# Steadwise — Feature Roadmap

**Horizon:** MVP → v1.0 → v1.x  
**Last updated:** July 2026

---

## Phase A — Shell & Design System ✅ (current)

**Goal:** Usable app skeleton with mock data and polished empty states.

| Item | Status |
|------|--------|
| Expo + TypeScript scaffold | 🟢 |
| Expo Router tab navigation | 🟢 |
| Design tokens (colors, typography, spacing) | 🟢 |
| Shared UI components (Button, Card, FAB, EmptyState) | 🟢 |
| Mock data layer | 🟢 |
| Today dashboard (mock) | 🟢 |
| Module list screens with empty states | 🟢 |
| Onboarding flow (UI only) | 🟢 |

**Exit criteria:** App runs on iOS/Android simulators; all tabs navigable; mock Today shows realistic data.

---

## Phase B — Local Data & Core Modules

**Goal:** SQLite as source of truth; Tasks and Today wired to real local DB.

| Item | Priority |
|------|----------|
| SQLite migrations (full schema) | P0 |
| Database client + base repository | P0 |
| Seed scripts (demo templates) | P0 |
| Task CRUD + recurrence expansion | P0 |
| Task completion + task_logs | P0 |
| Today dashboard queries | P0 |
| TanStack Query integration | P0 |
| Sync queue table (enqueue only) | P1 |
| Unit tests: recurrence, sync queue | P0 |

**Exit criteria:** Tasks persist across app restarts; Today reflects real task data; no network required.

---

## Phase C — Domain Modules

**Goal:** Garden, Animals, Pantry, Finance fully functional offline.

### Garden
- Areas & beds CRUD
- Varieties & seed inventory
- Plantings with succession groups
- Harvest logging
- Rotation history view

### Animals
- Groups & individuals
- Production log (eggs quick-entry)
- Health & feeding logs
- Photo attachments (local)

### Pantry
- Item CRUD with locations
- Inventory transactions
- Low stock alerts on Today
- Preserved batch records
- Harvest → batch → pantry linkage

### Finance
- Expense/income entry
- Categories & enterprise tags
- Monthly summary cards
- Simple charts (optional)

| Item | Priority |
|------|----------|
| Garden module | P0 |
| Animals module | P0 |
| Pantry + inventory math | P0 |
| Finance module | P1 |
| Notes & attachments | P1 |
| Unit tests: inventory math | P0 |

**Exit criteria:** All six tabs operate on local DB; demo templates seed full household.

---

## Phase D — Auth, Household & Sync

**Goal:** Multi-device sync with secure household sharing.

| Item | Priority |
|------|----------|
| Supabase project + migrations | P0 |
| Auth screens (email + magic link) | P0 |
| SecureStore token management | P0 |
| Household create/join | P0 |
| Membership roles | P0 |
| RLS policies | P0 |
| Sync worker (push/pull) | P0 |
| Conflict resolution | P0 |
| Sync status UI in settings | P0 |
| Attachment upload to Storage | P1 |
| Unit tests: permissions | P0 |

**Exit criteria:** Two devices sync tasks and pantry; RLS prevents cross-household access.

---

## Phase E — Polish & Launch Prep

| Item | Priority |
|------|----------|
| NWS weather integration | P1 |
| Push notifications for reminders | P2 |
| Onboarding template picker (live seeds) | P0 |
| Export (CSV) | P1 |
| E2E smoke tests | P1 |
| App Store / Play Store assets | P1 |
| Performance profiling | P2 |
| Accessibility pass | P1 |
| SQLCipher enablement | P2 |

---

## Post-MVP (v1.x)

| Feature | Notes |
|---------|-------|
| Web dashboard (read-heavy) | Shared types; Next.js |
| Google Calendar sync | Adapter interface |
| Plant.id / Trefle | Identification & reference data |
| Offline maps | Property & area mapping |
| AI assistant (opt-in) | Summaries, weekly plans, Q&A on own data |
| Barcode scanning | Pantry intake |
| Local-only mode | No cloud; export/import |
| Viewer role enforcement | Read-only household members |
| Multi-property support | Enterprise growers |
| Market / sales tracking | CSA, farmers market |

---

## Demo Templates (seed data)

| Template | Contents |
|----------|----------|
| **Beginner Backyard Garden** | 4 beds, 8 plantings, 3 varieties, 2 harvests |
| **Laying Hen Flock** | 1 group (6 hens), 7 days egg logs |
| **Pantry Starter** | 12 items across pantry/freezer/canned |
| **Weekly Chore Routines** | 5 recurring tasks (feed, water, collect eggs, etc.) |

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| SQLCipher build complexity | Ship unencrypted local first; encrypt at rest via OS |
| Sync conflicts confuse users | Clear sync diagnostics; conservative LWW |
| 6 tabs crowded on small phones | Scrollable tab bar; consider "More" tab later |
| Scope creep on finance | Keep v1 to entry + summaries only |
| Weather API rate limits | Cache snapshots; manual location entry |

---

## Milestone Summary

```
Phase A ──► Phase B ──► Phase C ──► Phase D ──► Phase E ──► Launch
  Shell      Local DB     Modules      Sync       Polish
  (week 1)   (week 2)     (week 3-4)   (week 5)   (week 6)
```

*Timeline is indicative for planning only; actual delivery is phase-gated on exit criteria.*
