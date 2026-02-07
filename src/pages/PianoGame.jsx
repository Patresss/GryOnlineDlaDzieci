import { useState, useCallback, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import { useProfile } from "../context/ProfileContext";
import { playTone, playSuccess } from "../hooks/useSound";
import "./PianoGame.css";

const KEYS = [
  { note: "C", freq: 261.6, color: "#e74c3c" },
  { note: "D", freq: 293.7, color: "#e67e22" },
  { note: "E", freq: 329.6, color: "#f1c40f" },
  { note: "F", freq: 349.2, color: "#2ecc71" },
  { note: "G", freq: 392.0, color: "#3498db" },
  { note: "A", freq: 440.0, color: "#9b59b6" },
  { note: "B", freq: 493.9, color: "#e91e8c" },
  { note: "C2", freq: 523.3, color: "#e74c3c" },
];

const MELODIES = [
  { name: "Do Re Mi", notes: [0, 1, 2] },
  { name: "Do Mi Sol", notes: [0, 2, 4] },
  { name: "Mały kotek", notes: [2, 1, 0, 0, 2, 1, 0] },
  { name: "Wlazł kotek", notes: [0, 0, 2, 2, 4, 4, 2] },
];

export default function PianoGame() {
  const [mode, setMode] = useState("free"); // free | melody
  const [melodyIndex, setMelodyIndex] = useState(0);
  const [playbackStep, setPlaybackStep] = useState(-1);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [success, setSuccess] = useState(false);
  const { addStar, addSticker } = useProfile();
  const timerRef = useRef();

  const melody = MELODIES[melodyIndex];

  const handleKeyPress = useCallback(
    (index) => {
      setActiveKey(index);
      playTone(KEYS[index].freq, 0.5);
      setTimeout(() => setActiveKey(null), 200);

      if (mode === "melody" && !isPlaying && !success) {
        if (melody.notes[playerStep] === index) {
          if (playerStep + 1 >= melody.notes.length) {
            setSuccess(true);
            playSuccess();
            addStar("pianoGame");
            addSticker("🎹");
          } else {
            setPlayerStep((s) => s + 1);
          }
        } else {
          setPlayerStep(0);
        }
      }
    },
    [mode, isPlaying, melody, playerStep, success, addStar, addSticker]
  );

  const playMelody = useCallback(() => {
    setIsPlaying(true);
    setPlayerStep(0);
    setSuccess(false);
    let i = 0;
    const play = () => {
      if (i >= melody.notes.length) {
        setPlaybackStep(-1);
        setIsPlaying(false);
        return;
      }
      const noteIdx = melody.notes[i];
      setPlaybackStep(noteIdx);
      playTone(KEYS[noteIdx].freq, 0.4);
      i++;
      timerRef.current = setTimeout(() => {
        setPlaybackStep(-1);
        timerRef.current = setTimeout(play, 200);
      }, 400);
    };
    play();
  }, [melody]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7 };
      if (map[e.key] !== undefined) handleKeyPress(map[e.key]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKeyPress]);

  return (
    <div className="game-page game-page--piano">
      <BackButton />
      <h2 className="piano-title">Pianinko 🎹</h2>
      <div className="piano-mode-toggle">
        <button className={`piano-mode-btn ${mode === "free" ? "piano-mode-btn--active" : ""}`} onClick={() => { setMode("free"); setSuccess(false); }}>Wolna gra</button>
        <button className={`piano-mode-btn ${mode === "melody" ? "piano-mode-btn--active" : ""}`} onClick={() => setMode("melody")}>Powtórz melodię</button>
      </div>

      {mode === "melody" && (
        <div className="piano-melody">
          <select className="piano-melody__select" value={melodyIndex} onChange={(e) => { setMelodyIndex(Number(e.target.value)); setPlayerStep(0); setSuccess(false); }}>
            {MELODIES.map((m, i) => <option key={i} value={i}>{m.name}</option>)}
          </select>
          <button className="piano-play-btn" onClick={playMelody} disabled={isPlaying}>
            {isPlaying ? "Gramy..." : "▶ Posłuchaj"}
          </button>
          {!isPlaying && !success && <p className="piano-step">Krok: {playerStep + 1} / {melody.notes.length}</p>}
          {success && <p className="piano-success">Brawo! 🎉</p>}
        </div>
      )}

      <div className="piano-keys">
        {KEYS.map((key, i) => (
          <button
            key={i}
            className={`piano-key ${activeKey === i || playbackStep === i ? "piano-key--active" : ""}`}
            style={{ "--key-color": key.color }}
            onClick={() => handleKeyPress(i)}
          >
            <span className="piano-key__label">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
