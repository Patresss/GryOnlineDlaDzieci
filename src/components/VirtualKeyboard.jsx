import { useCallback } from "react";
import "./VirtualKeyboard.css";

const LETTER_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const NUMBER_ROW = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function VirtualKeyboard({ mode = "letters", onKeyPress, highlightKey, disabled }) {
  const rows = mode === "numbers" ? [NUMBER_ROW] : LETTER_ROWS;

  const handleClick = useCallback(
    (key) => {
      if (!disabled && onKeyPress) {
        onKeyPress(key);
      }
    },
    [disabled, onKeyPress]
  );

  return (
    <div className={`virtual-keyboard ${disabled ? "virtual-keyboard--disabled" : ""}`}>
      {rows.map((row, i) => (
        <div key={i} className="virtual-keyboard__row">
          {row.map((key) => (
            <button
              key={key}
              className={`virtual-keyboard__key ${
                highlightKey === key ? "virtual-keyboard__key--highlight" : ""
              }`}
              onClick={() => handleClick(key)}
              disabled={disabled}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
