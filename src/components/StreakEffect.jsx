import "./StreakEffect.css";

export default function StreakEffect({ streak, visible }) {
  if (!visible) return null;

  return (
    <div className="streak-effect">
      <div className="streak-effect__rainbow" />
      <div className="streak-effect__text">
        {streak}x Seria!
      </div>
    </div>
  );
}
