import { useState, useEffect, useCallback, useRef } from "react";
import BackButton from "../components/BackButton";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { playTone, playError } from "../hooks/useSound";
import "./SimonGame.css";

const PADS = [
  { id: 0, color: "#e74c3c", freq: 329.6, label: "Czerwony" },
  { id: 1, color: "#2ecc71", freq: 392.0, label: "Zielony" },
  { id: 2, color: "#3498db", freq: 440.0, label: "Niebieski" },
  { id: 3, color: "#f1c40f", freq: 523.3, label: "Żółty" },
];

const WIN_LENGTH = 8;

export default function SimonGame() {
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [level, setLevel] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [failed, setFailed] = useState(false);
  const { addStar, addSticker } = useProfile();
  const timerRef = useRef();

  const playSequence = useCallback((seq) => {
    setIsPlaying(true);
    setIsPlayerTurn(false);
    let i = 0;
    const play = () => {
      if (i >= seq.length) {
        setActiveId(null);
        setIsPlaying(false);
        setIsPlayerTurn(true);
        setPlayerSeq([]);
        return;
      }
      const padId = seq[i];
      setActiveId(padId);
      playTone(PADS[padId].freq, 0.4);
      timerRef.current = setTimeout(() => {
        setActiveId(null);
        i++;
        timerRef.current = setTimeout(play, 300);
      }, 500);
    };
    timerRef.current = setTimeout(play, 600);
  }, []);

  const startNewRound = useCallback(
    (prevSeq) => {
      const next = [...prevSeq, Math.floor(Math.random() * 4)];
      setSequence(next);
      setLevel(next.length);
      playSequence(next);
    },
    [playSequence]
  );

  const startGame = useCallback(() => {
    setFailed(false);
    setIsWon(false);
    setSequence([]);
    setPlayerSeq([]);
    setLevel(0);
    startNewRound([]);
  }, [startNewRound]);

  const handlePadClick = useCallback(
    (padId) => {
      if (!isPlayerTurn || isPlaying) return;
      setActiveId(padId);
      playTone(PADS[padId].freq, 0.3);
      setTimeout(() => setActiveId(null), 200);

      const newPlayerSeq = [...playerSeq, padId];
      setPlayerSeq(newPlayerSeq);

      const idx = newPlayerSeq.length - 1;
      if (newPlayerSeq[idx] !== sequence[idx]) {
        playError();
        setFailed(true);
        setIsPlayerTurn(false);
        return;
      }

      if (newPlayerSeq.length === sequence.length) {
        setIsPlayerTurn(false);
        if (sequence.length >= WIN_LENGTH) {
          setIsWon(true);
          addStar("simonGame");
          addSticker("🎵");
        } else {
          setTimeout(() => startNewRound(sequence), 800);
        }
      }
    },
    [isPlayerTurn, isPlaying, playerSeq, sequence, startNewRound, addStar, addSticker]
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (isWon) return <div className="game-page game-page--simon"><WinScreen onPlayAgain={startGame} /></div>;

  return (
    <div className="game-page game-page--simon">
      <BackButton />
      <h2 className="simon-title">Simon Says</h2>
      <p className="simon-level">Poziom: {level} / {WIN_LENGTH}</p>

      <div className="simon-board">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            className={`simon-pad ${activeId === pad.id ? "simon-pad--active" : ""}`}
            style={{ "--pad-color": pad.color }}
            onClick={() => handlePadClick(pad.id)}
            disabled={!isPlayerTurn}
            aria-label={pad.label}
          />
        ))}
      </div>

      {!sequence.length && !failed && (
        <button className="simon-start-btn" onClick={startGame}>Start!</button>
      )}
      {isPlaying && <p className="simon-status">Obserwuj...</p>}
      {isPlayerTurn && <p className="simon-status">Twoja kolej!</p>}
      {failed && (
        <div className="simon-failed">
          <p>Spróbuj ponownie!</p>
          <button className="simon-start-btn" onClick={startGame}>Zagraj jeszcze raz</button>
        </div>
      )}
    </div>
  );
}
