# AGENTS.md

## Cursor Cloud specific instructions

Steadwise is an offline-first **Expo (React Native + web)** app written in TypeScript.
It uses `expo-router`, `expo-sqlite` (local database), and `zustand`/AsyncStorage for
state. There is **no backend service to run** yet — `supabase/` is a future phase and
currently only contains a `.gitkeep`. Data is served from in-memory mocks by default
(`useLocalDb` defaults to `false`; toggle to the local SQLite DB in Settings).

Package manager is **npm** (`package-lock.json`). Node 20+ is required; the VM ships
Node 22. Note `node_modules/` is committed to the repo (there is no `.gitignore`), so a
fresh `npm install` only produces a small, ignorable working-tree diff — do not commit
those `node_modules/` changes.

Standard commands (see `package.json` `scripts` and `README.md`):
- Tests: `npm test` (vitest, Node environment).
- Typecheck / lint: `npm run typecheck` (`tsc --noEmit`). There is no ESLint config;
  typecheck is the lint gate.
- Dev server: `npm start` (Metro, for native via Expo Go / simulators) or
  `npm run web` (web target).

Non-obvious caveats:
- **No iOS/Android simulators exist in the cloud VM.** To interact with the GUI here,
  run the **web** target (`npx expo start --web`) and open `http://localhost:8081`.
- The web bundle requires `metro.config.js` to register `.wasm` as an asset (and to set
  COOP/COEP headers for `SharedArrayBuffer`). Without it, web bundling fails with
  `Unable to resolve module ./wa-sqlite/wa-sqlite.wasm` from `expo-sqlite`. This file is
  committed at the repo root — keep it.
- `app.json` references icons under `./assets/images/*` that do not exist yet; Metro logs
  warnings about them but the app still bundles and renders.
