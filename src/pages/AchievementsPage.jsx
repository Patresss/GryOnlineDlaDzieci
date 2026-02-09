import { useMemo } from "react";
import BackButton from "../components/BackButton";
import { useProfile } from "../context/ProfileContext";
import "./AchievementsPage.css";

const CATEGORIES_MAP = {
  literki: ["letterGame", "firstLetterGame", "wordGame", "rhymeGame", "syllableGame", "oppositeGame"],
  matma: ["numberGame", "countGame", "biggerGame", "additionGame", "subtractionGame", "sortSizeGame", "shapeGame", "clockGame"],
  pamiec: ["memoryGame", "whatDisappearedGame", "simonGame", "findDifferencesGame", "shadowGame", "sequenceGame"],
  kolory: ["colorGame", "colorByNumberGame", "colorMixGame"],
  przyroda: ["animalSoundGame", "animalHomeGame", "seasonsGame"],
  zrecznosc: ["catchGame", "connectDotsGame", "mazeGame", "puzzleGame"],
  muzyka: ["pianoGame", "rhythmGame"],
  emocje: ["emotionGame"],
  umiejetnosci: ["cookingGame"],
};

const ALL_GAME_IDS = Object.values(CATEGORIES_MAP).flat();

const ACHIEVEMENTS = [
  {
    id: "first_step",
    emoji: "\u{1F463}",
    title: "Pierwszy krok",
    description: "Uko\u0144cz dowoln\u0105 1 gr\u0119",
    check: (completed) => Object.keys(completed).length >= 1,
  },
  {
    id: "explorer",
    emoji: "\u{1F9ED}",
    title: "Odkrywca",
    description: "Zagraj w 10 r\u00f3\u017cnych gier",
    check: (completed) => Object.keys(completed).length >= 10,
  },
  {
    id: "letter_master",
    emoji: "\u{1F4D6}",
    title: "Mistrz literek",
    description: "Uko\u0144cz wszystkie 6 gier z kategorii Literki",
    check: (completed) => CATEGORIES_MAP.literki.every((id) => completed[id]),
  },
  {
    id: "mathematician",
    emoji: "\u{1F522}",
    title: "Matematyk",
    description: "Uko\u0144cz wszystkie 8 gier z kategorii Matma",
    check: (completed) => CATEGORIES_MAP.matma.every((id) => completed[id]),
  },
  {
    id: "streak_5",
    emoji: "\u{1F525}",
    title: "Seria 5!",
    description: "Zdobądź 5 gwiazdek",
    check: (_completed, stars) => stars >= 5,
  },
  {
    id: "streak_10",
    emoji: "\u26A1",
    title: "Seria 10!",
    description: "Zdobądź 10 gwiazdek",
    check: (_completed, stars) => stars >= 10,
  },
  {
    id: "collector",
    emoji: "\u{1F3AF}",
    title: "Kolekcjoner",
    description: "Zbierz 20 naklejek",
    check: (_completed, _stars, stickers) => stickers.length >= 20,
  },
  {
    id: "versatile",
    emoji: "\u{1F308}",
    title: "Wszechstronny",
    description: "Zagraj w przynajmniej 1 gr\u0119 z ka\u017cdej kategorii",
    check: (completed) =>
      Object.values(CATEGORIES_MAP).every((games) =>
        games.some((id) => completed[id])
      ),
  },
  {
    id: "legend",
    emoji: "\u{1F3C6}",
    title: "Legenda",
    description: "Uko\u0144cz wszystkie 34 gry",
    check: (completed) => ALL_GAME_IDS.every((id) => completed[id]),
  },
];

export default function AchievementsPage() {
  const { profile } = useProfile();

  const results = useMemo(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: a.check(profile.gamesCompleted, profile.stars, profile.stickers),
    }));
  }, [profile.gamesCompleted, profile.stars, profile.stickers]);

  const unlockedCount = results.filter((r) => r.unlocked).length;

  return (
    <div className="game-page game-page--achievements">
      <BackButton />
      <h2 className="achievements__title">Osi\u0105gni\u0119cia</h2>
      <p className="achievements__counter">
        {unlockedCount} / {ACHIEVEMENTS.length} odblokowanych
      </p>

      <div className="achievements__grid">
        {results.map((a) => (
          <div
            key={a.id}
            className={`achievements__card ${a.unlocked ? "achievements__card--unlocked" : "achievements__card--locked"}`}
          >
            <div className="achievements__card-emoji">
              {a.unlocked ? a.emoji : "\u{1F512}"}
            </div>
            <div className="achievements__card-info">
              <span className="achievements__card-title">{a.title}</span>
              <span className="achievements__card-desc">{a.description}</span>
            </div>
            {a.unlocked && <div className="achievements__card-glow" />}
          </div>
        ))}
      </div>
    </div>
  );
}
