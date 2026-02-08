# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Gry dla Dzieci" — a Polish-language educational game collection for children ages 3-7. Built as a single-page app with 26 mini-games across 7 categories (language, math, memory, colors, nature, motor skills, music). No backend; all state is in localStorage.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint (flat config, no TypeScript)
- `npm run preview` — preview production build

No test framework is configured.

## Architecture

**Routing**: All routes defined in `src/App.jsx`. Games live under `/gra/*`, plus `/profil` and `/nagrody`.

**Game pattern**: Every game page follows the same structure:
1. Show `DifficultyPicker` (easy=5, medium=10, hard=15 rounds) → user picks level
2. Game loop: `BackButton` + `ProgressBar` + game-specific content
3. On completion: `WinScreen` overlay with confetti, calls `addStar(gameId)` and `addSticker(emoji)`
4. Feedback state: `null | "correct" | "wrong"` + `isProcessing` ref to block double-clicks

**State** (`src/context/ProfileContext.jsx`): Single React context providing `profile` (avatar, name, stars, stickers, gamesCompleted), persisted to localStorage under key `kidProfile`.

**Sound** (`src/hooks/useSound.js`): Exports both named functions (`speak`, `playSuccess`, `playError`, `playTone`, `playNote`) and a `useSound()` hook. `speak()` uses Web Speech API with `pl-PL` locale. Audio uses Web Audio API oscillators.

**Shared components** (`src/components/`): `BackButton`, `ProgressBar`, `DifficultyPicker`, `VirtualKeyboard` (letters/numbers modes), `WinScreen`.

**Data files** (`src/data/`): Static JS arrays/objects with emoji-based content (no image assets needed). Each file exports data for one or more games.

## Conventions

- Language: all UI text is in Polish
- Styling: pure CSS with one `.css` file per component/page, BEM-like class naming (`game-card--correct`), CSS variables for theming
- Font: Fredoka via Google Fonts
- No TypeScript — plain JSX
- ESLint rule: `no-unused-vars` ignores names starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- Games import sound functions directly (`import { speak, playSuccess } from "../hooks/useSound"`) rather than using the hook when outside React component scope
