import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import DifficultyPicker from "../components/DifficultyPicker";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import clockTimes from "../data/clockTimes";
import "./ClockGame.css";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getTimesForDifficulty(level) {
  if (level === "easy") return clockTimes.filter((t) => t.minutes === 0);
  if (level === "medium") return clockTimes.filter((t) => t.minutes === 0 || t.minutes === 30);
  return [...clockTimes];
}

function MiniClock({ hour, minutes, size = 80, status }) {
  const hourAngle = ((hour % 12) + minutes / 60) * 30 - 90;
  const minuteAngle = minutes * 6 - 90;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`mini-clock ${status === "correct" ? "mini-clock--correct" : ""} ${status === "wrong" ? "mini-clock--wrong" : ""}`}
      width={size}
      height={size}
    >
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#2d3436" strokeWidth="2.5" />
      {[...Array(12)].map((_, i) => {
        const angle = ((i + 1) * 30 - 90) * (Math.PI / 180);
        const nx = cx + (r - 10) * Math.cos(angle);
        const ny = cy + (r - 10) * Math.sin(angle);
        return (
          <text
            key={i}
            x={nx}
            y={ny}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size < 100 ? "8" : "11"}
            fontWeight="600"
            fill="#2d3436"
          >
            {i + 1}
          </text>
        );
      })}
      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + (r * 0.5) * Math.cos(hourAngle * Math.PI / 180)}
        y2={cy + (r * 0.5) * Math.sin(hourAngle * Math.PI / 180)}
        stroke="#2d3436"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + (r * 0.72) * Math.cos(minuteAngle * Math.PI / 180)}
        y2={cy + (r * 0.72) * Math.sin(minuteAngle * Math.PI / 180)}
        stroke="#636e72"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="3" fill="#2d3436" />
    </svg>
  );
}

export default function ClockGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const isProcessing = useRef(false);
  const hasSpoken = useRef(false);
  const { addStar, addSticker } = useProfile();

  const totalRounds = difficulty?.rounds || 10;
  const currentItem = rounds[currentRound];

  const options = useMemo(() => {
    if (!currentItem || !difficulty) return [];
    const others = shuffle(
      getTimesForDifficulty(difficulty.id).filter(
        (t) => t.display !== currentItem.display
      )
    ).slice(0, 3);
    return shuffle([currentItem, ...others]);
  }, [currentItem, difficulty]);

  const startGame = useCallback((level) => {
    const pool = getTimesForDifficulty(level.id);
    const shuffled = shuffle(pool);
    const count = Math.min(level.rounds, shuffled.length);
    setDifficulty(level);
    setRounds(shuffled.slice(0, count));
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setIsWon(false);
    isProcessing.current = false;
    hasSpoken.current = false;
  }, []);

  useEffect(() => {
    if (!isWon && currentItem && !hasSpoken.current) {
      hasSpoken.current = true;
      const t = setTimeout(() => speak(currentItem.description), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, currentItem]);

  const handlePick = useCallback(
    (time) => {
      if (feedback || isWon || isProcessing.current) return;
      isProcessing.current = true;

      if (time.display === currentItem.display) {
        setFeedback({ type: "correct", picked: time.display });
        playSuccess();
        setTimeout(() => {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore >= totalRounds) {
            setIsWon(true);
            addStar("clockGame");
            addSticker("🕐");
          } else {
            hasSpoken.current = false;
            setCurrentRound((r) => r + 1);
          }
          setFeedback(null);
          isProcessing.current = false;
        }, 1200);
      } else {
        setFeedback({ type: "wrong", picked: time.display });
        playError();
        setTimeout(() => {
          setFeedback(null);
          isProcessing.current = false;
        }, 600);
      }
    },
    [feedback, isWon, currentItem, score, totalRounds, addStar, addSticker]
  );

  if (!difficulty) {
    return (
      <div className="game-page game-page--clock">
        <BackButton />
        <DifficultyPicker onSelect={startGame} />
      </div>
    );
  }

  if (isWon) {
    return (
      <div className="game-page game-page--clock">
        <WinScreen onPlayAgain={() => setDifficulty(null)} sticker="🕐" />
      </div>
    );
  }

  return (
    <div className="game-page game-page--clock">
      <BackButton />
      <div className="game-page__progress">
        <ProgressBar current={score} total={totalRounds} />
      </div>

      <div className="clock-display">
        <MiniClock
          hour={currentItem.hour}
          minutes={currentItem.minutes}
          size={160}
        />
        <p className="clock-display__text">{currentItem.description}</p>
        <button
          className="clock-display__speak-btn"
          onClick={() => speak(currentItem.description)}
          aria-label="Przeczytaj czas"
        >
          🔊
        </button>
      </div>

      <p className="game-page__hint">Która godzina? Wybierz właściwy zegar!</p>

      <div className="clock-options">
        {options.map((time) => {
          let status = "";
          if (feedback?.type === "correct" && time.display === currentItem.display) status = "correct";
          if (feedback?.type === "wrong" && time.display === feedback.picked) status = "wrong";

          return (
            <button
              key={time.display}
              className={`clock-option ${status === "correct" ? "clock-option--correct" : ""} ${status === "wrong" ? "clock-option--wrong" : ""}`}
              onClick={() => handlePick(time)}
              disabled={!!feedback}
            >
              <MiniClock hour={time.hour} minutes={time.minutes} size={80} />
              <span className="clock-option__label">{time.display}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
