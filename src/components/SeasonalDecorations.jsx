import { useMemo } from "react";
import "./SeasonalDecorations.css";

function getSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

const SEASON_EMOJIS = {
  winter: ["❄️", "⛄", "🌨️", "❄️", "🧊", "❄️", "⛄", "❄️"],
  spring: ["🌸", "🦋", "🌷", "🐝", "🌸", "🌼", "🦋", "🌸"],
  summer: ["☀️", "🌊", "🐚", "🌴", "☀️", "🌺", "🌊", "☀️"],
  autumn: ["🍂", "🍁", "🎃", "🍄", "🍂", "🌰", "🍁", "🍂"],
};

export default function SeasonalDecorations() {
  const season = getSeason();
  const emojis = SEASON_EMOJIS[season];

  /* eslint-disable react-hooks/purity -- one-time random init for seasonal particles */
  const particles = useMemo(
    () => emojis.map((emoji, i) => ({
      emoji,
      x: `${10 + Math.random() * 80}%`,
      size: `${16 + Math.random() * 14}px`,
      delay: `${i * 1.5 + Math.random() * 2}s`,
      duration: `${8 + Math.random() * 6}s`,
    })),
    [emojis]
  );
  /* eslint-enable react-hooks/purity */

  return (
    <div className={`seasonal seasonal--${season}`} aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="seasonal__particle"
          style={{
            left: p.x,
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
