import type { SQLiteDatabase } from 'expo-sqlite';
import { mockData } from '@/mocks';
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from '@/mocks/household';
import { TABLES } from './schema';

/**
 * Idempotent demo seed for local development.
 * Skips insert when the demo household already exists.
 */
export async function seedDemoData(db: SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) as c FROM ${TABLES.households} WHERE id = ?`,
    [DEMO_HOUSEHOLD_ID]
  );
  if (existing && existing.c > 0) return;

  const h = mockData.household;
  await db.runAsync(
    `INSERT INTO ${TABLES.households}
      (id, name, slug, timezone, latitude, longitude, homestead_types, settings,
       created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      h.id, h.name, h.slug, h.timezone, h.latitude, h.longitude,
      JSON.stringify(h.homesteadTypes), JSON.stringify(h.settings),
      h.createdAt, h.updatedAt, 'synced',
    ]
  );

  await db.runAsync(
    `INSERT INTO ${TABLES.usersLocal}
      (id, household_id, email, display_name, avatar_url, created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      DEMO_USER_ID, DEMO_HOUSEHOLD_ID, mockData.user.email, mockData.user.displayName,
      mockData.user.avatarUrl, h.createdAt, h.updatedAt, 'synced',
    ]
  );

  for (const task of mockData.tasks) {
    await db.runAsync(
      `INSERT INTO ${TABLES.tasks}
        (id, household_id, title, description, status, priority, due_date, due_time,
         assigned_to, routine_id, area_id, tags, recurrence_rule, season, completed_at,
         created_by, created_at, updated_at, sync_status)
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
      `INSERT INTO ${TABLES.gardenAreas}
        (id, household_id, property_id, name, area_type, description, sort_order, metadata,
         created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        area.id, area.householdId, area.propertyId, area.name, area.areaType,
        area.description, area.sortOrder, JSON.stringify(area.metadata),
        area.createdBy, area.createdAt, area.updatedAt, area.localSyncStatus,
      ]
    );
  }

  const varietyMap = new Map(mockData.varieties.map((v) => [v.id, v]));

  for (const p of mockData.plantings) {
    const v = varietyMap.get(p.varietyId);
    await db.runAsync(
      `INSERT INTO ${TABLES.plantings}
        (id, household_id, area_id, variety_id, common_name, variety_name, crop_type,
         planted_on, expected_harvest_start, status, quantity, succession_group, notes,
         created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id, p.householdId, p.areaId, p.varietyId,
        v?.commonName ?? null, v?.varietyName ?? null, v?.cropType ?? null,
        p.plantedOn, p.expectedHarvestStart, p.status, p.quantity, p.successionGroup, p.notes,
        p.createdBy, p.createdAt, p.updatedAt, p.localSyncStatus,
      ]
    );
  }

  for (const harvest of mockData.harvests) {
    const v = varietyMap.get(harvest.varietyId);
    await db.runAsync(
      `INSERT INTO ${TABLES.harvests}
        (id, household_id, planting_id, variety_id, common_name, variety_name,
         harvested_on, quantity, unit, quality, destination, notes,
         created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        harvest.id, harvest.householdId, harvest.plantingId, harvest.varietyId,
        v?.commonName ?? null, v?.varietyName ?? null,
        harvest.harvestedOn, harvest.quantity, harvest.unit, harvest.quality,
        harvest.destination, harvest.notes,
        harvest.createdBy, harvest.createdAt, harvest.updatedAt, harvest.localSyncStatus,
      ]
    );
  }

  for (const g of mockData.animalGroups) {
    await db.runAsync(
      `INSERT INTO ${TABLES.animalGroups}
        (id, household_id, species, name, area_id, count, breed, acquired_on, status,
         created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.id, g.householdId, g.species, g.name, g.areaId, g.count, g.breed,
        g.acquiredOn, g.status, g.createdBy, g.createdAt, g.updatedAt, g.localSyncStatus,
      ]
    );
  }

  for (const log of mockData.animalLogs) {
    await db.runAsync(
      `INSERT INTO ${TABLES.animalLogs}
        (id, household_id, animal_id, group_id, log_type, logged_at, quantity, unit, notes,
         metadata, created_by, created_at, updated_at, sync_status)
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
      `INSERT INTO ${TABLES.pantryItems}
        (id, household_id, name, category, quantity, unit, low_stock_threshold,
         expiration_date, location_label, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id, item.householdId, item.name, item.category, item.quantity, item.unit,
        item.lowStockThreshold, item.expirationDate, item.locationLabel,
        item.createdBy, item.createdAt, item.updatedAt, item.localSyncStatus,
      ]
    );
  }

  for (const e of mockData.expenses) {
    const cat = mockData.expenseCategories.find((c) => c.id === e.categoryId);
    await db.runAsync(
      `INSERT INTO ${TABLES.financeTransactions}
        (id, household_id, type, category_id, category_name, amount, currency, transaction_date,
         counterparty, description, enterprise, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, 'expense', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.id, e.householdId, e.categoryId, cat?.name ?? 'Expense', e.amount, e.currency,
        e.expenseDate, e.vendor, e.description, e.enterprise,
        e.createdBy, e.createdAt, e.updatedAt, e.localSyncStatus,
      ]
    );
  }

  for (const i of mockData.incomes) {
    const cat = mockData.incomeCategories.find((c) => c.id === i.categoryId);
    await db.runAsync(
      `INSERT INTO ${TABLES.financeTransactions}
        (id, household_id, type, category_id, category_name, amount, currency, transaction_date,
         counterparty, description, enterprise, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, 'income', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        i.id, i.householdId, i.categoryId, cat?.name ?? 'Income', i.amount, i.currency,
        i.incomeDate, i.source, i.description, i.enterprise,
        i.createdBy, i.createdAt, i.updatedAt, i.localSyncStatus,
      ]
    );
  }

  await db.runAsync(
    `INSERT INTO ${TABLES.notes}
      (id, household_id, title, body, tags, created_by, created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'note-demo-001', DEMO_HOUSEHOLD_ID, 'Spring planting plan',
      'Tomatoes in bed A, succession lettuce every two weeks.',
      JSON.stringify(['garden', 'planning']),
      DEMO_USER_ID, h.createdAt, h.updatedAt, 'synced',
    ]
  );
}
