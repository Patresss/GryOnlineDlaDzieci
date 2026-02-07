const colorMixes = [
  { color1: { name: "Czerwony", css: "#e74c3c" }, color2: { name: "Żółty", css: "#f1c40f" }, result: { name: "Pomarańczowy", css: "#e67e22" }, wrong: [{ name: "Zielony", css: "#2ecc71" }, { name: "Fioletowy", css: "#9b59b6" }] },
  { color1: { name: "Niebieski", css: "#3498db" }, color2: { name: "Żółty", css: "#f1c40f" }, result: { name: "Zielony", css: "#2ecc71" }, wrong: [{ name: "Pomarańczowy", css: "#e67e22" }, { name: "Różowy", css: "#e91e8c" }] },
  { color1: { name: "Czerwony", css: "#e74c3c" }, color2: { name: "Niebieski", css: "#3498db" }, result: { name: "Fioletowy", css: "#9b59b6" }, wrong: [{ name: "Zielony", css: "#2ecc71" }, { name: "Pomarańczowy", css: "#e67e22" }] },
  { color1: { name: "Czerwony", css: "#e74c3c" }, color2: { name: "Biały", css: "#ecf0f1" }, result: { name: "Różowy", css: "#e91e8c" }, wrong: [{ name: "Fioletowy", css: "#9b59b6" }, { name: "Pomarańczowy", css: "#e67e22" }] },
  { color1: { name: "Niebieski", css: "#3498db" }, color2: { name: "Biały", css: "#ecf0f1" }, result: { name: "Jasnoniebieski", css: "#74b9ff" }, wrong: [{ name: "Zielony", css: "#2ecc71" }, { name: "Fioletowy", css: "#9b59b6" }] },
  { color1: { name: "Czarny", css: "#2d3436" }, color2: { name: "Biały", css: "#ecf0f1" }, result: { name: "Szary", css: "#95a5a6" }, wrong: [{ name: "Brązowy", css: "#8B4513" }, { name: "Niebieski", css: "#3498db" }] },
];

export default colorMixes;
