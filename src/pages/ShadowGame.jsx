import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import shadows from "../data/shadows";
import "./ShadowGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ShadowGame() {
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

  const shuffledOptions = useMemo(() => {
    if (!item) return [];
    return shuffle(item.options);
  }, [item]);

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setRounds(shuffle(shadows).slice(0, level.rounds));
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
      const t = setTimeout(() => speak("Co to za cień?"), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, item]);

  const handlePick = useCallback((emoji) => {
    if (feedback || isWon || proc.current) return;
    proc.current = true;
    if (emoji === item.emoji) {
      setFeedback({ type: "correct", picked: emoji });
      playSuccess();
      setTimeout(() => speak(`Tak! To ${item.name}!`), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) { setIsWon(true); addStar("shadowGame"); addSticker("👤"); }
        else { hasSpoken.current = false; setCurrentRound(r => r + 1); }
        setFeedback(null);
        proc.current = false;
      }, 1200);
    } else {
      setFeedback({ type: "wrong", picked: emoji });
      playError();
      setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
    }
  }, [feedback, isWon, item, score, totalRounds, addStar, addSticker]);

  if (!difficulty) return <div className="game-page game-page--shadow"><BackButton /><DifficultyPicker onSelect={startGame} /></div>;
  if (isWon) return <div className="game-page game-page--shadow"><WinScreen onPlayAgain={() => setDifficulty(null)} sticker="👤" /></div>;

  return (
    <div className="game-page game-page--shadow">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={totalRounds} /></div>
      <div className="shadow-display">
        <span className="shadow-display__shadow">{item.shadowEmoji}</span>
      </div>
      <p className="game-page__hint">Co to za cień? Wybierz właściwy obrazek!</p>
      <div className="shadow-options">
        {shuffledOptions.map(e => (
          <button
            key={e}
            className={`shadow-btn ${feedback?.type === "correct" && e === item.emoji ? "shadow-btn--correct" : ""} ${feedback?.type === "wrong" && e === feedback.picked ? "shadow-btn--wrong" : ""}`}
            onClick={() => handlePick(e)}
            disabled={!!feedback}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
