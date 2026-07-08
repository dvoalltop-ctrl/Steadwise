# Steadwise

**Run your homestead with confidence.**

Mobile-first homesteading manager for small-scale and hobby homesteaders. Built with Expo, React Native, TypeScript, and offline-first SQLite.

## Quick start

```bash
npm install
npm start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## Project structure

```
app/           Expo Router screens
src/
  components/  Shared UI kit
  features/    Domain modules (tasks, garden, etc.)
  db/          SQLite migrations & seed data
  sync/        Offline sync queue
  mocks/       Demo data for Phase A
  theme/       Design tokens
docs/          PRD, architecture, schema, roadmap, routes
```

## Development phases

| Phase | Status | Focus |
|-------|--------|-------|
| A | ✅ | Shell, navigation, mocks, empty states |
| B | 🟡 | Local SQLite, tasks, today dashboard |
| C | ⬜ | Garden, animals, pantry, finance |
| D | ⬜ | Auth, household, Supabase sync |
| E | ⬜ | Polish, tests, export |

## Scripts

- `npm start` — Expo dev server
- `npm test` — Run unit tests
- `npm run typecheck` — TypeScript check

## Documentation

- [PRD](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Schema](docs/SCHEMA.md)
- [Roadmap](docs/ROADMAP.md)
- [Routes](docs/ROUTES.md)

## Demo templates

After onboarding, seed data includes:

- Beginner Backyard Garden
- Laying Hen Flock
- Pantry Starter
- Weekly Chore Routines

Toggle **Mock** vs **Local DB** in Settings to compare data sources.
