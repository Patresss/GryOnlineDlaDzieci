import { useProfile } from "../context/ProfileContext";
import "./SoundToggle.css";

export default function SoundToggle() {
  const { profile, setSoundEnabled } = useProfile();

  return (
    <button
      className={`sound-toggle ${profile.soundEnabled ? "" : "sound-toggle--muted"}`}
      onClick={() => setSoundEnabled(!profile.soundEnabled)}
      aria-label={profile.soundEnabled ? "Wycisz dźwięki" : "Włącz dźwięki"}
    >
      {profile.soundEnabled ? "🔊" : "🔇"}
    </button>
  );
}
