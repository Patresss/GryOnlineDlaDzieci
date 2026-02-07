import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import VirtualKeyboard from "../components/VirtualKeyboard";
import useKeyboardListener from "../hooks/useKeyboardListener";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./AdditionGame.css";

const EMOJIS = ["🐦", "🍎", "⭐", "🌸", "🎈"];
const TOTAL = 10;

function genRound() {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * (9 - a)) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  return { a, b, sum: a + b, emoji };
}

export default function AdditionGame() {
  const [round, setRound] = useState(() => genRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [lastKey, resetKey] = useKeyboardListener();
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  useEffect(() => {
    if (!isWon) {
      setShowSecond(false);
      const t1 = setTimeout(() => speak(`${round.a} plus ${round.b} to ile?`), 400);
      const t2 = setTimeout(() => setShowSecond(true), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [round, isWon]);

  const handleKey = useCallback(
    (key) => {
      if (feedback || isWon || proc.current) return;
      const num = parseInt(key);
      if (isNaN(num)) return;
      proc.current = true;
      if (num === round.sum) {
        setFeedback("correct");
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("additionGame"); addSticker("➕"); }
          else setRound(genRound());
          setFeedback(null);
          proc.current = false;
          resetKey();
        }, 1000);
      } else {
        setFeedback("wrong");
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; resetKey(); }, 600);
      }
    },
    [feedback, isWon, round, score, resetKey, addStar, addSticker]
  );

  useEffect(() => { if (lastKey) handleKey(lastKey); }, [lastKey]);

  const restart = () => { setRound(genRound()); setScore(0); setFeedback(null); setIsWon(false); proc.current = false; resetKey(); };

  if (isWon) return <div className="game-page game-page--addition"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--addition">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className={`addition-display ${feedback === "correct" ? "addition-display--correct" : feedback === "wrong" ? "addition-display--wrong" : ""}`}>
        <div className="addition-group">
          {Array.from({ length: round.a }, (_, i) => <span key={i} className="addition-item">{round.emoji}</span>)}
        </div>
        <span className="addition-plus">+</span>
        <div className={`addition-group ${showSecond ? "addition-group--visible" : "addition-group--hidden"}`}>
          {Array.from({ length: round.b }, (_, i) => <span key={i} className="addition-item">{round.emoji}</span>)}
        </div>
        <span className="addition-equals">= ?</span>
      </div>
      <p className="game-page__hint">{round.a} + {round.b} = ?</p>
      <VirtualKeyboard mode="numbers" onKeyPress={handleKey} highlightKey={feedback === "correct" ? String(round.sum) : null} disabled={!!feedback} />
    </div>
  );
}
