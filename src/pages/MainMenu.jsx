import { Link } from "react-router-dom";
import { useEffect, useRef, useMemo } from "react";
import { useProfile } from "../context/ProfileContext";
import { playClick, speak } from "../hooks/useSound";
import useScrollAnimation from "../hooks/useScrollAnimation";
import SoundToggle from "../components/SoundToggle";
import Onboarding from "../components/Onboarding";
import LevelUpModal from "../components/LevelUpModal";
import "./MainMenu.css";

const ALL_GAMES = [
  { to: "/gra/literki", label: "ABC", emoji: "🔤", bg: "linear-gradient(135deg, #FF6B6B, #ee5a5a)", gameId: "letterGame" },
  { to: "/gra/pierwsza-literka", label: "Pierwsza", emoji: "🅰️", bg: "linear-gradient(135deg, #e17055, #d63031)", gameId: "firstLetterGame" },
  { to: "/gra/uloz-slowo", label: "Słowa", emoji: "📝", bg: "linear-gradient(135deg, #fd79a8, #e84393)", gameId: "wordGame" },
  { to: "/gra/rymowanki", label: "Rymy", emoji: "🎶", bg: "linear-gradient(135deg, #a29bfe, #6c5ce7)", gameId: "rhymeGame" },
  { to: "/gra/sylaby", label: "Sylaby", emoji: "🗣️", bg: "linear-gradient(135deg, #55efc4, #00b894)", gameId: "syllableGame" },
  { to: "/gra/cyferki", label: "123", emoji: "🔢", bg: "linear-gradient(135deg, #74B9FF, #5a9fe6)", gameId: "numberGame" },
  { to: "/gra/policz", label: "Policz", emoji: "🔢", bg: "linear-gradient(135deg, #0984e3, #0652DD)", gameId: "countGame" },
  { to: "/gra/wiekszy", label: "Więcej?", emoji: "⚖️", bg: "linear-gradient(135deg, #fdcb6e, #e17055)", gameId: "biggerGame" },
  { to: "/gra/dodawanie", label: "Dodaj", emoji: "➕", bg: "linear-gradient(135deg, #e17055, #d63031)", gameId: "additionGame" },
  { to: "/gra/odejmowanie", label: "Odejmij", emoji: "➖", bg: "linear-gradient(135deg, #fab1a0, #e17055)", gameId: "subtractionGame" },
  { to: "/gra/rozmiary", label: "Rozmiary", emoji: "📏", bg: "linear-gradient(135deg, #00cec9, #00b894)", gameId: "sortSizeGame" },
  { to: "/gra/ksztalty", label: "Kształty", emoji: "🔷", bg: "linear-gradient(135deg, #6c5ce7, #a29bfe)", gameId: "shapeGame" },
  { to: "/gra/zegar", label: "Zegar", emoji: "🕐", bg: "linear-gradient(135deg, #fdcb6e, #74b9ff)", gameId: "clockGame" },
  { to: "/gra/memory", label: "Memory", emoji: "🃏", bg: "linear-gradient(135deg, #A29BFE, #6c5ce7)", gameId: "memoryGame" },
  { to: "/gra/co-zniknelo", label: "Zniknęło?", emoji: "👀", bg: "linear-gradient(135deg, #00b894, #00cec9)", gameId: "whatDisappearedGame" },
  { to: "/gra/simon", label: "Simon", emoji: "🎵", bg: "linear-gradient(135deg, #636e72, #2d3436)", gameId: "simonGame" },
  { to: "/gra/roznice", label: "Różnice", emoji: "🔍", bg: "linear-gradient(135deg, #fdcb6e, #e17055)", gameId: "findDifferencesGame" },
  { to: "/gra/cienie", label: "Cienie", emoji: "👤", bg: "linear-gradient(135deg, #636e72, #b2bec3)", gameId: "shadowGame" },
  { to: "/gra/sekwencje", label: "Sekwencje", emoji: "🔢", bg: "linear-gradient(135deg, #74b9ff, #a29bfe)", gameId: "sequenceGame" },
  { to: "/gra/kolory", label: "Kolory", emoji: "🎨", bg: "linear-gradient(135deg, #e74c3c, #e67e22, #f1c40f, #2ecc71, #3498db)", gameId: "colorGame" },
  { to: "/gra/kolorowanie", label: "Koloruj", emoji: "🖌️", bg: "linear-gradient(135deg, #e84393, #fd79a8)", gameId: "colorByNumberGame" },
  { to: "/gra/mieszanie", label: "Mieszaj", emoji: "🧪", bg: "linear-gradient(135deg, #6c5ce7, #e84393)", gameId: "colorMixGame" },
  { to: "/gra/dzwieki-zwierzat", label: "Dźwięki", emoji: "🐾", bg: "linear-gradient(135deg, #00b894, #55efc4)", gameId: "animalSoundGame" },
  { to: "/gra/kto-tu-mieszka", label: "Domki", emoji: "🏡", bg: "linear-gradient(135deg, #e17055, #fdcb6e)", gameId: "animalHomeGame" },
  { to: "/gra/pory-roku", label: "Pory roku", emoji: "🍂", bg: "linear-gradient(135deg, #00cec9, #55efc4, #fdcb6e, #74b9ff)", gameId: "seasonsGame" },
  { to: "/gra/zlap-motylka", label: "Łap!", emoji: "🦋", bg: "linear-gradient(135deg, #55efc4, #00b894)", gameId: "catchGame" },
  { to: "/gra/polacz-kropki", label: "Kropki", emoji: "✏️", bg: "linear-gradient(135deg, #fdcb6e, #e17055)", gameId: "connectDotsGame" },
  { to: "/gra/labirynt", label: "Labirynt", emoji: "🏁", bg: "linear-gradient(135deg, #636e72, #b2bec3)", gameId: "mazeGame" },
  { to: "/gra/puzzle", label: "Puzzle", emoji: "🧩", bg: "linear-gradient(135deg, #6c5ce7, #fd79a8)", gameId: "puzzleGame" },
  { to: "/gra/pianino", label: "Pianino", emoji: "🎹", bg: "linear-gradient(135deg, #2d3436, #636e72)", gameId: "pianoGame" },
  { to: "/gra/rytm", label: "Rytm", emoji: "🥁", bg: "linear-gradient(135deg, #e67e22, #d35400)", gameId: "rhythmGame" },
  { to: "/gra/emocje", label: "Emocje", emoji: "😊", bg: "linear-gradient(135deg, #fd79a8, #fdcb6e)", gameId: "emotionGame" },
  { to: "/gra/przeciwienstwa", label: "Przeciw.", emoji: "🔄", bg: "linear-gradient(135deg, #00cec9, #6c5ce7)", gameId: "oppositeGame" },
  { to: "/gra/gotowanie", label: "Gotowanie", emoji: "👨‍🍳", bg: "linear-gradient(135deg, #ffeaa7, #fab1a0)", gameId: "cookingGame" },
];

