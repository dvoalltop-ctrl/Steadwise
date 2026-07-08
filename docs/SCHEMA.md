# Steadwise — Relational Schema

**Version:** 0.1  
**Applies to:** Local SQLite + Supabase Postgres (mirrored)

---

## 1. Conventions

### 1.1 Standard columns (all main tables)

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, client-generated |
| `household_id` | UUID | FK → households |
| `created_by` | UUID | FK → users (nullable for system seeds) |
| `created_at` | TIMESTAMPTZ | ISO 8601 |
| `updated_at` | TIMESTAMPTZ | ISO 8601 |
| `deleted_at` | TIMESTAMPTZ | NULL = active (soft delete) |
| `local_sync_status` | TEXT | `synced` \| `pending` \| `conflict` \| `error` |
| `last_synced_at` | TIMESTAMPTZ | NULL if never synced |

### 1.2 Naming

- Tables: snake_case plural
- Enums stored as TEXT with CHECK constraints
- JSON columns for flexible metadata where noted

### 1.3 Sync metadata (local only)

```sql
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL, -- insert | update | delete
  payload TEXT NOT NULL,   -- JSON
  created_at TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_error TEXT
);

CREATE TABLE sync_state (
  household_id TEXT PRIMARY KEY,
  last_pull_at TEXT,
  last_push_at TEXT
);
```

---

## 2. Core Identity

### households

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | TEXT | e.g. "Oak Creek Homestead" |
| slug | TEXT | UNIQUE, optional |
| timezone | TEXT | IANA, default America/Chicago |
| latitude | REAL | optional |
| longitude | REAL | optional |
| homestead_types | TEXT | JSON array: garden, chickens, goats, pantry, bees, etc. |
| settings | TEXT | JSON blob |
| + standard audit/sync cols | | |

### users

Mirrors `auth.users` on server. Local cache:

| Column | Type |
|--------|------|
| id | UUID PK |
| email | TEXT |
| display_name | TEXT |
| avatar_url | TEXT |
| updated_at | TIMESTAMPTZ |

### memberships

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| household_id | UUID | FK |
| user_id | UUID | FK |
| role | TEXT | `owner` \| `admin` \| `member` \| `viewer` |
| invited_at | TIMESTAMPTZ | |
| accepted_at | TIMESTAMPTZ | NULL if pending |
| + standard cols | | |

---

## 3. Locations & Areas

### properties

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| household_id | UUID | |
| name | TEXT | e.g. "Main Farm" |
| address | TEXT | optional |
| latitude | REAL | |
| longitude | REAL | |
| + standard cols | | |

### areas

Unified zones: garden beds, paddocks, coops, greenhouses.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| property_id | UUID | FK, nullable |
| name | TEXT | |
| area_type | TEXT | `bed` \| `plot` \| `paddock` \| `coop` \| `barn` \| `greenhouse` \| `other` |
| description | TEXT | |
| sort_order | INTEGER | |
| metadata | TEXT | JSON (dimensions, soil, etc.) |
| + standard cols | | |

---

## 4. Tasks

### tasks

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| title | TEXT | |
| description | TEXT | |
| status | TEXT | `open` \| `done` \| `skipped` \| `cancelled` |
| priority | TEXT | `low` \| `normal` \| `high` \| `urgent` |
| due_date | DATE | |
| due_time | TIME | optional |
| assigned_to | UUID | FK users, nullable |
| routine_id | UUID | FK, nullable |
| area_id | UUID | FK, nullable |
| tags | TEXT | JSON array of tag IDs |
| reminder_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |
| recurrence_rule | TEXT | iCal RRULE or simplified JSON |
| season | TEXT | `spring` \| `summer` \| `fall` \| `winter` \| NULL |
| + standard cols | | |

### routines

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | TEXT | |
| description | TEXT | |
| recurrence_rule | TEXT | |
| default_assignee | UUID | |
| checklist_template | TEXT | JSON array of step strings |
| is_active | INTEGER | 0/1 |
| + standard cols | | |

### task_logs

