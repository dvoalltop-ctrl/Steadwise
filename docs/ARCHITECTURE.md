# Steadwise — Technical Architecture

**Version:** 0.1  
**Stack:** Expo · React Native · TypeScript · Expo SQLite · Supabase

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Steadwise Mobile App                     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Expo Router │   UI Layer   │ Feature Mods │  Design Tokens │
├──────────────┴──────────────┴──────────────┴────────────────┤
│              TanStack Query (persisted cache)                │
├─────────────────────────────────────────────────────────────┤
│         Repository Layer (domain data access)                │
├──────────────────────┬──────────────────────────────────────┤
│   Local SQLite DB    │         Sync Engine                  │
│   (source of truth   │  mutation queue · pull · conflict   │
│    for active sess)  │  last-write-wins · inventory merge   │
├──────────────────────┴──────────────────────────────────────┤
│              Supabase (Auth · Postgres · Storage)            │
└─────────────────────────────────────────────────────────────┘
```

**Principle:** Writes always land locally first. Network is an enhancement, not a requirement.

---

## 2. Layer Responsibilities

### 2.1 Presentation (`app/`, `src/components/`, `src/features/*/screens`)

- Expo Router file-based navigation
- Screen components consume hooks from feature modules
- Shared UI primitives in `src/components/ui`
- No direct SQL or Supabase calls from screens

### 2.2 Feature modules (`src/features/<name>/`)

Each module owns:

- `types.ts` — domain types + Zod schemas
- `hooks/` — TanStack Query hooks
- `repository.ts` — local data access (implements shared interfaces)
- `components/` — feature-specific UI
- `utils/` — recurrence, calculations, formatters

Modules: `onboarding`, `today`, `tasks`, `garden`, `animals`, `pantry`, `finance`, `notes`, `settings`, `auth`, `sync`

### 2.3 Data layer (`src/db/`, `src/lib/repositories/`)

- **Migrations:** versioned SQL in `src/db/migrations/`
- **Database client:** Expo SQLite wrapper with optional SQLCipher
- **Base repository:** CRUD, soft delete, sync metadata helpers
- **Sync queue table:** pending mutations with payload JSON

### 2.4 Sync engine (`src/sync/`)

| Component | Role |
|-----------|------|
| `SyncQueue` | Enqueue local mutations |
| `SyncWorker` | Process queue when online |
| `PullService` | Incremental fetch by `updated_at` |
| `ConflictResolver` | Per-entity strategy |
| `SyncStateStore` | Zustand slice for UI indicator |

**Conflict policies:**

| Entity | Strategy |
|--------|----------|
| Tasks, notes, expenses | Last write wins (`updated_at`) |
| Inventory transactions | Append-only merge; recompute balance |
| Attachments | Server wins on duplicate ID |
| Household settings | Owner role wins |

### 2.5 Backend (`supabase/`)

- Postgres schema mirrors local (see SCHEMA.md)
- RLS: `household_id` membership check on all tables
- Storage buckets: `attachments`, `avatars`
- Edge functions (later): weather proxy, export jobs

---

## 3. Folder Structure

```
steadwise/
├── app/                      # Expo Router routes
│   ├── (tabs)/               # Main tab navigator
│   ├── (auth)/               # Sign in/up
│   ├── onboarding/           # First-run flow
│   └── _layout.tsx
├── src/
│   ├── components/
│   │   ├── ui/               # Button, Card, Input, FAB, etc.
│   │   └── layout/           # Screen, Header, TabBar
│   ├── features/             # Domain modules
│   ├── db/
│   │   ├── client.ts
│   │   ├── migrations/
│   │   └── seed/
│   ├── sync/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── query-client.ts
│   │   └── weather/
│   ├── theme/
│   ├── types/
│   ├── mocks/
│   └── hooks/
├── supabase/
│   └── migrations/
├── docs/
└── __tests__/
```

---

## 4. Key Technologies

| Concern | Choice |
|---------|--------|
| Framework | Expo SDK 52+, React Native |
| Navigation | Expo Router (file-based) |
| Local DB | expo-sqlite (+ SQLCipher when available) |
| Server state | TanStack Query v5 + persist |
| Local UI state | Zustand (minimal: sync, onboarding) |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth |
| Backend | Supabase Postgres + RLS |
| Secrets | expo-secure-store |
| Styling | StyleSheet + theme tokens (NativeWind-ready) |
| Tests | Vitest + React Native Testing Library |

---

## 5. Data Flow

### 5.1 Read path

```
Screen → useQuery hook → Repository → SQLite → map to domain type → UI
```

TanStack Query caches by entity key. Persist plugin writes cache to AsyncStorage for fast cold start (metadata only; entity data from SQLite).

### 5.2 Write path

```
Form → Zod validate → Repository.insert/update → SQLite
     → SyncQueue.enqueue → invalidate queries → UI update
```

### 5.3 Sync path (online)

```
SyncWorker:
  1. Push pending mutations (FIFO per household)
  2. Pull records where server.updated_at > last_pull
  3. Upsert into SQLite; resolve conflicts
  4. Mark queue items complete / failed
  5. Update SyncStateStore
```

---

## 6. Authentication & Household Model

- User authenticates via Supabase Auth
- `households` + `memberships` tie users to shared data
- All domain tables include `household_id`
- RLS policy pattern:

```sql
household_id IN (
  SELECT household_id FROM memberships
  WHERE user_id = auth.uid() AND deleted_at IS NULL
)
```

**Phase A–C:** Single mock household in app state.  
**Phase D:** Real auth + membership sync.

---

## 7. Integration Interfaces

### 7.1 Weather (`src/lib/weather/`)

```typescript
interface WeatherProvider {
  getCurrent(location: GeoLocation): Promise<WeatherSnapshot>;
  getForecast(location: GeoLocation, days: number): Promise<WeatherForecast[]>;
}
```

MVP: `NWSWeatherProvider` (US). Fallback: cached last snapshot.

### 7.2 Calendar (future)

```typescript
interface CalendarAdapter {
  exportTasks(tasks: Task[]): Promise<void>;
  importEvents(range: DateRange): Promise<ExternalEvent[]>;
}
```

### 7.3 Plant intelligence (future)

```typescript
interface PlantIdentificationProvider {
  identify(imageUri: string): Promise<PlantSuggestion[]>;
}
```

### 7.4 AI assistant (future, feature-flagged)

```typescript
interface HomesteadAIProvider {
  summarizeLogs(context: AIContext): Promise<string>;
  suggestWeeklyPlan(householdId: string): Promise<TaskDraft[]>;
}
```

No implementation in v0.1; `FeatureFlags.aiAssistant = false`.

---

## 8. Offline & Security

| Item | Approach |
|------|----------|
| Local encryption | SQLCipher via expo-sqlite plugin when build supports; else OS-level device encryption + documented risk |
| Tokens | SecureStore only; never in SQLite |
| Sync payload | HTTPS; RLS on server |
| Soft delete | `deleted_at` synced; tombstones prevent resurrection |
| Audit | `created_by`, `created_at`, `updated_at` on all records |

---

## 9. Testing Strategy

| Area | Tests |
|------|-------|
| Task recurrence | Unit: RRULE-like expansion in `tasks/utils/recurrence.ts` |
| Inventory math | Unit: transaction balance computation |
| Sync queue | Unit: enqueue, retry, ordering |
| Permissions | Unit: household access helpers |
| Critical flows | RNTL: Today dashboard, task complete |

---

## 10. Web Strategy (future)

- Shared types in `src/types/` consumable by a future Next.js app
- Supabase client isomorphic
- No Expo Router on web in v0.1; if `expo export:web` is enabled, show read-only placeholder

---

## 11. Deployment

| Target | Method |
|--------|--------|
| iOS / Android | EAS Build |
| Supabase | CLI migrations + dashboard |
| Env vars | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` |

---

## 12. Phase Mapping

| Phase | Deliverables |
|-------|--------------|
| **A** | Scaffold, navigation, tokens, UI kit, mocks, empty states |
| **B** | SQLite schema, repositories, tasks, today dashboard |
| **C** | Garden, animals, pantry, finance modules |
| **D** | Auth, household, sync engine, Supabase wiring |
| **E** | Polish, tests, seeds, templates, export |
