import { useCallback } from "react";

let runtimeSoundEnabled = null;
let sharedAudioContext = null;
let toneQueue = [];
let toneInProgress = false;
let stopCurrentTone = null;
let speechQueue = [];
let speechInProgress = false;
let voicesListenerAttached = false;
let voiceCacheByLang = {};

const VOICE_QUALITY_HINTS = [
  "natural",
  "neural",
  "enhanced",
  "premium",
  "wavenet",
  "studio",
  "microsoft",
  "google",
];

const VOICE_LOW_QUALITY_HINTS = [
  "espeak",
  "compact",
  "lite",
  "basic",
];

const POLISH_VOICE_HINTS = [
  "polish",
  "polski",
  "zosia",
  "marek",
  "pl-pl",
];

function readSoundEnabledFromStorage() {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem("kidProfile");
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : true;
  } catch {
    return true;
  }
}

function isSoundEnabled() {
  if (typeof runtimeSoundEnabled === "boolean") {
    return runtimeSoundEnabled;
  }
  return readSoundEnabledFromStorage();
}

function clearSpeech() {
  speechQueue = [];
  speechInProgress = false;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function clearTones() {
  toneQueue = [];
  toneInProgress = false;
  if (stopCurrentTone) {
    stopCurrentTone();
    stopCurrentTone = null;
  }
}

export function setSoundEnabledRuntime(enabled) {
  runtimeSoundEnabled = !!enabled;
  if (!runtimeSoundEnabled) {
    clearSpeech();
    clearTones();
  }
}

function normalizeSpeechText(text) {
  return String(text)
    .replace(/\s+/g, " ")
    .replace(/\+/g, " plus ")
    .replace(/\s=\s/g, " równa się ")
    .replace(/\s-\s/g, " minus ")
    .replace(/\//g, " na ")
    .trim();
}

function splitSpeechIntoChunks(text, maxLength = 140) {
  if (text.length <= maxLength) return [text];

  const sentenceParts = text.match(/[^.!?]+[.!?]?/g) || [text];
  const chunks = [];
  let current = "";

  sentenceParts.forEach((part) => {
    const candidate = current ? `${current} ${part}`.trim() : part.trim();
    if (candidate.length <= maxLength) {
      current = candidate;
      return;
    }
    if (current) chunks.push(current);
    if (part.length <= maxLength) {
      current = part.trim();
      return;
    }

    const words = part.trim().split(" ");
    current = "";
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxLength && current) {
        chunks.push(current);
        current = word;
      } else {
        current = next;
      }
    });
  });

  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text];
}

function ensureVoicesListener() {
  if (voicesListenerAttached) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  voicesListenerAttached = true;
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    voiceCacheByLang = {};
    processSpeechQueue();
  });
}

function scoreVoice(voice, lang, langBase) {
  const voiceLang = (voice.lang || "").toLowerCase();
  const voiceName = (voice.name || "").toLowerCase();
  let score = 0;

  if (voiceLang === lang.toLowerCase()) score += 120;
  else if (voiceLang.startsWith(langBase)) score += 85;
  else if (voiceLang.startsWith("pl")) score += 40;
  if (voice.default) score += 10;

  VOICE_QUALITY_HINTS.forEach((hint) => {
    if (voiceName.includes(hint)) score += 8;
  });
  VOICE_LOW_QUALITY_HINTS.forEach((hint) => {
    if (voiceName.includes(hint)) score -= 16;
  });

  if (langBase === "pl") {
    POLISH_VOICE_HINTS.forEach((hint) => {
      if (voiceName.includes(hint)) score += 10;
    });
  }

  return score;
}

function getBestVoice(lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  ensureVoicesListener();

  if (Object.prototype.hasOwnProperty.call(voiceCacheByLang, lang)) {
    return voiceCacheByLang[lang];
  }

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) {
    voiceCacheByLang[lang] = null;
    return null;
  }

  const langBase = (lang || "pl-PL").slice(0, 2).toLowerCase();
  const sameLangVoices = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith(langBase));
  const candidates = sameLangVoices.length > 0 ? sameLangVoices : voices;

  let bestVoice = null;
  let bestScore = -Infinity;
  candidates.forEach((voice) => {
    const score = scoreVoice(voice, lang, langBase);
    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  });

  voiceCacheByLang[lang] = bestVoice;
  return bestVoice;
}

