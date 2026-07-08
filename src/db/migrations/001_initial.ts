export const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS sync_state (
  household_id TEXT PRIMARY KEY,
  last_pull_at TEXT,
  last_push_at TEXT
);

CREATE TABLE IF NOT EXISTS households (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT,
  timezone TEXT DEFAULT 'America/Chicago',
  latitude REAL,
  longitude REAL,
  homestead_types TEXT DEFAULT '[]',
  settings TEXT DEFAULT '{}',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  due_date TEXT,
  due_time TEXT,
  assigned_to TEXT,
  routine_id TEXT,
  area_id TEXT,
  tags TEXT DEFAULT '[]',
  reminder_at TEXT,
  completed_at TEXT,
  recurrence_rule TEXT,
  season TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS routines (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  recurrence_rule TEXT NOT NULL,
  default_assignee TEXT,
  checklist_template TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  property_id TEXT,
  name TEXT NOT NULL,
  area_type TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS crop_varieties (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  common_name TEXT NOT NULL,
  variety_name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  days_to_maturity INTEGER,
  spacing_notes TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS plantings (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  area_id TEXT NOT NULL,
  variety_id TEXT NOT NULL,
  planted_on TEXT NOT NULL,
  expected_harvest_start TEXT,
  status TEXT DEFAULT 'active',
  quantity INTEGER DEFAULT 1,
  succession_group TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS harvests (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  planting_id TEXT,
  variety_id TEXT NOT NULL,
  harvested_on TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  quality TEXT DEFAULT 'good',
  destination TEXT DEFAULT 'pantry',
  notes TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS animal_groups (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  species TEXT NOT NULL,
  name TEXT NOT NULL,
  area_id TEXT,
  count INTEGER DEFAULT 0,
  breed TEXT,
  acquired_on TEXT,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS animal_logs (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  animal_id TEXT,
  group_id TEXT,
  log_type TEXT NOT NULL,
  logged_at TEXT NOT NULL,
  quantity REAL,
  unit TEXT,
  notes TEXT,
  metadata TEXT DEFAULT '{}',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  low_stock_threshold REAL,
  expiration_date TEXT,
  location_label TEXT,
  harvest_id TEXT,
  batch_id TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  expense_date TEXT NOT NULL,
  vendor TEXT,
  description TEXT,
  enterprise TEXT DEFAULT 'general',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS incomes (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  income_date TEXT NOT NULL,
  source TEXT,
  description TEXT,
  enterprise TEXT DEFAULT 'general',
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_tasks_household_due ON tasks(household_id, due_date);
CREATE INDEX IF NOT EXISTS idx_harvests_date ON harvests(household_id, harvested_on);
CREATE INDEX IF NOT EXISTS idx_animal_logs_date ON animal_logs(household_id, logged_at);
`;
