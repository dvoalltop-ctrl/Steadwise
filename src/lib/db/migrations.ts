export const SCHEMA_VERSION = 1;

export const MIGRATION_V1 = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_state (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  due_date TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  category TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS gardens (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  location TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS garden_beds (
  id TEXT PRIMARY KEY NOT NULL,
  garden_id TEXT NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT,
  FOREIGN KEY (garden_id) REFERENCES gardens(id)
);

CREATE TABLE IF NOT EXISTS plantings (
  id TEXT PRIMARY KEY NOT NULL,
  garden_bed_id TEXT NOT NULL,
  plant_name TEXT NOT NULL,
  variety TEXT,
  planted_on TEXT,
  expected_harvest TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT,
  FOREIGN KEY (garden_bed_id) REFERENCES garden_beds(id)
);

CREATE TABLE IF NOT EXISTS animals (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  birth_date TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT,
  location TEXT,
  expires_on TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY NOT NULL,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  occurred_on TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  tags TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY NOT NULL,
  local_uri TEXT NOT NULL,
  caption TEXT,
  entity_type TEXT,
  entity_id TEXT,
  taken_at TEXT,
  remote_uri TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS weather_logs (
  id TEXT PRIMARY KEY NOT NULL,
  logged_on TEXT NOT NULL,
  high_f REAL,
  low_f REAL,
  precipitation_in REAL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_updated ON tasks(updated_at);
CREATE INDEX IF NOT EXISTS idx_garden_beds_garden ON garden_beds(garden_id);
CREATE INDEX IF NOT EXISTS idx_plantings_bed ON plantings(garden_bed_id);
CREATE INDEX IF NOT EXISTS idx_pantry_name ON pantry_items(name);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(occurred_on);
`;

export const MIGRATIONS: { version: number; sql: string }[] = [
  { version: 1, sql: MIGRATION_V1 },
];