Completion / skip history.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| task_id | UUID | FK |
| action | TEXT | `completed` \| `skipped` \| `reopened` |
| notes | TEXT | |
| logged_at | TIMESTAMPTZ | |
| logged_by | UUID | |
| + standard cols | | |

---

## 5. Garden / Crops

### crop_varieties

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| common_name | TEXT | e.g. "Tomato" |
| variety_name | TEXT | e.g. "Cherokee Purple" |
| crop_type | TEXT | `vegetable` \| `fruit` \| `herb` \| `flower` \| `grain` \| `other` |
| days_to_maturity | INTEGER | |
| spacing_notes | TEXT | |
| metadata | TEXT | JSON |
| + standard cols | | |

### seed_inventory

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| variety_id | UUID | FK |
| quantity | REAL | |
| unit | TEXT | `seeds` \| `packets` \| `grams` |
| source | TEXT | |
| purchase_date | DATE | |
| expiration_date | DATE | |
| + standard cols | | |

### plantings

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| area_id | UUID | FK |
| variety_id | UUID | FK |
| planted_on | DATE | |
| expected_harvest_start | DATE | |
| status | TEXT | `planned` \| `active` \| `harvesting` \| `finished` \| `failed` |
| quantity | INTEGER | plant count |
| succession_group | TEXT | optional grouping |
| notes | TEXT | |
| + standard cols | | |

### harvests

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| planting_id | UUID | FK, nullable |
| variety_id | UUID | FK |
| harvested_on | DATE | |
| quantity | REAL | |
| unit | TEXT | `lbs` \| `oz` \| `count` \| `bunches` etc. |
| quality | TEXT | `excellent` \| `good` \| `fair` \| `poor` |
| destination | TEXT | `pantry` \| `preserved` \| `sold` \| `fed` \| `compost` |
| notes | TEXT | |
| + standard cols | | |

### crop_rotation_history

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| area_id | UUID | FK |
| variety_id | UUID | FK |
| season_year | INTEGER | e.g. 2026 |
| season | TEXT | |
| + standard cols | | |

---

## 6. Animals

### animal_groups

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| species | TEXT | `chicken` \| `goat` \| `duck` \| `rabbit` \| `bee` \| `other` |
| name | TEXT | e.g. "Laying flock" |
| area_id | UUID | FK, nullable |
| count | INTEGER | for group tracking |
| breed | TEXT | |
| acquired_on | DATE | |
| status | TEXT | `active` \| `sold` \| `deceased` \| `archived` |
| metadata | TEXT | JSON |
| + standard cols | | |

### animals

Individual tracking when needed.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| group_id | UUID | FK, nullable |
| name | TEXT | optional tag/name |
| tag_id | TEXT | ear tag, band number |
| sex | TEXT | `male` \| `female` \| `unknown` |
| birth_date | DATE | |
| status | TEXT | |
| + standard cols | | |

### animal_logs

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| animal_id | UUID | FK, nullable |
| group_id | UUID | FK, nullable |
| log_type | TEXT | `health` \| `feeding` \| `production` \| `breeding` \| `weight` \| `note` |
| logged_at | TIMESTAMPTZ | |
| quantity | REAL | eggs, milk, weight |
| unit | TEXT | |
| notes | TEXT | |
| metadata | TEXT | JSON (treatment, feed type, etc.) |
| + standard cols | | |

---

## 7. Pantry & Preservation

### pantry_items

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | TEXT | |
| category | TEXT | `pantry` \| `freezer` \| `canned` \| `dehydrated` \| `fermented` \| `other` |
| quantity | REAL | |
| unit | TEXT | |
| low_stock_threshold | REAL | |
| expiration_date | DATE | |
| location_label | TEXT | e.g. "Root cellar shelf 2" |
| harvest_id | UUID | FK, nullable |
| batch_id | UUID | FK, nullable |
| + standard cols | | |

### preserved_batches

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | TEXT | e.g. "Tomato sauce 2026" |
| method | TEXT | `canning` \| `freezing` \| `dehydrating` \| `fermenting` \| `other` |
| started_on | DATE | |
| finished_on | DATE | |
| quantity_produced | REAL | |
| unit | TEXT | |
| harvest_id | UUID | FK, nullable |
| recipe_notes | TEXT | |
| + standard cols | | |

