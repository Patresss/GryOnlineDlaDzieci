import "./DifficultyPicker.css";

const LEVELS = [
  { id: "easy", label: "Łatwy", emoji: "🌟", rounds: 5, description: "3-4 lata" },
  { id: "medium", label: "Średni", emoji: "⭐", rounds: 10, description: "5 lat" },
  { id: "hard", label: "Trudny", emoji: "🏆", rounds: 15, description: "6-7 lat" },
];

export default function DifficultyPicker({ onSelect }) {
  return (
    <div className="difficulty-picker">
      <h2 className="difficulty-picker__title">Wybierz poziom</h2>
      <div className="difficulty-picker__options">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            className={`difficulty-picker__btn difficulty-picker__btn--${level.id}`}
            onClick={() => onSelect(level)}
          >
            <span className="difficulty-picker__emoji">{level.emoji}</span>
            <span className="difficulty-picker__label">{level.label}</span>
            <span className="difficulty-picker__desc">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { LEVELS };
