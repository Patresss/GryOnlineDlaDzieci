import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import animals from "../data/animals";
import "./AnimalSoundGame.css";

const TOTAL = 10;
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function genRound() {
  const correct = animals[Math.floor(Math.random() * animals.length)];
  const wrongs = shuffle(animals.filter((a) => a.name !== correct.name)).slice(0, 3);
  return { correct, options: shuffle([correct, ...wrongs]) };
}

export default function AnimalSoundGame() {
  const [round, setRound] = useState(() => genRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const playSound = useCallback(() => {
    speak(`${round.correct.sound}`, "pl-PL", 0.8);
  }, [round]);

  useEffect(() => {
    if (!isWon) {
      const t = setTimeout(playSound, 500);
      return () => clearTimeout(t);
    }
  }, [round, isWon, playSound]);

  const handlePick = useCallback(
    (animal) => {
      if (feedback || isWon || proc.current) return;
      proc.current = true;
      if (animal.name === round.correct.name) {
        setFeedback({ type: "correct", picked: animal.name });
        playSuccess();
        setTimeout(() => {
          speak(`Tak! To ${round.correct.name}!`);
        }, 300);
        setTimeout(() => {
          const ns = score + 1;
          setScore(ns);
          if (ns >= TOTAL) { setIsWon(true); addStar("animalSoundGame"); addSticker("🐾"); }
          else setRound(genRound());
          setFeedback(null);
          proc.current = false;
        }, 1500);
      } else {
        setFeedback({ type: "wrong", picked: animal.name });
        playError();
        setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
      }
    },
    [feedback, isWon, round, score, addStar, addSticker]
  );

  const restart = () => { setRound(genRound()); setScore(0); setFeedback(null); setIsWon(false); proc.current = false; };

  if (isWon) return <div className="game-page game-page--animal"><WinScreen onPlayAgain={restart} sticker="🐾" /></div>;

  return (
    <div className="game-page game-page--animal">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <button className="animal-sound-btn" onClick={playSound}>
        🔊 <span>Posłuchaj dźwięku!</span>
      </button>
      <p className="game-page__hint">Które zwierzę tak mówi?</p>
      <div className="animal-options">
        {round.options.map((a) => (
          <button
            key={a.name}
            className={`animal-option ${
              feedback?.type === "correct" && a.name === round.correct.name ? "animal-option--correct" : ""
            } ${feedback?.type === "wrong" && a.name === feedback.picked ? "animal-option--wrong" : ""}`}
            onClick={() => handlePick(a)}
            disabled={!!feedback}
          >
            <span className="animal-option__emoji">{a.emoji}</span>
            <span className="animal-option__name">{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
