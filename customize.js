const roomCanvas = document.getElementById("roomCanvas");
const floorColorPicker = document.getElementById("floorColor");
const clearBtn = document.getElementById("clearRoomBtn");
let dragOffsetX = 0, dragOffsetY = 0;
let activeDragElement = null;

floorColorPicker.addEventListener("input", function (e) {
    roomCanvas.style.background = e.target.value;
});
clearBtn.addEventListener("click", function () {
    while (roomCanvas.firstChild) {
        roomCanvas.removeChild(roomCanvas.firstChild);
    }
});
document.querySelectorAll(".furniture-item").forEach(item => {
    item.addEventListener("dragstart", function (e) {
        const furnitureEmoji = this.getAttribute("data-furniture");
        const furnitureName = this.getAttribute("data-name");
        e.dataTransfer.setData("text/plain", JSON.stringify({
            emoji: furnitureEmoji,
            name: furnitureName
        }));
        e.dataTransfer.effectAllowed = "copy";
        this.style.opacity = "0.5";
    });
    item.addEventListener("dragend", function (e) {
        this.style.opacity = "1";
    });
});
roomCanvas.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
});
roomCanvas.addEventListener("drop", function (e) {
    e.preventDefault();
    const rawData = e.dataTransfer.getData("text/plain");
    if (!rawData) return;
    const furnitureData = JSON.parse(rawData);
    const rect = roomCanvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(10, Math.min(x, roomCanvas.clientWidth - 70));
    y = Math.max(10, Math.min(y, roomCanvas.clientHeight - 70));
    createFurniture(furnitureData.emoji, furnitureData.name, x, y);
});
function createFurniture(emoji, name, leftPos, topPos) {
    const furnitureDiv = document.createElement("div");
    furnitureDiv.className = "furniture-piece";
    furnitureDiv.style.position = "absolute";
    furnitureDiv.style.left = leftPos + "px";
    furnitureDiv.style.top = topPos + "px";
    furnitureDiv.style.width = "80px";
    furnitureDiv.style.cursor = "move";
    furnitureDiv.setAttribute("data-width", "80");
    furnitureDiv.setAttribute("data-emoji", emoji);
    furnitureDiv.setAttribute("data-name", name);
    const emojiSpan = document.createElement("div");
    emojiSpan.className = "furniture-emoji-large";
    emojiSpan.textContent = emoji;
    emojiSpan.style.fontSize = "3.5rem";
    const labelSpan = document.createElement("div");
    labelSpan.className = "furniture-label";
    labelSpan.textContent = name;
    furnitureDiv.appendChild(emojiSpan);
    furnitureDiv.appendChild(labelSpan);
    makeDraggable(furnitureDiv);
    furnitureDiv.addEventListener("dblclick", function (e) {
        e.stopPropagation();
        const currentSize = parseInt(furnitureDiv.style.width);
        const newSize = prompt("Enter new size in pixels (40-200):", currentSize);
        if (newSize && !isNaN(newSize) && newSize >= 40 && newSize <= 200) {
            furnitureDiv.style.width = newSize + "px";
            const newFontSize = (newSize / 80) * 3.5;
            emojiSpan.style.fontSize = newFontSize + "rem";
            furnitureDiv.setAttribute("data-width", newSize);
        } else if (newSize) {
            alert("Please enter a number between 40 and 200");
        }
    });
    furnitureDiv.addEventListener("click", function (e) {
        e.stopPropagation();
    });
    document.addEventListener("keydown", function deleteHandler(e) {
        if (e.key === "Delete" && document.activeElement === furnitureDiv) {
            if (confirm("Remove this " + name + "?")) {
                furnitureDiv.remove();
                document.removeEventListener("keydown", deleteHandler);
            }
        }
    });
    furnitureDiv.setAttribute("tabindex", "0");
    roomCanvas.appendChild(furnitureDiv);
}
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
    element.addEventListener("mousedown", dragMouseDown);
    function dragMouseDown(e) {
        if (e.target.closest('.furniture-piece') !== element) return;
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        offsetX = element.offsetLeft;
        offsetY = element.offsetTop;
        document.addEventListener("mousemove", elementDrag);
        document.addEventListener("mouseup", closeDragElement);
        element.style.zIndex = "1000";
        element.style.opacity = "0.9";
        element.focus();
    }
    function elementDrag(e) {
        e.preventDefault();
        const dx = e.clientX - mouseX;
        const dy = e.clientY - mouseY;
        let newLeft = offsetX + dx;
        let newTop = offsetY + dy;
        const maxX = roomCanvas.clientWidth - element.offsetWidth;
        const maxY = roomCanvas.clientHeight - element.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));
        element.style.left = newLeft + "px";
        element.style.top = newTop + "px";
        offsetX = newLeft;
        offsetY = newTop;
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    function closeDragElement() {
        document.removeEventListener("mousemove", elementDrag);
        document.removeEventListener("mouseup", closeDragElement);
        element.style.zIndex = "";
        element.style.opacity = "1";
    }
}
window.addEventListener("load", function () {
    roomCanvas.style.background = floorColorPicker.value;
    createFurniture("🛋️", "Sofa", 50, 50);
    createFurniture("🪑", "Chair", 200, 150);
    createFurniture("🪵", "Table", 350, 300);
});