const CATEGORIES = [
  {
    title: "Literki i słowa",
    icon: "📖",
    games: ["letterGame", "firstLetterGame", "wordGame", "rhymeGame", "syllableGame", "oppositeGame"],
  },
  {
    title: "Cyferki i matma",
    icon: "🔢",
    games: ["numberGame", "countGame", "biggerGame", "additionGame", "subtractionGame", "sortSizeGame", "shapeGame", "clockGame"],
  },
  {
    title: "Pamięć i myślenie",
    icon: "🧠",
    games: ["memoryGame", "whatDisappearedGame", "simonGame", "findDifferencesGame", "shadowGame", "sequenceGame"],
  },
  {
    title: "Kolory i sztuka",
    icon: "🎨",
    games: ["colorGame", "colorByNumberGame", "colorMixGame"],
  },
  {
    title: "Przyroda",
    icon: "🌿",
    games: ["animalSoundGame", "animalHomeGame", "seasonsGame"],
  },
  {
    title: "Zręczność",
    icon: "🏃",
    games: ["catchGame", "connectDotsGame", "mazeGame", "puzzleGame"],
  },
  {
    title: "Muzyka",
    icon: "🎵",
    games: ["pianoGame", "rhythmGame"],
  },
  {
    title: "Ja i emocje",
    icon: "😊",
    games: ["emotionGame"],
  },
  {
    title: "Codzienne umiejętności",
    icon: "🏠",
    games: ["cookingGame"],
  },
];

const GAME_MAP = {};
ALL_GAMES.forEach((g) => { GAME_MAP[g.gameId] = g; });

function getGameOfTheDay() {
  const day = Math.floor(Date.now() / 86400000);
  return ALL_GAMES[day % ALL_GAMES.length];
}

