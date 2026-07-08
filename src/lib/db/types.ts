export interface SyncableRecord {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  synced_at: string | null;
}

export interface Task extends SyncableRecord {
  title: string;
  notes: string | null;
  due_date: string | null;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'done' | 'cancelled';
  category: string | null;
}

export interface Garden extends SyncableRecord {
  name: string;
  notes: string | null;
  location: string | null;
}

export interface GardenBed extends SyncableRecord {
  garden_id: string;
  name: string;
  notes: string | null;
}

export interface Planting extends SyncableRecord {
  garden_bed_id: string;
  plant_name: string;
  variety: string | null;
  planted_on: string | null;
  expected_harvest: string | null;
  notes: string | null;
  status: 'planned' | 'active' | 'harvested' | 'removed';
}

export interface Animal extends SyncableRecord {
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  notes: string | null;
  status: 'active' | 'sold' | 'deceased';
}

export interface PantryItem extends SyncableRecord {
  name: string;
  quantity: number;
  unit: string | null;
  location: string | null;
  expires_on: string | null;
  notes: string | null;
}

export interface Transaction extends SyncableRecord {
  description: string;
  amount_cents: number;
  type: 'income' | 'expense';
  category: string | null;
  occurred_on: string;
  notes: string | null;
}

export interface Note extends SyncableRecord {
  title: string;
  body: string | null;
  tags: string | null;
}

export interface Photo extends SyncableRecord {
  local_uri: string;
  caption: string | null;
  entity_type: string | null;
  entity_id: string | null;
  taken_at: string | null;
  remote_uri: string | null;
}

export interface WeatherLog extends SyncableRecord {
  logged_on: string;
  high_f: number | null;
  low_f: number | null;
  precipitation_in: number | null;
  notes: string | null;
}

export type SyncableTable =
  | 'tasks'
  | 'gardens'
  | 'garden_beds'
  | 'plantings'
  | 'animals'
  | 'pantry_items'
  | 'transactions'
  | 'notes'
  | 'photos'
  | 'weather_logs';
