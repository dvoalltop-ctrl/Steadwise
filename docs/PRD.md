# Steadwise — Product Requirements Document (MVP)

**Tagline:** Run your homestead with confidence.

**Version:** 0.1 (MVP)  
**Last updated:** July 2026

---

## 1. Summary

Steadwise is a mobile-first homestead operating system for small-scale and hobby homesteaders. It helps households plan daily work, log what happened, and understand crops, animals, pantry inventory, and basic finances — even with poor connectivity.

This is **not** enterprise farm ERP or a content-first education platform. It is a calm, practical tool for real homestead life.

---

## 2. Target Users

| Segment | Needs |
|---------|-------|
| Backyard / hobby homesteaders | Simple daily guidance, low setup friction |
| Families & couples | Shared tasks, household context |
| Newcomers | Seasonal overwhelm relief, templates |
| Small diversified growers | Garden + animals + pantry + light sales |

---

## 3. Jobs to Be Done

1. **Tell me what I need to do today** — tasks, routines, seasonal checklists, overdue items.
2. **Let me quickly record what happened** — harvests, eggs, feeding, expenses, notes.
3. **Show me what needs attention** — producing crops, animal health, low pantry stock.
4. **Tell me what I have stored** — pantry, freezer, canned, dehydrated inventory.
5. **Help me understand costs and outputs** — simple income/expense views by category and enterprise.
6. **Work offline** — core logs and CRUD without network dependency.

---

## 4. Non-Negotiable Rules

- Mobile-first (iOS & Android via Expo)
- Offline-first for all core workflows
- Fast, low-friction data entry
- Calm rustic-modern visual design
- Minimal cognitive load; clear IA
- Multi-user household in data model from day one
- AI is optional enhancement only — never required for basic use

---

## 5. MVP Scope

### In scope (v0.1)

| Module | MVP capabilities |
|--------|------------------|
| **Onboarding** | Welcome, create homestead, select types, seed templates |
| **Today** | Due/overdue tasks, weather snapshot, quick actions, recent logs, counters |
| **Tasks** | One-off, recurring, seasonal checklists, assignee, priority, reminders, completion log |
| **Garden** | Areas/beds, plantings, varieties, seed inventory, harvest logs, notes/photos, rotation history |
| **Animals** | Species, groups/individuals, health/feeding/production logs, breeding notes, photos |
| **Pantry** | Inventory by location, quantities/units, expiration, low stock, batch records, harvest linkage |
| **Finance** | Expense/income entry, categories, enterprise tags, summary cards, monthly view |
| **Notes** | Rich text notes, photo attachments, searchable activity |

### Out of scope (v0.1)

- Full web dashboard
- Enterprise ERP features (payroll, compliance, multi-farm)
- Required AI / LLM features
- Google Calendar sync (interface only)
- Plant.id / Trefle integrations (hooks only)
- Local-only mode (architecture prepared, not shipped)
- Advanced conflict merge beyond documented strategies

---

## 6. User Flows

### 6.1 First launch

1. Welcome → value props
2. Sign up / sign in (Phase D; mock/local in early phases)
3. Create homestead (name, location optional)
4. Select homestead types (garden, chickens, goats, pantry, etc.)
5. Offer template seed (Beginner Garden, Laying Hens, Pantry Starter, Weekly Chores)
6. Land on **Today** dashboard

### 6.2 Daily use

1. Open app → **Today** shows priorities
2. Complete tasks via swipe/tap
3. Quick-log harvest, eggs, expense from FAB or quick actions
4. Drill into Grow / Animals / Pantry / Money as needed
5. Sync indicator in settings when online

### 6.3 Offline use

1. All reads/writes go to local SQLite
2. Mutations queued with `local_sync_status = pending`
3. On reconnect, sync engine pushes queue; pulls server changes
4. User sees sync state; conflicts resolved per record type policy

---

## 7. Information Architecture

**Bottom tabs:** Today · Tasks · Grow · Animals · Pantry · Money

Nested stacks per tab for detail screens (planting detail, animal log, expense form, etc.). Settings and onboarding live outside tabs.

---

## 8. Design Principles

- **Rustic-modern:** warm earth tones, clean typography, generous whitespace
- **Thumb-friendly:** primary actions within easy reach; compact forms
- **Calm:** no alarmist UI; gentle reminders for overdue items
- **Beginner-friendly:** excellent empty states with actionable copy
- **Fast add:** FAB + quick-action sheet on Today

**Assumption:** NativeWind (Tailwind for RN) for styling velocity; design tokens centralized for future theming.

---

## 9. Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Time to first log | < 2 min after onboarding |
| Offline write success | 100% for core CRUD |
| Task completion flow | ≤ 3 taps from Today |
| Crash-free sessions | > 99% |
| Sync success rate | > 95% when online |

---

## 10. Security & Privacy

- Supabase Auth + RLS per household
- Tokens in Expo SecureStore
- SQLCipher for encrypted local DB (when feasible)
- Financial and household data private by default
- Explicit roles: owner, admin, member, viewer (viewer in roadmap)

---

## 11. Assumptions & Tradeoffs

| Decision | Rationale |
|----------|-----------|
| Local DB as session source of truth | True offline-first; sync is eventual |
| Last-write-wins default | Founder speed; merge only where documented (inventory transactions) |
| 6 bottom tabs | Matches mental model; may collapse on small phones via scroll |
| US-first weather (NWS) | Primary user base; provider abstraction for future |
| Mock → local DB → sync phasing | Ship usable UI fast; reduce integration risk |

---

## 12. Open Questions (post-MVP)

- Push notification provider (Expo Notifications vs. custom)
- Barcode scanning for pantry items
- Export format (CSV vs. PDF reports)
- Paid tier boundaries (household size, sync history)
