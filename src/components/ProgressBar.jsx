import "./ProgressBar.css";

export default function ProgressBar({ current, total = 10 }) {
  const progress = (current / total) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-bar__mouse" style={{ left: `${progress}%` }}>
        <span role="img" aria-label="myszka">🐭</span>
      </div>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-bar__cheese">
        <span role="img" aria-label="serek">🧀</span>
      </div>
    </div>
  );
}
