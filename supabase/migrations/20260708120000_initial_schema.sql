-- Steadwise Supabase migration 001
-- Mirrors local SQLite schema with Row Level Security

-- Households
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT,
  timezone TEXT DEFAULT 'America/Chicago',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  homestead_types JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ,
  UNIQUE(household_id, user_id)
);

-- Helper function for RLS
CREATE OR REPLACE FUNCTION user_household_ids()
RETURNS SETOF UUID AS $$
  SELECT household_id FROM memberships
  WHERE user_id = auth.uid() AND deleted_at IS NULL
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  due_date DATE,
  due_time TIME,
  assigned_to UUID,
  routine_id UUID,
  area_id UUID,
  tags JSONB DEFAULT '[]',
  reminder_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  recurrence_rule TEXT,
  season TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

-- Areas, garden, animals, pantry, finance tables (abbreviated — same pattern)
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  property_id UUID,
  name TEXT NOT NULL,
  area_type TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS crop_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  common_name TEXT NOT NULL,
  variety_name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  days_to_maturity INTEGER,
  spacing_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS plantings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  area_id UUID NOT NULL,
  variety_id UUID NOT NULL,
  planted_on DATE NOT NULL,
  expected_harvest_start DATE,
  status TEXT DEFAULT 'active',
  quantity INTEGER DEFAULT 1,
  succession_group TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS harvests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  planting_id UUID,
  variety_id UUID NOT NULL,
  harvested_on DATE NOT NULL,
  quantity DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  quality TEXT DEFAULT 'good',
  destination TEXT DEFAULT 'pantry',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS animal_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  species TEXT NOT NULL,
  name TEXT NOT NULL,
  area_id UUID,
  count INTEGER DEFAULT 0,
  breed TEXT,
  acquired_on DATE,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS animal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  animal_id UUID,
  group_id UUID,
  log_type TEXT NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL,
  quantity DOUBLE PRECISION,
  unit TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  low_stock_threshold DOUBLE PRECISION,
  expiration_date DATE,
  location_label TEXT,
  harvest_id UUID,
  batch_id UUID,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  category_id UUID NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'USD',
  expense_date DATE NOT NULL,
  vendor TEXT,
  description TEXT,
  enterprise TEXT DEFAULT 'general',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL,
  category_id UUID NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'USD',
  income_date DATE NOT NULL,
  source TEXT,
  description TEXT,
  enterprise TEXT DEFAULT 'general',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  local_sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ
);

-- RLS policies
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

-- Membership: users see own memberships
CREATE POLICY memberships_select ON memberships FOR SELECT
  USING (user_id = auth.uid() OR household_id IN (SELECT user_household_ids()));

CREATE POLICY memberships_insert ON memberships FOR INSERT
  WITH CHECK (household_id IN (SELECT user_household_ids()));

-- Generic household-scoped policy macro for domain tables
DO $$ 
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['tasks','areas','crop_varieties','plantings','harvests',
    'animal_groups','animal_logs','pantry_items','expenses','incomes','households']
  LOOP
    EXECUTE format('CREATE POLICY %I_select ON %I FOR SELECT USING (household_id IN (SELECT user_household_ids()))', t, t);
    EXECUTE format('CREATE POLICY %I_insert ON %I FOR INSERT WITH CHECK (household_id IN (SELECT user_household_ids()))', t, t);
    EXECUTE format('CREATE POLICY %I_update ON %I FOR UPDATE USING (household_id IN (SELECT user_household_ids()))', t, t);
  END LOOP;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_household_due ON tasks(household_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_updated ON tasks(household_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
