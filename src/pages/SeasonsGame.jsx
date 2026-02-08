import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import seasons from "../data/seasons";
import "./SeasonsGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function genRounds() {
  const items = seasons.flatMap((s) => s.items.map((item) => ({ ...item, seasonId: s.id, seasonName: s.name })));
  return shuffle(items).slice(0, 12);
}

export default function SeasonsGame() {
  const [rounds] = useState(() => genRounds());
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();
  const total = rounds.length;
  const item = rounds[currentRound];

  useEffect(() => {
    if (!isWon && item) {
      setFeedback(null); // eslint-disable-line react-hooks/set-state-in-effect -- reset state on new round
      proc.current = false;
      const t = setTimeout(() => speak(`${item.name}. Do jakiej pory roku pasuje?`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, item]);

  const handlePick = useCallback(
    (season) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (season.id === item.seasonId) {
        setFeedback({ type: "correct", picked: season.id });
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= total) { setIsWon(true); addStar("seasonsGame"); addSticker("🍂"); }
          else setCurrentRound((r) => r + 1);
        }, 1000);
      } else {
        setFeedback({ type: "wrong", picked: season.id });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, item, score, total, addStar, addSticker]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--seasons"><WinScreen onPlayAgain={restart} sticker="🍂" /></div>;

  return (
    <div className="game-page game-page--seasons">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={total} /></div>
      <div className="seasons-item">
        <span className="seasons-item__emoji">{item.emoji}</span>
        <span className="seasons-item__name">{item.name}</span>
      </div>
      <p className="game-page__hint">Do jakiej pory roku pasuje?</p>
      <div className="seasons-options">
        {seasons.map((s) => (
          <button
            key={s.id}
            className={`seasons-option ${
              feedback?.type === "correct" && s.id === item.seasonId ? "seasons-option--correct" : ""
            } ${feedback?.type === "wrong" && s.id === feedback.picked ? "seasons-option--wrong" : ""}`}
            style={{ borderColor: feedback?.type === "correct" && s.id === item.seasonId ? "var(--color-success)" : undefined }}
            onClick={() => handlePick(s)}
            disabled={!!feedback}
          >
            <span className="seasons-option__emoji">{s.emoji}</span>
            <span className="seasons-option__name">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
