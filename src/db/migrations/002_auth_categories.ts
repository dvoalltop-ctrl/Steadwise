export const MIGRATION_002 = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_at TEXT,
  accepted_at TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS expense_categories (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS income_categories (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
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
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  local_sync_status TEXT DEFAULT 'pending',
  last_synced_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_item ON inventory_transactions(pantry_item_id);
`;
