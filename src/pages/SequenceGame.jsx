import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import sequences from "../data/sequences";
import "./SequenceGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function getSequencesForDifficulty(levelId) {
  if (levelId === "easy") return sequences.filter(s => s.difficulty === "easy");
  if (levelId === "medium") return sequences.filter(s => s.difficulty === "easy" || s.difficulty === "medium");
  return [...sequences];
}

export default function SequenceGame() {
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

  const startGame = useCallback((level) => {
    const pool = getSequencesForDifficulty(level.id);
    setDifficulty(level);
    setRounds(shuffle(pool).slice(0, level.rounds));
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
      const t = setTimeout(() => speak("Co będzie dalej?"), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, item]);

  const handlePick = useCallback((emoji) => {
    if (feedback || isWon || proc.current) return;
    proc.current = true;
    if (emoji === item.answer) {
      setFeedback({ type: "correct", picked: emoji });
      playSuccess();
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) { setIsWon(true); addStar("sequenceGame"); addSticker("🔢"); }
        else { hasSpoken.current = false; setCurrentRound(r => r + 1); }
        setFeedback(null);
        proc.current = false;
      }, 1000);
    } else {
      setFeedback({ type: "wrong", picked: emoji });
      playError();
      setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
    }
  }, [feedback, isWon, item, score, totalRounds, addStar, addSticker]);

  if (!difficulty) return <div className="game-page game-page--sequence"><BackButton /><DifficultyPicker onSelect={startGame} /></div>;
  if (isWon) return <div className="game-page game-page--sequence"><WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🔢" /></div>;

  return (
    <div className="game-page game-page--sequence">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={totalRounds} /></div>
      <div className="sequence-display">
        {item.pattern.map((emoji, i) => (
          <span key={i} className="sequence-item" style={{ animationDelay: `${i * 0.1}s` }}>{emoji}</span>
        ))}
        <span className="sequence-item sequence-item--question">❓</span>
      </div>
      <p className="game-page__hint">Co będzie dalej?</p>
      <div className="sequence-options">
        {item.options.map(emoji => (
          <button
            key={emoji}
            className={`sequence-btn ${feedback?.type === "correct" && emoji === item.answer ? "sequence-btn--correct" : ""} ${feedback?.type === "wrong" && emoji === feedback.picked ? "sequence-btn--wrong" : ""}`}
            onClick={() => handlePick(emoji)}
            disabled={!!feedback}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
