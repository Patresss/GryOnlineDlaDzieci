import { Link } from "react-router-dom";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useProfile } from "../context/ProfileContext";
import { playClick, speak } from "../hooks/useSound";
import useScrollAnimation from "../hooks/useScrollAnimation";
import SoundToggle from "../components/SoundToggle";
import Onboarding from "../components/Onboarding";
import LevelUpModal from "../components/LevelUpModal";
import ProgressJourney from "../components/ProgressJourney";
import Mascot from "../components/Mascot";
import SeasonalDecorations from "../components/SeasonalDecorations";
import DarkModeToggle from "../components/DarkModeToggle";
import "./MainMenu.css";

const ALL_GAMES = [
  { to: "/gra/literki", label: "ABC", emoji: "🔤", bg: "linear-gradient(135deg, #FF6B6B, #ee5a5a)", gameId: "letterGame", difficulty: 1 },
  { to: "/gra/pierwsza-literka", label: "Pierwsza", emoji: "🅰️", bg: "linear-gradient(135deg, #e17055, #d63031)", gameId: "firstLetterGame", difficulty: 1 },
  { to: "/gra/uloz-slowo", label: "Słowa", emoji: "📝", bg: "linear-gradient(135deg, #fd79a8, #e84393)", gameId: "wordGame", difficulty: 2 },
  { to: "/gra/rymowanki", label: "Rymy", emoji: "🎶", bg: "linear-gradient(135deg, #a29bfe, #6c5ce7)", gameId: "rhymeGame", difficulty: 2 },
  { to: "/gra/sylaby", label: "Sylaby", emoji: "🗣️", bg: "linear-gradient(135deg, #55efc4, #00b894)", gameId: "syllableGame", difficulty: 2 },
  { to: "/gra/cyferki", label: "123", emoji: "🔢", bg: "linear-gradient(135deg, #74B9FF, #5a9fe6)", gameId: "numberGame", difficulty: 1 },
  { to: "/gra/policz", label: "Policz", emoji: "🔢", bg: "linear-gradient(135deg, #0984e3, #0652DD)", gameId: "countGame", difficulty: 1 },
  { to: "/gra/wiekszy", label: "Więcej?", emoji: "⚖️", bg: "linear-gradient(135deg, #fdcb6e, #e17055)", gameId: "biggerGame", difficulty: 2 },
  { to: "/gra/dodawanie", label: "Dodaj", emoji: "➕", bg: "linear-gradient(135deg, #e17055, #d63031)", gameId: "additionGame", difficulty: 2 },
  { to: "/gra/odejmowanie", label: "Odejmij", emoji: "➖", bg: "linear-gradient(135deg, #fab1a0, #e17055)", gameId: "subtractionGame", difficulty: 2 },
  { to: "/gra/rozmiary", label: "Rozmiary", emoji: "📏", bg: "linear-gradient(135deg, #00cec9, #00b894)", gameId: "sortSizeGame", difficulty: 2 },
  { to: "/gra/ksztalty", label: "Kształty", emoji: "🔷", bg: "linear-gradient(135deg, #6c5ce7, #a29bfe)", gameId: "shapeGame", difficulty: 2 },
  { to: "/gra/zegar", label: "Zegar", emoji: "🕐", bg: "linear-gradient(135deg, #fdcb6e, #74b9ff)", gameId: "clockGame", difficulty: 3 },
  { to: "/gra/memory", label: "Memory", emoji: "🃏", bg: "linear-gradient(135deg, #A29BFE, #6c5ce7)", gameId: "memoryGame", difficulty: 2 },
  { to: "/gra/co-zniknelo", label: "Zniknęło?", emoji: "👀", bg: "linear-gradient(135deg, #00b894, #00cec9)", gameId: "whatDisappearedGame", difficulty: 2 },
  { to: "/gra/simon", label: "Simon", emoji: "🎵", bg: "linear-gradient(135deg, #636e72, #2d3436)", gameId: "simonGame", difficulty: 3 },
  { to: "/gra/roznice", label: "Różnice", emoji: "🔍", bg: "linear-gradient(135deg, #fdcb6e, #e17055)", gameId: "findDifferencesGame", difficulty: 2 },
  { to: "/gra/cienie", label: "Cienie", emoji: "👤", bg: "linear-gradient(135deg, #636e72, #b2bec3)", gameId: "shadowGame", difficulty: 2 },
  { to: "/gra/sekwencje", label: "Sekwencje", emoji: "🔢", bg: "linear-gradient(135deg, #74b9ff, #a29bfe)", gameId: "sequenceGame", difficulty: 3 },
  { to: "/gra/kolory", label: "Kolory", emoji: "🎨", bg: "linear-gradient(135deg, #e74c3c, #e67e22, #f1c40f, #2ecc71, #3498db)", gameId: "colorGame", difficulty: 1 },
  { to: "/gra/kolorowanie", label: "Koloruj", emoji: "🖌️", bg: "linear-gradient(135deg, #e84393, #fd79a8)", gameId: "colorByNumberGame", difficulty: 2 },
  { to: "/gra/mieszanie", label: "Mieszaj", emoji: "🧪", bg: "linear-gradient(135deg, #6c5ce7, #e84393)", gameId: "colorMixGame", difficulty: 3 },
  { to: "/gra/dzwieki-zwierzat", label: "Dźwięki", emoji: "🐾", bg: "linear-gradient(135deg, #00b894, #55efc4)", gameId: "animalSoundGame", difficulty: 1 },
  { to: "/gra/kto-tu-mieszka", label: "Domki", emoji: "🏡", bg: "linear-gradient(135deg, #e17055, #fdcb6e)", gameId: "animalHomeGame", difficulty: 2 },
  { to: "/gra/pory-roku", label: "Pory roku", emoji: "🍂", bg: "linear-gradient(135deg, #00cec9, #55efc4, #fdcb6e, #74b9ff)", gameId: "seasonsGame", difficulty: 2 },
  { to: "/gra/zlap-motylka", label: "Łap!", emoji: "🦋", bg: "linear-gradient(135deg, #55efc4, #00b894)", gameId: "catchGame", difficulty: 1 },
  { to: "/gra/polacz-kropki", label: "Kropki", emoji: "✏️", bg: "linear-gradient(135deg, #fdcb6e, #e17055)", gameId: "connectDotsGame", difficulty: 2 },
  { to: "/gra/labirynt", label: "Labirynt", emoji: "🏁", bg: "linear-gradient(135deg, #636e72, #b2bec3)", gameId: "mazeGame", difficulty: 3 },
  { to: "/gra/puzzle", label: "Puzzle", emoji: "🧩", bg: "linear-gradient(135deg, #6c5ce7, #fd79a8)", gameId: "puzzleGame", difficulty: 3 },
  { to: "/gra/pianino", label: "Pianino", emoji: "🎹", bg: "linear-gradient(135deg, #2d3436, #636e72)", gameId: "pianoGame", difficulty: 1 },
  { to: "/gra/rytm", label: "Rytm", emoji: "🥁", bg: "linear-gradient(135deg, #e67e22, #d35400)", gameId: "rhythmGame", difficulty: 2 },
  { to: "/gra/emocje", label: "Emocje", emoji: "😊", bg: "linear-gradient(135deg, #fd79a8, #fdcb6e)", gameId: "emotionGame", difficulty: 1 },
  { to: "/gra/przeciwienstwa", label: "Przeciw.", emoji: "🔄", bg: "linear-gradient(135deg, #00cec9, #6c5ce7)", gameId: "oppositeGame", difficulty: 2 },
  { to: "/gra/gotowanie", label: "Gotowanie", emoji: "👨‍🍳", bg: "linear-gradient(135deg, #ffeaa7, #fab1a0)", gameId: "cookingGame", difficulty: 2 },
  { to: "/gra/intruz", label: "Intruz", emoji: "🔎", bg: "linear-gradient(135deg, #00cec9, #0984e3)", gameId: "oddOneOutGame", difficulty: 1 },
  { to: "/gra/lustro", label: "Lustro", emoji: "🪞", bg: "linear-gradient(135deg, #a29bfe, #6c5ce7)", gameId: "mirrorGame", difficulty: 2 },
  { to: "/gra/pociag", label: "Pociąg", emoji: "🚂", bg: "linear-gradient(135deg, #636e72, #b2bec3)", gameId: "trainGame", difficulty: 2 },
  { to: "/gra/skarb", label: "Skarb", emoji: "🗺️", bg: "linear-gradient(135deg, #00b894, #fdcb6e)", gameId: "treasureGame", difficulty: 2 },
  { to: "/gra/sklep", label: "Sklep", emoji: "🛒", bg: "linear-gradient(135deg, #ffeaa7, #e17055)", gameId: "shopGame", difficulty: 2 },
  { to: "/gra/buduj", label: "Buduj", emoji: "🏗️", bg: "linear-gradient(135deg, #6c5ce7, #fd79a8)", gameId: "builderGame", difficulty: 3 },
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
  {
    title: "Logika",
    icon: "🧩",
    games: ["oddOneOutGame", "mirrorGame", "trainGame", "treasureGame", "shopGame", "builderGame"],
  },
];

