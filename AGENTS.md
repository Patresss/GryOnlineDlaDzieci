# Repository Guidelines

## Project Structure & Module Organization
- `src/main.jsx` boots the app, and `src/App.jsx` contains route definitions with lazy-loaded pages.
- `src/pages/` contains screens and games (usually `FeatureGame.jsx` with matching `FeatureGame.css`).
- `src/components/` holds shared UI parts (buttons, modals, onboarding, progress UI).
- `src/hooks/` stores reusable logic (`useSound`, `useGameLoop`, `useKeyboardListener`, etc.).
- `src/context/ProfileContext.jsx` manages profile, progress, themes, and persistence.
- `src/data/` contains static datasets used by games; `public/` has static assets; `dist/` is generated build output.

## Build, Test, and Development Commands
```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (HMR)
npm run build      # create production build in dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint on JS/JSX files
```
Before submitting changes, run `npm run lint && npm run build`.

## Coding Style & Naming Conventions
- Use React function components and ES module imports/exports.
- Match existing formatting: 2-space indentation, semicolons, and double quotes.
- Use PascalCase for component/page filenames (`MainMenu.jsx`, `ProfilePage.jsx`).
- Use `useX` naming for hooks (`useScrollAnimation.js`).
- Keep route slugs in kebab-case under `/gra/...` (example: `/gra/polacz-kropki`).
- Keep CSS colocated and similarly named (`PuzzleGame.jsx` + `PuzzleGame.css`).
- Follow `eslint.config.js`; if disabling a rule, add a short justification comment.

## Testing Guidelines
- No automated unit/integration test framework is configured yet.
- Required validation is lint + build + manual smoke testing:
  1. `npm run lint`
  2. `npm run build`
  3. `npm run dev` and verify the changed routes/games
- For gameplay changes, confirm scoring/stars, level updates, and `localStorage` persistence (`kidProfile`).

## Commit & Pull Request Guidelines
- Current history uses short descriptive subjects (examples: `Claude improvements`, `Claude improvements part 2`).
- Keep commit messages concise and specific to one logical change.
- PRs should include: what changed, affected pages/routes, manual test steps, and screenshots/GIFs for UI updates.
- Link the related issue/task when available.
