# Steadwise Supabase schema (reference)

Run this in your Supabase SQL editor when enabling cloud sync.
Tables mirror the local SQLite schema with a `user_id` column for row-level security.

```sql
-- tasks
create table if not exists public.tasks (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  due_date text,
  priority text not null default 'normal',
  status text not null default 'pending',
  category text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  synced_at timestamptz
);

alter table public.tasks enable row level security;

create policy "Users manage own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Additional tables (gardens, animals, pantry_items, etc.) follow the same pattern.
Add them before enabling full multi-entity sync.
