import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import "./SortSizeGame.css";

const EMOJIS = ["🌳", "🌟", "🎈", "🐟", "🍎", "🌸", "❤️", "🦋"];
const TOTAL = 8;

function genRound() {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const count = 4 + Math.floor(Math.random() * 2);
  const sizes = Array.from({ length: count }, (_, i) => 30 + i * 18);
  const shuffled = [...sizes].sort(() => Math.random() - 0.5);
  return { emoji, sizes, shuffled: shuffled.map((s, i) => ({ size: s, id: i })) };
}

export default function SortSizeGame() {
  const [round, setRound] = useState(() => genRound());
  const [placed, setPlaced] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [available, setAvailable] = useState(round.shuffled);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  useEffect(() => {
    if (!isWon) {
      const t = setTimeout(() => speak("Ułóż od najmniejszego do największego!"), 400);
      return () => clearTimeout(t);
    }
  }, [round, isWon]);

  const handlePick = useCallback(
    (item) => {
      if (feedback || proc.current) return;
      playClick();
      const newPlaced = [...placed, item];
      setPlaced(newPlaced);
      setAvailable((a) => a.filter((i) => i.id !== item.id));

      if (newPlaced.length === round.shuffled.length) {
        proc.current = true;
        const sorted = newPlaced.map((i) => i.size);
        const isSorted = sorted.every((s, i) => i === 0 || s >= sorted[i - 1]);
        if (isSorted) {
          setFeedback("correct");
          playSuccess();
          setTimeout(() => {
            const ns = score + 1;
            setScore(ns);
            if (ns >= TOTAL) { setIsWon(true); addStar("sortSizeGame"); addSticker("📏"); }
            else {
              const nr = genRound();
              setRound(nr);
              setPlaced([]);
              setAvailable(nr.shuffled);
              setFeedback(null);
              proc.current = false;
            }
          }, 1200);
        } else {
          setFeedback("wrong");
          playError();
          setTimeout(() => {
            setPlaced([]);
            setAvailable(round.shuffled.sort(() => Math.random() - 0.5));
            setFeedback(null);
            proc.current = false;
          }, 800);
        }
      }
    },
    [placed, round, feedback, score, addStar, addSticker]
  );

  const handleUndo = useCallback(() => {
    if (feedback || placed.length === 0) return;
    const last = placed[placed.length - 1];
    setPlaced((p) => p.slice(0, -1));
    setAvailable((a) => [...a, last]);
  }, [placed, feedback]);

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--sortsize"><WinScreen onPlayAgain={restart} sticker="📏" /></div>;

  return (
    <div className="game-page game-page--sortsize">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <p className="game-page__hint">Klikaj od <strong>najmniejszego</strong> do <strong>największego</strong>!</p>
      <div className={`sort-placed ${feedback === "correct" ? "sort-placed--correct" : feedback === "wrong" ? "sort-placed--wrong" : ""}`}>
        {placed.map((item, i) => (
          <span key={item.id} className="sort-placed-item" style={{ fontSize: `${item.size}px` }}>{round.emoji}</span>
        ))}
        {placed.length > 0 && !feedback && (
          <button className="sort-undo" onClick={handleUndo}>↩</button>
        )}
      </div>
      <div className="sort-available">
        {available.map((item) => (
          <button key={item.id} className="sort-item-btn" style={{ fontSize: `${item.size}px` }} onClick={() => handlePick(item)}>
            {round.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
