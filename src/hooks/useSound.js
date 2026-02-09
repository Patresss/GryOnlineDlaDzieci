import { useCallback } from "react";

let runtimeSoundEnabled = null;
let sharedAudioContext = null;
let toneQueue = [];
let toneInProgress = false;
let stopCurrentTone = null;
let speechQueue = [];
let speechInProgress = false;

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

  speechInProgress = true;
  const finish = () => {
    speechInProgress = false;
    processSpeechQueue();
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  window.speechSynthesis.speak(utterance);
}

export function speak(text, lang = "pl-PL", rate = 0.85) {
  if (!text || !isSoundEnabled()) return;
  speechQueue.push({ text, lang, rate, pitch: 1.1 });
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
