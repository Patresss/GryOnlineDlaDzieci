import { useMemo } from "react";
import { useProfile } from "../context/ProfileContext";
import "./ProgressJourney.css";

const TOTAL_GAMES = 34;

const MILESTONES = [
  { at: 5, emoji: "\u{1F31F}" },
  { at: 10, emoji: "\u{1F3C5}" },
  { at: 15, emoji: "\u{1F3AF}" },
  { at: 20, emoji: "\u{1F680}" },
  { at: 25, emoji: "\u{1F451}" },
  { at: 30, emoji: "\u{1F48E}" },
  { at: 34, emoji: "\u{1F3C6}" },
];

export default function ProgressJourney() {
  const { profile } = useProfile();

  const uniqueGames = useMemo(
    () => Object.keys(profile.gamesCompleted).length,
    [profile.gamesCompleted]
  );

  const percent = Math.min((uniqueGames / TOTAL_GAMES) * 100, 100);

  return (
    <div className="progress-journey">
      <div className="progress-journey__header">
        <span className="progress-journey__title">Twoja przygoda</span>
        <span className="progress-journey__count">
          {uniqueGames} / {TOTAL_GAMES} gier
        </span>
      </div>

      <div className="progress-journey__bar-container">
        <div className="progress-journey__bar-track">
          <div
            className="progress-journey__bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        {MILESTONES.map((m) => {
          const pos = (m.at / TOTAL_GAMES) * 100;
          const reached = uniqueGames >= m.at;
          return (
            <div
              key={m.at}
              className={`progress-journey__milestone ${reached ? "progress-journey__milestone--reached" : ""}`}
              style={{ left: `${pos}%` }}
              title={`${m.at} gier`}
            >
              <span className="progress-journey__milestone-emoji">
                {reached ? m.emoji : "\u{1F512}"}
              </span>
            </div>
          );
        })}
      </div>

      {uniqueGames === TOTAL_GAMES && (
        <p className="progress-journey__complete">
          {"Brawo! Uko\u0144czy\u0142e\u015B wszystkie gry! \u{1F389}"}
        </p>
      )}
    </div>
  );
}
