import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./BiggerGame.css";

const EMOJIS = ["🍎", "⭐", "🌸", "🎈", "🦋", "❤️", "🐟", "🍐"];
const TOTAL = 10;

function genRound() {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  let a, b;
  do {
    a = Math.floor(Math.random() * 8) + 1;
    b = Math.floor(Math.random() * 8) + 1;
  } while (a === b);
  return { emoji, a, b, bigger: a > b ? "left" : "right" };
}

export default function BiggerGame() {
  const [round, setRound] = useState(() => genRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  useEffect(() => {
    if (!isWon) {
      const t = setTimeout(() => speak("Gdzie jest więcej?"), 400);
      return () => clearTimeout(t);
    }
  }, [round, isWon]);

  const pick = useCallback(
    (side) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (side === round.bigger) {
        setFeedback("correct");
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("biggerGame"); addSticker("⚖️"); }
          else setRound(genRound());
          setFeedback(null);
          proc.current = false;
        }, 1000);
      } else {
        setFeedback("wrong");
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, addStar, addSticker]
  );

  const restart = () => { setRound(genRound()); setScore(0); setFeedback(null); setIsWon(false); proc.current = false; };

  if (isWon) return <div className="game-page game-page--bigger"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--bigger">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <p className="game-page__hint">Gdzie jest <strong>więcej</strong>?</p>
      <div className="bigger-sides">
        <button
          className={`bigger-side ${feedback === "correct" && round.bigger === "left" ? "bigger-side--correct" : ""} ${feedback === "wrong" ? "bigger-side--shake" : ""}`}
          onClick={() => pick("left")}
        >
          <div className="bigger-items">
            {Array.from({ length: round.a }, (_, i) => <span key={i}>{round.emoji}</span>)}
          </div>
        </button>
        <span className="bigger-vs">VS</span>
        <button
          className={`bigger-side ${feedback === "correct" && round.bigger === "right" ? "bigger-side--correct" : ""} ${feedback === "wrong" ? "bigger-side--shake" : ""}`}
          onClick={() => pick("right")}
        >
          <div className="bigger-items">
            {Array.from({ length: round.b }, (_, i) => <span key={i}>{round.emoji}</span>)}
          </div>
        </button>
      </div>
    </div>
  );
}
