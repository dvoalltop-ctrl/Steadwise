# Steadwise

Mobile-first, offline-first homestead management built with Expo, SQLite, and Supabase.

## Stack

- Expo React Native (TypeScript strict)
- expo-sqlite for local storage
- Supabase for auth and cloud sync (optional)

## Getting started

```bash
npm install
cp .env.example .env
npm start
```

Add your Supabase project URL and anon key to `.env` when you are ready for sync.

## Scripts

- `npm start` — Expo dev server
- `npm run typecheck` — TypeScript check
- `npm run android` / `ios` / `web` — platform targets

## Project structure

```
app/                 Expo Router screens
src/
  components/        Shared UI
  features/          Feature screens and hooks
  lib/db/            SQLite schema, migrations, repositories
  lib/supabase/      Auth and sync skeleton
  providers/         App-wide context
  theme/             Colors and spacing
supabase/            Remote schema reference
```

## First screen

**Tasks** supports offline create, complete, and delete with loading, empty, and error states.

Other tabs (Garden, Animals, Pantry) are placeholders. Local tables are already created for future features.
