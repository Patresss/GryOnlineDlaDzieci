import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import colorMixes from "../data/colorMixes";
import "./ColorMixGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ColorMixGame() {
  const [rounds] = useState(() => shuffle(colorMixes));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [mixed, setMixed] = useState(false);
  const [options, setOptions] = useState([]);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const round = rounds[currentRound];

  useEffect(() => {
    if (round) {
      setOptions(shuffle([round.result, ...round.wrong]));
      setMixed(false);
      setFeedback(null);
      proc.current = false;
      const t1 = setTimeout(() => speak(`Co powstanie gdy zmieszamy ${round.color1.name} i ${round.color2.name}?`), 400);
      const t2 = setTimeout(() => setMixed(true), 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [currentRound, round]);

  const handlePick = useCallback(
    (color) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (color.name === round.result.name) {
        setFeedback({ type: "correct", picked: color.name });
        playSuccess();
        setTimeout(() => speak(`Tak! ${round.color1.name} plus ${round.color2.name} to ${round.result.name}!`), 300);
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= rounds.length) { setIsWon(true); addStar("colorMixGame"); addSticker("🧪"); }
          else setCurrentRound((r) => r + 1);
        }, 1800);
      } else {
        setFeedback({ type: "wrong", picked: color.name });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, rounds.length, addStar, addSticker]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--colormix"><WinScreen onPlayAgain={restart} /></div>;

  return (
    <div className="game-page game-page--colormix">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={rounds.length} /></div>
      <div className="colormix-display">
        <div className="colormix-circle" style={{ background: round.color1.css }} />
        <span className="colormix-plus">+</span>
        <div className="colormix-circle" style={{ background: round.color2.css }} />
        <span className="colormix-equals">=</span>
        <div className={`colormix-circle colormix-circle--result ${mixed ? "colormix-circle--visible" : ""}`}>?</div>
      </div>
      <p className="game-page__hint">{round.color1.name} + {round.color2.name} = ?</p>
      <div className="colormix-options">
        {options.map((c) => (
          <button
            key={c.name}
            className={`colormix-option ${
              feedback?.type === "correct" && c.name === round.result.name ? "colormix-option--correct" : ""
            } ${feedback?.type === "wrong" && c.name === feedback.picked ? "colormix-option--wrong" : ""}`}
            onClick={() => handlePick(c)}
            disabled={!!feedback}
          >
            <div className="colormix-option__swatch" style={{ background: c.css }} />
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
