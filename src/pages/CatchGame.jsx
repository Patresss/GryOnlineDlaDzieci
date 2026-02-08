import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playClick } from "../hooks/useSound";
import "./CatchGame.css";

const BUTTERFLIES = ["🦋", "🦋", "🦋", "🦋"];
const COLORS = ["#FF6B6B", "#74B9FF", "#51CF66", "#FFE66D", "#A29BFE", "#4ECDC4"];
const GAME_DURATION = 30;

function randomPos() {
  return {
    x: 10 + Math.random() * 75,
    y: 10 + Math.random() * 70,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
  };
}

export default function CatchGame() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [butterflies, setButterflies] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [pops, setPops] = useState([]);
  const timerRef = useRef();
  const { addStar, addSticker } = useProfile();

  const start = useCallback(() => {
    setStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsWon(false);
    setButterflies(
      Array.from({ length: 6 }, (_, i) => ({ id: i, ...randomPos() }))
    );
  }, []);

  // Move butterflies
  useEffect(() => {
    if (!started || isWon) return;
    let raf;
    const move = () => {
      setButterflies((prev) =>
        prev.map((b) => {
          let nx = b.x + b.dx;
          let ny = b.y + b.dy;
          let ndx = b.dx;
          let ndy = b.dy;
          if (nx < 5 || nx > 85) ndx = -ndx;
          if (ny < 5 || ny > 75) ndy = -ndy;
          return { ...b, x: nx, y: ny, dx: ndx, dy: ndy };
        })
      );
      raf = requestAnimationFrame(move);
    };
    raf = requestAnimationFrame(move);
    return () => cancelAnimationFrame(raf);
  }, [started, isWon]);

  // Timer
  useEffect(() => {
    if (!started || isWon) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setIsWon(true);
          addStar("catchGame");
          addSticker("🦋");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, isWon, addStar, addSticker]);

  const catchButterfly = useCallback(
    (id, x, y) => {
      playClick();
      setScore((s) => s + 1);
      setPops((p) => [...p, { id: Date.now(), x, y }]);
      setTimeout(() => setPops((p) => p.filter((pp) => pp.id !== Date.now())), 600);
      setButterflies((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...randomPos(), id: b.id } : b))
      );
    },
    []
  );

  if (isWon) {
    return (
      <div className="game-page game-page--catch">
        <div className="catch-final-score">Złapano: {score} 🦋</div>
        <WinScreen onPlayAgain={start} sticker="🦋" />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="game-page game-page--catch">
        <BackButton />
        <div className="catch-start">
          <span className="catch-start__emoji">🦋</span>
          <h2>Złap motylki!</h2>
          <p>Masz {GAME_DURATION} sekund</p>
          <button className="catch-start__btn" onClick={start}>Start!</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page game-page--catch">
      <BackButton />
      <div className="catch-hud">
        <div className="catch-hud__score">🦋 {score}</div>
        <div className="catch-hud__timer">⏱️ {timeLeft}s</div>
      </div>
      <div className="catch-arena">
        {butterflies.map((b) => (
          <button
            key={b.id}
            className="catch-butterfly"
            style={{ left: `${b.x}%`, top: `${b.y}%`, color: b.color }}
            onClick={() => catchButterfly(b.id, b.x, b.y)}
          >
            🦋
          </button>
        ))}
        {pops.map((p) => (
          <span key={p.id} className="catch-pop" style={{ left: `${p.x}%`, top: `${p.y}%` }}>+1</span>
        ))}
      </div>
    </div>
  );
}
