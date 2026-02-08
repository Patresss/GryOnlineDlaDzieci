import { useState, useCallback, useRef, useEffect } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playClick, playSuccess } from "../hooks/useSound";
import dotPuzzles from "../data/dotPuzzles";
import "./ConnectDotsGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ConnectDotsGame() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [currentDot, setCurrentDot] = useState(0);
  const [lines, setLines] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [puzzles] = useState(() => shuffle(dotPuzzles));
  const { addStar, addSticker } = useProfile();

  const puzzle = puzzles[puzzleIndex];

  const handleDotClick = useCallback(
    (index) => {
      if (completed) return;
      if (index !== currentDot) return;

      playClick();
      if (index > 0) {
        setLines((l) => [...l, { from: puzzle.dots[index - 1], to: puzzle.dots[index] }]);
      }
      const next = index + 1;
      setCurrentDot(next);

      if (next >= puzzle.dots.length) {
        if (puzzle.closePath) {
          setLines((l) => [...l, { from: puzzle.dots[index], to: puzzle.dots[0] }]);
        }
        setCompleted(true);
        playSuccess();
      }
    },
    [currentDot, completed, puzzle]
  );

  const handleNext = useCallback(() => {
    if (puzzleIndex + 1 >= puzzles.length) {
      setAllDone(true);
      addStar("connectDotsGame");
      addSticker("✏️");
    } else {
      setPuzzleIndex((i) => i + 1);
      setCurrentDot(0);
      setLines([]);
      setCompleted(false);
    }
  }, [puzzleIndex, puzzles.length, addStar, addSticker]);

  const restart = () => { setPuzzleIndex(0); setCurrentDot(0); setLines([]); setCompleted(false); setAllDone(false); };

  if (allDone) return <div className="game-page game-page--dots"><WinScreen onPlayAgain={restart} sticker="✏️" /></div>;

  return (
    <div className="game-page game-page--dots">
      <BackButton />
      <h2 className="dots-title">Połącz kropki: {puzzle.emoji}</h2>
      <p className="dots-counter">{puzzleIndex + 1} / {puzzles.length}</p>
      <div className="dots-canvas">
        <svg viewBox="0 0 100 100" className="dots-svg">
          {lines.map((line, i) => (
            <line key={i} x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y}
              stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>
        {puzzle.dots.map((dot, i) => (
          <button
            key={i}
            className={`dot-point ${i < currentDot ? "dot-point--done" : ""} ${i === currentDot ? "dot-point--next" : ""}`}
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            onClick={() => handleDotClick(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {completed && (
        <button className="dots-next-btn" onClick={handleNext}>
          {puzzleIndex + 1 >= puzzles.length ? "Koniec!" : "Następny!"} ➡️
        </button>
      )}
    </div>
  );
}
