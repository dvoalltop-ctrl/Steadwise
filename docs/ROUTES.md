# Steadwise — UI Sitemap & Routes

**Router:** Expo Router (file-based)  
**Navigation:** Bottom tabs + nested stacks

---

## 1. Route Tree

```
app/
├── _layout.tsx                    # Root: providers, fonts, splash
├── index.tsx                      # Redirect → onboarding or (tabs)/today
│
├── (auth)/
│   ├── _layout.tsx                # Stack, no tabs
│   ├── sign-in.tsx
│   └── sign-up.tsx
│
├── onboarding/
│   ├── _layout.tsx                # Stack
│   ├── welcome.tsx                # Value props
│   ├── create-homestead.tsx       # Name, location
│   ├── select-types.tsx           # Garden, chickens, etc.
│   └── seed-templates.tsx         # Template picker
│
├── (tabs)/
│   ├── _layout.tsx                # Bottom tab navigator (6 tabs)
│   │
│   ├── today/
│   │   ├── _layout.tsx            # Stack
│   │   └── index.tsx              # Today dashboard
│   │
│   ├── tasks/
│   │   ├── _layout.tsx            # Stack
│   │   ├── index.tsx              # Task list (filters: today, overdue, all)
│   │   ├── [id].tsx               # Task detail
│   │   ├── new.tsx                # Create task
│   │   └── routines/
│   │       ├── index.tsx          # Routines list
│   │       └── [id].tsx           # Routine detail
│   │
│   ├── grow/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Garden overview (areas + active plantings)
│   │   ├── areas/
│   │   │   ├── index.tsx
│   │   │   ├── new.tsx
│   │   │   └── [id].tsx
│   │   ├── plantings/
│   │   │   ├── index.tsx
│   │   │   ├── new.tsx
│   │   │   └── [id].tsx
│   │   ├── varieties/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── harvests/
│   │   │   ├── index.tsx
│   │   │   └── new.tsx
│   │   └── seeds/
│   │       └── index.tsx
│   │
│   ├── animals/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Groups & species overview
│   │   ├── groups/
│   │   │   ├── new.tsx
│   │   │   └── [id].tsx           # Group detail + quick log
│   │   ├── individuals/
│   │   │   └── [id].tsx
│   │   └── log/
│   │       └── new.tsx            # Quick production/health log
│   │
│   ├── pantry/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Inventory by category
│   │   ├── items/
│   │   │   ├── new.tsx
│   │   │   └── [id].tsx
│   │   ├── batches/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── low-stock.tsx
│   │
│   └── money/
│       ├── _layout.tsx
│       ├── index.tsx              # Summary dashboard
│       ├── expenses/
│       │   ├── index.tsx
│       │   ├── new.tsx
│       │   └── [id].tsx
│       └── income/
│           ├── index.tsx
│           └── new.tsx
│
├── quick-add/
│   └── index.tsx                  # Modal: harvest, eggs, expense, task, note
│
├── notes/
│   ├── index.tsx
│   ├── new.tsx
│   └── [id].tsx
│
└── settings/
    ├── _layout.tsx
    ├── index.tsx                  # Profile, household, sync status
    ├── household.tsx
    ├── members.tsx
    ├── sync-diagnostics.tsx
    └── about.tsx
```

---

## 2. Tab Bar Configuration

| Tab | Route | Icon | Label |
|-----|-------|------|-------|
| 1 | `/(tabs)/today` | `sun` | Today |
| 2 | `/(tabs)/tasks` | `check-square` | Tasks |
| 3 | `/(tabs)/grow` | `sprout` | Grow |
| 4 | `/(tabs)/animals` | `bird` | Animals |
| 5 | `/(tabs)/pantry` | `archive` | Pantry |
| 6 | `/(tabs)/money` | `wallet` | Money |

**Header actions (global):**
- Settings gear → `/settings`
- Quick-add FAB → `/quick-add` (modal presentation)

---

## 3. Screen Inventory (MVP)

### Today (`/(tabs)/today`)
- Greeting + date
- Weather card (mock → NWS)
- Counters row: eggs today, harvest this week, low stock count
- Tasks due today (max 5, link to Tasks)
- Overdue section (if any)
- Quick actions grid
- Recent activity feed

### Tasks (`/(tabs)/tasks`)
- Segmented control: Today | Overdue | Upcoming | All
- Task row: checkbox, title, due, assignee chip, priority dot
- Swipe or tap to complete
- FAB → new task
- Empty state: "No tasks yet — add your first chore"

### Grow (`/(tabs)/grow`)
- Summary cards: active plantings, harvests this week
- Area list with planting count
- Quick links: Log harvest, Add planting
- Empty state: "Plan your first bed"

### Animals (`/(tabs)/animals`)
- Group cards with species icon
- Today's production summary (eggs, milk)
- Quick log button
- Empty state: "Add your first flock or herd"

### Pantry (`/(tabs)/pantry`)
- Category tabs: All | Pantry | Freezer | Canned | Dehydrated
- Low stock banner
- Item rows: name, qty, expiration warning
- Empty state: "Stock your pantry"

### Money (`/(tabs)/money`)
- Month selector
- Summary: income, expenses, net
- Recent transactions list
- FAB → add expense (primary), add income (secondary)
- Empty state: "Track your first expense"

---

## 4. Navigation Flows

### Auth gate (Phase D)
```
index → [no session] → (auth)/sign-in
index → [no homestead] → onboarding/welcome
index → [ready] → (tabs)/today
```

### Quick-add modal
```
Any tab → FAB → quick-add
  ├── Log harvest    → grow/harvests/new
  ├── Log eggs       → animals/log/new?type=production
  ├── Add expense    → money/expenses/new
  ├── Add task       → tasks/new
  └── Add note       → notes/new
```

### Onboarding
```
welcome → create-homestead → select-types → seed-templates → (tabs)/today
```

---

## 5. Deep Links (future)

| Path | Screen |
|------|--------|
| `steadwise://today` | Today dashboard |
| `steadwise://tasks/:id` | Task detail |
| `steadwise://grow/plantings/:id` | Planting detail |
| `steadwise://animals/groups/:id` | Animal group |
| `steadwise://pantry/items/:id` | Pantry item |
| `steadwise://invite/:token` | Accept household invite |

---

## 6. Modal vs Stack Conventions

| Pattern | Use |
|---------|-----|
| **Stack push** | Detail views, multi-step forms within a tab |
| **Modal** | Quick-add, one-shot forms, settings sub-flows |
| **Tab switch** | Cross-module navigation from Today quick actions |

---

## 7. Component Mapping

| Screen region | Components |
|---------------|------------|
| Screen wrapper | `Screen`, `SafeAreaView` |
| Section headers | `SectionHeader` |
| Lists | `FlashList` or `FlatList` + `ListItem` |
| Cards | `Card`, `StatCard`, `WeatherCard` |
| Forms | `FormField`, `DatePicker`, `Select` |
| Empty | `EmptyState` with illustration + CTA |
| Loading | `Skeleton` placeholders |
| FAB | `FloatingActionButton` |

---

## 8. Assumptions

- Tab bar uses `@expo/vector-icons` (Feather set) until custom icon set is designed
- Settings is not a tab; accessible from header to preserve 6 domain tabs
- `quick-add` is a modal route group at root level for global access
- Web export shows single-page "Download the app" placeholder
