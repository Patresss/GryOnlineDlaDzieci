import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import VirtualKeyboard from "../components/VirtualKeyboard";
import useKeyboardListener from "../hooks/useKeyboardListener";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./CountGame.css";

const EMOJIS = ["🦋", "⭐", "🌸", "🎈", "🍎", "❤️", "🐟", "🌺"];
const TOTAL = 10;

function generateRound() {
  const count = Math.floor(Math.random() * 9) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  return { count, emoji };
}

export default function CountGame() {
  const [round, setRound] = useState(() => generateRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [lastKey, resetKey] = useKeyboardListener();
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  useEffect(() => {
    if (!isWon && round) {
      const t = setTimeout(() => speak(`Policz ile jest`), 400);
      return () => clearTimeout(t);
    }
  }, [round, isWon]);

  const handleKey = useCallback(
    (key) => {
      if (feedback || isWon || isProcessing.current) return;
      const num = parseInt(key);
      if (isNaN(num) || num < 1 || num > 9) return;
      isProcessing.current = true;

      if (num === round.count) {
        setFeedback("correct");
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) {
            setIsWon(true);
            addStar("countGame");
            addSticker("🔢");
          } else {
            setRound(generateRound());
          }
          setFeedback(null);
          isProcessing.current = false;
          resetKey();
        }, 1000);
      } else {
        setFeedback("wrong");
        playError();
        setTimeout(() => {
          setFeedback(null);
          isProcessing.current = false;
          resetKey();
        }, 600);
      }
    },
    [feedback, isWon, round, score, resetKey, addStar, addSticker]
  );

  useEffect(() => {
    if (lastKey) handleKey(lastKey); // eslint-disable-line react-hooks/set-state-in-effect -- keyboard listener bridge
  }, [lastKey, handleKey]);

  const restart = useCallback(() => {
    setRound(generateRound());
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    isProcessing.current = false;
    resetKey();
  }, [resetKey]);

  if (isWon) {
    return <div className="game-page game-page--count"><WinScreen onPlayAgain={restart} sticker="🔢" /></div>;
  }

  return (
    <div className="game-page game-page--count">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={TOTAL} />
      </div>
      <div className={`count-area ${feedback === "correct" ? "count-area--correct" : feedback === "wrong" ? "count-area--wrong" : ""}`}>
        <div className="count-items">
          {Array.from({ length: round.count }, (_, i) => (
            <span key={i} className="count-item" style={{ animationDelay: `${i * 0.08}s` }}>{round.emoji}</span>
          ))}
        </div>
        <p className="game-page__hint">Ile ich jest?</p>
      </div>
      <VirtualKeyboard mode="numbers" onKeyPress={handleKey} highlightKey={feedback === "correct" ? String(round.count) : null} disabled={!!feedback} />
    </div>
  );
}
