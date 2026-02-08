import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError, playClick } from "../hooks/useSound";
import "./SyllableGame.css";

const WORDS = [
  { word: "Kot", emoji: "🐱", syllables: 1 },
  { word: "Dom", emoji: "🏠", syllables: 1 },
  { word: "Pies", emoji: "🐶", syllables: 1 },
  { word: "Mo-tyl", emoji: "🦋", syllables: 2 },
  { word: "Ba-lon", emoji: "🎈", syllables: 2 },
  { word: "Kwia-tek", emoji: "🌸", syllables: 2 },
  { word: "Ja-błko", emoji: "🍎", syllables: 2 },
  { word: "Ko-lo-ry", emoji: "🎨", syllables: 3 },
  { word: "Mo-ty-lek", emoji: "🦋", syllables: 3 },
  { word: "Ra-kie-ta", emoji: "🚀", syllables: 3 },
  { word: "He-li-kop-ter", emoji: "🚁", syllables: 4 },
  { word: "Cy-try-na", emoji: "🍋", syllables: 3 },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
const TOTAL = 10;

export default function SyllableGame() {
  const [rounds] = useState(() => shuffle(WORDS).slice(0, TOTAL));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [taps, setTaps] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [bounces, setBounces] = useState([]);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const round = rounds[currentRound];

  useEffect(() => {
    if (!isWon && round) {
      setTaps(0); // eslint-disable-line react-hooks/set-state-in-effect -- reset state on new round
      setBounces([]);
      setFeedback(null);
      proc.current = false;
      const t = setTimeout(() => speak(`${round.word.replace(/-/g, " ")}. Ile sylab?`), 400);
      return () => clearTimeout(t);
    }
  }, [currentRound, isWon, round]);

  const handleTap = useCallback(() => {
    if (feedback || proc.current) return;
    playClick();
    setTaps((t) => t + 1);
    setBounces((b) => [...b, Date.now()]);
  }, [feedback]);

  const handleCheck = useCallback(() => {
    if (feedback || proc.current) return;
    proc.current = true;
    if (taps === round.syllables) {
      setFeedback("correct");
      playSuccess();
      setTimeout(() => speak(`Brawo! ${round.word.replace(/-/g, " ")} ma ${round.syllables} ${round.syllables === 1 ? "sylabę" : "sylaby"}`), 300);
      setTimeout(() => {
        const ns = score + 1;
        setScore(ns);
        if (ns >= TOTAL) { setIsWon(true); addStar("syllableGame"); addSticker("🗣️"); }
        else setCurrentRound((r) => r + 1);
      }, 2000);
    } else {
      setFeedback("wrong");
      playError();
      setTimeout(() => { setTaps(0); setBounces([]); setFeedback(null); proc.current = false; }, 800);
    }
  }, [taps, round, feedback, score, addStar, addSticker]);

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--syllable"><WinScreen onPlayAgain={restart} sticker="🗣️" /></div>;

  return (
    <div className="game-page game-page--syllable">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={score} total={TOTAL} /></div>
      <div className="syllable-display">
        <span className="syllable-emoji">{round.emoji}</span>
        <span className="syllable-word">{round.word.replace(/-/g, "")}</span>
      </div>
      <p className="game-page__hint">Kliknij żabkę tyle razy, ile jest sylab!</p>
      <button className={`syllable-frog ${feedback === "correct" ? "syllable-frog--correct" : feedback === "wrong" ? "syllable-frog--wrong" : ""}`} onClick={handleTap} disabled={!!feedback}>
        <span className="syllable-frog__emoji">🐸</span>
        <span className="syllable-frog__count">{taps > 0 ? taps : ""}</span>
      </button>
      <div className="syllable-jumps">
        {bounces.map((id) => (
          <span key={id} className="syllable-jump-dot" />
        ))}
      </div>
      {taps > 0 && !feedback && (
        <button className="syllable-check-btn" onClick={handleCheck}>Sprawdź!</button>
      )}
    </div>
  );
}
