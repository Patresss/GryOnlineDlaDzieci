import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import rhymesData from "../data/rhymes";
import "./RhymeGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
const TOTAL = 8;

export default function RhymeGame() {
  const [rounds] = useState(() => shuffle(rhymesData).slice(0, TOTAL));
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
      setOptions(shuffle([round.correct, ...round.wrong])); // eslint-disable-line react-hooks/set-state-in-effect -- reset options on new round
      const t = setTimeout(() => speak(`Co się rymuje ze słowem ${round.word}?`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, round]);

  const handlePick = useCallback(
    (option) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (option.word === round.correct.word) {
        setFeedback({ type: "correct", picked: option.word });
        playSuccess();
        setTimeout(() => speak(`${round.word} - ${round.correct.word}!`), 300);
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("rhymeGame"); addSticker("🎶"); }
          else setCurrentRound((r) => r + 1);
          setFeedback(null);
          proc.current = false;
        }, 1500);
      } else {
        setFeedback({ type: "wrong", picked: option.word });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, addStar, addSticker]
  );

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--rhyme"><WinScreen onPlayAgain={restart} sticker="🎶" /></div>;

  return (
    <div className="game-page game-page--rhyme">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="rhyme-word">
        <span className="rhyme-word__emoji">{round.wordEmoji}</span>
        <span className="rhyme-word__text">{round.word}</span>
      </div>
      <p className="game-page__hint">Co się rymuje z <strong>{round.word}</strong>?</p>
      <div className="rhyme-options">
        {options.map((opt) => (
          <button
            key={opt.word}
            className={`rhyme-option ${
              feedback?.type === "correct" && opt.word === round.correct.word ? "rhyme-option--correct" : ""
            } ${feedback?.type === "wrong" && opt.word === feedback.picked ? "rhyme-option--wrong" : ""}`}
            onClick={() => handlePick(opt)}
            disabled={!!feedback}
          >
            <span className="rhyme-option__emoji">{opt.emoji}</span>
            <span className="rhyme-option__word">{opt.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
