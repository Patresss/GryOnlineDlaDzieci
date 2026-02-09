import { useState, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import "./ShopGame.css";

const ITEMS = [
  { emoji: "🍎", name: "Jabłko", price: 2 },
  { emoji: "🍪", name: "Ciastko", price: 3 },
  { emoji: "🧃", name: "Sok", price: 4 },
  { emoji: "🎈", name: "Balonik", price: 5 },
  { emoji: "🍰", name: "Tort", price: 6 },
  { emoji: "📕", name: "Książka", price: 7 },
  { emoji: "🧸", name: "Miś", price: 10 },
  { emoji: "🎮", name: "Gra", price: 15 },
  { emoji: "🎒", name: "Plecak", price: 20 },
];

const COINS = [
  { value: 1, label: "1 zł" },
  { value: 2, label: "2 zł" },
  { value: 5, label: "5 zł" },
  { value: 10, label: "10 zł" },
  { value: 20, label: "20 zł" },
];

function getItemsForDifficulty(diffId) {
  if (diffId === "easy") return ITEMS.filter((i) => i.price <= 5);
  if (diffId === "medium") return ITEMS.filter((i) => i.price <= 10);
  return ITEMS;
}

export default function ShopGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;

  /* eslint-disable react-hooks/purity */
  const items = useMemo(() => {
    if (!difficulty) return [];
    const pool = getItemsForDifficulty(difficulty.id);
    return Array.from({ length: totalRounds }, () =>
      pool[Math.floor(Math.random() * pool.length)]
    );
  }, [difficulty, totalRounds]);
  /* eslint-enable react-hooks/purity */

  const currentItem = items[currentRound];
  const total = selectedCoins.reduce((sum, c) => sum + c, 0);

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    setSelectedCoins([]);
    isProcessing.current = false;
    setTimeout(() => speak("Zapłać za produkt odpowiednimi monetami!"), 400);
  }, []);

  const addCoin = useCallback((value) => {
    if (isProcessing.current || feedback) return;
    playClick();
    setSelectedCoins((prev) => [...prev, value]);
  }, [feedback]);

  const removeCoin = useCallback((idx) => {
    if (isProcessing.current || feedback) return;
    playClick();
    setSelectedCoins((prev) => prev.filter((_, i) => i !== idx));
  }, [feedback]);

  const handlePay = useCallback(() => {
    if (isProcessing.current || feedback || !currentItem) return;
    isProcessing.current = true;

    if (total === currentItem.price) {
      setFeedback("correct");
      playSuccess();
      setTimeout(() => speak("Świetnie! Dokładna kwota!"), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        setSelectedCoins([]);
        if (ns >= totalRounds) {
          setIsWon(true);
          addStar("shopGame");
          addSticker("🛒");
        } else {
          setCurrentRound((r) => r + 1);
        }
        setFeedback(null);
        isProcessing.current = false;
      }, 1200);
    } else {
      setFeedback("wrong");
      playError();
      const hint = total < currentItem.price ? "Za mało!" : "Za dużo!";
      setTimeout(() => speak(hint), 200);
      setTimeout(() => {
        setFeedback(null);
        isProcessing.current = false;
      }, 1000);
    }
  }, [feedback, currentItem, total, score, totalRounds, addStar, addSticker]);

  const maxCoin = difficulty?.id === "easy" ? 5 : difficulty?.id === "medium" ? 10 : 20;
  const availableCoins = COINS.filter((c) => c.value <= maxCoin);

  if (!difficulty) {
    return (
      <div className="game-page game-page--shop">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--shop">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🛒" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--shop">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <h2 className="shop__title">Sklep 🛒</h2>

      {currentItem && (
        <div className={`shop__item ${feedback === "correct" ? "shop__item--correct" : ""} ${feedback === "wrong" ? "shop__item--wrong" : ""}`}>
          <span className="shop__item-emoji">{currentItem.emoji}</span>
          <span className="shop__item-name">{currentItem.name}</span>
          <span className="shop__item-price">{currentItem.price} zł</span>
        </div>
      )}

      <div className="shop__selected">
        <p className="shop__total">Twoja kwota: <strong>{total} zł</strong></p>
        <div className="shop__selected-coins">
          {selectedCoins.map((c, i) => (
            <button key={i} className="shop__coin shop__coin--selected" onClick={() => removeCoin(i)}>
              🪙 {c}
            </button>
          ))}
          {selectedCoins.length === 0 && <span className="shop__empty">Wybierz monety poniżej</span>}
        </div>
      </div>

      <div className="shop__coins">
        {availableCoins.map((coin) => (
          <button
            key={coin.value}
            className="shop__coin"
            onClick={() => addCoin(coin.value)}
            disabled={!!feedback}
          >
            🪙 {coin.label}
          </button>
        ))}
      </div>

      <div className="shop__actions">
        <button
          className="shop__pay-btn"
          onClick={handlePay}
          disabled={!!feedback || selectedCoins.length === 0}
        >
          Zapłać 💰
        </button>
        <button
          className="shop__clear-btn"
          onClick={() => { setSelectedCoins([]); playClick(); }}
          disabled={!!feedback || selectedCoins.length === 0}
        >
          Wyczyść
        </button>
      </div>
    </div>
  );
}
