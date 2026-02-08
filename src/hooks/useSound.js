import { useCallback } from "react";

export function speak(text, lang = "pl-PL", rate = 0.85) {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
  }
}

export function playTone(frequency, duration = 0.2, type = "sine") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { /* audio not available */ }
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
    speak: useCallback((...args) => speak(...args), []),
    playSuccess: useCallback((...args) => playSuccess(...args), []),
    playError: useCallback((...args) => playError(...args), []),
    playWin: useCallback((...args) => playWin(...args), []),
    playClick: useCallback((...args) => playClick(...args), []),
    playNote: useCallback((...args) => playNote(...args), []),
    playTone: useCallback((...args) => playTone(...args), []),
  };
}
