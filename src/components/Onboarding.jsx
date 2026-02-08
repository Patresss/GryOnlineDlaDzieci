import { useState } from "react";
import { useProfile } from "../context/ProfileContext";
import { speak } from "../hooks/useSound";
import "./Onboarding.css";

const AGE_GROUPS = [
  { id: "3-4", label: "3-4 lata", emoji: "🧒" },
  { id: "5", label: "5 lat", emoji: "👦" },
  { id: "6-7", label: "6-7 lat", emoji: "🧑" },
];

export default function Onboarding() {
  const { setAvatar, setName, setAgeGroup, setOnboardingDone, availableAvatars } = useProfile();
  const [step, setStep] = useState(0);
  const [tempName, setTempName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setAvatar(avatar);
  };

  const handleNameNext = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
    setStep(2);
    speak("Ile masz lat?");
  };

  const handleAgeSelect = (ageId) => {
    setAgeGroup(ageId);
    setOnboardingDone();
    speak("Świetnie! Zaczynamy zabawę!");
  };

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        {step === 0 && (
          <div className="onboarding__step">
            <h2 className="onboarding__title">Cześć! Wybierz zwierzaka!</h2>
            <div className="onboarding__avatars">
              {availableAvatars.map((a) => (
                <button
                  key={a}
                  className={`onboarding__avatar ${selectedAvatar === a ? "onboarding__avatar--selected" : ""}`}
                  onClick={() => handleAvatarSelect(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <button
              className="onboarding__next"
              onClick={() => { setStep(1); speak("Jak masz na imię?"); }}
              disabled={!selectedAvatar}
            >
              Dalej
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding__step">
            <h2 className="onboarding__title">Jak masz na imię?</h2>
            <div className="onboarding__selected-avatar">{selectedAvatar}</div>
            <input
              className="onboarding__input"
              type="text"
              placeholder="Twoje imię..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button className="onboarding__next" onClick={handleNameNext}>
              Dalej
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding__step">
            <h2 className="onboarding__title">Ile masz lat?</h2>
            <div className="onboarding__age-options">
              {AGE_GROUPS.map((ag) => (
                <button
                  key={ag.id}
                  className="onboarding__age-btn"
                  onClick={() => handleAgeSelect(ag.id)}
                >
                  <span className="onboarding__age-emoji">{ag.emoji}</span>
                  <span className="onboarding__age-label">{ag.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="onboarding__dots">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`onboarding__dot ${step === i ? "onboarding__dot--active" : step > i ? "onboarding__dot--done" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
