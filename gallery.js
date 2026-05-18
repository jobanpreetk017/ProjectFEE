const furnitureItems = [
    { name: "Comfy Chair", emoji: "🪑", desc: "Ergonomic seating" },
    { name: "Modern Table", emoji: "🪵", desc: "Wooden finish" },
    { name: "Luxury Bed", emoji: "🛏️", desc: "King size comfort" },
    { name: "Elegant Sofa", emoji: "🛋️", desc: "Velvet fabric" },
    { name: "Floor Lamp", emoji: "💡", desc: "Warm lighting" },
    { name: "Study Desk", emoji: "📚", desc: "Spacious workspace" },
    { name: "Wall Clock", emoji: "🕰️", desc: "Vintage style" },
    { name: "Plant Pot", emoji: "🪴", desc: "Bring nature in" }
];
const galleryGrid = document.getElementById("galleryGrid");
furnitureItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
        <div class="gallery-emoji">${item.emoji}</div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
    `;
    galleryGrid.appendChild(card);
});