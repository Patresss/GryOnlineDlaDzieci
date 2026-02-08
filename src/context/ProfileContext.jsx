import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ProfileContext = createContext();

const AVATARS_BY_LEVEL = {
  0: ["🐱", "🐶", "🐰", "🦊", "🐼", "🐨", "🦁", "🐸"],
  1: ["🐯", "🐺", "🦄", "🐲"],
  2: ["🦅", "🐬", "🦈", "🐙"],
  3: ["🦋", "🌟", "🔥", "💎"],
};

const LEVELS = [
  { id: 0, name: "Żółtodziób", minStars: 0, color: "#74B9FF", emoji: "🐣" },
  { id: 1, name: "Odkrywca", minStars: 11, color: "#00b894", emoji: "🧭" },
  { id: 2, name: "Mistrz", minStars: 31, color: "#e17055", emoji: "🏅" },
  { id: 3, name: "Geniusz", minStars: 61, color: "#6c5ce7", emoji: "🧠" },
];

const THEMES = [
  { id: "rainbow", name: "Tęcza", gradient: "linear-gradient(135deg, #A29BFE 0%, #74B9FF 30%, #4ECDC4 60%, #FFE66D 100%)", unlockGames: 0 },
  { id: "ocean", name: "Ocean", gradient: "linear-gradient(135deg, #0652DD 0%, #1289A7 40%, #74B9FF 70%, #c7ecee 100%)", unlockGames: 10 },
  { id: "forest", name: "Las", gradient: "linear-gradient(135deg, #00b894 0%, #55efc4 30%, #b8e994 60%, #ffeaa7 100%)", unlockGames: 20 },
  { id: "cosmos", name: "Kosmos", gradient: "linear-gradient(135deg, #0c0c1d 0%, #2d1b69 30%, #6c5ce7 60%, #a29bfe 100%)", unlockGames: 30 },
];

function getLevel(stars) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (stars >= LEVELS[i].minStars) return LEVELS[i];
  }
  return LEVELS[0];
}

function getAvailableAvatars(levelId) {
  const avatars = [];
  for (let i = 0; i <= levelId; i++) {
    avatars.push(...(AVATARS_BY_LEVEL[i] || []));
  }
  return avatars;
}

const DEFAULT_PROFILE = {
  avatar: null,
  name: "",
  stars: 0,
  gamesCompleted: {},
  stickers: [],
  recentlyPlayed: [],
  theme: "rainbow",
  ageGroup: null,
  soundEnabled: true,
  onboardingDone: false,
  helpSeen: {},
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
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    localStorage.setItem("kidProfile", JSON.stringify(profile));
  }, [profile]);

  const setAvatar = (avatar) => setProfile((p) => ({ ...p, avatar }));
  const setName = (name) => setProfile((p) => ({ ...p, name }));
  const setAgeGroup = (ageGroup) => setProfile((p) => ({ ...p, ageGroup }));
  const setTheme = (theme) => setProfile((p) => ({ ...p, theme }));
  const setSoundEnabled = (soundEnabled) => setProfile((p) => ({ ...p, soundEnabled }));
  const setOnboardingDone = () => setProfile((p) => ({ ...p, onboardingDone: true }));
  const markHelpSeen = (gameId) => setProfile((p) => ({ ...p, helpSeen: { ...p.helpSeen, [gameId]: true } }));

  const addStar = useCallback((gameId) => {
    setProfile((p) => ({
      ...p,
      stars: p.stars + 1,
      gamesCompleted: {
        ...p.gamesCompleted,
        [gameId]: (p.gamesCompleted[gameId] || 0) + 1,
      },
    }));
  }, []);

  const addSticker = useCallback((sticker) => {
    setProfile((p) => ({
      ...p,
      stickers: p.stickers.includes(sticker)
        ? p.stickers
        : [...p.stickers, sticker],
    }));
  }, []);

  const trackRecentlyPlayed = useCallback((gameId) => {
    setProfile((p) => {
      const filtered = (p.recentlyPlayed || []).filter((id) => id !== gameId);
      return { ...p, recentlyPlayed: [gameId, ...filtered].slice(0, 5) };
    });
  }, []);

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem("kidProfile");
  };

  const level = getLevel(profile.stars);
  const [prevLevelId, setPrevLevelId] = useState(level.id);

  useEffect(() => {
    if (level.id > prevLevelId) {
      setShowLevelUp(true); // eslint-disable-line react-hooks/set-state-in-effect -- level-up detection
    }
    setPrevLevelId(level.id);
  }, [level.id, prevLevelId]);

  const acknowledgeLevelUp = useCallback(() => {
    setShowLevelUp(false);
  }, []);

  const availableAvatars = getAvailableAvatars(level.id);
  const totalGamesPlayed = Object.values(profile.gamesCompleted).reduce((a, b) => a + b, 0);
  const unlockedThemes = THEMES.filter((t) => totalGamesPlayed >= t.unlockGames);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setAvatar,
        setName,
        setAgeGroup,
        setTheme,
        setSoundEnabled,
        setOnboardingDone,
        markHelpSeen,
        addStar,
        addSticker,
        trackRecentlyPlayed,
        resetProfile,
        acknowledgeLevelUp,
        level,
        leveledUp: showLevelUp,
        availableAvatars,
        unlockedThemes,
        LEVELS,
        THEMES,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  return useContext(ProfileContext);
}
