import type { SQLiteDatabase } from 'expo-sqlite';
import { mockData } from '@/mocks';
import { DEMO_HOUSEHOLD_ID } from '@/mocks/household';

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  const count = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM households'
  );
  if (count && count.c > 0) return;

  const h = mockData.household;
  await db.runAsync(
    `INSERT INTO households (id, household_id, name, slug, timezone, latitude, longitude,
      homestead_types, settings, created_by, created_at, updated_at, local_sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      h.id, h.householdId, h.name, h.slug, h.timezone, h.latitude, h.longitude,
      JSON.stringify(h.homesteadTypes), JSON.stringify(h.settings),
      h.createdBy, h.createdAt, h.updatedAt, h.localSyncStatus,
    ]
  );

  for (const task of mockData.tasks) {
    await db.runAsync(
      `INSERT INTO tasks (id, household_id, title, description, status, priority, due_date,
        due_time, assigned_to, routine_id, area_id, tags, recurrence_rule, season,
        completed_at, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id, task.householdId, task.title, task.description, task.status, task.priority,
        task.dueDate, task.dueTime, task.assignedTo, task.routineId, task.areaId,
        JSON.stringify(task.tags), task.recurrenceRule, task.season, task.completedAt,
        task.createdBy, task.createdAt, task.updatedAt, task.localSyncStatus,
      ]
    );
  }

  for (const area of mockData.areas) {
    await db.runAsync(
      `INSERT INTO areas (id, household_id, property_id, name, area_type, description,
        sort_order, metadata, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        area.id, area.householdId, area.propertyId, area.name, area.areaType,
        area.description, area.sortOrder, JSON.stringify(area.metadata),
        area.createdBy, area.createdAt, area.updatedAt, area.localSyncStatus,
      ]
    );
  }

  for (const p of mockData.plantings) {
    await db.runAsync(
      `INSERT INTO plantings (id, household_id, area_id, variety_id, planted_on,
        expected_harvest_start, status, quantity, succession_group, notes,
        created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id, p.householdId, p.areaId, p.varietyId, p.plantedOn, p.expectedHarvestStart,
        p.status, p.quantity, p.successionGroup, p.notes,
        p.createdBy, p.createdAt, p.updatedAt, p.localSyncStatus,
      ]
    );
  }

  for (const v of mockData.varieties) {
    await db.runAsync(
      `INSERT INTO crop_varieties (id, household_id, common_name, variety_name, crop_type,
        days_to_maturity, spacing_notes, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.id, v.householdId, v.commonName, v.varietyName, v.cropType,
        v.daysToMaturity, v.spacingNotes, v.createdBy, v.createdAt, v.updatedAt, v.localSyncStatus,
      ]
    );
  }

  for (const h of mockData.harvests) {
    await db.runAsync(
      `INSERT INTO harvests (id, household_id, planting_id, variety_id, harvested_on,
        quantity, unit, quality, destination, notes, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.id, h.householdId, h.plantingId, h.varietyId, h.harvestedOn,
        h.quantity, h.unit, h.quality, h.destination, h.notes,
        h.createdBy, h.createdAt, h.updatedAt, h.localSyncStatus,
      ]
    );
  }

  for (const g of mockData.animalGroups) {
    await db.runAsync(
      `INSERT INTO animal_groups (id, household_id, species, name, area_id, count, breed,
        acquired_on, status, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.id, g.householdId, g.species, g.name, g.areaId, g.count, g.breed,
        g.acquiredOn, g.status, g.createdBy, g.createdAt, g.updatedAt, g.localSyncStatus,
      ]
    );
  }

  for (const log of mockData.animalLogs) {
    await db.runAsync(
      `INSERT INTO animal_logs (id, household_id, animal_id, group_id, log_type, logged_at,
        quantity, unit, notes, metadata, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id, log.householdId, log.animalId, log.groupId, log.logType, log.loggedAt,
        log.quantity, log.unit, log.notes, JSON.stringify(log.metadata),
        log.createdBy, log.createdAt, log.updatedAt, log.localSyncStatus,
      ]
    );
  }

  for (const item of mockData.pantryItems) {
    await db.runAsync(
      `INSERT INTO pantry_items (id, household_id, name, category, quantity, unit,
        low_stock_threshold, expiration_date, location_label, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id, item.householdId, item.name, item.category, item.quantity, item.unit,
        item.lowStockThreshold, item.expirationDate, item.locationLabel,
        item.createdBy, item.createdAt, item.updatedAt, item.localSyncStatus,
      ]
    );
  }

  for (const e of mockData.expenses) {
    await db.runAsync(
      `INSERT INTO expenses (id, household_id, category_id, amount, currency, expense_date,
        vendor, description, enterprise, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.id, e.householdId, e.categoryId, e.amount, e.currency, e.expenseDate,
        e.vendor, e.description, e.enterprise, e.createdBy, e.createdAt, e.updatedAt, e.localSyncStatus,
      ]
    );
  }

  for (const i of mockData.incomes) {
    await db.runAsync(
      `INSERT INTO incomes (id, household_id, category_id, amount, currency, income_date,
        source, description, enterprise, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        i.id, i.householdId, i.categoryId, i.amount, i.currency, i.incomeDate,
        i.source, i.description, i.enterprise, i.createdBy, i.createdAt, i.updatedAt, i.localSyncStatus,
      ]
    );
  }

  // Ensure household id is consistent
  void DEMO_HOUSEHOLD_ID;
}
