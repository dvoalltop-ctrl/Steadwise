/**
 * Steadwise local SQLite schema definitions.
 *
 * Offline-first: SQLite is the source of truth while the app is in use.
 * Every domain row carries sync metadata so a future cloud sync layer can
 * push/pull without reshaping tables. Supabase is intentionally not wired here.
 */

/** Current schema generation — bump when migrations change. */
export const SCHEMA_VERSION = 1;

export const DATABASE_NAME = 'steadwise_local.db';

/**
 * Standard sync columns appended to homestead domain tables.
 * `sync_status` tracks local → remote state; `last_synced_at` is null until
 * a successful push/pull (future work).
 */
export const SYNC_METADATA_COLUMNS = `
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'conflict', 'error')),
  last_synced_at TEXT
`;

export const TABLES = {
  schemaMigrations: 'schema_migrations',
  households: 'households',
  usersLocal: 'users_local',
  tasks: 'tasks',
  taskLogs: 'task_logs',
  gardenAreas: 'garden_areas',
  plantings: 'plantings',
  harvests: 'harvests',
  animalGroups: 'animal_groups',
  animalLogs: 'animal_logs',
  pantryItems: 'pantry_items',
  inventoryTransactions: 'inventory_transactions',
  financeTransactions: 'finance_transactions',
  notes: 'notes',
  attachments: 'attachments',
  syncQueue: 'sync_queue',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

/** SQL to create all local tables (idempotent). */
export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS ${TABLES.schemaMigrations} (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ${TABLES.households} (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  timezone TEXT DEFAULT 'America/Chicago',
  latitude REAL,
  longitude REAL,
  homestead_types TEXT DEFAULT '[]',
  settings TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS ${TABLES.usersLocal} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS ${TABLES.tasks} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
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
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.taskLogs} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  action TEXT NOT NULL,
  notes TEXT,
  logged_at TEXT NOT NULL,
  logged_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.gardenAreas} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  property_id TEXT,
  name TEXT NOT NULL,
  area_type TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.plantings} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  area_id TEXT NOT NULL,
  variety_id TEXT NOT NULL,
  common_name TEXT,
  variety_name TEXT,
  crop_type TEXT,
  planted_on TEXT NOT NULL,
  expected_harvest_start TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  quantity INTEGER DEFAULT 1,
  succession_group TEXT,
  notes TEXT,
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.harvests} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  planting_id TEXT,
  variety_id TEXT NOT NULL,
  common_name TEXT,
  variety_name TEXT,
  harvested_on TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  quality TEXT DEFAULT 'good',
  destination TEXT DEFAULT 'pantry',
  notes TEXT,
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.animalGroups} (
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
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.animalLogs} (
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
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.pantryItems} (
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
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.inventoryTransactions} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  pantry_item_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  quantity_delta REAL NOT NULL,
  unit TEXT NOT NULL,
  reason TEXT,
  reference_id TEXT,
  reference_type TEXT,
  transacted_at TEXT NOT NULL,
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.financeTransactions} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  category_id TEXT NOT NULL,
  category_name TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  transaction_date TEXT NOT NULL,
  counterparty TEXT,
  description TEXT,
  enterprise TEXT DEFAULT 'general',
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.notes} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  linked_entity_type TEXT,
  linked_entity_id TEXT,
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.attachments} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  file_uri TEXT NOT NULL,
  mime_type TEXT,
  file_name TEXT,
  byte_size INTEGER,
  created_by TEXT,
  ${SYNC_METADATA_COLUMNS}
);

CREATE TABLE IF NOT EXISTS ${TABLES.syncQueue} (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete')),
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_tasks_household_due ON ${TABLES.tasks}(household_id, due_date);
CREATE INDEX IF NOT EXISTS idx_task_logs_task ON ${TABLES.taskLogs}(task_id);
CREATE INDEX IF NOT EXISTS idx_garden_areas_household ON ${TABLES.gardenAreas}(household_id);
CREATE INDEX IF NOT EXISTS idx_plantings_household ON ${TABLES.plantings}(household_id);
CREATE INDEX IF NOT EXISTS idx_harvests_date ON ${TABLES.harvests}(household_id, harvested_on);
CREATE INDEX IF NOT EXISTS idx_animal_logs_date ON ${TABLES.animalLogs}(household_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_pantry_items_household ON ${TABLES.pantryItems}(household_id);
CREATE INDEX IF NOT EXISTS idx_finance_tx_date ON ${TABLES.financeTransactions}(household_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_sync_queue_created ON ${TABLES.syncQueue}(created_at);
`;
