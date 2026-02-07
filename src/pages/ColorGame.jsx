import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import colors from "../data/colors";
import "./ColorGame.css";

const TOTAL = 10;

function pickRounds(count) {
  const pool = [];
  while (pool.length < count) {
    pool.push(...[...colors].sort(() => Math.random() - 0.5));
  }
  return pool.slice(0, count);
}

function getOptions(correct, allColors) {
  const others = allColors.filter((c) => c.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3);
  return [...others, correct].sort(() => Math.random() - 0.5);
}

export default function ColorGame() {
  const [rounds] = useState(() => pickRounds(TOTAL));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [options, setOptions] = useState(() => getOptions(rounds[0], colors));
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const current = rounds[currentRound];

  useEffect(() => {
    if (!isWon && current) {
      const t = setTimeout(() => speak(`To jest kolor ${current.name}`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, current]);

  useEffect(() => {
    if (current) setOptions(getOptions(current, colors));
  }, [currentRound]);

  const handlePick = useCallback(
    (color) => {
      if (feedback || isWon || isProcessing.current) return;
      isProcessing.current = true;

      if (color.name === current.name) {
        setFeedback("correct");
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) {
            setIsWon(true);
            addStar("colorGame");
            addSticker("🎨");
          } else {
            setCurrentRound((r) => r + 1);
          }
          setFeedback(null);
          isProcessing.current = false;
        }, 1000);
      } else {
        setFeedback("wrong");
        playError();
        setTimeout(() => {
          setFeedback(null);
          isProcessing.current = false;
        }, 600);
      }
    },
    [feedback, isWon, current, score, addStar, addSticker]
  );

  const restart = useCallback(() => {
    window.location.reload();
  }, []);

  if (isWon) return <div className="game-page game-page--color"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--color">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="color-display">
        <div className="color-display__swatch" style={{ background: current.css }} />
        <p className="color-display__name">{current.name}</p>
      </div>
      <p className="game-page__hint">Kliknij odpowiedni kolor!</p>
      <div className="color-options">
        {options.map((c) => (
          <button
            key={c.name}
            className={`color-option ${
              feedback === "correct" && c.name === current.name ? "color-option--correct" : ""
            } ${feedback === "wrong" && c.name !== current.name ? "" : feedback === "wrong" ? "color-option--wrong" : ""}`}
            style={{ background: c.css }}
            onClick={() => handlePick(c)}
            disabled={!!feedback}
            aria-label={c.name}
          />
        ))}
      </div>
    </div>
  );
}
