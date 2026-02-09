import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import "./BuilderGame.css";

const COLORS = [
  { name: "red", css: "#FF6B6B" },
  { name: "blue", css: "#74B9FF" },
  { name: "yellow", css: "#FFE66D" },
  { name: "green", css: "#55efc4" },
];

function generatePattern(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () =>
      Math.floor(Math.random() * COLORS.length)
    )
  );
}

export default function BuilderGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [phase, setPhase] = useState("memorize"); // memorize | build | result
  const [pattern, setPattern] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [wrongCells, setWrongCells] = useState([]);
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const gridSize = 3;
  const memorizeTime = difficulty?.id === "easy" ? 3000 : difficulty?.id === "medium" ? 2000 : 1500;

  const patterns = useMemo(() => {
    if (!difficulty) return [];
    return Array.from({ length: totalRounds }, () => generatePattern(gridSize));
  }, [difficulty, totalRounds, gridSize]);

  const initRound = useCallback((roundIdx, pat) => {
    const p = pat || patterns[roundIdx];
    if (!p) return;
    setPattern(p);
    setUserGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));
    setWrongCells([]);
    setPhase("memorize");
    setFeedback(null);
    isProcessing.current = false;
  }, [patterns, gridSize]);

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setCurrentRound(0);
    setScore(0);
    setIsWon(false);
    setFeedback(null);
    isProcessing.current = false;
    setTimeout(() => speak("Zapamiętaj wzór i odtwórz go!"), 400);
  }, []);

  // Start memorize phase when round changes
  useEffect(() => {
    if (!difficulty || patterns.length === 0) return;
    initRound(currentRound); // eslint-disable-line react-hooks/set-state-in-effect -- init round on round change
  }, [currentRound, difficulty, patterns.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer for memorize phase
  useEffect(() => {
    if (phase !== "memorize" || !difficulty) return;
    const timer = setTimeout(() => {
      setPhase("build");
    }, memorizeTime);
    return () => clearTimeout(timer);
  }, [phase, difficulty, memorizeTime]);

  const handleCellClick = useCallback((r, c) => {
    if (phase !== "build" || isProcessing.current || feedback) return;
    playClick();
    setUserGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = (next[r][c] + 1) % COLORS.length;
      return next;
    });
  }, [phase, feedback]);

  const handleCheck = useCallback(() => {
    if (phase !== "build" || isProcessing.current || feedback) return;
    isProcessing.current = true;

    const wrong = [];
    let allCorrect = true;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (userGrid[r][c] !== pattern[r][c]) {
          wrong.push(`${r}-${c}`);
          allCorrect = false;
        }
      }
    }

    if (allCorrect) {
      setFeedback("correct");
      playSuccess();
      setTimeout(() => speak("Świetna pamięć!"), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) {
          setIsWon(true);
          addStar("builderGame");
          addSticker("🏗️");
        } else {
          setCurrentRound((r) => r + 1);
        }
        setFeedback(null);
        isProcessing.current = false;
      }, 1200);
    } else {
      setFeedback("wrong");
      setWrongCells(wrong);
      playError();
      setTimeout(() => {
        setFeedback(null);
        setWrongCells([]);
        isProcessing.current = false;
      }, 1500);
    }
  }, [phase, feedback, userGrid, pattern, gridSize, score, totalRounds, addStar, addSticker]);

  if (!difficulty) {
    return (
      <div className="game-page game-page--builder">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--builder">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🏗️" />
      </div>
    );
  }

  const displayGrid = phase === "memorize" ? pattern : userGrid;

  return (
    <div className="game-page game-page--builder">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <h2 className="builder__title">Budowlaniec 🏗️</h2>

      {phase === "memorize" && (
        <p className="builder__phase-label">Zapamiętaj wzór!</p>
      )}
      {phase === "build" && (
        <p className="builder__phase-label">Odtwórz wzór z pamięci!</p>
      )}

      <div className="builder__grid" style={{ "--cols": gridSize }}>
        {displayGrid.map((row, r) =>
          row.map((colorIdx, c) => (
            <button
              key={`${r}-${c}`}
              className={`builder__cell ${
                phase === "build" ? "builder__cell--clickable" : ""
              } ${
                wrongCells.includes(`${r}-${c}`) ? "builder__cell--wrong" : ""
              } ${
                feedback === "correct" ? "builder__cell--correct" : ""
              }`}
              style={{ background: COLORS[colorIdx].css }}
              onClick={() => handleCellClick(r, c)}
              disabled={phase !== "build" || !!feedback}
            />
          ))
        )}
      </div>

      {phase === "build" && (
        <div className="builder__legend">
          {COLORS.map((color, i) => (
            <div key={i} className="builder__legend-item">
              <span className="builder__legend-swatch" style={{ background: color.css }} />
            </div>
          ))}
        </div>
      )}

      {phase === "build" && (
        <button
          className="builder__check-btn"
          onClick={handleCheck}
          disabled={!!feedback}
        >
          Sprawdź ✓
        </button>
      )}
    </div>
  );
}
