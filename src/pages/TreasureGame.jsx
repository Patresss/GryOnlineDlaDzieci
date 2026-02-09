import { useState, useCallback, useRef, useEffect } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import "./TreasureGame.css";

function generateGrid(size) {
  const grid = Array.from({ length: size }, () => Array(size).fill("empty"));
  // Place player at top-left
  grid[0][0] = "player";
  // Place treasure at bottom-right area
  const tr = size - 1 - Math.floor(Math.random() * 2);
  const tc = size - 1 - Math.floor(Math.random() * 2);
  grid[tr][tc] = "treasure";
  // Place obstacles (avoiding player, treasure, and ensuring path)
  const obstacleCount = Math.floor(size * size * 0.15);
  let placed = 0;
  while (placed < obstacleCount) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (grid[r][c] === "empty" && !(r <= 1 && c <= 1) && !(r >= size - 2 && c >= size - 2)) {
      grid[r][c] = "rock";
      placed++;
    }
  }
  return { grid, playerPos: [0, 0], treasurePos: [tr, tc] };
}

const CELL_EMOJI = {
  empty: "🌿",
  rock: "🪨",
  player: "🧒",
  treasure: "💎",
  visited: "👣",
};

export default function TreasureGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [treasurePos, setTreasurePos] = useState([0, 0]);
  const [moves, setMoves] = useState(0);
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const gridSize = difficulty?.id === "easy" ? 5 : difficulty?.id === "medium" ? 6 : 7;

  const initRound = useCallback((size) => {
    const data = generateGrid(size);
    setGrid(data.grid);
    setPlayerPos(data.playerPos);
    setTreasurePos(data.treasurePos);
    setMoves(0);
    setFeedback(null);
    isProcessing.current = false;
  }, []);

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setCurrentRound(0);
    setScore(0);
    setIsWon(false);
    const size = level.id === "easy" ? 5 : level.id === "medium" ? 6 : 7;
    initRound(size);
    setTimeout(() => speak("Znajdź skarb! Użyj strzałek!"), 400);
  }, [initRound]);

  const movePlayer = useCallback((dr, dc) => {
    if (isProcessing.current || feedback) return;
    const [pr, pc] = playerPos;
    const nr = pr + dr;
    const nc = pc + dc;

    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return;
    if (grid[nr]?.[nc] === "rock") {
      playError();
      return;
    }

    playClick();
    setMoves((m) => m + 1);

    const newGrid = grid.map((row) => [...row]);
    newGrid[pr][pc] = "visited";

    if (nr === treasurePos[0] && nc === treasurePos[1]) {
      // Found treasure!
      newGrid[nr][nc] = "player";
      setGrid(newGrid);
      setPlayerPos([nr, nc]);
      setFeedback("correct");
      playSuccess();
      isProcessing.current = true;
      setTimeout(() => speak("Brawo! Znalazłeś skarb!"), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) {
          setIsWon(true);
          addStar("treasureGame");
          addSticker("🗺️");
        } else {
          setCurrentRound((r) => r + 1);
          initRound(gridSize);
        }
        setFeedback(null);
        isProcessing.current = false;
      }, 1500);
    } else {
      newGrid[nr][nc] = "player";
      setGrid(newGrid);
      setPlayerPos([nr, nc]);
    }
  }, [playerPos, gridSize, grid, treasurePos, feedback, score, totalRounds, addStar, addSticker, initRound]);

  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); movePlayer(dir[0], dir[1]); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [movePlayer]);

  if (!difficulty) {
    return (
      <div className="game-page game-page--treasure">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--treasure">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🗺️" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--treasure">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <h2 className="treasure__title">Mapa skarbów 🗺️</h2>
      <p className="game-page__hint">Doprowadź 🧒 do 💎 ! Ruchy: {moves}</p>

      <div className="treasure__grid" style={{ "--cols": gridSize }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`treasure__cell treasure__cell--${cell} ${
                r === playerPos[0] && c === playerPos[1] && feedback === "correct" ? "treasure__cell--found" : ""
              }`}
            >
              {CELL_EMOJI[cell]}
            </div>
          ))
        )}
      </div>

      <div className="treasure__controls">
        <button className="treasure__btn" onClick={() => movePlayer(-1, 0)} disabled={!!feedback}>⬆️</button>
        <div className="treasure__btn-row">
          <button className="treasure__btn" onClick={() => movePlayer(0, -1)} disabled={!!feedback}>⬅️</button>
          <button className="treasure__btn" onClick={() => movePlayer(1, 0)} disabled={!!feedback}>⬇️</button>
          <button className="treasure__btn" onClick={() => movePlayer(0, 1)} disabled={!!feedback}>➡️</button>
        </div>
      </div>
    </div>
  );
}
