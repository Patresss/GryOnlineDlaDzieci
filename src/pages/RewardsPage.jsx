import BackButton from "../components/BackButton";
import { useProfile } from "../context/ProfileContext";
import "./RewardsPage.css";

const ALL_STICKERS = [
  { emoji: "🔤", name: "Literki" },
  { emoji: "🔢", name: "Cyferki" },
  { emoji: "🃏", name: "Memory" },
  { emoji: "🦋", name: "Motylki" },
  { emoji: "🎨", name: "Kolory" },
  { emoji: "⚖️", name: "Porównanie" },
  { emoji: "🅰️", name: "Pierwsza litera" },
  { emoji: "🐾", name: "Zwierzęta" },
  { emoji: "🎵", name: "Simon" },
  { emoji: "📝", name: "Słowa" },
  { emoji: "✏️", name: "Kropki" },
  { emoji: "🎶", name: "Rymowanki" },
  { emoji: "🗣️", name: "Sylaby" },
  { emoji: "🔷", name: "Kształty" },
  { emoji: "📏", name: "Rozmiary" },
  { emoji: "➕", name: "Dodawanie" },
  { emoji: "👀", name: "Co zniknęło" },
  { emoji: "🖌️", name: "Kolorowanie" },
  { emoji: "🧪", name: "Mieszanie" },
  { emoji: "🏡", name: "Kto tu mieszka" },
  { emoji: "🍂", name: "Pory roku" },
  { emoji: "🏁", name: "Labirynt" },
  { emoji: "🎹", name: "Pianino" },
  { emoji: "🥁", name: "Rytm" },
  { emoji: "🔍", name: "Różnice" },
  { emoji: "➖", name: "Odejmowanie" },
  { emoji: "🕐", name: "Zegar" },
  { emoji: "👤", name: "Cienie" },
  { emoji: "🔢", name: "Sekwencje" },
  { emoji: "🧩", name: "Puzzle" },
  { emoji: "🔄", name: "Przeciwieństwa" },
  { emoji: "😊", name: "Emocje" },
  { emoji: "👨‍🍳", name: "Gotowanie" },
];

export default function RewardsPage() {
  const { profile } = useProfile();

  return (
    <div className="game-page game-page--rewards">
      <BackButton />
      <h2 className="rewards-title">Moje naklejki</h2>
      <p className="rewards-counter">
        {profile.stickers.length} / {ALL_STICKERS.length} zebranych
      </p>
      <div className="rewards-stars">
        Gwiazdek: {profile.stars} ⭐
      </div>
      <div className="rewards-grid">
        {ALL_STICKERS.map((s) => {
          const earned = profile.stickers.includes(s.emoji);
          return (
            <div
              key={s.emoji}
              className={`rewards-sticker ${earned ? "rewards-sticker--earned" : "rewards-sticker--locked"}`}
            >
              <span className="rewards-sticker__emoji">
                {earned ? s.emoji : "❓"}
              </span>
              <span className="rewards-sticker__name">
                {earned ? s.name : "???"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
