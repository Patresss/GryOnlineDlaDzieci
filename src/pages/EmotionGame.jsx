import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import emotions from "../data/emotions";
import "./EmotionGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function EmotionGame() {
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
    setDifficulty(level);
    setRounds(shuffle(emotions).slice(0, level.rounds));
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
      const t = setTimeout(() => speak(item.scene), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, item]);

  const handlePick = useCallback((emoji) => {
    if (feedback || isWon || proc.current) return;
    proc.current = true;
    if (emoji === item.correctEmotion) {
      setFeedback("correct");
      playSuccess();
      setTimeout(() => speak(item.emotionName), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) { setIsWon(true); addStar("emotionGame"); addSticker("😊"); }
        else { hasSpoken.current = false; setCurrentRound(r => r + 1); }
        setFeedback(null);
        proc.current = false;
      }, 1200);
    } else {
      setFeedback("wrong");
      playError();
      setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
    }
  }, [feedback, isWon, item, score, totalRounds, addStar, addSticker]);

  if (!difficulty) return <div className="game-page game-page--emotion"><BackButton /><DifficultyPicker onSelect={startGame} /></div>;
  if (isWon) return <div className="game-page game-page--emotion"><WinScreen onPlayAgain={() => setDifficulty(null)} sticker="😊" /></div>;

  return (
    <div className="game-page game-page--emotion">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={totalRounds} /></div>
      <div className="emotion-scene">
        <span className="emotion-scene__emoji">{item.emoji}</span>
        <p className="emotion-scene__text">{item.scene}</p>
        {feedback === "correct" && <p className="emotion-scene__answer">{item.correctEmotion} {item.emotionName}</p>}
      </div>
      <p className="game-page__hint">Jak się czuje ta osoba?</p>
      <div className="emotion-options">
        {item.options.map(e => (
          <button
            key={e}
            className={`emotion-btn ${feedback === "correct" && e === item.correctEmotion ? "emotion-btn--correct" : ""} ${feedback === "wrong" && e !== item.correctEmotion ? "" : ""}`}
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
