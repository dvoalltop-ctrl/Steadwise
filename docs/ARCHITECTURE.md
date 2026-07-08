# Architecture

Steadwise is an offline-first homesteading manager built with Expo, React Native,
and TypeScript. This document describes the foundation structure.

## Layout

```
app/                      Expo Router routes (file-based navigation)
  _layout.tsx             Root stack + SafeAreaProvider
  index.tsx               Redirects to the Today tab
  +not-found.tsx          Fallback route
  (tabs)/                 Bottom tab navigator
    _layout.tsx           Tab bar definition (7 tabs)
    today | tasks | grow | animals | pantry | money | settings

src/
  components/             Shared UI kit (Screen, Card, EmptyState, ...)
  features/               Domain modules, one folder per area
    today/ weather/ tasks/ garden/ animals/ pantry/ finance/ settings/
  lib/
    db/                   Local storage layer (placeholder)
    supabase/             Remote backend + auth (placeholder)
    sync/                 Offline sync queue (placeholder)
    utils/                Small pure helpers (dates, ids)
  types/                  Shared domain types
  theme/                  Design tokens (colors, spacing, typography, radius)

docs/                     Project documentation
```

## Principles

- **Feature-first modules.** Each domain area owns its screens, components, and
  mock data under `src/features/<area>`. Route files in `app/` are thin wrappers
  that re-export a feature screen.
- **Offline-first, later.** `src/lib/{db,supabase,sync}` are intentional
  placeholders. The current phase runs entirely on mock data — no real database
  or network logic is wired yet.
- **Design tokens over hardcoded values.** Import from `@/theme` (`colors`,
  `spacing`, `typography`, `radius`) instead of literals.
- **Small, focused files.** Components and screens stay short and readable.

## Path alias

`@/*` maps to `src/*` (see `tsconfig.json`), so imports read as `@/components`,
`@/features/...`, `@/theme`, etc.

## Navigation

The app uses `expo-router` file-based routing. The primary surface is a
seven-tab bottom navigator: **Today, Tasks, Grow, Animals, Pantry, Money,
Settings**. Today shows a live-feeling dashboard from mock data; the remaining
modules render clean empty states until their features land.
