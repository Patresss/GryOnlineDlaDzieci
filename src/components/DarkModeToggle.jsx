import { useProfile } from "../context/ProfileContext";
import "./DarkModeToggle.css";

export default function DarkModeToggle() {
  const { profile, setDarkMode } = useProfile();

  return (
    <button
      className="dark-mode-toggle"
      onClick={() => setDarkMode(!profile.darkMode)}
      aria-label={profile.darkMode ? "Tryb jasny" : "Tryb nocny"}
      title={profile.darkMode ? "Tryb jasny" : "Tryb nocny"}
    >
      {profile.darkMode ? "☀️" : "🌙"}
    </button>
  );
}
