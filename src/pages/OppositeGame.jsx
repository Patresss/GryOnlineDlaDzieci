import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import opposites from "../data/opposites";
import "./OppositeGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function OppositeGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const hasSpoken = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const item = rounds[currentRound];

  const shuffledOpts = useMemo(() => {
    if (!item) return [];
    return shuffle(item.options);
  }, [item]);

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setRounds(shuffle(opposites).slice(0, level.rounds));
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    proc.current = false;
    hasSpoken.current = false;
  }, []);

  useEffect(() => {
    if (!isWon && item && !hasSpoken.current) {
      hasSpoken.current = true;
      const t = setTimeout(() => speak(`Co jest przeciwieństwem słowa ${item.word}?`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, item]);

  const handlePick = useCallback((opt) => {
    if (feedback || isWon || proc.current) return;
    proc.current = true;
    if (opt.word === item.opposite) {
      setFeedback({ type: "correct", picked: opt.word });
      playSuccess();
      setTimeout(() => speak(`Tak! Przeciwieństwo ${item.word} to ${item.opposite}!`), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) { setIsWon(true); addStar("oppositeGame"); addSticker("🔄"); }
        else { hasSpoken.current = false; setCurrentRound(r => r + 1); }
        setFeedback(null);
        proc.current = false;
      }, 1400);
    } else {
      setFeedback({ type: "wrong", picked: opt.word });
      playError();
      setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
    }
  }, [feedback, isWon, item, score, totalRounds, addStar, addSticker]);

  if (!difficulty) return <div className="game-page game-page--opposite"><BackButton /><DifficultyPicker onSelect={startGame} /></div>;
  if (isWon) return <div className="game-page game-page--opposite"><WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🔄" /></div>;

  return (
    <div className="game-page game-page--opposite">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={totalRounds} /></div>
      <div className="opposite-card">
        <span className="opposite-card__emoji">{item.emoji}</span>
        <span className="opposite-card__word">{item.word}</span>
      </div>
      <p className="game-page__hint">Co jest przeciwieństwem?</p>
      <div className="opposite-options">
        {shuffledOpts.map(opt => (
          <button
            key={opt.word}
            className={`opposite-btn ${feedback?.type === "correct" && opt.word === item.opposite ? "opposite-btn--correct" : ""} ${feedback?.type === "wrong" && opt.word === feedback.picked ? "opposite-btn--wrong" : ""}`}
            onClick={() => handlePick(opt)}
            disabled={!!feedback}
          >
            <span className="opposite-btn__emoji">{opt.emoji}</span>
            <span className="opposite-btn__word">{opt.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
