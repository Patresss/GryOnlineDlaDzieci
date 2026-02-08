import { useState, useCallback, useRef } from "react";
import { useProfile } from "../context/ProfileContext";
import { playSuccess, playError, speak } from "./useSound";

const CORRECT_MESSAGES = ["Super!", "Świetnie!", "Brawo!", "Ale dobrze!", "Wow!", "Ekstra!"];
const WRONG_MESSAGES = ["Prawie! Spróbuj jeszcze raz!", "Nie tym razem!", "Spróbuj ponownie!"];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export default function useGameLoop({ gameId, sticker, dataSource, generateRound }) {
  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const isProcessing = useRef(false);
  const { addStar, addSticker, trackRecentlyPlayed } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const currentItem = rounds[currentRound];

  const startGame = useCallback((level) => {
    setDifficulty(level);
    if (dataSource) {
      setRounds(shuffleAndPick(dataSource, level.rounds));
    } else if (generateRound) {
      setRounds(Array.from({ length: level.rounds }, () => generateRound()));
    }
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    setStreak(0);
    setShowStreak(false);
    setWrongCount(0);
    setShowHint(false);
    isProcessing.current = false;
    trackRecentlyPlayed(gameId);
  }, [dataSource, generateRound, gameId, trackRecentlyPlayed]);

  const handleCorrect = useCallback(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setFeedback("correct");
    playSuccess();

    const newStreak = streak + 1;
    setStreak(newStreak);
    setWrongCount(0);
    setShowHint(false);

    if (newStreak >= 3 && newStreak % 3 === 0) {
      setShowStreak(true);
      setTimeout(() => setShowStreak(false), 1500);
    }

    const msg = pickRandom(CORRECT_MESSAGES);
    setTimeout(() => speak(msg), 200);

    setTimeout(() => {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= totalRounds) {
        setIsWon(true);
        addStar(gameId);
        addSticker(sticker);
      } else {
        if (generateRound) {
          setRounds((prev) => {
            const next = [...prev];
            next[currentRound + 1] = generateRound();
            return next;
          });
        }
        setCurrentRound((r) => r + 1);
      }
      setFeedback(null);
      isProcessing.current = false;
    }, 1200);
  }, [streak, score, totalRounds, gameId, sticker, addStar, addSticker, currentRound, generateRound]);

  const handleWrong = useCallback(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setFeedback("wrong");
    playError();
    setStreak(0);

    const newWrongCount = wrongCount + 1;
    setWrongCount(newWrongCount);

    if (newWrongCount >= 2) {
      setTimeout(() => setShowHint(true), 400);
    }

    const msg = pickRandom(WRONG_MESSAGES);
    setTimeout(() => speak(msg), 200);

    setTimeout(() => {
      setFeedback(null);
      isProcessing.current = false;
    }, 800);
  }, [wrongCount]);

  const resetGame = useCallback(() => {
    setDifficulty(null);
    setRounds([]);
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    setStreak(0);
    setShowStreak(false);
    setWrongCount(0);
    setShowHint(false);
    isProcessing.current = false;
  }, []);

  return {
    difficulty,
    startGame,
    currentRound,
    currentItem,
    score,
    totalRounds,
    feedback,
    isWon,
    isProcessing,
    streak,
    showStreak,
    showHint,
    handleCorrect,
    handleWrong,
    resetGame,
  };
}
