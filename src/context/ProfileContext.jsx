import { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

const AVATARS = ["🐱", "🐶", "🐰", "🦊", "🐼", "🐨", "🦁", "🐸"];

const DEFAULT_PROFILE = {
  avatar: null,
  name: "",
  stars: 0,
  gamesCompleted: {},
  stickers: [],
};

function loadProfile() {
  try {
    const raw = localStorage.getItem("kidProfile");
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    localStorage.setItem("kidProfile", JSON.stringify(profile));
  }, [profile]);

  const setAvatar = (avatar) => setProfile((p) => ({ ...p, avatar }));
  const setName = (name) => setProfile((p) => ({ ...p, name }));

  const addStar = (gameId) =>
    setProfile((p) => ({
      ...p,
      stars: p.stars + 1,
      gamesCompleted: {
        ...p.gamesCompleted,
        [gameId]: (p.gamesCompleted[gameId] || 0) + 1,
      },
    }));

  const addSticker = (sticker) =>
    setProfile((p) => ({
      ...p,
      stickers: p.stickers.includes(sticker)
        ? p.stickers
        : [...p.stickers, sticker],
    }));

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem("kidProfile");
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setAvatar, setName, addStar, addSticker, resetProfile, AVATARS }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
