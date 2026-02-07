import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import VirtualKeyboard from "../components/VirtualKeyboard";
import useKeyboardListener from "../hooks/useKeyboardListener";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import allNumbers from "../data/numbers";
import "./GamePage.css";

function pickRounds(arr, count) {
  const pool = [];
  while (pool.length < count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    pool.push(...shuffled);
  }
  return pool.slice(0, count);
}

function EmojiGrid({ emoji, count }) {
  return (
    <div className="emoji-grid">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="emoji-grid__item">{emoji}</span>
      ))}
    </div>
  );
}

export default function NumberGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [lastKey, resetKey] = useKeyboardListener();
  const isProcessing = useRef(false);
  const hasSpoken = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const currentItem = rounds[currentRound];

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setRounds(pickRounds(allNumbers, level.rounds));
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    isProcessing.current = false;
    hasSpoken.current = false;
  }, []);

  useEffect(() => {
    if (!isWon && currentItem && !hasSpoken.current) {
      hasSpoken.current = true;
      const timer = setTimeout(() => {
        speak(`${currentItem.number} ${currentItem.word}`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentRound, isWon, currentItem]);

  const handleKey = useCallback(
    (key) => {
      if (feedback || isWon || isProcessing.current || !currentItem) return;
      isProcessing.current = true;

      if (key === String(currentItem.number)) {
        setFeedback("correct");
        playSuccess();
        setTimeout(() => {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore >= totalRounds) {
            setIsWon(true);
            addStar("numberGame");
            addSticker("🔢");
          } else {
            hasSpoken.current = false;
            setCurrentRound((r) => r + 1);
          }
          setFeedback(null);
          isProcessing.current = false;
          resetKey();
        }, 1200);
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
    [feedback, isWon, currentItem, score, totalRounds, resetKey, addStar, addSticker]
  );

  useEffect(() => {
    if (lastKey && difficulty) handleKey(lastKey);
  }, [lastKey]);

  if (!difficulty) {
    return (
      <div className="game-page game-page--numbers">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--numbers">
        <WinScreen onPlayAgain={() => setDifficulty(null)} />
      </div>
    );
  }

  return (
    <div className="game-page game-page--numbers">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <div className="game-page__content">
        <div className={`game-card game-card--image ${feedback === "correct" ? "game-card--correct" : ""}`}>
          <EmojiGrid emoji={currentItem.emoji} count={currentItem.number} />
          <span className="game-card__word">{currentItem.number} {currentItem.word}</span>
        </div>
        <div className={`game-card game-card--answer ${feedback === "correct" ? "game-card--correct" : feedback === "wrong" ? "game-card--wrong" : ""}`}>
          <span className="game-card__letter">{currentItem.number}</span>
        </div>
      </div>
      <p className="game-page__hint">
        Naciśnij cyfrę <strong>{currentItem.number}</strong>!
      </p>
      <VirtualKeyboard
        mode="numbers"
        onKeyPress={handleKey}
        highlightKey={feedback === "correct" ? String(currentItem.number) : null}
        disabled={!!feedback}
      />
    </div>
  );
}
