const shapes = [
  {
    name: "Koło",
    emoji: "⚫",
    color: "#e74c3c",
    svg: '<circle cx="50" cy="50" r="40" />',
    holeSvg: '<circle cx="50" cy="50" r="42" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="8,4" />',
  },
  {
    name: "Kwadrat",
    emoji: "⬛",
    color: "#3498db",
    svg: '<rect x="10" y="10" width="80" height="80" />',
    holeSvg: '<rect x="8" y="8" width="84" height="84" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="8,4" />',
  },
  {
    name: "Trójkąt",
    emoji: "🔺",
    color: "#2ecc71",
    svg: '<polygon points="50,10 90,90 10,90" />',
    holeSvg: '<polygon points="50,8 92,92 8,92" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="8,4" />',
  },
  {
    name: "Gwiazda",
    emoji: "⭐",
    color: "#f1c40f",
    svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />',
    holeSvg: '<polygon points="50,3 62,33 97,33 69,56 80,93 50,72 20,93 31,56 3,33 38,33" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="8,4" />',
  },
  {
    name: "Serce",
    emoji: "❤️",
    color: "#e91e63",
    svg: '<path d="M50,88 C20,65 5,45 5,30 C5,15 15,5 30,5 C40,5 48,12 50,18 C52,12 60,5 70,5 C85,5 95,15 95,30 C95,45 80,65 50,88Z" />',
    holeSvg: '<path d="M50,90 C18,66 3,45 3,29 C3,14 14,3 29,3 C40,3 48,11 50,17 C52,11 60,3 71,3 C86,3 97,14 97,29 C97,45 82,66 50,90Z" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="8,4" />',
  },
];

export default shapes;
