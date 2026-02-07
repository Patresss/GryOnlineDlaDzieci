import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import shapes from "../data/shapes";
import "./ShapeGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
const TOTAL = 10;

function genRounds() {
  const pool = [];
  while (pool.length < TOTAL) pool.push(...shuffle(shapes));
  return pool.slice(0, TOTAL);
}

export default function ShapeGame() {
  const [rounds] = useState(() => genRounds());
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [options, setOptions] = useState([]);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const round = rounds[currentRound];

  useEffect(() => {
    if (round) {
      const others = shuffle(shapes.filter((s) => s.name !== round.name)).slice(0, 3);
      setOptions(shuffle([round, ...others]));
      setFeedback(null);
      proc.current = false;
      const t = setTimeout(() => speak(`Znajdź ${round.name.toLowerCase()}`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, round]);

  const handlePick = useCallback(
    (shape) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (shape.name === round.name) {
        setFeedback({ type: "correct", picked: shape.name });
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("shapeGame"); addSticker("🔷"); }
          else setCurrentRound((r) => r + 1);
        }, 1000);
      } else {
        setFeedback({ type: "wrong", picked: shape.name });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, addStar, addSticker]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--shape"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--shape">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="shape-target">
        <svg viewBox="0 0 100 100" className="shape-target__svg">
          <g dangerouslySetInnerHTML={{ __html: round.holeSvg }} />
        </svg>
        <span className="shape-target__name">{round.name}</span>
      </div>
      <p className="game-page__hint">Znajdź <strong>{round.name.toLowerCase()}</strong>!</p>
      <div className="shape-options">
        {options.map((s) => (
          <button
            key={s.name}
            className={`shape-option ${
              feedback?.type === "correct" && s.name === round.name ? "shape-option--correct" : ""
            } ${feedback?.type === "wrong" && s.name === feedback.picked ? "shape-option--wrong" : ""}`}
            onClick={() => handlePick(s)}
            disabled={!!feedback}
          >
            <svg viewBox="0 0 100 100" className="shape-option__svg">
              <g fill={s.color} dangerouslySetInnerHTML={{ __html: s.svg }} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