function processSpeechQueue() {
  if (speechInProgress || speechQueue.length === 0) return;
  if (!isSoundEnabled()) {
    speechQueue = [];
    return;
  }
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    speechQueue = [];
    return;
  }

  const next = speechQueue.shift();
  if (!next) return;

  const utterance = new SpeechSynthesisUtterance(next.text);
  utterance.lang = next.lang;
  utterance.rate = next.rate;
  utterance.pitch = next.pitch;
  utterance.volume = 1;
  utterance.voice = getBestVoice(next.lang);

  speechInProgress = true;
  const finish = () => {
    speechInProgress = false;
    processSpeechQueue();
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  window.speechSynthesis.speak(utterance);
}

export function speak(text, lang = "pl-PL", rate = 0.95) {
  if (!text || !isSoundEnabled()) return;

  const normalized = normalizeSpeechText(text);
  if (!normalized) return;

  const clampedRate = Math.min(Math.max(rate, 0.78), 1.1);
  const pitch = (lang || "").toLowerCase().startsWith("pl") ? 0.97 : 1;
  const chunks = splitSpeechIntoChunks(normalized);

  chunks.forEach((chunk) => {
    speechQueue.push({
      text: chunk,
      lang,
      rate: clampedRate,
      pitch,
    });
  });

  processSpeechQueue();
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new Ctx();
  }
  return sharedAudioContext;
}

function playToneNow(frequency, duration, type, onDone) {
  const ctx = getAudioContext();
  if (!ctx) {
    onDone();
    return;
  }

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      stopCurrentTone = null;
      onDone();
    };

    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = finish;
    osc.start();
    osc.stop(ctx.currentTime + duration);

    stopCurrentTone = () => {
      try {
        osc.onended = null;
        osc.stop();
      } catch {
        // no-op
      } finally {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // no-op
        }
        finished = true;
      }
    };
  } catch {
    onDone();
  }
}

function processToneQueue() {
  if (toneInProgress || toneQueue.length === 0) return;
  if (!isSoundEnabled()) {
    toneQueue = [];
    return;
  }

  const next = toneQueue.shift();
  if (!next) return;

  toneInProgress = true;
  playToneNow(next.frequency, next.duration, next.type, () => {
    toneInProgress = false;
    processToneQueue();
  });
}

export function playTone(frequency, duration = 0.2, type = "sine") {
  if (!isSoundEnabled()) return;
  toneQueue.push({ frequency, duration, type });
  processToneQueue();
}

export function playSuccess() {
  playTone(523, 0.15);
  setTimeout(() => playTone(659, 0.15), 100);
  setTimeout(() => playTone(784, 0.3), 200);
}

export function playError() {
  playTone(200, 0.3, "square");
}

export function playWin() {
  [523, 587, 659, 698, 784].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.25), i * 120);
  });
}

export function playClick() {
  playTone(440, 0.08);
}

export function playNote(noteIndex) {
  const frequencies = [261.6, 293.7, 329.6, 349.2, 392.0, 440.0, 493.9, 523.3];
  playTone(frequencies[noteIndex] || 440, 0.5);
}

export default function useSound() {
  return {
    setSoundEnabledRuntime: useCallback((...args) => setSoundEnabledRuntime(...args), []),
    speak: useCallback((...args) => speak(...args), []),
    playSuccess: useCallback((...args) => playSuccess(...args), []),
    playError: useCallback((...args) => playError(...args), []),
    playWin: useCallback((...args) => playWin(...args), []),
    playClick: useCallback((...args) => playClick(...args), []),
    playNote: useCallback((...args) => playNote(...args), []),
    playTone: useCallback((...args) => playTone(...args), []),
  };
}
