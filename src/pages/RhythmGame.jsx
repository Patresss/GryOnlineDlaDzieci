import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playTone, playSuccess, playError } from "../hooks/useSound";
import "./RhythmGame.css";

const PATTERNS = [
  { beats: [0, 500], level: 1 },
  { beats: [0, 400, 800], level: 2 },
  { beats: [0, 300, 600, 900], level: 3 },
  { beats: [0, 250, 500, 1000], level: 4 },
  { beats: [0, 200, 400, 800, 1000], level: 5 },
  { beats: [0, 200, 400, 600, 1000, 1200], level: 6 },
];

const TOLERANCE = 250;

export default function RhythmGame() {
  const [patternIndex, setPatternIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | playing | listening | result
  const [drumActive, setDrumActive] = useState(false);
  const [playerBeats, setPlayerBeats] = useState([]);
  const [result, setResult] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const startTime = useRef(0);
  const timerRef = useRef();
  const { addStar, addSticker } = useProfile();

  const pattern = PATTERNS[patternIndex];

  const playPattern = useCallback(() => {
    setPhase("playing");
    setResult(null);
    setPlayerBeats([]);
    pattern.beats.forEach((t, i) => {
      setTimeout(() => {
        setDrumActive(true);
        playTone(150, 0.15, "triangle");
        setTimeout(() => setDrumActive(false), 100);
      }, t);
    });
    setTimeout(() => {
      setPhase("listening");
      startTime.current = Date.now();
    }, pattern.beats[pattern.beats.length - 1] + 500);
  }, [pattern]);

  const handleDrumHit = useCallback(() => {
    if (phase !== "listening") return;
    setDrumActive(true);
    playTone(150, 0.15, "triangle");
    setTimeout(() => setDrumActive(false), 100);

    // Start timer on first hit
    if (playerBeats.length === 0) {
      startTime.current = Date.now();
    }

    const elapsed = playerBeats.length === 0 ? 0 : Date.now() - startTime.current;
    const newBeats = [...playerBeats, elapsed];
    setPlayerBeats(newBeats);

    if (newBeats.length >= pattern.beats.length) {
      clearTimeout(timerRef.current);
      // Check accuracy by comparing intervals between beats
      let correct = true;
      for (let i = 1; i < pattern.beats.length; i++) {
        const expectedInterval = pattern.beats[i] - pattern.beats[0];
        const playerInterval = newBeats[i] - newBeats[0];
        if (Math.abs(playerInterval - expectedInterval) > TOLERANCE) {
          correct = false;
          break;
        }
      }
      if (correct) {
        setResult("correct");
        playSuccess();
        if (patternIndex + 1 >= PATTERNS.length) {
          setTimeout(() => { setAllDone(true); addStar("rhythmGame"); addSticker("🥁"); }, 1000);
        }
      } else {
        setResult("wrong");
        playError();
      }
      setPhase("result");
    }
  }, [phase, playerBeats, pattern, patternIndex, addStar, addSticker]);

  // Auto-timeout listening
  useEffect(() => {
    if (phase === "listening") {
      timerRef.current = setTimeout(() => {
        if (playerBeats.length < pattern.beats.length) {
          setResult("wrong");
          playError();
          setPhase("result");
        }
      }, pattern.beats[pattern.beats.length - 1] + 2000);
      return () => clearTimeout(timerRef.current);
    }
  }, [phase, pattern, playerBeats.length]);

  const handleNext = useCallback(() => {
    setPatternIndex((i) => i + 1);
    setPhase("idle");
    setResult(null);
    setPlayerBeats([]);
  }, []);

  const restart = () => { setPatternIndex(0); setPhase("idle"); setResult(null); setPlayerBeats([]); setAllDone(false); };

  if (allDone) return <div className="game-page game-page--rhythm"><WinScreen onPlayAgain={restart} sticker="🥁" /></div>;

  return (
    <div className="game-page game-page--rhythm">
      <BackButton />
      <h2 className="rhythm-title">Powtórz rytm! 🥁</h2>
      <p className="rhythm-level">Poziom {pattern.level} / {PATTERNS.length}</p>

      <button
        className={`rhythm-drum ${drumActive ? "rhythm-drum--active" : ""}`}
        onClick={handleDrumHit}
        disabled={phase !== "listening"}
      >
        🥁
      </button>

      {phase === "idle" && (
        <button className="rhythm-action-btn" onClick={playPattern}>Posłuchaj!</button>
      )}
      {phase === "playing" && <p className="rhythm-status">Posłuchaj...</p>}
      {phase === "listening" && <p className="rhythm-status">Twoja kolej! ({playerBeats.length}/{pattern.beats.length})</p>}
      {phase === "result" && result === "correct" && (
        <div className="rhythm-result">
          <p className="rhythm-result--correct">Brawo! 🎉</p>
          {patternIndex + 1 < PATTERNS.length && (
            <button className="rhythm-action-btn" onClick={handleNext}>Następny!</button>
          )}
        </div>
      )}
      {phase === "result" && result === "wrong" && (
        <div className="rhythm-result">
          <p className="rhythm-result--wrong">Spróbuj jeszcze raz!</p>
          <button className="rhythm-action-btn" onClick={playPattern}>Posłuchaj ponownie</button>
        </div>
      )}
    </div>
  );
}
