import { useState, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./MirrorGame.css";

const COLORS = [
  { name: "red", css: "#FF6B6B", emoji: "🔴" },
  { name: "blue", css: "#74B9FF", emoji: "🔵" },
  { name: "yellow", css: "#FFE66D", emoji: "🟡" },
  { name: "green", css: "#55efc4", emoji: "🟢" },
];

const EMPTY_CSS = "#ccc";

function getGridSize(diffId) {
  if (diffId === "easy") return { rows: 3, cols: 3 };
  if (diffId === "medium") return { rows: 3, cols: 4 };
  return { rows: 4, cols: 4 };
}

function generatePattern(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * COLORS.length))
  );
}

function mirrorPattern(pattern) {
  return pattern.map((row) => [...row].reverse());
}

export default function MirrorGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const gridSize = useMemo(() => difficulty ? getGridSize(difficulty.id) : { rows: 3, cols: 3 }, [difficulty]);

  const patterns = useMemo(() => {
    if (!difficulty) return [];
    return Array.from({ length: totalRounds }, () =>
      generatePattern(gridSize.rows, gridSize.cols)
    );
  }, [difficulty, totalRounds, gridSize.rows, gridSize.cols]);

  const [playerGrid, setPlayerGrid] = useState([]);

  const pattern = patterns[currentRound];

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    isProcessing.current = false;
    const size = getGridSize(level.id);
    setPlayerGrid(Array.from({ length: size.rows }, () => Array(size.cols).fill(-1)));
    setTimeout(() => speak("Odtwórz lustrzane odbicie!"), 400);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (isProcessing.current || feedback) return;
    setPlayerGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = (next[row][col] + 1) % COLORS.length;
      return next;
    });
  }, [feedback]);

  const handleCheck = useCallback(() => {
    if (isProcessing.current || feedback || !pattern) return;
    isProcessing.current = true;

    const mirrored = mirrorPattern(pattern);
    let allCorrect = true;
    for (let r = 0; r < gridSize.rows; r++) {
      for (let c = 0; c < gridSize.cols; c++) {
        if (playerGrid[r][c] !== mirrored[r][c]) {
          allCorrect = false;
          break;
        }
      }
      if (!allCorrect) break;
    }

    if (allCorrect) {
      setFeedback("correct");
      playSuccess();
      setTimeout(() => speak("Świetnie! Idealne lustro!"), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) {
          setIsWon(true);
          addStar("mirrorGame");
          addSticker("🪞");
        } else {
          setCurrentRound((r) => r + 1);
          setPlayerGrid(Array.from({ length: gridSize.rows }, () => Array(gridSize.cols).fill(-1)));
        }
        setFeedback(null);
        isProcessing.current = false;
      }, 1200);
    } else {
      setFeedback("wrong");
      playError();
      setTimeout(() => {
        setFeedback(null);
        isProcessing.current = false;
      }, 800);
    }
  }, [feedback, pattern, gridSize, playerGrid, score, totalRounds, addStar, addSticker]);

  if (!difficulty) {
    return (
      <div className="game-page game-page--mirror">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--mirror">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🪞" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--mirror">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <h2 className="mirror__title">Lustro 🪞</h2>
      <p className="game-page__hint">Odtwórz lustrzane odbicie wzoru!</p>

      <div className="mirror__boards">
        <div className="mirror__board">
          <span className="mirror__label">Wzór</span>
          <div
            className="mirror__grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            }}
          >
            {pattern && pattern.map((row, r) =>
              row.map((colorIdx, c) => (
                <div
                  key={`${r}-${c}`}
                  className="mirror__cell"
                  style={{ background: COLORS[colorIdx].css }}
                />
              ))
            )}
          </div>
        </div>

        <div className="mirror__divider">🪞</div>

        <div className="mirror__board">
          <span className="mirror__label">Twoje odbicie</span>
          <div
            className={`mirror__grid ${feedback === "correct" ? "mirror__grid--correct" : ""} ${feedback === "wrong" ? "mirror__grid--wrong" : ""}`}
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            }}
          >
            {playerGrid.map((row, r) =>
              row.map((colorIdx, c) => (
                <div
                  key={`${r}-${c}`}
                  className="mirror__cell mirror__cell--clickable"
                  style={{ background: colorIdx >= 0 ? COLORS[colorIdx].css : EMPTY_CSS }}
                  onClick={() => handleCellClick(r, c)}
                >
                  {colorIdx < 0 && <span className="mirror__cell-hint">?</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        className="mirror__check-btn"
        onClick={handleCheck}
        disabled={!!feedback}
      >
        Sprawdź ✓
      </button>
    </div>
  );
}
