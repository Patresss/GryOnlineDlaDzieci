import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { playClick } from "../hooks/useSound";
import "./ChallengeMode.css";

const ALL_GAME_IDS = [
  "letterGame", "firstLetterGame", "wordGame", "rhymeGame", "syllableGame", "oppositeGame",
  "numberGame", "countGame", "biggerGame", "additionGame", "subtractionGame", "sortSizeGame", "shapeGame", "clockGame",
  "memoryGame", "whatDisappearedGame", "simonGame", "findDifferencesGame", "shadowGame", "sequenceGame",
  "colorGame", "colorByNumberGame", "colorMixGame",
  "animalSoundGame", "animalHomeGame", "seasonsGame",
  "catchGame", "connectDotsGame", "mazeGame", "puzzleGame",
  "pianoGame", "rhythmGame",
  "emotionGame", "cookingGame",
  "oddOneOutGame", "mirrorGame", "trainGame", "treasureGame", "shopGame", "builderGame",
];

const GAME_INFO = {
  letterGame: { label: "ABC", emoji: "🔤", to: "/gra/literki" },
  firstLetterGame: { label: "Pierwsza", emoji: "🅰️", to: "/gra/pierwsza-literka" },
  wordGame: { label: "Słowa", emoji: "📝", to: "/gra/uloz-slowo" },
  rhymeGame: { label: "Rymy", emoji: "🎶", to: "/gra/rymowanki" },
  syllableGame: { label: "Sylaby", emoji: "🗣️", to: "/gra/sylaby" },
  oppositeGame: { label: "Przeciw.", emoji: "🔄", to: "/gra/przeciwienstwa" },
  numberGame: { label: "123", emoji: "🔢", to: "/gra/cyferki" },
  countGame: { label: "Policz", emoji: "🔢", to: "/gra/policz" },
  biggerGame: { label: "Więcej?", emoji: "⚖️", to: "/gra/wiekszy" },
  additionGame: { label: "Dodaj", emoji: "➕", to: "/gra/dodawanie" },
  subtractionGame: { label: "Odejmij", emoji: "➖", to: "/gra/odejmowanie" },
  sortSizeGame: { label: "Rozmiary", emoji: "📏", to: "/gra/rozmiary" },
  shapeGame: { label: "Kształty", emoji: "🔷", to: "/gra/ksztalty" },
  clockGame: { label: "Zegar", emoji: "🕐", to: "/gra/zegar" },
  memoryGame: { label: "Memory", emoji: "🃏", to: "/gra/memory" },
  whatDisappearedGame: { label: "Zniknęło?", emoji: "👀", to: "/gra/co-zniknelo" },
  simonGame: { label: "Simon", emoji: "🎵", to: "/gra/simon" },
  findDifferencesGame: { label: "Różnice", emoji: "🔍", to: "/gra/roznice" },
  shadowGame: { label: "Cienie", emoji: "👤", to: "/gra/cienie" },
  sequenceGame: { label: "Sekwencje", emoji: "🔢", to: "/gra/sekwencje" },
  colorGame: { label: "Kolory", emoji: "🎨", to: "/gra/kolory" },
  colorByNumberGame: { label: "Koloruj", emoji: "🖌️", to: "/gra/kolorowanie" },
  colorMixGame: { label: "Mieszaj", emoji: "🧪", to: "/gra/mieszanie" },
  animalSoundGame: { label: "Dźwięki", emoji: "🐾", to: "/gra/dzwieki-zwierzat" },
  animalHomeGame: { label: "Domki", emoji: "🏡", to: "/gra/kto-tu-mieszka" },
  seasonsGame: { label: "Pory roku", emoji: "🍂", to: "/gra/pory-roku" },
  catchGame: { label: "Łap!", emoji: "🦋", to: "/gra/zlap-motylka" },
  connectDotsGame: { label: "Kropki", emoji: "✏️", to: "/gra/polacz-kropki" },
  mazeGame: { label: "Labirynt", emoji: "🏁", to: "/gra/labirynt" },
  puzzleGame: { label: "Puzzle", emoji: "🧩", to: "/gra/puzzle" },
  pianoGame: { label: "Pianino", emoji: "🎹", to: "/gra/pianino" },
  rhythmGame: { label: "Rytm", emoji: "🥁", to: "/gra/rytm" },
  emotionGame: { label: "Emocje", emoji: "😊", to: "/gra/emocje" },
  cookingGame: { label: "Gotowanie", emoji: "👨‍🍳", to: "/gra/gotowanie" },
  oddOneOutGame: { label: "Intruz", emoji: "🔎", to: "/gra/intruz" },
  mirrorGame: { label: "Lustro", emoji: "🪞", to: "/gra/lustro" },
  trainGame: { label: "Pociąg", emoji: "🚂", to: "/gra/pociag" },
  treasureGame: { label: "Skarb", emoji: "🗺️", to: "/gra/skarb" },
  shopGame: { label: "Sklep", emoji: "🛒", to: "/gra/sklep" },
  builderGame: { label: "Buduj", emoji: "🏗️", to: "/gra/buduj" },
};

function pickRandom3() {
  const shuffled = [...ALL_GAME_IDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default function ChallengeMode() {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);

  const challengeGames = useMemo(() => pickRandom3(), []);

  const completedCount = challengeGames.filter(
    (id) => profile.gamesCompleted[id]
  ).length;
  const allDone = completedCount === 3;

  if (!open) {
    return (
      <button className="challenge-btn" onClick={() => { setOpen(true); playClick(); }}>
        🎯 Wyzwanie!
      </button>
    );
  }

  return (
    <div className="challenge">
      <div className="challenge__header">
        <h3 className="challenge__title">🎯 Dzisiejsze wyzwanie!</h3>
        <p className="challenge__desc">Ukończ 3 losowe gry!</p>
      </div>
      <div className="challenge__games">
        {challengeGames.map((id) => {
          const info = GAME_INFO[id];
          if (!info) return null;
          const done = !!profile.gamesCompleted[id];
          return (
            <Link
              key={id}
              to={info.to}
              className={`challenge__game ${done ? "challenge__game--done" : ""}`}
              onClick={() => playClick()}
            >
              <span className="challenge__game-emoji">{info.emoji}</span>
              <span className="challenge__game-label">{info.label}</span>
              {done && <span className="challenge__game-check">✅</span>}
            </Link>
          );
        })}
      </div>
      <div className="challenge__progress">
        {completedCount}/3 {allDone ? "🎉 Brawo!" : ""}
      </div>
      <button className="challenge__close" onClick={() => setOpen(false)}>Zamknij</button>
    </div>
  );
}
