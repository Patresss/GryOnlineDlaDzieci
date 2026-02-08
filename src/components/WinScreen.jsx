import { useEffect, useRef } from "react";
import "./WinScreen.css";

export default function WinScreen({ onPlayAgain, sticker }) {
  const hasSpoken = useRef(false);

  useEffect(() => {
    if (!hasSpoken.current && "speechSynthesis" in window) {
      hasSpoken.current = true;
      const utterance = new SpeechSynthesisUtterance("Brawo! Wygrałeś!");
      utterance.lang = "pl-PL";
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div className="win-screen">
      <div className="win-screen__content">
        <div className="win-screen__confetti">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="win-screen__confetti-piece"
              style={{
                "--delay": `${Math.random() * 2}s`,
                "--x": `${Math.random() * 100}vw`,
                "--rotation": `${Math.random() * 360}deg`,
                "--color": ["#FF6B6B", "#4ECDC4", "#FFE66D", "#74B9FF", "#A29BFE", "#51CF66"][i % 6],
              }}
            />
          ))}
        </div>
        <div className="win-screen__stars">
          <span>⭐</span>
          <span>🌟</span>
          <span>⭐</span>
        </div>
        <h1 className="win-screen__title">Brawo!</h1>
        {sticker && (
          <div className="win-screen__sticker">
            <span className="win-screen__sticker-emoji">{sticker}</span>
            <span className="win-screen__sticker-label">Nowa naklejka!</span>
          </div>
        )}
        <div className="win-screen__emoji">🎉</div>
        <button className="win-screen__button" onClick={onPlayAgain}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Zagraj ponownie
        </button>
      </div>
    </div>
  );
}
