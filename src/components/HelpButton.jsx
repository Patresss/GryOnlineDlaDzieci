import { useState, useEffect, useRef } from "react";
import { useProfile } from "../context/ProfileContext";
import { speak } from "../hooks/useSound";
import "./HelpButton.css";

export default function HelpButton({ gameId, title, instructions }) {
  const { profile, markHelpSeen } = useProfile();
  const [open, setOpen] = useState(() => !profile.helpSeen[gameId]);
  const didAutoOpen = useRef(false);

  useEffect(() => {
    if (open && !didAutoOpen.current && !profile.helpSeen[gameId]) {
      didAutoOpen.current = true;
      markHelpSeen(gameId);
    }
  }, [open, gameId, profile.helpSeen, markHelpSeen]);

  const handleOpen = () => {
    setOpen(true);
    speak(instructions);
  };

  return (
    <>
      <button className="help-btn" onClick={handleOpen} aria-label="Pomoc">
        ?
      </button>
      {open && (
        <div className="help-overlay" onClick={() => setOpen(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="help-modal__title">{title}</h3>
            <p className="help-modal__text">{instructions}</p>
            <button className="help-modal__close" onClick={() => setOpen(false)}>
              Rozumiem!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