### inventory_transactions

Append-only ledger for pantry quantity changes.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| pantry_item_id | UUID | FK |
| transaction_type | TEXT | `add` \| `use` \| `adjust` \| `waste` \| `transfer` |
| quantity_delta | REAL | signed |
| unit | TEXT | |
| reason | TEXT | |
| reference_id | UUID | optional link to harvest, sale, etc. |
| reference_type | TEXT | |
| transacted_at | TIMESTAMPTZ | |
| + standard cols | | |

**Balance rule:** `pantry_items.quantity` = SUM(`quantity_delta`) for item. Recomputed on sync merge.

---

## 8. Finance

### expense_categories / income_categories

| Column | Type |
|--------|------|
| id | UUID PK |
| name | TEXT |
| icon | TEXT |
| sort_order | INTEGER |
| + standard cols |

### expenses

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| category_id | UUID | FK |
| amount | REAL | positive |
| currency | TEXT | default USD |
| expense_date | DATE | |
| vendor | TEXT | |
| description | TEXT | |
| enterprise | TEXT | `garden` \| `chickens` \| `goats` \| `pantry` \| `general` |
| receipt_attachment_id | UUID | FK attachments |
| + standard cols | | |

### incomes

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| category_id | UUID | FK |
| amount | REAL | |
| currency | TEXT | |
| income_date | DATE | |
| source | TEXT | |
| description | TEXT | |
| enterprise | TEXT | |
| + standard cols | | |

---

## 9. Shared

### tags

| Column | Type |
|--------|------|
| id | UUID PK |
| name | TEXT |
| color | TEXT |
| + standard cols |

### attachments

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| entity_type | TEXT | polymorphic |
| entity_id | UUID | |
| file_name | TEXT | |
| mime_type | TEXT | |
| local_uri | TEXT | device path |
| remote_url | TEXT | Supabase Storage |
| file_size | INTEGER | |
| + standard cols | | |

### notes

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| title | TEXT | |
| body | TEXT | markdown or plain |
| entity_type | TEXT | optional link |
| entity_id | UUID | |
| + standard cols | | |

### weather_snapshots

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| property_id | UUID | FK |
| observed_at | TIMESTAMPTZ | |
| temp_f | REAL | |
| temp_c | REAL | |
| conditions | TEXT | |
| forecast_json | TEXT | |
| provider | TEXT | `nws` |
| + standard cols | | |

---

## 10. Indexes (recommended)

```sql
CREATE INDEX idx_tasks_household_due ON tasks(household_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_plantings_area ON plantings(area_id);
CREATE INDEX idx_harvests_date ON harvests(household_id, harvested_on);
CREATE INDEX idx_animal_logs_date ON animal_logs(household_id, logged_at);
CREATE INDEX idx_pantry_low_stock ON pantry_items(household_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_inventory_tx_item ON inventory_transactions(pantry_item_id);
CREATE INDEX idx_expenses_date ON expenses(household_id, expense_date);
CREATE INDEX idx_sync_queue_pending ON sync_queue(household_id, created_at);
```

---

## 11. RLS Policy Summary (Supabase)

- **SELECT/INSERT/UPDATE:** member of `household_id`
- **DELETE:** soft delete preferred; hard delete owner/admin only
- **memberships:** owners manage invites; users read own memberships
- **users:** read/update self only

---

## 12. Entity Relationship (simplified)

```
households ─┬─ memberships ─ users
            ├─ properties ─ areas
            ├─ tasks ─ task_logs
            ├─ routines
            ├─ crop_varieties ─ seed_inventory
            │                 └─ plantings ─ harvests
            ├─ animal_groups ─ animals ─ animal_logs
            ├─ pantry_items ─ inventory_transactions
            ├─ preserved_batches
            ├─ expenses / incomes
            ├─ notes / attachments / tags
            └─ weather_snapshots
```
