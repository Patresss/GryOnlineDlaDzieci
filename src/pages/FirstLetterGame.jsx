import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import allLetters from "../data/letters";
import "./FirstLetterGame.css";

const TOTAL = 10;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function genRound(letters) {
  const correct = letters[Math.floor(Math.random() * letters.length)];
  const wrongs = shuffle(letters.filter((l) => l.letter !== correct.letter)).slice(0, 3);
  const options = shuffle([correct, ...wrongs]);
  return { correct, options };
}

export default function FirstLetterGame() {
  const [rounds] = useState(() => {
    const r = [];
    for (let i = 0; i < TOTAL; i++) r.push(genRound(allLetters));
    return r;
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const round = rounds[currentRound];

  useEffect(() => {
    if (!isWon && round) {
      const t = setTimeout(() => speak(`Co zaczyna się na literę ${round.correct.letter}?`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon]);

  const handlePick = useCallback(
    (item) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (item.letter === round.correct.letter) {
        setFeedback({ type: "correct", picked: item.letter });
        playSuccess();
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("firstLetterGame"); addSticker("🅰️"); }
          else setCurrentRound((r) => r + 1);
          setFeedback(null);
          proc.current = false;
        }, 1000);
      } else {
        setFeedback({ type: "wrong", picked: item.letter });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, addStar, addSticker]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--firstletter"><WinScreen onPlayAgain={restart} sticker="🅰️" /></div>;

  return (
    <div className="game-page game-page--firstletter">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="fl-letter">
        <span className="fl-letter__char">{round.correct.letter}</span>
      </div>
      <p className="game-page__hint">Co zaczyna się na <strong>{round.correct.letter}</strong>?</p>
      <div className="fl-options">
        {round.options.map((item) => (
          <button
            key={item.letter}
            className={`fl-option ${
              feedback?.type === "correct" && item.letter === round.correct.letter ? "fl-option--correct" : ""
            } ${feedback?.type === "wrong" && item.letter === feedback.picked ? "fl-option--wrong" : ""}`}
            onClick={() => handlePick(item)}
            disabled={!!feedback}
          >
            <span className="fl-option__emoji">{item.emoji}</span>
            <span className="fl-option__word">{item.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
