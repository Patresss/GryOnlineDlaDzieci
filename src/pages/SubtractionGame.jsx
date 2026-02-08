import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import VirtualKeyboard from "../components/VirtualKeyboard";
import useKeyboardListener from "../hooks/useKeyboardListener";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./SubtractionGame.css";

const EMOJIS = ["🍪", "🍎", "⭐", "🌸", "🎈"];
const TOTAL = 10;

function genRound() {
  const a = Math.floor(Math.random() * 7) + 3;
  const b = Math.floor(Math.random() * (a - 1)) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  return { a, b, result: a - b, emoji };
}

export default function SubtractionGame() {
  const [round, setRound] = useState(() => genRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);
  const [lastKey, resetKey] = useKeyboardListener();
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  useEffect(() => {
    if (!isWon) {
      const t1 = setTimeout(() => speak(`${round.a} minus ${round.b} to ile?`), 400);
      const t2 = setTimeout(() => setShowRemoved(true), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [round, isWon]);

  const handleKey = useCallback((key) => {
    if (feedback || isWon || proc.current) return;
    const num = parseInt(key);
    if (isNaN(num)) return;
    proc.current = true;
    if (num === round.result) {
      setFeedback("correct");
      playSuccess();
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= TOTAL) { setIsWon(true); addStar("subtractionGame"); addSticker("➖"); }
        else { setShowRemoved(false); setRound(genRound()); }
        setFeedback(null);
        proc.current = false;
        resetKey();
      }, 1000);
    } else {
      setFeedback("wrong");
      playError();
      setTimeout(() => { setFeedback(null); proc.current = false; resetKey(); }, 600);
    }
  }, [feedback, isWon, round, score, resetKey, addStar, addSticker]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- keyboard listener bridge
  useEffect(() => { if (lastKey) handleKey(lastKey); }, [lastKey, handleKey]);

  const restart = () => { setRound(genRound()); setScore(0); setFeedback(null); setIsWon(false); proc.current = false; resetKey(); };

  if (isWon) return <div className="game-page game-page--subtraction"><WinScreen onPlayAgain={restart} sticker="➖" /></div>;

  return (
    <div className="game-page game-page--subtraction">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className={`subtraction-display ${feedback === "correct" ? "subtraction-display--correct" : feedback === "wrong" ? "subtraction-display--wrong" : ""}`}>
        <div className="subtraction-group">
          {Array.from({ length: round.a }, (_, i) => (
            <span
              key={i}
              className={`subtraction-item ${showRemoved && i >= round.result ? "subtraction-item--removed" : ""}`}
            >
              {round.emoji}
            </span>
          ))}
        </div>
        <span className="subtraction-minus">- {round.b}</span>
        <span className="subtraction-equals">= ?</span>
      </div>
      <p className="game-page__hint">{round.a} - {round.b} = ?</p>
      <VirtualKeyboard mode="numbers" onKeyPress={handleKey} highlightKey={feedback === "correct" ? String(round.result) : null} disabled={!!feedback} />
    </div>
  );
}
