import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import "./MainMenu.css";

const CATEGORIES = [
  {
    title: "Literki i słowa",
    games: [
      { to: "/gra/literki", label: "ABC", emoji: "🔤", bg: "linear-gradient(135deg, #FF6B6B, #ee5a5a)" },
      { to: "/gra/pierwsza-literka", label: "Pierwsza", emoji: "🅰️", bg: "linear-gradient(135deg, #e17055, #d63031)" },
      { to: "/gra/uloz-slowo", label: "Słowa", emoji: "📝", bg: "linear-gradient(135deg, #fd79a8, #e84393)" },
      { to: "/gra/rymowanki", label: "Rymy", emoji: "🎶", bg: "linear-gradient(135deg, #a29bfe, #6c5ce7)" },
      { to: "/gra/sylaby", label: "Sylaby", emoji: "🗣️", bg: "linear-gradient(135deg, #55efc4, #00b894)" },
    ],
  },
  {
    title: "Cyferki i matma",
    games: [
      { to: "/gra/cyferki", label: "123", emoji: "🔢", bg: "linear-gradient(135deg, #74B9FF, #5a9fe6)" },
      { to: "/gra/policz", label: "Policz", emoji: "🔢", bg: "linear-gradient(135deg, #0984e3, #0652DD)" },
      { to: "/gra/wiekszy", label: "Więcej?", emoji: "⚖️", bg: "linear-gradient(135deg, #fdcb6e, #e17055)" },
      { to: "/gra/dodawanie", label: "Dodaj", emoji: "➕", bg: "linear-gradient(135deg, #e17055, #d63031)" },
      { to: "/gra/rozmiary", label: "Rozmiary", emoji: "📏", bg: "linear-gradient(135deg, #00cec9, #00b894)" },
      { to: "/gra/ksztalty", label: "Kształty", emoji: "🔷", bg: "linear-gradient(135deg, #6c5ce7, #a29bfe)" },
    ],
  },
  {
    title: "Pamięć i myślenie",
    games: [
      { to: "/gra/memory", label: "Memory", emoji: "🃏", bg: "linear-gradient(135deg, #A29BFE, #6c5ce7)" },
      { to: "/gra/co-zniknelo", label: "Zniknęło?", emoji: "👀", bg: "linear-gradient(135deg, #00b894, #00cec9)" },
      { to: "/gra/simon", label: "Simon", emoji: "🎵", bg: "linear-gradient(135deg, #636e72, #2d3436)" },
      { to: "/gra/roznice", label: "Różnice", emoji: "🔍", bg: "linear-gradient(135deg, #fdcb6e, #e17055)" },
    ],
  },
  {
    title: "Kolory i sztuka",
    games: [
      { to: "/gra/kolory", label: "Kolory", emoji: "🎨", bg: "linear-gradient(135deg, #e74c3c, #e67e22, #f1c40f, #2ecc71, #3498db)" },
      { to: "/gra/kolorowanie", label: "Koloruj", emoji: "🖌️", bg: "linear-gradient(135deg, #e84393, #fd79a8)" },
      { to: "/gra/mieszanie", label: "Mieszaj", emoji: "🧪", bg: "linear-gradient(135deg, #6c5ce7, #e84393)" },
    ],
  },
  {
    title: "Przyroda",
    games: [
      { to: "/gra/dzwieki-zwierzat", label: "Dźwięki", emoji: "🐾", bg: "linear-gradient(135deg, #00b894, #55efc4)" },
      { to: "/gra/kto-tu-mieszka", label: "Domki", emoji: "🏡", bg: "linear-gradient(135deg, #e17055, #fdcb6e)" },
      { to: "/gra/pory-roku", label: "Pory roku", emoji: "🍂", bg: "linear-gradient(135deg, #00cec9, #55efc4, #fdcb6e, #74b9ff)" },
    ],
  },
  {
    title: "Zręczność",
    games: [
      { to: "/gra/zlap-motylka", label: "Łap!", emoji: "🦋", bg: "linear-gradient(135deg, #55efc4, #00b894)" },
      { to: "/gra/polacz-kropki", label: "Kropki", emoji: "✏️", bg: "linear-gradient(135deg, #fdcb6e, #e17055)" },
      { to: "/gra/labirynt", label: "Labirynt", emoji: "🏁", bg: "linear-gradient(135deg, #636e72, #b2bec3)" },
    ],
  },
  {
    title: "Muzyka",
    games: [
      { to: "/gra/pianino", label: "Pianino", emoji: "🎹", bg: "linear-gradient(135deg, #2d3436, #636e72)" },
      { to: "/gra/rytm", label: "Rytm", emoji: "🥁", bg: "linear-gradient(135deg, #e67e22, #d35400)" },
    ],
  },
];

export default function MainMenu() {
  const { profile } = useProfile();

  return (
    <div className="main-menu">
      <div className="main-menu__bg">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="main-menu__bubble"
            style={{
              "--size": `${40 + Math.random() * 60}px`,
              "--x": `${Math.random() * 100}%`,
              "--delay": `${Math.random() * 8}s`,
              "--duration": `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <header className="main-menu__header">
        <span className="main-menu__icon" role="img" aria-label="gra">🎮</span>
        <h1 className="main-menu__title">Gry dla Dzieci</h1>
        <span className="main-menu__icon" role="img" aria-label="gwiazdka">⭐</span>
      </header>

      <div className="main-menu__profile-bar">
        <Link to="/profil" className="main-menu__profile-link">
          <span>{profile.avatar || "👤"}</span>
          <span>{profile.name || "Mój profil"}</span>
          <span className="main-menu__stars">⭐ {profile.stars}</span>
        </Link>
        <Link to="/nagrody" className="main-menu__rewards-link">
          🏆 Naklejki ({profile.stickers.length})
        </Link>
      </div>

      {CATEGORIES.map((cat) => (
        <section key={cat.title} className="main-menu__section">
          <h2 className="main-menu__section-title">{cat.title}</h2>
          <div className="main-menu__grid">
            {cat.games.map((game) => (
              <Link
                key={game.to}
                to={game.to}
                className="main-menu__tile"
                style={{ background: game.bg }}
              >
                <span className="main-menu__tile-emoji">{game.emoji}</span>
                <span className="main-menu__tile-label">{game.label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
