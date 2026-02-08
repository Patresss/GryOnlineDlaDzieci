import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playSuccess, playError, playClick } from "../hooks/useSound";
import "./MemoryGame.css";

const CARD_SETS = {
  letters: [
    { id: "A", front: "🚗", back: "A" },
    { id: "B", front: "🎈", back: "B" },
    { id: "C", front: "🍋", back: "C" },
    { id: "D", front: "🏠", back: "D" },
    { id: "E", front: "🖥️", back: "E" },
    { id: "F", front: "🚩", back: "F" },
    { id: "G", front: "🍐", back: "G" },
    { id: "H", front: "🚁", back: "H" },
  ],
  numbers: [
    { id: "1", front: "🐦", back: "1" },
    { id: "2", front: "🐦🐦", back: "2" },
    { id: "3", front: "🍎🍎🍎", back: "3" },
    { id: "4", front: "🦋🦋🦋🦋", back: "4" },
    { id: "5", front: "⭐⭐⭐⭐⭐", back: "5" },
    { id: "6", front: "🌸🌸🌸🌸🌸🌸", back: "6" },
    { id: "7", front: "🎈🎈🎈🎈🎈🎈🎈", back: "7" },
    { id: "8", front: "☁️☁️☁️☁️☁️☁️☁️☁️", back: "8" },
  ],
};

const DIFFICULTIES = [
  { id: "easy", label: "Łatwy", emoji: "🌟", pairs: 4 },
  { id: "medium", label: "Średni", emoji: "⭐", pairs: 6 },
  { id: "hard", label: "Trudny", emoji: "🏆", pairs: 8 },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const isChecking = useRef(false);
  const { addStar, addSticker } = useProfile();

  const startGame = useCallback((setType, diff) => {
    setMode(setType);
    setDifficulty(diff);
    const set = CARD_SETS[setType].slice(0, diff.pairs);
    let pairs;
    if (diff.id === "easy") {
      // Easy mode: both cards show the same emoji
      pairs = set.flatMap((c, i) => [
        { uid: `${i}-a`, id: c.id, display: c.front, type: "front" },
        { uid: `${i}-b`, id: c.id, display: c.front, type: "front" },
      ]);
    } else {
      pairs = set.flatMap((c, i) => [
        { uid: `${i}-a`, id: c.id, display: c.front, type: "front" },
        { uid: `${i}-b`, id: c.id, display: c.back, type: "back" },
      ]);
    }
    setCards(shuffle(pairs));
    setFlipped([]);
    setMatched([]);
    setIsWon(false);
  }, []);

  const handleFlip = useCallback(
    (uid) => {
      if (isChecking.current) return;
      if (flipped.includes(uid) || matched.includes(uid)) return;
      playClick();

      const newFlipped = [...flipped, uid];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        isChecking.current = true;
        const [a, b] = newFlipped.map((u) => cards.find((c) => c.uid === u));
        if (a.id === b.id) {
          playSuccess();
          const newMatched = [...matched, a.uid, b.uid];
          setTimeout(() => {
            setMatched(newMatched);
            setFlipped([]);
            isChecking.current = false;
            if (newMatched.length === cards.length) {
              setIsWon(true);
              addStar("memoryGame");
              addSticker("🃏");
            }
          }, 600);
        } else {
          playError();
          setTimeout(() => {
            setFlipped([]);
            isChecking.current = false;
          }, 1000);
        }
      }
    },
    [flipped, matched, cards, addStar, addSticker]
  );

  if (isWon) {
    return (
      <div className="game-page game-page--memory">
        <WinScreen onPlayAgain={() => { setMode(null); setDifficulty(null); }} sticker="🃏" />
      </div>
    );
  }

  if (!mode || !difficulty) {
    return (
      <div className="game-page game-page--memory">
        <BackButton />
        <div className="memory-setup">
          <h2 className="memory-setup__title">Memory</h2>
          {!mode ? (
            <div className="memory-setup__options">
              <button className="memory-setup__btn memory-setup__btn--letters" onClick={() => setMode("letters")}>
                <span>🔤</span>Literki
              </button>
              <button className="memory-setup__btn memory-setup__btn--numbers" onClick={() => setMode("numbers")}>
                <span>🔢</span>Cyferki
              </button>
            </div>
          ) : (
            <div className="memory-setup__options">
              {DIFFICULTIES.map((d) => (
                <button key={d.id} className={`memory-setup__btn memory-setup__btn--${d.id}`} onClick={() => startGame(mode, d)}>
                  <span>{d.emoji}</span>{d.label}<small>{d.pairs} pary</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const cols = cards.length <= 8 ? 4 : cards.length <= 12 ? 4 : 4;

  return (
    <div className="game-page game-page--memory">
      <BackButton />
      <h2 className="memory-title">Znajdź pary!</h2>
      <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uid) || matched.includes(card.uid);
          const isMatched = matched.includes(card.uid);
          return (
            <button
              key={card.uid}
              className={`memory-card ${isFlipped ? "memory-card--flipped" : ""} ${isMatched ? "memory-card--matched" : ""}`}
              onClick={() => handleFlip(card.uid)}
              disabled={isMatched}
            >
              <div className="memory-card__inner">
                <div className="memory-card__front">❓</div>
                <div className="memory-card__back">{card.display}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
