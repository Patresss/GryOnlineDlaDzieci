import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import VirtualKeyboard from "../components/VirtualKeyboard";
import useKeyboardListener from "../hooks/useKeyboardListener";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import allLetters from "../data/letters";
import "./GamePage.css";

function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export default function LetterGame() {
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
    setRounds(shuffleAndPick(allLetters, level.rounds));
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
        speak(`${currentItem.letter} jak ${currentItem.word}`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentRound, isWon, currentItem]);

  const handleKey = useCallback(
    (key) => {
      if (feedback || isWon || isProcessing.current || !currentItem) return;
      isProcessing.current = true;

      if (key === currentItem.letter) {
        setFeedback("correct");
        playSuccess();
        setTimeout(() => {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore >= totalRounds) {
            setIsWon(true);
            addStar("letterGame");
            addSticker("🔤");
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
      <div className="game-page game-page--letters">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--letters">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🔤" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--letters">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <div className="game-page__content">
        <div className={`game-card game-card--image ${feedback === "correct" ? "game-card--correct" : ""}`}>
          <span className="game-card__emoji">{currentItem.emoji}</span>
          <span className="game-card__word">{currentItem.word}</span>
        </div>
        <div className={`game-card game-card--answer ${feedback === "correct" ? "game-card--correct" : feedback === "wrong" ? "game-card--wrong" : ""}`}>
          <span className="game-card__letter">{currentItem.letter}</span>
        </div>
      </div>
      <p className="game-page__hint">
        Naciśnij literkę <strong>{currentItem.letter}</strong>!
      </p>
      <VirtualKeyboard
        mode="letters"
        onKeyPress={handleKey}
        highlightKey={feedback === "correct" ? currentItem.letter : null}
        disabled={!!feedback}
      />
    </div>
  );
}
