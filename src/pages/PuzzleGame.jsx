import { useState, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playClick } from "../hooks/useSound";
import puzzles from "../data/puzzles";
import "./PuzzleGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function scramble(pieces) {
  const indices = pieces.map((_, i) => i);
  const shuffled = shuffle(indices);
  return pieces.map((p, i) => ({ ...p, currentPosition: shuffled[i] }));
}

function isSolved(board) {
  return board.every((p) => p.currentPosition === p.correctPosition);
}

export default function PuzzleGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 5;
  const currentPuzzle = rounds[currentRound];

  const startGame = useCallback((level) => {
    const pool = level.id === "easy"
      ? puzzles.filter(p => p.gridSize === 2)
      : puzzles.filter(p => p.gridSize === 3);
    const picked = shuffle(pool).slice(0, level.rounds);
    setDifficulty(level);
    setRounds(picked);
    setCurrentRound(0);
    setScore(0);
    setIsWon(false);
    setSelected(null);
    if (picked[0]) setBoard(scramble(picked[0].pieces));
    proc.current = false;
    speak("Ułóż puzzle! Kliknij dwa elementy żeby je zamienić.");
  }, []);

  const handleTap = useCallback((idx) => {
    if (isWon || proc.current) return;
    playClick();
    if (selected === null) {
      setSelected(idx);
    } else {
      if (selected === idx) { setSelected(null); return; }
      setBoard(prev => {
        const next = [...prev];
        const posA = next[selected].currentPosition;
        const posB = next[idx].currentPosition;
        next[selected] = { ...next[selected], currentPosition: posB };
        next[idx] = { ...next[idx], currentPosition: posA };
        if (isSolved(next)) {
          proc.current = true;
          playSuccess();
          setTimeout(() => {
            const ns = score + 1;
            if (ns >= totalRounds) {
              setScore(ns);
              setIsWon(true);
              addStar("puzzleGame");
              addSticker("🧩");
            } else {
              setScore(ns);
              setCurrentRound(r => r + 1);
              setBoard(scramble(rounds[currentRound + 1].pieces));
              speak("Brawo! Następne puzzle!");
            }
            proc.current = false;
          }, 800);
        }
        return next;
      });
      setSelected(null);
    }
  }, [selected, isWon, score, totalRounds, currentRound, rounds, addStar, addSticker]);

  if (!difficulty) return <div className="game-page game-page--puzzle"><BackButton /><DifficultyPicker onSelect={startGame} /></div>;
  if (isWon) return <div className="game-page game-page--puzzle"><WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🧩" /></div>;

  const gridSize = currentPuzzle?.gridSize || 2;
  const sorted = [...board].sort((a, b) => a.currentPosition - b.currentPosition);

  return (
    <div className="game-page game-page--puzzle">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={totalRounds} /></div>
      <p className="puzzle-name">{currentPuzzle?.name}</p>
      <div className="puzzle-preview">
        <span className="puzzle-preview__label">Podgląd:</span>
        <div className="puzzle-preview__grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {currentPuzzle?.pieces.map((p, i) => <span key={i} className="puzzle-preview__cell">{p.emoji}</span>)}
        </div>
      </div>
      <div className="puzzle-board" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {sorted.map((piece) => {
          const origIdx = board.indexOf(piece);
          return (
            <button
              key={piece.correctPosition}
              className={`puzzle-cell ${selected === origIdx ? "puzzle-cell--selected" : ""} ${piece.currentPosition === piece.correctPosition ? "puzzle-cell--correct" : ""}`}
              onClick={() => handleTap(origIdx)}
            >
              {piece.emoji}
            </button>
          );
        })}
      </div>
      <p className="game-page__hint">Kliknij dwa elementy żeby je zamienić!</p>
    </div>
  );
}
