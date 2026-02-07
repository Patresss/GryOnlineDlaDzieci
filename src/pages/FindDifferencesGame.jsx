import { useState, useCallback } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playSuccess, playClick, playError } from "../hooks/useSound";
import "./FindDifferencesGame.css";

const SCENES = [
  {
    name: "Ogród",
    bg: "#c8f7c5",
    baseItems: [
      { emoji: "🌳", x: 15, y: 30, size: 40 },
      { emoji: "🌻", x: 40, y: 65, size: 32 },
      { emoji: "🦋", x: 70, y: 25, size: 28 },
      { emoji: "🏠", x: 80, y: 55, size: 40 },
      { emoji: "☁️", x: 25, y: 10, size: 28 },
      { emoji: "☁️", x: 60, y: 8, size: 24 },
      { emoji: "🌷", x: 55, y: 70, size: 28 },
      { emoji: "🐦", x: 30, y: 45, size: 24 },
    ],
    differences: [
      { id: 0, x: 40, y: 65, original: "🌻", changed: "🌹", size: 32 },
      { id: 1, x: 70, y: 25, original: "🦋", changed: "🐝", size: 28 },
      { id: 2, x: 30, y: 45, original: "🐦", changed: "🐿️", size: 24 },
    ],
  },
  {
    name: "Plaża",
    bg: "#aed9e0",
    baseItems: [
      { emoji: "☀️", x: 80, y: 10, size: 36 },
      { emoji: "🏖️", x: 50, y: 50, size: 36 },
      { emoji: "🐚", x: 20, y: 70, size: 24 },
      { emoji: "🦀", x: 70, y: 75, size: 28 },
      { emoji: "⛵", x: 30, y: 25, size: 32 },
      { emoji: "🌴", x: 10, y: 40, size: 40 },
      { emoji: "🐟", x: 60, y: 35, size: 24 },
      { emoji: "🪣", x: 45, y: 72, size: 24 },
    ],
    differences: [
      { id: 0, x: 70, y: 75, original: "🦀", changed: "⭐", size: 28 },
      { id: 1, x: 30, y: 25, original: "⛵", changed: "🚢", size: 32 },
      { id: 2, x: 45, y: 72, original: "🪣", changed: "🏐", size: 24 },
    ],
  },
  {
    name: "Las",
    bg: "#d5f5e3",
    baseItems: [
      { emoji: "🌲", x: 15, y: 35, size: 44 },
      { emoji: "🌲", x: 75, y: 40, size: 40 },
      { emoji: "🍄", x: 40, y: 75, size: 28 },
      { emoji: "🦊", x: 55, y: 60, size: 32 },
      { emoji: "🦉", x: 25, y: 20, size: 28 },
      { emoji: "🌙", x: 70, y: 10, size: 28 },
      { emoji: "🐿️", x: 85, y: 70, size: 24 },
      { emoji: "🌰", x: 65, y: 80, size: 20 },
    ],
    differences: [
      { id: 0, x: 55, y: 60, original: "🦊", changed: "🐺", size: 32 },
      { id: 1, x: 25, y: 20, original: "🦉", changed: "🦇", size: 28 },
      { id: 2, x: 85, y: 70, original: "🐿️", changed: "🐰", size: 24 },
      { id: 3, x: 70, y: 10, original: "🌙", changed: "⭐", size: 28 },
    ],
  },
];

function SceneView({ scene, isModified, found, onClickDiff }) {
  const items = scene.baseItems.map((item) => {
    const diff = scene.differences.find(
      (d) => d.x === item.x && d.y === item.y
    );
    if (diff && isModified && !found.includes(diff.id)) {
      return { ...item, emoji: diff.changed, diffId: diff.id };
    }
    if (diff && isModified && found.includes(diff.id)) {
      return { ...item, emoji: diff.changed, diffId: diff.id, isFound: true };
    }
    return item;
  });

  return (
    <div className="fd-scene" style={{ background: scene.bg }}>
      {items.map((item, i) => (
        <span
          key={i}
          className={`fd-item ${item.isFound ? "fd-item--found" : ""} ${item.diffId !== undefined && !item.isFound ? "fd-item--clickable" : ""}`}
          style={{ left: `${item.x}%`, top: `${item.y}%`, fontSize: `${item.size}px` }}
          onClick={() => item.diffId !== undefined && !item.isFound && onClickDiff(item.diffId)}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

export default function FindDifferencesGame() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [found, setFound] = useState([]);
  const [allDone, setAllDone] = useState(false);
  const { addStar, addSticker } = useProfile();

  const scene = SCENES[sceneIndex];
  const totalDiffs = scene.differences.length;

  const handleFind = useCallback(
    (diffId) => {
      if (found.includes(diffId)) return;
      playClick();
      const newFound = [...found, diffId];
      setFound(newFound);
      if (newFound.length >= totalDiffs) {
        playSuccess();
      }
    },
    [found, totalDiffs]
  );

  const handleWrongClick = useCallback(() => {
    playError();
  }, []);

  const handleNext = useCallback(() => {
    if (sceneIndex + 1 >= SCENES.length) {
      setAllDone(true);
      addStar("findDifferencesGame");
      addSticker("🔍");
    } else {
      setSceneIndex((i) => i + 1);
      setFound([]);
    }
  }, [sceneIndex, addStar, addSticker]);

  const restart = () => {
    setSceneIndex(0);
    setFound([]);
    setAllDone(false);
  };

  if (allDone) {
    return (
      <div className="game-page game-page--fd">
        <WinScreen onPlayAgain={restart} />
      </div>
    );
  }

  return (
    <div className="game-page game-page--fd">
      <BackButton />
      <h2 className="fd-title">Znajdź {totalDiffs} różnice!</h2>
      <p className="fd-counter">
        Znalezione: {found.length} / {totalDiffs} | Scena {sceneIndex + 1}/{SCENES.length}
      </p>
      <div className="fd-pair">
        <div className="fd-panel" onClick={handleWrongClick}>
          <p className="fd-label">Oryginał</p>
          <SceneView scene={scene} isModified={false} found={found} onClickDiff={() => {}} />
        </div>
        <div className="fd-panel">
          <p className="fd-label">Znajdź różnice!</p>
          <SceneView scene={scene} isModified={true} found={found} onClickDiff={handleFind} />
        </div>
      </div>
      {found.length >= totalDiffs && (
        <button className="fd-next-btn" onClick={handleNext}>
          {sceneIndex + 1 >= SCENES.length ? "Koniec!" : "Następna scena!"} ➡️
        </button>
      )}
    </div>
  );
}
