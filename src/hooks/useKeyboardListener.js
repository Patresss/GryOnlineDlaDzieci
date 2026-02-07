import { useState, useEffect } from "react";

export default function useKeyboardListener() {
  const [lastKey, setLastKey] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      setLastKey(e.key.toUpperCase());
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resetKey = () => setLastKey(null);

  return [lastKey, resetKey];
}
