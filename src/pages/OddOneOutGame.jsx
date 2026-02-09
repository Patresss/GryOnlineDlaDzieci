import { useState, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./OddOneOutGame.css";

const CATEGORIES = [
  { name: "Owoce", items: ["🍎", "🍐", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒"], intruders: ["🐱", "🚗", "🏠", "⚽", "🎵"] },
  { name: "Zwierzęta", items: ["🐱", "🐶", "🐰", "🦊", "🐼", "🐨", "🦁", "🐸"], intruders: ["🍎", "🚗", "🏠", "⚽", "🎵"] },
  { name: "Pojazdy", items: ["🚗", "🚌", "🚂", "🚁", "✈️", "🚢", "🏍️", "🚲"], intruders: ["🍎", "🐱", "🏠", "⚽", "🎵"] },
  { name: "Warzywa", items: ["🥕", "🥦", "🌽", "🍅", "🥒", "🧅", "🥔", "🌶️"], intruders: ["🐱", "🚗", "🏠", "⚽", "🎵"] },
  { name: "Instrumenty", items: ["🎹", "🎸", "🥁", "🎺", "🎻", "🪗", "🎷"], intruders: ["🍎", "🐱", "🚗", "🏠", "⚽"] },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateRound() {
  const cat = pickRandom(CATEGORIES);
  const groupItems = shuffle(cat.items).slice(0, 3);
  const intruder = pickRandom(cat.intruders);
  const options = shuffle([...groupItems, intruder]);
  return { category: cat.name, groupItems, intruder, options };
}

export default function OddOneOutGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;

  const rounds = useMemo(() => {
    if (!difficulty) return [];
    return Array.from({ length: totalRounds }, () => generateRound());
  }, [difficulty, totalRounds]);

  const round = rounds[currentRound];

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    isProcessing.current = false;
  }, []);

  const handlePick = useCallback((emoji) => {
    if (isProcessing.current || feedback || isWon) return;
    isProcessing.current = true;

    if (emoji === round.intruder) {
      setFeedback("correct");
      playSuccess();
      const catNameLower = round.category.toLowerCase();
      const article = catNameLower === "owoce" ? "owoc"
        : catNameLower === "zwierzęta" ? "zwierzę"
        : catNameLower === "pojazdy" ? "pojazd"
        : catNameLower === "warzywa" ? "warzywo"
        : "instrument";
      setTimeout(() => speak(`Brawo! To nie ${article}!`), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) {
          setIsWon(true);
          addStar("oddOneOutGame");
          addSticker("🔎");
        } else {
          setCurrentRound((r) => r + 1);
        }
        setFeedback(null);
        isProcessing.current = false;
      }, 1200);
    } else {
      setFeedback("wrong");
      playError();
      setTimeout(() => {
        setFeedback(null);
        isProcessing.current = false;
      }, 800);
    }
  }, [feedback, isWon, round, score, totalRounds, addStar, addSticker]);

  if (!difficulty) {
    return (
      <div className="game-page game-page--oddoneout">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--oddoneout">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🔎" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--oddoneout">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <h2 className="oddoneout__title">Znajdź intruza! 🔎</h2>
      <p className="game-page__hint">Jedno z nich nie pasuje do reszty</p>
      <div className="oddoneout__grid">
        {round.options.map((emoji, i) => (
          <button
            key={i}
            className={`oddoneout__item ${
              feedback === "correct" && emoji === round.intruder ? "oddoneout__item--correct" : ""
            } ${
              feedback === "wrong" ? "oddoneout__item--shake" : ""
            }`}
            onClick={() => handlePick(emoji)}
            disabled={!!feedback}
          >
            <span className="oddoneout__emoji">{emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