const GAME_MAP = {};
ALL_GAMES.forEach((g) => { GAME_MAP[g.gameId] = g; });

const SOLO_GAME_IDS = CATEGORIES
  .filter((cat) => cat.games.length === 1)
  .flatMap((cat) => cat.games);

const MENU_CATEGORIES = [
  ...CATEGORIES.filter((cat) => cat.games.length > 1),
  ...(SOLO_GAME_IDS.length > 0
    ? [{ title: "Inne", icon: "✨", games: SOLO_GAME_IDS }]
    : []),
];

function GameTile({ game, count, delay, className = "" }) {
  return (
    <Link
      to={game.to}
      className={`main-menu__tile ${count > 0 ? "main-menu__tile--completed" : "main-menu__tile--new"} ${className}`.trim()}
      style={{ background: game.bg, "--delay": `${delay}ms` }}
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
            <GameTile
              key={game.to}
              game={game}
              count={count}
              delay={i * 60}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function MainMenu() {
  const { profile, level, THEMES } = useProfile();
  const hasGreeted = useRef(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === profile.theme) || THEMES[0];

  /* eslint-disable react-hooks/purity -- one-time random init for bubble animation */
  const bubbleStyles = useMemo(
    () => Array.from({ length: 8 }, () => ({
      size: `${40 + Math.random() * 60}px`,
      x: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 8}s`,
    })),
    []
  );
  /* eslint-enable react-hooks/purity */

  /* A5: Sticky header visibility on scroll */
  const handleScroll = useCallback(() => {
    setStickyVisible(window.scrollY > 140);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (profile.name && profile.soundEnabled && !hasGreeted.current) {
      hasGreeted.current = true;
      setTimeout(() => speak(`Cześć, ${profile.name}!`), 500);
    }
  }, [profile.name, profile.soundEnabled]);

  if (!profile.onboardingDone) {
    return <Onboarding />;
  }

  return (
    <div className="main-menu" style={{ background: currentTheme.gradient }}>
      {/* A5: Sticky header */}
      <div className={`main-menu__sticky ${stickyVisible ? "main-menu__sticky--visible" : ""}`}>
        <Link to="/profil" className="main-menu__sticky-link">
          <span className="main-menu__sticky-avatar" style={{ borderColor: level.color }}>
            {profile.avatar || "👤"}
          </span>
          <span className="main-menu__sticky-name">{profile.name || "Profil"}</span>
        </Link>
        <span className="main-menu__sticky-stars">⭐ {profile.stars}</span>
      </div>

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


      <section className="main-menu__hero">
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
          <Link to="/osiagniecia" className="main-menu__rewards-link">
            🏅 Osiągnięcia
          </Link>
        </div>

      </section>

      <section className="main-menu__extras">
        <div className="main-menu__extras-content">
          <ProgressJourney />
        </div>
      </section>

      {MENU_CATEGORIES.map((cat) => (
        <CategorySection key={cat.title} cat={cat} profile={profile} />
      ))}

      <SeasonalDecorations />
      <DarkModeToggle />
      <SoundToggle />
      <LevelUpModal />
      <Mascot />
    </div>
  );
}