function CategorySection({ cat, profile }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section ref={ref} className={`main-menu__section ${isVisible ? "main-menu__section--visible" : ""}`}>
      <h2 className="main-menu__section-title">
        <span className="main-menu__section-icon">{cat.icon}</span>
        {cat.title}
      </h2>
      <div className="main-menu__grid">
        {cat.games.map((gameId, i) => {
          const game = GAME_MAP[gameId];
          if (!game) return null;
          const count = profile.gamesCompleted[gameId] || 0;
          return (
            <Link
              key={game.to}
              to={game.to}
              className={`main-menu__tile ${count > 0 ? "main-menu__tile--completed" : "main-menu__tile--new"}`}
              style={{ background: game.bg, "--delay": `${i * 60}ms` }}
              onClick={() => playClick()}
            >
              {count > 0 && (
                <span className="main-menu__tile-badge">
                  ⭐ <span className="main-menu__tile-count">x{count}</span>
                </span>
              )}
              <span className="main-menu__tile-emoji">{game.emoji}</span>
              <span className="main-menu__tile-label">{game.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function MainMenu() {
  const { profile, level, THEMES } = useProfile();
  const hasGreeted = useRef(false);

  const currentTheme = THEMES.find((t) => t.id === profile.theme) || THEMES[0];

  /* eslint-disable react-hooks/purity -- one-time random init for bubble animation */
  const bubbleStyles = useMemo(
    () => Array.from({ length: 12 }, () => ({
      size: `${40 + Math.random() * 60}px`,
      x: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 8}s`,
    })),
    []
  );
  /* eslint-enable react-hooks/purity */

  useEffect(() => {
    if (profile.name && profile.soundEnabled && !hasGreeted.current) {
      hasGreeted.current = true;
      setTimeout(() => speak(`Cześć, ${profile.name}!`), 500);
    }
  }, [profile.name, profile.soundEnabled]);

  const gameOfDay = getGameOfTheDay();
  const recentGames = (profile.recentlyPlayed || [])
    .map((id) => GAME_MAP[id])
    .filter(Boolean)
    .slice(0, 3);
  const playedIds = new Set(Object.keys(profile.gamesCompleted));
  const unplayed = ALL_GAMES.filter((g) => !playedIds.has(g.gameId));
  /* eslint-disable react-hooks/purity -- one-time random pick for "try new" tile */
  const tryNewIndex = useMemo(
    () => Math.floor(Math.random() * Math.max(unplayed.length, 1)),
    [unplayed.length]
  );
  const tryNew = unplayed.length > 0 ? unplayed[tryNewIndex % unplayed.length] : null;
  /* eslint-enable react-hooks/purity */

  if (!profile.onboardingDone) {
    return <Onboarding />;
  }

  return (
    <div className="main-menu" style={{ background: currentTheme.gradient }}>
      <div className="main-menu__bg">
        {bubbleStyles.map((b, i) => (
          <div
            key={i}
            className="main-menu__bubble"
            style={{
              "--size": b.size,
              "--x": b.x,
              "--delay": b.delay,
              "--duration": b.duration,
            }}
          />
        ))}
      </div>

      <header className="main-menu__header">
        <span className="main-menu__icon" role="img" aria-label="gra">🎮</span>
        <h1 className="main-menu__title">Gry dla Dzieci</h1>
        <span className="main-menu__icon" role="img" aria-label="gwiazdka">⭐</span>
      </header>

      {profile.name && (
        <p className="main-menu__greeting">Cześć, {profile.name}!</p>
      )}

      <div className="main-menu__profile-bar">
        <Link to="/profil" className="main-menu__profile-link">
          <span className="main-menu__avatar-frame" style={{ borderColor: level.color }}>
            {profile.avatar || "👤"}
          </span>
          <span>{profile.name || "Mój profil"}</span>
          <span className="main-menu__level-badge" style={{ background: level.color }}>
            {level.emoji} {level.name}
          </span>
          <span className="main-menu__stars">⭐ {profile.stars}</span>
        </Link>
        <Link to="/nagrody" className="main-menu__rewards-link">
          🏆 Naklejki ({profile.stickers.length})
        </Link>
      </div>

      {/* A2: Recommended section */}
      <section className="main-menu__recommended">
        <h2 className="main-menu__recommended-title">Polecane</h2>
        <div className="main-menu__recommended-scroll">
          {/* Game of the day */}
          <Link
            to={gameOfDay.to}
            className="main-menu__rec-tile main-menu__rec-tile--daily"
            style={{ background: gameOfDay.bg }}
            onClick={() => playClick()}
          >
            <span className="main-menu__rec-label">Gra dnia</span>
            <span className="main-menu__rec-emoji">{gameOfDay.emoji}</span>
            <span className="main-menu__rec-name">{gameOfDay.label}</span>
          </Link>

          {/* Recently played */}
          {recentGames.map((g) => (
            <Link
              key={g.gameId}
              to={g.to}
              className="main-menu__rec-tile"
              style={{ background: g.bg }}
              onClick={() => playClick()}
            >
              <span className="main-menu__rec-label">Ostatnio</span>
              <span className="main-menu__rec-emoji">{g.emoji}</span>
              <span className="main-menu__rec-name">{g.label}</span>
            </Link>
          ))}

          {/* Try something new */}
          {tryNew && (
            <Link
              to={tryNew.to}
              className="main-menu__rec-tile main-menu__rec-tile--new"
              style={{ background: tryNew.bg }}
              onClick={() => playClick()}
            >
              <span className="main-menu__rec-label">Spróbuj!</span>
              <span className="main-menu__rec-emoji">{tryNew.emoji}</span>
              <span className="main-menu__rec-name">{tryNew.label}</span>
            </Link>
          )}
        </div>
      </section>

      {CATEGORIES.map((cat) => (
        <CategorySection key={cat.title} cat={cat} profile={profile} />
      ))}

      <SoundToggle />
      <LevelUpModal />
    </div>
  );
}
