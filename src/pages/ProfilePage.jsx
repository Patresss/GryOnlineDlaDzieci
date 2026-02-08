import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useProfile } from "../context/ProfileContext";
import "./ProfilePage.css";

const GAME_NAMES = {
  letterGame: { name: "Literki ABC", emoji: "🔤" },
  firstLetterGame: { name: "Pierwsza literka", emoji: "🅰️" },
  wordGame: { name: "Ułóż słowo", emoji: "📝" },
  rhymeGame: { name: "Rymowanki", emoji: "🎶" },
  syllableGame: { name: "Sylaby", emoji: "🗣️" },
  oppositeGame: { name: "Przeciwieństwa", emoji: "🔄" },
  numberGame: { name: "Cyferki 123", emoji: "🔢" },
  countGame: { name: "Policz", emoji: "🔢" },
  biggerGame: { name: "Większy mniejszy", emoji: "⚖️" },
  additionGame: { name: "Dodawanie", emoji: "➕" },
  subtractionGame: { name: "Odejmowanie", emoji: "➖" },
  sortSizeGame: { name: "Rozmiary", emoji: "📏" },
  shapeGame: { name: "Kształty", emoji: "🔷" },
  clockGame: { name: "Zegar", emoji: "🕐" },
  memoryGame: { name: "Memory", emoji: "🃏" },
  whatDisappearedGame: { name: "Co zniknęło?", emoji: "👀" },
  simonGame: { name: "Simon", emoji: "🎵" },
  findDifferencesGame: { name: "Znajdź różnice", emoji: "🔍" },
  shadowGame: { name: "Cienie", emoji: "👤" },
  sequenceGame: { name: "Sekwencje", emoji: "🔢" },
  colorGame: { name: "Kolory", emoji: "🎨" },
  colorByNumberGame: { name: "Kolorowanie", emoji: "🖌️" },
  colorMixGame: { name: "Mieszanie kolorów", emoji: "🧪" },
  animalSoundGame: { name: "Dźwięki zwierząt", emoji: "🐾" },
  animalHomeGame: { name: "Kto tu mieszka?", emoji: "🏡" },
  seasonsGame: { name: "Pory roku", emoji: "🍂" },
  catchGame: { name: "Złap motylka", emoji: "🦋" },
  connectDotsGame: { name: "Połącz kropki", emoji: "✏️" },
  mazeGame: { name: "Labirynt", emoji: "🏁" },
  puzzleGame: { name: "Puzzle", emoji: "🧩" },
  pianoGame: { name: "Pianino", emoji: "🎹" },
  rhythmGame: { name: "Rytm", emoji: "🥁" },
  emotionGame: { name: "Emocje", emoji: "😊" },
  cookingGame: { name: "Gotowanie", emoji: "👨‍🍳" },
};

export default function ProfilePage() {
  const {
    profile, setAvatar, setName, setTheme,
    availableAvatars, level, unlockedThemes, LEVELS, THEMES
  } = useProfile();
  const [editing, setEditing] = useState(!profile.avatar);
  const [tempName, setTempName] = useState(profile.name || "");
  const navigate = useNavigate();

  const handleSave = () => {
    setName(tempName);
    setEditing(false);
  };

  const nextLevel = LEVELS.find(l => l.minStars > profile.stars);
  const starsToNext = nextLevel ? nextLevel.minStars - profile.stars : 0;

  return (
    <div className="game-page game-page--profile">
      <BackButton />
      <h2 className="profile-title">Mój profil</h2>

      {editing || !profile.avatar ? (
        <div className="profile-setup">
          <p className="profile-setup__label">Wybierz swojego zwierzaka:</p>
          <div className="profile-avatars">
            {availableAvatars.map((a) => (
              <button
                key={a}
                className={`profile-avatar ${profile.avatar === a ? "profile-avatar--selected" : ""}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            className="profile-name-input"
            type="text"
            placeholder="Twoje imię..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            maxLength={20}
          />
          <button className="profile-save-btn" onClick={handleSave} disabled={!profile.avatar}>
            Zapisz!
          </button>
        </div>
      ) : (
        <div className="profile-display">
          <div className="profile-display__avatar-wrap" style={{ borderColor: level.color }}>
            <div className="profile-display__avatar">{profile.avatar}</div>
          </div>
          <h3 className="profile-display__name">{profile.name || "Anonimowy gracz"}</h3>

          {/* B3: Level display */}
          <div className="profile-level" style={{ background: level.color }}>
            <span className="profile-level__emoji">{level.emoji}</span>
            <span className="profile-level__name">{level.name}</span>
          </div>
          {nextLevel && (
            <p className="profile-level__next">
              Jeszcze {starsToNext} gwiazdek do poziomu "{nextLevel.name}" {nextLevel.emoji}
            </p>
          )}

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat__value">{profile.stars}</span>
              <span className="profile-stat__label">Gwiazdek</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__value">{Object.keys(profile.gamesCompleted).length}</span>
              <span className="profile-stat__label">Różnych gier</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__value">{profile.stickers.length}</span>
              <span className="profile-stat__label">Naklejek</span>
            </div>
          </div>

          {/* B5: Theme selection */}
          <h4 className="profile-section-title">Motyw kolorystyczny:</h4>
          <div className="profile-themes">
            {THEMES.map((t) => {
              const unlocked = unlockedThemes.some(u => u.id === t.id);
              return (
                <button
                  key={t.id}
                  className={`profile-theme ${profile.theme === t.id ? "profile-theme--active" : ""} ${!unlocked ? "profile-theme--locked" : ""}`}
                  onClick={() => unlocked && setTheme(t.id)}
                  disabled={!unlocked}
                >
                  <div className="profile-theme__preview" style={{ background: t.gradient }} />
                  <span className="profile-theme__name">{unlocked ? t.name : `🔒 ${t.unlockGames} gier`}</span>
                </button>
              );
            })}
          </div>

          <h4 className="profile-section-title">Ukończone gry:</h4>
          <div className="profile-completed">
            {Object.entries(profile.gamesCompleted).length === 0 ? (
              <p className="profile-empty">Jeszcze żadna gra nie ukończona!</p>
            ) : (
              Object.entries(profile.gamesCompleted).map(([game, count]) => {
                const info = GAME_NAMES[game];
                return (
                  <div key={game} className="profile-completed__item">
                    <span>{info ? `${info.emoji} ${info.name}` : game}</span>
                    <span className="profile-completed__count">x{count}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="profile-actions">
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edytuj profil</button>
            <button className="profile-rewards-btn" onClick={() => navigate("/nagrody")}>Moje naklejki</button>
          </div>
        </div>
      )}
    </div>
  );
}
