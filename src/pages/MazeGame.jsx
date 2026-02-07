import { useState, useEffect, useCallback } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playClick, playSuccess, playError } from "../hooks/useSound";
import "./MazeGame.css";

const MAZES = [
  {
    name: "Prosty",
    rows: 5, cols: 5,
    start: [0, 0], end: [4, 4],
    walls: new Set(["1,0", "1,1", "1,2", "3,2", "3,3", "3,4", "2,4"]),
  },
  {
    name: "Średni",
    rows: 6, cols: 6,
    start: [0, 0], end: [5, 5],
    walls: new Set(["1,0", "1,1", "1,3", "1,4", "3,1", "3,2", "3,4", "3,5", "5,1", "5,2", "5,3"]),
  },
  {
    name: "Trudny",
    rows: 7, cols: 7,
    start: [0, 0], end: [6, 6],
    walls: new Set(["1,0", "1,1", "1,3", "1,5", "2,3", "2,5", "3,1", "3,3", "3,5", "4,1", "4,5", "5,1", "5,2", "5,3", "5,5", "6,3"]),
  },
];

export default function MazeGame() {
  const [mazeIndex, setMazeIndex] = useState(0);
  const [pos, setPos] = useState(MAZES[0].start);
  const [path, setPath] = useState([MAZES[0].start.join(",")]);
  const [won, setWon] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const { addStar, addSticker } = useProfile();

  const maze = MAZES[mazeIndex];

  const move = useCallback(
    (dr, dc) => {
      if (won) return;
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;
      if (nr < 0 || nr >= maze.rows || nc < 0 || nc >= maze.cols) return;
      if (maze.walls.has(`${nr},${nc}`)) { playError(); return; }

      playClick();
      const newPos = [nr, nc];
      setPos(newPos);
      setPath((p) => [...p, newPos.join(",")]);

      if (nr === maze.end[0] && nc === maze.end[1]) {
        setWon(true);
        playSuccess();
      }
    },
    [pos, maze, won]
  );

  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); move(dir[0], dir[1]); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  const handleNext = useCallback(() => {
    if (mazeIndex + 1 >= MAZES.length) {
      setAllDone(true);
      addStar("mazeGame");
      addSticker("🏁");
    } else {
      const next = mazeIndex + 1;
      setMazeIndex(next);
      setPos(MAZES[next].start);
      setPath([MAZES[next].start.join(",")]);
      setWon(false);
    }
  }, [mazeIndex, addStar, addSticker]);

  const restart = () => { setMazeIndex(0); setPos(MAZES[0].start); setPath([MAZES[0].start.join(",")]); setWon(false); setAllDone(false); };

  if (allDone) return <div className="game-page game-page--maze"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--maze">
      <BackButton />
      <h2 className="maze-title">Labirynt: {maze.name}</h2>
      <p className="maze-hint">Doprowadź myszkę 🐭 do serka 🧀!</p>
      <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${maze.cols}, 1fr)` }}>
        {Array.from({ length: maze.rows }, (_, r) =>
          Array.from({ length: maze.cols }, (_, c) => {
            const key = `${r},${c}`;
            const isWall = maze.walls.has(key);
            const isStart = r === maze.start[0] && c === maze.start[1];
            const isEnd = r === maze.end[0] && c === maze.end[1];
            const isPlayer = r === pos[0] && c === pos[1];
            const isPath = path.includes(key);
            return (
              <div key={key} className={`maze-cell ${isWall ? "maze-cell--wall" : ""} ${isPath ? "maze-cell--path" : ""} ${isPlayer ? "maze-cell--player" : ""}`}>
                {isPlayer && "🐭"}
                {isEnd && !isPlayer && "🧀"}
                {isStart && !isPlayer && !isEnd && ""}
              </div>
            );
          })
        )}
      </div>
      <div className="maze-controls">
        <button className="maze-btn" onClick={() => move(-1, 0)}>⬆️</button>
        <div className="maze-controls__row">
          <button className="maze-btn" onClick={() => move(0, -1)}>⬅️</button>
          <button className="maze-btn" onClick={() => move(1, 0)}>⬇️</button>
          <button className="maze-btn" onClick={() => move(0, 1)}>➡️</button>
        </div>
      </div>
      {won && (
        <button className="maze-next-btn" onClick={handleNext}>
          {mazeIndex + 1 >= MAZES.length ? "Koniec!" : "Następny!"} ➡️
        </button>
      )}
    </div>
  );
}
