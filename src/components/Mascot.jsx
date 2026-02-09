import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useProfile } from "../context/ProfileContext";
import "./Mascot.css";

const PHRASES = [
  "Hej! Zagrajmy!",
  "Super si\u0119 bawisz!",
  "Jeste\u015B niesamowity!",
  "Jaka gra dzisiaj?",
  "Brawo za post\u0119py!",
];

export default function Mascot() {
  const { profile } = useProfile();
  const [phrase, setPhrase] = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const fadeTimerRef = useRef(null);

  const getRandomPhrase = useMemo(
    () => () => PHRASES[Math.floor(Math.random() * PHRASES.length)],
    []
  );

  const showPhrase = useCallback(() => {
    const text = getRandomPhrase();
    setPhrase(text);
    setVisible(true);

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 4000);
  }, [getRandomPhrase]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      showPhrase();
    }, 15000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [showPhrase]);

  const handleTap = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    showPhrase();
    timerRef.current = setInterval(() => {
      showPhrase();
    }, 15000);
  }, [showPhrase]);

  return (
    <div className="mascot" onClick={handleTap}>
      <div className={`mascot__bubble ${visible ? "mascot__bubble--visible" : ""}`}>
        {phrase}
      </div>
      <div className="mascot__avatar">
        {profile.avatar || "\u{1F431}"}
      </div>
    </div>
  );
}
