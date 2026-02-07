import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "./context/ProfileContext";
import MainMenu from "./pages/MainMenu";
import LetterGame from "./pages/LetterGame";
import NumberGame from "./pages/NumberGame";
import MemoryGame from "./pages/MemoryGame";
import CountGame from "./pages/CountGame";
import CatchGame from "./pages/CatchGame";
import ColorGame from "./pages/ColorGame";
import BiggerGame from "./pages/BiggerGame";
import FirstLetterGame from "./pages/FirstLetterGame";
import AnimalSoundGame from "./pages/AnimalSoundGame";
import SimonGame from "./pages/SimonGame";
import WordGame from "./pages/WordGame";
import ConnectDotsGame from "./pages/ConnectDotsGame";
import RhymeGame from "./pages/RhymeGame";
import SyllableGame from "./pages/SyllableGame";
import ShapeGame from "./pages/ShapeGame";
import SortSizeGame from "./pages/SortSizeGame";
import AdditionGame from "./pages/AdditionGame";
import WhatDisappearedGame from "./pages/WhatDisappearedGame";
import ColorByNumberGame from "./pages/ColorByNumberGame";
import ColorMixGame from "./pages/ColorMixGame";
import AnimalHomeGame from "./pages/AnimalHomeGame";
import SeasonsGame from "./pages/SeasonsGame";
import MazeGame from "./pages/MazeGame";
import PianoGame from "./pages/PianoGame";
import RhythmGame from "./pages/RhythmGame";
import FindDifferencesGame from "./pages/FindDifferencesGame";
import ProfilePage from "./pages/ProfilePage";
import RewardsPage from "./pages/RewardsPage";

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />

          {/* Literki i słowa */}
          <Route path="/gra/literki" element={<LetterGame />} />
          <Route path="/gra/pierwsza-literka" element={<FirstLetterGame />} />
          <Route path="/gra/uloz-slowo" element={<WordGame />} />
          <Route path="/gra/rymowanki" element={<RhymeGame />} />
          <Route path="/gra/sylaby" element={<SyllableGame />} />

          {/* Cyferki i matma */}
          <Route path="/gra/cyferki" element={<NumberGame />} />
          <Route path="/gra/policz" element={<CountGame />} />
          <Route path="/gra/wiekszy" element={<BiggerGame />} />
          <Route path="/gra/dodawanie" element={<AdditionGame />} />
          <Route path="/gra/rozmiary" element={<SortSizeGame />} />
          <Route path="/gra/ksztalty" element={<ShapeGame />} />

          {/* Pamięć i myślenie */}
          <Route path="/gra/memory" element={<MemoryGame />} />
          <Route path="/gra/co-zniknelo" element={<WhatDisappearedGame />} />
          <Route path="/gra/simon" element={<SimonGame />} />
          <Route path="/gra/roznice" element={<FindDifferencesGame />} />

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

          {/* Muzyka */}
          <Route path="/gra/pianino" element={<PianoGame />} />
          <Route path="/gra/rytm" element={<RhythmGame />} />

          {/* Profil i nagrody */}
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/nagrody" element={<RewardsPage />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
