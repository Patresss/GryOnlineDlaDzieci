import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import "./TrainGame.css";

const WAGON_COLORS = [
  { name: "czerwony", css: "#FF6B6B" },
  { name: "niebieski", css: "#74B9FF" },
  { name: "zielony", css: "#55efc4" },
  { name: "żółty", css: "#FFE66D" },
  { name: "fioletowy", css: "#A29BFE" },
  { name: "pomarańczowy", css: "#fab1a0" },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function generateRound(wagonCount) {
  const numbers = [];
  const used = new Set();
  while (numbers.length < wagonCount) {
    const n = Math.floor(Math.random() * 9) + 1;
    if (!used.has(n)) { used.add(n); numbers.push(n); }
  }
  const colors = shuffle(WAGON_COLORS).slice(0, wagonCount);
  const wagons = numbers.map((num, i) => ({
    id: i,
    number: num,
    color: colors[i],
  }));
  const sorted = [...wagons].sort((a, b) => a.number - b.number);
  return { wagons: shuffle(wagons), solution: sorted.map((w) => w.number) };
}

export default function TrainGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [wagons, setWagons] = useState([]);
  const [sorted, setSorted] = useState(false);
  const isProcessing = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const wagonCount = difficulty?.id === "easy" ? 3 : difficulty?.id === "medium" ? 4 : 5;

  const rounds = useMemo(() => {
    if (!difficulty) return [];
    return Array.from({ length: totalRounds }, () => generateRound(wagonCount));
  }, [difficulty, totalRounds, wagonCount]);

  const round = rounds[currentRound];

  const startGame = useCallback((level) => {
    setDifficulty(level);
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    setSelectedIdx(null);
    setSorted(false);
    isProcessing.current = false;
    const wc = level.id === "easy" ? 3 : level.id === "medium" ? 4 : 5;
    const r = generateRound(wc);
    setWagons(r.wagons);
    setTimeout(() => speak("Posortuj wagony od najmniejszego do największego!"), 400);
  }, []);

  // Initialize wagons when round changes
  useEffect(() => {
    if (round && currentRound > 0) {
      setWagons([...round.wagons]); // eslint-disable-line react-hooks/set-state-in-effect -- sync round data
      setSelectedIdx(null);
      setSorted(false);
    }
  }, [currentRound, round]);

  const handleWagonClick = useCallback((idx) => {
    if (isProcessing.current || feedback || sorted) return;
    playClick();

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      setWagons((prev) => {
        const next = [...prev];
        const temp = next[selectedIdx];
        next[selectedIdx] = next[idx];
        next[idx] = temp;
        return next;
      });
      setSelectedIdx(null);
    }
  }, [selectedIdx, feedback, sorted]);

  const handleCheck = useCallback(() => {
    if (isProcessing.current || feedback || !round) return;
    isProcessing.current = true;

    const isSorted = wagons.every((w, i) => {
      if (i === 0) return true;
      return wagons[i - 1].number <= w.number;
    });

    if (isSorted) {
      setFeedback("correct");
      setSorted(true);
      playSuccess();
      setTimeout(() => speak("Brawo! Pociąg gotowy do jazdy!"), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= totalRounds) {
          setIsWon(true);
          addStar("trainGame");
          addSticker("🚂");
        } else {
          setCurrentRound((r) => r + 1);
        }
        setFeedback(null);
        isProcessing.current = false;
      }, 1500);
    } else {
      setFeedback("wrong");
      playError();
      setTimeout(() => {
        setFeedback(null);
        isProcessing.current = false;
      }, 800);
    }
  }, [feedback, round, wagons, score, totalRounds, addStar, addSticker]);

  if (!difficulty) {
    return (
      <div className="game-page game-page--train">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--train">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🚂" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--train">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>
      <h2 className="train__title">Pociąg 🚂</h2>
      <p className="game-page__hint">Posortuj wagony od najmniejszego do największego! Kliknij dwa wagony, aby je zamienić.</p>

      <div className={`train__track ${sorted ? "train__track--moving" : ""}`}>
        <div className="train__locomotive">🚂</div>
        {wagons.map((wagon, idx) => (
          <button
            key={wagon.id}
            className={`train__wagon ${
              selectedIdx === idx ? "train__wagon--selected" : ""
            } ${
              feedback === "correct" ? "train__wagon--correct" : ""
            } ${
              feedback === "wrong" ? "train__wagon--shake" : ""
            }`}
            style={{ background: wagon.color.css }}
            onClick={() => handleWagonClick(idx)}
            disabled={!!feedback}
          >
            <span className="train__wagon-number">{wagon.number}</span>
            <div className="train__wagon-wheels">
              <span className="train__wheel" />
              <span className="train__wheel" />
            </div>
          </button>
        ))}
      </div>

      <button
        className="train__check-btn"
        onClick={handleCheck}
        disabled={!!feedback}
      >
        Sprawdź ✓
      </button>
    </div>
  );
}
