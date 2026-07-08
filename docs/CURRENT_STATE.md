# Steadwise — Current State Audit

**Audit date:** July 8, 2026  
**Branch audited:** `main` (`aac8f1ed`)  
**Scope:** Read-only inspection of file structure, dependencies, navigation, styling, database, docs, and tooling. No feature work.

---

## Executive summary

Steadwise is an **early-stage Expo / React Native homestead manager** with a solid architectural direction, good documentation, working unit tests, and a navigable shell across six domain tabs. The repo is **not greenfield** — it has meaningful scaffolding through Phase C/D — but it is **not production-ready** and has several repository hygiene issues that should be fixed before serious mobile development.

**Expo mobile readiness:** **Partially ready.** The core Expo Router app, SQLite layer, repositories, and sync engine skeleton can run in development, but missing assets, committed `node_modules`, incomplete screens vs. docs, and unused dependencies mean the repo needs cleanup before EAS builds or team onboarding.

---

## File structure (high level)

```
steadwise/
├── app/                    # 25 route files — Expo Router screens
│   ├── (auth)/             # sign-in, sign-up
│   ├── (tabs)/             # today, tasks, grow, animals, pantry, money
│   ├── onboarding/         # 4-step first-run flow
│   ├── settings/           # settings + sync diagnostics
│   └── quick-add/          # modal stub
├── src/
│   ├── components/         # ui/ (11 components) + layout/Screen
│   ├── features/           # tasks, garden, animals, pantry, finance repos + TaskForm
│   ├── db/                 # SQLite client, 2 migrations, seed
│   ├── sync/               # queue, worker, conflict resolver, state
│   ├── lib/                # supabase, query-client, permissions, weather stub
│   ├── providers/          # auth-provider, data-provider
│   ├── stores/             # app-store (Zustand + AsyncStorage persist)
│   ├── theme/              # design tokens
│   ├── types/              # domain TypeScript types
│   └── mocks/              # demo data for all domains
├── supabase/migrations/    # 1 Postgres migration (RLS-oriented)
├── docs/                   # PRD, ARCHITECTURE, SCHEMA, ROADMAP, ROUTES (+ this file)
├── __tests__/              # 5 Vitest test files (22 tests)
├── app.json                # Expo config (references missing assets/)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

**Notable absences:** `assets/`, `.gitignore`, `eas.json`, `eslint`/`prettier` config, `expo-env.d.ts`, CI workflow, and most nested routes described in `docs/ROUTES.md` (grow/areas, animals/groups, money/expenses, notes/, etc.).

---

## Stack currently installed

| Layer | Technology | Version / notes |
|-------|------------|-----------------|
| Framework | Expo | ~57.0.4 |
| UI runtime | React / React Native | 19.2.3 / 0.86.0 |
| Navigation | Expo Router | ~57.0.4 (file-based, typed routes experiment enabled) |
| Local database | expo-sqlite | ~16.0.4, migrations in `src/db/migrations/` |
| Remote backend | Supabase (`@supabase/supabase-js`) | ^2.110.1 — optional via env vars |
| Server-state cache | TanStack Query | ^5.90.2 — **provider wired, hooks not used** |
| Client state | Zustand | ^5.0.5 — auth store, app store, sync store |
| Forms / validation | react-hook-form + zod + @hookform/resolvers | Present; used in `TaskForm` |
| Auth storage | expo-secure-store | Session persistence on native |
| App persistence | @react-native-async-storage/async-storage | Onboarding + data-source toggle |
| Icons | @expo/vector-icons (Feather) | Tab bar + UI |
| Animation | react-native-reanimated + worklets | Installed, minimal visible usage |
| UUID | uuid | Client-generated record IDs |
| Testing | Vitest + @testing-library/react-native | Vitest used; RNTL not exercised in tests |
| Language | TypeScript | ~6.0.3, strict mode |

**Scripts:** `start`, `android`, `ios`, `web`, `test`, `test:watch`, `typecheck`.

---

## Navigation setup

**Root stack** (`app/_layout.tsx`): wraps `QueryClientProvider` → `AuthProvider` → `DataProvider`, then a `Stack` with:

- `index` — auth/onboarding gate
- `(auth)` — sign-in / sign-up
- `(tabs)` — main app
- `onboarding` — first-run wizard
- `quick-add/index` — modal
- `settings` — nested stack

**Entry routing** (`app/index.tsx`):

1. Wait for auth init
2. Unauthenticated → `/(auth)/sign-in`
3. Onboarding incomplete → `/onboarding/welcome`
4. Ready → `/(tabs)/today`

**Tab navigator** (`app/(tabs)/_layout.tsx`): six tabs — Today, Tasks, Grow, Animals, Pantry, Money — with a settings gear in the header. Tasks has its own nested stack (`index`, `[id]`, `new`).

**Implemented vs. documented:** `docs/ROUTES.md` describes ~60+ screens including deep nested stacks for garden, animals, pantry, finance, notes, and settings sub-pages. **Only ~25 route files exist.** Most domain modules are single list/overview screens with empty states.

**Auth behavior:** When Supabase env vars are absent, `isDemoMode` is true and `isAuthenticated` is always true after init — users can skip sign-in via "Continue offline."

---

## Styling approach

- **Pattern:** React Native `StyleSheet.create()` per screen/component.
- **Design system:** Centralized tokens in `src/theme/tokens.ts` — colors (sage/clay/wheat rustic palette), spacing, radius, typography, shadows.
- **Components:** Shared UI kit in `src/components/ui/` — `Button`, `Card`, `Badge`, `EmptyState`, `FAB`, `ListItem`, `SectionHeader`, `StatCard`, `TaskRow`, `WeatherCard`.
- **Layout:** `src/components/layout/Screen.tsx` wrapper.
- **Not used:** NativeWind/Tailwind, styled-components, or a global theme provider component.
- **Docs mention:** NativeWind-ready styling and `FlashList` — neither is installed.

Icons use Feather via `@expo/vector-icons`. Tab icons differ slightly from `ROUTES.md` (e.g. Animals uses `github` instead of documented `bird`).

---

## Database setup

### Local (SQLite)

- **Client:** `src/db/client.ts` — singleton `expo-sqlite` database `steadwise.db`.
- **Migrations:** Versioned via `schema_migrations` table.
  - `001_initial.ts` — core tables: households, tasks, routines, garden, animals, pantry, finance, sync_queue, sync_state, etc.
  - `002_auth_categories.ts` — expense/income categories + seed from mocks.
- **Seed:** `src/db/seed/index.ts` runs on first migration; populates demo household data.
- **Repositories:** Per-domain classes in `src/features/*/repository.ts` with CRUD, soft delete metadata, and sync enqueue via `sync-helper`.
- **Default data source:** App store defaults `useLocalDb: false` (mock mode). User must toggle "Local DB" in Settings.

### Remote (Supabase)

- **Config:** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env.example` (no `.env` committed).
- **Migration:** `supabase/migrations/20260708120000_initial_schema.sql` — Postgres tables mirroring local schema with RLS helper `user_household_ids()`.
- **Sync engine:** `src/sync/` — queue, worker (push/pull), conflict resolver, Zustand sync state. Push/pull run when Supabase is configured and user triggers sync or completes tasks in local DB mode.
- **Not verified in audit:** Whether migration has been applied to a live Supabase project, or end-to-end sync against a real backend.

### Schema quirks

- `households` table includes a redundant `household_id` column (mirrored in both SQLite and Postgres migrations).
- Local-only sync metadata columns (`local_sync_status`, `last_synced_at`) exist on server tables too — unusual for Postgres.

---

## Existing documentation

| Document | Purpose | Alignment with code |
|----------|---------|---------------------|
| `README.md` | Quick start, phases A–E status | Mostly accurate; phase D marked in-progress |
| `docs/PRD.md` | Product requirements, MVP scope | Aspirational; many MVP screens not built |
| `docs/ARCHITECTURE.md` | Layers, sync, tech choices | Ahead of implementation (TanStack Query hooks, SQLCipher, RNTL tests) |
| `docs/SCHEMA.md` | Full relational schema | Local schema largely matches; many tables unused by UI |
| `docs/ROADMAP.md` | Phased delivery plan | Phase A marked current; code has progressed to B/C/D |
| `docs/ROUTES.md` | Full sitemap | **Significantly ahead** of implemented routes |

Documentation quality is **high** for a project at this stage, but docs and README phase markers are **stale** relative to `main`.

---

## What is working

| Area | Status |
|------|--------|
| TypeScript | `npm run typecheck` passes |
| Unit tests | 22/22 tests pass (recurrence, inventory, sync queue, conflict resolver, permissions) |
| Expo Router shell | Root auth gate, tabs, onboarding stack, settings, task stack |
| UI kit | Reusable components with consistent tokens |
| Mock data layer | Full demo dataset for all domains |
| Local SQLite | Migrations, seed, repositories for tasks/garden/animals/pantry/finance |
| Task flows | List, detail, create (`TaskForm` + Zod), complete |
| Today dashboard | Weather card (mock), stats, overdue/due today, activity feed |
| Onboarding UI | 4 screens (welcome → homestead → types → templates) |
| Auth UI | Sign-in/sign-up with demo-mode bypass |
| Sync skeleton | Queue enqueue on writes, worker push/pull logic, diagnostics screen |
| Offline-first intent | Writes go to SQLite when Local DB mode is on |

---

## What is missing

| Category | Gap |
|----------|-----|
| **Assets** | `app.json` references `./assets/images/*` — **no `assets/` directory exists** |
| **Repo hygiene** | No `.gitignore`; **`node_modules/` committed** (~38,500 tracked files) |
| **Build / deploy** | No `eas.json`, no CI, no app store signing setup |
| **Screens** | Most CRUD/detail routes from ROUTES.md (garden areas, animal groups, pantry items, expenses, notes, routines) |
| **TanStack Query** | Installed and provided at root, but **zero `useQuery`/`useMutation` usage** — `DataProvider` uses manual `useState` |
| **Query persistence** | `@tanstack/react-query-persist-client` installed but unused |
| **Weather** | `NWSWeatherProvider` is a stub that throws |
| **Real auth flow** | No household creation tied to Supabase; hardcoded `DEMO_HOUSEHOLD_ID` |
| **Multi-user** | Membership UI marked "Coming soon" |
| **Forms beyond tasks** | No create/edit flows for garden, animals, pantry, finance |
| **Quick-add** | Modal exists but actions are stubs |
| **Linting / formatting** | No ESLint or Prettier |
| **Screen tests** | RNTL installed but no component/integration tests |
| **SQLCipher** | Documented but not implemented |
| **E2E / Maestro / Detox** | None |

---

## What is risky or messy

1. **Committed `node_modules`** — Bloated repo, merge conflicts, security audit noise, slow clones. Should be removed and gitignored immediately.

2. **Missing assets** — Expo will fail or warn on icon/splash resolution; blocks EAS builds and store submission.

3. **Documentation drift** — ROUTES.md, ROADMAP.md, and ARCHITECTURE.md describe systems (TanStack Query data layer, FlashList, full module CRUD) that are not implemented. New contributors will follow outdated plans.

4. **Dual data paths without guards** — `useLocalDb` defaults to mock; task creation (`tasks/new.tsx`) **always writes to SQLite** regardless of toggle. Easy source of confusion and bugs.

5. **Demo auth bypass** — Without Supabase, everyone is "authenticated." Fine for dev, but auth gate logic is effectively disabled in default setup.

6. **Monolithic `DataProvider`** — Single context loads all domain data into memory on every refresh. Will not scale; contradicts modular feature architecture in docs.

7. **Supabase schema oddities** — `households.household_id` column and client sync metadata on server tables may cause sync/RLS issues.

8. **Version inconsistencies** — `package.json` / `app.json` say `0.1.0`; Settings screen shows `v0.2.0`.

9. **Settings sync button logic** — "Sync now" shown when `isDemoMode` (inverted from expected: sync only works when Supabase *is* configured).

10. **No environment file** — Developers must manually create `.env.local` from `.env.example`; no validation at startup beyond `isSupabaseConfigured`.

11. **React 19 / RN 0.86 / Expo 57** — Bleeding-edge stack; `legacy-peer-deps=true` in `.npmrc` signals dependency tension.

---

## Recommended next 10 development steps

1. **Fix repository hygiene** — Add `.gitignore`, remove `node_modules` from git history, add `assets/` with icon/splash/favicon placeholders matching `app.json`.

2. **Align docs with reality** — Update README phase table, ROUTES.md (mark implemented vs. planned), and ARCHITECTURE.md (note DataProvider vs. TanStack Query status).

3. **Resolve data-source consistency** — Gate all writes behind `useLocalDb` or default to local DB; add in-memory mock writes when in mock mode.

4. **Add `eas.json` and verify `expo start`** — Confirm iOS/Android simulators boot without asset errors; document env setup.

5. **Complete task module as reference implementation** — Edit task, delete task, filters (today/overdue/all), wire sync on create/update — use as pattern for other domains.

6. **Implement one full domain CRUD vertical** — e.g. Pantry: list → item detail → new/edit → SQLite → sync queue. Proves the architecture end-to-end.

7. **Wire TanStack Query properly** — Replace `DataProvider` bulk state with per-feature `useQuery`/`useMutation` hooks; remove or use `react-query-persist-client`.

8. **Connect Supabase for real** — Apply migration, fix `households` schema, create household on onboarding, test push/pull against a dev project.

9. **Add ESLint + Prettier + CI** — `npm run typecheck` + `npm test` on PR; catch regressions early.

10. **Implement quick-add and Today actions** — Connect FAB/modal to real create flows; highest user-visible value for MVP.

---

## Package recommendations

### Consider adding

| Package | Reason |
|---------|--------|
| `@shopify/flash-list` | Documented list performance choice; better than FlatList at scale |
| `eslint` + `eslint-config-expo` + `prettier` | Code quality and CI |
| `expo-dev-client` | Needed for custom native modules beyond Expo Go |
| `@tanstack/eslint-plugin-query` | If adopting Query hooks widely |
| `date-fns` or `dayjs` | Date handling for tasks/recurrence (if not using built-ins) |
| `expo-image-picker` | Documented animal photo attachments |
| `jest-expo` or keep Vitest + add RNTL test setup | Screen-level tests |

### Consider removing (if unused after audit)

| Package | Reason |
|---------|--------|
| `@tanstack/react-query-persist-client` | Not imported anywhere |
| `@testing-library/react-native` | Installed but no tests use it — remove or start using |
| `react-dom` / `react-native-web` | Only needed if web target is active; docs say web is future/placeholder |

### Keep (core to current architecture)

`expo`, `expo-router`, `expo-sqlite`, `@supabase/supabase-js`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `uuid`, `expo-secure-store`, `@react-native-async-storage/async-storage`.

### Defer

**NativeWind** — docs say "ready" but adding it now is a styling migration; finish functional MVP first unless design velocity requires it.

---

## Expo mobile development readiness

| Criterion | Ready? | Notes |
|-----------|--------|-------|
| Expo project structure | ✅ | Standard `app/` + `src/` layout |
| Expo Router navigation | ✅ | Tabs, stacks, modals configured |
| `package.json` scripts | ✅ | `start`, `ios`, `android` present |
| TypeScript | ✅ | Strict, passes typecheck |
| Native modules | ⚠️ | expo-sqlite, secure-store, reanimated — need Expo Go or dev client |
| Assets / branding | ❌ | Missing `assets/` directory |
| Git / clone experience | ❌ | Committed `node_modules` |
| EAS Build config | ❌ | No `eas.json` |
| Offline SQLite | ✅ | Works in local DB mode |
| Store-ready auth | ⚠️ | UI exists; backend optional |
| Feature completeness | ⚠️ | Shell + tasks strong; other modules read-only lists |
| Test coverage | ⚠️ | Good unit tests; no device/E2E tests |

### Verdict

**Yes, with cleanup** — the repo is a legitimate Expo mobile foundation and can be developed in Expo Go / simulators after fixing assets and `node_modules`. It is **not ready** for team onboarding, EAS production builds, or App Store submission without the hygiene and asset fixes above.

**Suggested pre-flight checklist before mobile dev sprint:**

```bash
npm install          # after node_modules removed from git
cp .env.example .env.local   # optional Supabase
npm run typecheck
npm test
npx expo start
```

Toggle **Settings → Local DB** to exercise SQLite instead of mocks.

---

## Audit methodology

- Inspected `main` at `aac8f1ed` (Phase C/D merge)
- Read `package.json`, `app.json`, `tsconfig.json`, navigation layouts, providers, db client, sync worker, theme, and all docs
- Enumerated `app/**/*.tsx` routes vs. `docs/ROUTES.md`
- Ran `npm test` (22 passed) and `npm run typecheck` (passed)
- Did not run `expo start` on device/simulator in this audit
- Did not connect to a live Supabase instance

---

*This document reflects repository state at audit time. Update it when major structural or stack changes land.*
