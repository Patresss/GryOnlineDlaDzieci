import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import animals, { habitats } from "../data/animals";
import "./AnimalHomeGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
const TOTAL = 12;

function genRounds() {
  return shuffle(animals).slice(0, TOTAL);
}

export default function AnimalHomeGame() {
  const [rounds] = useState(() => genRounds());
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const animal = rounds[currentRound];

  useEffect(() => {
    if (!isWon && animal) {
      setFeedback(null); // eslint-disable-line react-hooks/set-state-in-effect -- reset state on new round
      proc.current = false;
      const t = setTimeout(() => speak(`Gdzie mieszka ${animal.name}?`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, animal]);

  const handlePick = useCallback(
    (habitat) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (habitat.id === animal.habitat) {
        setFeedback({ type: "correct", picked: habitat.id });
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("animalHomeGame"); addSticker("🏡"); }
          else setCurrentRound((r) => r + 1);
        }, 1000);
      } else {
        setFeedback({ type: "wrong", picked: habitat.id });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, animal, score, addStar, addSticker]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--animalhome"><WinScreen onPlayAgain={restart} sticker="🏡" /></div>;

  return (
    <div className="game-page game-page--animalhome">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="ah-animal">
        <span className="ah-animal__emoji">{animal.emoji}</span>
        <span className="ah-animal__name">{animal.name}</span>
      </div>
      <p className="game-page__hint">Gdzie mieszka <strong>{animal.name}</strong>?</p>
      <div className="ah-habitats">
        {habitats.map((h) => (
          <button
            key={h.id}
            className={`ah-habitat ${
              feedback?.type === "correct" && h.id === animal.habitat ? "ah-habitat--correct" : ""
            } ${feedback?.type === "wrong" && h.id === feedback.picked ? "ah-habitat--wrong" : ""}`}
            onClick={() => handlePick(h)}
            disabled={!!feedback}
          >
            <span className="ah-habitat__emoji">{h.emoji}</span>
            <span className="ah-habitat__name">{h.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
