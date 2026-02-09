import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "./context/ProfileContext";
import LoadingSpinner from "./components/LoadingSpinner";

const MainMenu = lazy(() => import("./pages/MainMenu"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));

// Language games
const LetterGame = lazy(() => import("./pages/LetterGame"));
const FirstLetterGame = lazy(() => import("./pages/FirstLetterGame"));
const WordGame = lazy(() => import("./pages/WordGame"));
const RhymeGame = lazy(() => import("./pages/RhymeGame"));
const SyllableGame = lazy(() => import("./pages/SyllableGame"));
const OppositeGame = lazy(() => import("./pages/OppositeGame"));

// Math games
const NumberGame = lazy(() => import("./pages/NumberGame"));
const CountGame = lazy(() => import("./pages/CountGame"));
const BiggerGame = lazy(() => import("./pages/BiggerGame"));
const AdditionGame = lazy(() => import("./pages/AdditionGame"));
const SubtractionGame = lazy(() => import("./pages/SubtractionGame"));
const SortSizeGame = lazy(() => import("./pages/SortSizeGame"));
const ShapeGame = lazy(() => import("./pages/ShapeGame"));
const ClockGame = lazy(() => import("./pages/ClockGame"));

// Memory games
const MemoryGame = lazy(() => import("./pages/MemoryGame"));
const WhatDisappearedGame = lazy(() => import("./pages/WhatDisappearedGame"));
const SimonGame = lazy(() => import("./pages/SimonGame"));
const FindDifferencesGame = lazy(() => import("./pages/FindDifferencesGame"));
const ShadowGame = lazy(() => import("./pages/ShadowGame"));
const SequenceGame = lazy(() => import("./pages/SequenceGame"));

// Color games
const ColorGame = lazy(() => import("./pages/ColorGame"));
const ColorByNumberGame = lazy(() => import("./pages/ColorByNumberGame"));
const ColorMixGame = lazy(() => import("./pages/ColorMixGame"));

// Nature games
const AnimalSoundGame = lazy(() => import("./pages/AnimalSoundGame"));
const AnimalHomeGame = lazy(() => import("./pages/AnimalHomeGame"));
const SeasonsGame = lazy(() => import("./pages/SeasonsGame"));

// Motor games
const CatchGame = lazy(() => import("./pages/CatchGame"));
const ConnectDotsGame = lazy(() => import("./pages/ConnectDotsGame"));
const MazeGame = lazy(() => import("./pages/MazeGame"));
const PuzzleGame = lazy(() => import("./pages/PuzzleGame"));

// Music games
const PianoGame = lazy(() => import("./pages/PianoGame"));
const RhythmGame = lazy(() => import("./pages/RhythmGame"));

// New category games
const EmotionGame = lazy(() => import("./pages/EmotionGame"));
const CookingGame = lazy(() => import("./pages/CookingGame"));

// Logic / new games (C1-C6)
const OddOneOutGame = lazy(() => import("./pages/OddOneOutGame"));
const MirrorGame = lazy(() => import("./pages/MirrorGame"));
const TrainGame = lazy(() => import("./pages/TrainGame"));
const TreasureGame = lazy(() => import("./pages/TreasureGame"));
const ShopGame = lazy(() => import("./pages/ShopGame"));
const BuilderGame = lazy(() => import("./pages/BuilderGame"));

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainMenu />} />

            {/* Literki i słowa */}
            <Route path="/gra/literki" element={<LetterGame />} />
            <Route path="/gra/pierwsza-literka" element={<FirstLetterGame />} />
            <Route path="/gra/uloz-slowo" element={<WordGame />} />
            <Route path="/gra/rymowanki" element={<RhymeGame />} />
            <Route path="/gra/sylaby" element={<SyllableGame />} />
            <Route path="/gra/przeciwienstwa" element={<OppositeGame />} />

            {/* Cyferki i matma */}
            <Route path="/gra/cyferki" element={<NumberGame />} />
            <Route path="/gra/policz" element={<CountGame />} />
            <Route path="/gra/wiekszy" element={<BiggerGame />} />
            <Route path="/gra/dodawanie" element={<AdditionGame />} />
            <Route path="/gra/odejmowanie" element={<SubtractionGame />} />
            <Route path="/gra/rozmiary" element={<SortSizeGame />} />
            <Route path="/gra/ksztalty" element={<ShapeGame />} />
            <Route path="/gra/zegar" element={<ClockGame />} />

            {/* Pamięć i myślenie */}
            <Route path="/gra/memory" element={<MemoryGame />} />
            <Route path="/gra/co-zniknelo" element={<WhatDisappearedGame />} />
            <Route path="/gra/simon" element={<SimonGame />} />
            <Route path="/gra/roznice" element={<FindDifferencesGame />} />
            <Route path="/gra/cienie" element={<ShadowGame />} />
            <Route path="/gra/sekwencje" element={<SequenceGame />} />

            {/* Kolory i sztuka */}
            <Route path="/gra/kolory" element={<ColorGame />} />
            <Route path="/gra/kolorowanie" element={<ColorByNumberGame />} />
            <Route path="/gra/mieszanie" element={<ColorMixGame />} />

            {/* Przyroda */}
            <Route path="/gra/dzwieki-zwierzat" element={<AnimalSoundGame />} />
            <Route path="/gra/kto-tu-mieszka" element={<AnimalHomeGame />} />
            <Route path="/gra/pory-roku" element={<SeasonsGame />} />

            {/* Zręczność */}
            <Route path="/gra/zlap-motylka" element={<CatchGame />} />
            <Route path="/gra/polacz-kropki" element={<ConnectDotsGame />} />
            <Route path="/gra/labirynt" element={<MazeGame />} />
            <Route path="/gra/puzzle" element={<PuzzleGame />} />

            {/* Muzyka */}
            <Route path="/gra/pianino" element={<PianoGame />} />
            <Route path="/gra/rytm" element={<RhythmGame />} />

            {/* Ja i emocje */}
            <Route path="/gra/emocje" element={<EmotionGame />} />

            {/* Codzienne umiejętności */}
            <Route path="/gra/gotowanie" element={<CookingGame />} />

            {/* Logika */}
            <Route path="/gra/intruz" element={<OddOneOutGame />} />
            <Route path="/gra/lustro" element={<MirrorGame />} />
            <Route path="/gra/pociag" element={<TrainGame />} />
            <Route path="/gra/skarb" element={<TreasureGame />} />
            <Route path="/gra/sklep" element={<ShopGame />} />
            <Route path="/gra/buduj" element={<BuilderGame />} />

            {/* Profil i nagrody */}
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/nagrody" element={<RewardsPage />} />
            <Route path="/osiagniecia" element={<AchievementsPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ProfileProvider>
  );
}
