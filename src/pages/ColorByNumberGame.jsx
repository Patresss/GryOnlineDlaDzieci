import { useState, useCallback } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playClick, playSuccess } from "../hooks/useSound";
import "./ColorByNumberGame.css";

const PALETTE = [
  { id: 1, name: "Czerwony", css: "#e74c3c" },
  { id: 2, name: "Niebieski", css: "#3498db" },
  { id: 3, name: "Zielony", css: "#2ecc71" },
  { id: 4, name: "Żółty", css: "#f1c40f" },
  { id: 5, name: "Pomarańczowy", css: "#e67e22" },
  { id: 6, name: "Fioletowy", css: "#9b59b6" },
];

const PICTURES = [
  {
    name: "Domek",
    cells: [
      { id: 0, path: "M50,10 L10,40 L10,90 L90,90 L90,40 Z", num: 1 },
      { id: 1, path: "M10,40 L50,10 L90,40 Z", num: 3 },
      { id: 2, path: "M35,55 L35,90 L65,90 L65,55 Z", num: 4 },
      { id: 3, path: "M20,50 L20,65 L35,65 L35,50 Z", num: 2 },
      { id: 4, path: "M65,50 L65,65 L80,65 L80,50 Z", num: 2 },
    ],
  },
  {
    name: "Kwiatek",
    cells: [
      { id: 0, path: "M50,30 A15,15 0 1,1 50,0 A15,15 0 1,1 50,30", num: 1, transform: "translate(0,15)" },
      { id: 1, path: "M35,45 A15,15 0 1,1 35,15 A15,15 0 1,1 35,45", num: 5, transform: "translate(-5,15)" },
      { id: 2, path: "M65,45 A15,15 0 1,1 65,15 A15,15 0 1,1 65,45", num: 5, transform: "translate(5,15)" },
      { id: 3, path: "M50,55 A10,10 0 1,1 50,35 A10,10 0 1,1 50,55", num: 4, transform: "translate(0,10)" },
      { id: 4, path: "M48,60 L52,60 L52,95 L48,95 Z", num: 3 },
      { id: 5, path: "M35,75 Q42,70 48,75", num: 3, stroke: true },
      { id: 6, path: "M52,80 Q58,75 65,80", num: 3, stroke: true },
    ],
  },
];

export default function ColorByNumberGame() {
  const [picIndex, setPicIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [filled, setFilled] = useState({});
  const [allDone, setAllDone] = useState(false);
  const { addStar, addSticker } = useProfile();

  const pic = PICTURES[picIndex];

  const handleCellClick = useCallback(
    (cellId) => {
      if (!selectedColor || allDone) return;
      playClick();
      const newFilled = { ...filled, [cellId]: selectedColor };
      setFilled(newFilled);

      if (Object.keys(newFilled).length === pic.cells.length) {
        playSuccess();
        if (picIndex + 1 >= PICTURES.length) {
          setAllDone(true);
          addStar("colorByNumberGame");
          addSticker("🖌️");
        }
      }
    },
    [selectedColor, filled, pic, picIndex, allDone, addStar, addSticker]
  );

  const handleNext = useCallback(() => {
    setPicIndex((i) => i + 1);
    setFilled({});
    setSelectedColor(null);
  }, []);

  const restart = () => { setPicIndex(0); setFilled({}); setSelectedColor(null); setAllDone(false); };

  if (allDone) return <div className="game-page game-page--cbn"><WinScreen onPlayAgain={restart} /></div>;

  const isDone = Object.keys(filled).length === pic.cells.length;

  return (
    <div className="game-page game-page--cbn">
      <BackButton />
      <h2 className="cbn-title">{pic.name}</h2>
      <svg viewBox="0 0 100 100" className="cbn-canvas">
        {pic.cells.map((cell) => (
          <g key={cell.id} transform={cell.transform || ""}>
            <path
              d={cell.path}
              fill={filled[cell.id] || "#f0f0f0"}
              stroke="#999"
              strokeWidth="1"
              className="cbn-cell"
              onClick={() => handleCellClick(cell.id)}
              style={{ cursor: selectedColor ? "pointer" : "default" }}
            />
            {!filled[cell.id] && (
              <text x="0" y="0" className="cbn-number" fontSize="8" fill="#666" textAnchor="middle">
                {cell.num}
                <tspan>{/* positioned by cell center via CSS */}</tspan>
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="cbn-palette">
        {PALETTE.map((color) => (
          <button
            key={color.id}
            className={`cbn-color ${selectedColor === color.css ? "cbn-color--selected" : ""}`}
            style={{ background: color.css }}
            onClick={() => { setSelectedColor(color.css); playClick(); }}
          >
            <span className="cbn-color__num">{color.id}</span>
          </button>
        ))}
      </div>
      {isDone && picIndex + 1 < PICTURES.length && (
        <button className="cbn-next-btn" onClick={handleNext}>Następny! ➡️</button>
      )}
    </div>
  );
}
