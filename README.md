# Steadwise

**Run your homestead with confidence.**

Mobile-first homesteading manager for small-scale and hobby homesteaders. Built
with Expo, React Native, and TypeScript, designed to be offline-first.

> This is the clean project foundation. It ships tab navigation, placeholder
> module screens with empty states, a rustic-modern theme, and mock data only —
> no real database or backend logic yet.

## Quick start

```bash
npm install
npm start        # Metro dev server (press i / a, or scan with Expo Go)
npm run web      # run in the browser
```

## Scripts

- `npm start` — Expo dev server
- `npm run web` / `npm run ios` / `npm run android` — platform targets
- `npm run typecheck` — TypeScript check (`tsc --noEmit`)

## Structure

```
app/           Expo Router screens (7-tab navigator)
src/
  components/  Shared UI kit
  features/    Domain modules (today, tasks, garden, animals, pantry, finance, weather, settings)
  lib/         db / supabase / sync (placeholders) + utils
  types/       Shared domain types
  theme/       Design tokens (colors, spacing, typography, radius)
docs/          Documentation
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Tabs

Today · Tasks · Grow · Animals · Pantry · Money · Settings

The **Today** dashboard renders mock weather, stats, and tasks. Other modules
show clean empty states until their features are implemented.
