import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import "./WhatDisappearedGame.css";

const ALL_ITEMS = [
  { name: "Jabłko", emoji: "🍎" }, { name: "Balon", emoji: "🎈" }, { name: "Kot", emoji: "🐱" },
  { name: "Pies", emoji: "🐶" }, { name: "Gwiazda", emoji: "⭐" }, { name: "Serce", emoji: "❤️" },
  { name: "Kwiatek", emoji: "🌸" }, { name: "Motyl", emoji: "🦋" }, { name: "Rakieta", emoji: "🚀" },
  { name: "Samochód", emoji: "🚗" }, { name: "Dom", emoji: "🏠" }, { name: "Słońce", emoji: "☀️" },
  { name: "Ryba", emoji: "🐟" }, { name: "Lew", emoji: "🦁" }, { name: "Drzewo", emoji: "🌳" },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
const TOTAL = 8;

function genRound() {
  const count = 5;
  const items = shuffle(ALL_ITEMS).slice(0, count);
  const removed = items[Math.floor(Math.random() * items.length)];
  const remaining = items.filter((i) => i.name !== removed.name);
  const decoys = shuffle(ALL_ITEMS.filter((i) => !items.find((it) => it.name === i.name))).slice(0, 3);
  const options = shuffle([removed, ...decoys]);
  return { items, removed, remaining, options };
}

export default function WhatDisappearedGame() {
  const [round, setRound] = useState(() => genRound());
  const [phase, setPhase] = useState("show"); // show | hidden | guess
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  useEffect(() => {
    if (phase === "show") {
      speak("Zapamiętaj te przedmioty!");
      const t = setTimeout(() => setPhase("hidden"), 3000);
      return () => clearTimeout(t);
    }
    if (phase === "hidden") {
      const t = setTimeout(() => setPhase("guess"), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handlePick = useCallback(
    (item) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (item.name === round.removed.name) {
        setFeedback({ type: "correct", picked: item.name });
        playSuccess();
        setTimeout(() => speak(`Tak! Zniknął ${round.removed.name}!`), 300);
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("whatDisappearedGame"); addSticker("👀"); }
          else { setRound(genRound()); setPhase("show"); }
          setFeedback(null);
          proc.current = false;
        }, 1500);
      } else {
        setFeedback({ type: "wrong", picked: item.name });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, addStar, addSticker]
  );

  const restart = () => { setRound(genRound()); setPhase("show"); setScore(0); setFeedback(null); setIsWon(false); proc.current = false; };

  if (isWon) return <div className="game-page game-page--disappeared"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--disappeared">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>

      {phase === "show" && (
        <>
          <p className="game-page__hint">Zapamiętaj!</p>
          <div className="disappeared-items">
            {round.items.map((item) => (
              <div key={item.name} className="disappeared-item">{item.emoji}</div>
            ))}
          </div>
        </>
      )}

      {phase === "hidden" && (
        <div className="disappeared-curtain">
          <span>🙈</span>
          <p>Coś znika...</p>
        </div>
      )}

      {phase === "guess" && (
        <>
          <p className="game-page__hint">Co zniknęło?</p>
          <div className="disappeared-items">
            {round.remaining.map((item) => (
              <div key={item.name} className="disappeared-item">{item.emoji}</div>
            ))}
            <div className="disappeared-item disappeared-item--missing">?</div>
          </div>
          <div className="disappeared-options">
            {round.options.map((item) => (
              <button
                key={item.name}
                className={`disappeared-option ${
                  feedback?.type === "correct" && item.name === round.removed.name ? "disappeared-option--correct" : ""
                } ${feedback?.type === "wrong" && item.name === feedback.picked ? "disappeared-option--wrong" : ""}`}
                onClick={() => handlePick(item)}
                disabled={!!feedback}
              >
                <span>{item.emoji}</span>
                <small>{item.name}</small>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
