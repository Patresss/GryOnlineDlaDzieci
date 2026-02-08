import { useEffect, useMemo } from "react";
import { useProfile } from "../context/ProfileContext";
import { speak, playTone } from "../hooks/useSound";
import "./LevelUpModal.css";

export default function LevelUpModal() {
  const { level, leveledUp, acknowledgeLevelUp } = useProfile();

  const sparkDelays = useMemo(
    () => Array.from({ length: 20 }, () => Math.random() * 0.3), // eslint-disable-line react-hooks/purity -- one-time random init
    []
  );

  useEffect(() => {
    if (leveledUp) {
      speak(`Brawo! Awansujesz na poziom ${level.name}!`);
      [523, 587, 659, 698, 784, 880].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3), i * 100);
      });
    }
  }, [leveledUp, level.name]);

  if (!leveledUp) return null;

  return (
    <div className="levelup-overlay" onClick={acknowledgeLevelUp}>
      <div className="levelup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="levelup-fireworks">
          {sparkDelays.map((delay, i) => (
            <div
              key={i}
              className="levelup-spark"
              style={{
                "--angle": `${(i * 360) / 20}deg`,
                "--delay": `${delay}s`,
                "--color": ["#FF6B6B", "#4ECDC4", "#FFE66D", "#74B9FF", "#A29BFE", "#51CF66"][i % 6],
              }}
            />
          ))}
        </div>
        <div className="levelup-emoji">{level.emoji}</div>
        <h2 className="levelup-title">Nowy poziom!</h2>
        <p className="levelup-level" style={{ color: level.color }}>{level.name}</p>
        <p className="levelup-desc">Odblokowano nowe awatary!</p>
        <button className="levelup-btn" onClick={acknowledgeLevelUp}>
          Super!
        </button>
      </div>
    </div>
  );
}
