import { useState, useCallback, useRef, useEffect } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import wordsData from "../data/words";
import "./WordGame.css";

const TOTAL = 8;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function pickRounds(count) {
  return shuffle(wordsData).slice(0, count);
}

export default function WordGame() {
  const [rounds] = useState(() => pickRounds(TOTAL));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [scrambled, setScrambled] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const word = rounds[currentRound];

  useEffect(() => {
    if (word) {
      const letters = word.word.split("").map((l, i) => ({ letter: l, id: i }));
      setScrambled(shuffle(letters));
      setPlaced([]);
      setFeedback(null);
      proc.current = false;
      const t = setTimeout(() => speak(word.hint), 500);
      return () => clearTimeout(t);
    }
  }, [currentRound, word]);

  const handleLetterClick = useCallback(
    (item) => {
      if (feedback || proc.current) return;
      playClick();
      const newPlaced = [...placed, item];
      setPlaced(newPlaced);
      setScrambled((s) => s.filter((l) => l.id !== item.id));

      if (newPlaced.length === word.word.length) {
        proc.current = true;
        const attempt = newPlaced.map((l) => l.letter).join("");
        if (attempt === word.word) {
          setFeedback("correct");
          playSuccess();
          setTimeout(() => {
            const ns = score + 1;
            setScore(ns);
            if (ns >= TOTAL) { setIsWon(true); addStar("wordGame"); addSticker("📝"); }
            else setCurrentRound((r) => r + 1);
          }, 1200);
        } else {
          setFeedback("wrong");
          playError();
          setTimeout(() => {
            const letters = word.word.split("").map((l, i) => ({ letter: l, id: i }));
            setScrambled(shuffle(letters));
            setPlaced([]);
            setFeedback(null);
            proc.current = false;
          }, 800);
        }
      }
    },
    [placed, word, feedback, score, addStar, addSticker]
  );

  const handlePlacedClick = useCallback(
    (item) => {
      if (feedback || proc.current) return;
      playClick();
      setPlaced((p) => p.filter((l) => l.id !== item.id));
      setScrambled((s) => [...s, item]);
    },
    [feedback]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--word"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--word">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="word-emoji">{word.emoji}</div>
      <div className={`word-slots ${feedback === "correct" ? "word-slots--correct" : feedback === "wrong" ? "word-slots--wrong" : ""}`}>
        {word.word.split("").map((_, i) => (
          <div key={i} className="word-slot" onClick={() => placed[i] && handlePlacedClick(placed[i])}>
            {placed[i] ? <span className="word-slot__letter">{placed[i].letter}</span> : null}
          </div>
        ))}
      </div>
      <p className="game-page__hint">{word.hint}</p>
      <div className="word-scramble">
        {scrambled.map((item) => (
          <button key={item.id} className="word-letter-btn" onClick={() => handleLetterClick(item)}>
            {item.letter}
          </button>
        ))}
      </div>
    </div>
  );
}
