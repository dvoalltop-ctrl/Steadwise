import type { Area, Planting, Harvest, CropVariety } from '@/types';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { toBaseRecordFields } from '../utils';

function rowToArea(row: Record<string, unknown>): Area {
  return {
    ...toBaseRecordFields(row),
    propertyId: (row.property_id as string) ?? null,
    name: row.name as string,
    areaType: row.area_type as Area['areaType'],
    description: (row.description as string) ?? null,
    sortOrder: row.sort_order as number,
    metadata: JSON.parse((row.metadata as string) || '{}'),
  };
}

function rowToPlanting(row: Record<string, unknown>): Planting {
  return {
    ...toBaseRecordFields(row),
    areaId: row.area_id as string,
    varietyId: row.variety_id as string,
    plantedOn: row.planted_on as string,
    expectedHarvestStart: (row.expected_harvest_start as string) ?? null,
    status: row.status as Planting['status'],
    quantity: row.quantity as number,
    successionGroup: (row.succession_group as string) ?? null,
    notes: (row.notes as string) ?? null,
  };
}

function rowToHarvest(row: Record<string, unknown>): Harvest {
  return {
    ...toBaseRecordFields(row),
    plantingId: (row.planting_id as string) ?? null,
    varietyId: row.variety_id as string,
    harvestedOn: row.harvested_on as string,
    quantity: row.quantity as number,
    unit: row.unit as string,
    quality: row.quality as Harvest['quality'],
    destination: row.destination as Harvest['destination'],
    notes: (row.notes as string) ?? null,
  };
}

export const gardenRepository = {
  async listAreas(householdId: string): Promise<Area[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.gardenAreas} WHERE household_id = ? AND deleted_at IS NULL ORDER BY sort_order`,
      [householdId]
    );
    return rows.map(rowToArea);
  },

  async listPlantings(householdId: string): Promise<Planting[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.plantings} WHERE household_id = ? AND deleted_at IS NULL`,
      [householdId]
    );
    return rows.map(rowToPlanting);
  },

  async listHarvests(householdId: string): Promise<Harvest[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.harvests} WHERE household_id = ? AND deleted_at IS NULL ORDER BY harvested_on DESC`,
      [householdId]
    );
    return rows.map(rowToHarvest);
  },

  /** Derive variety catalog from denormalized planting/harvest rows. */
  async listVarieties(householdId: string): Promise<CropVariety[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT DISTINCT variety_id, common_name, variety_name, crop_type, household_id,
              created_at, updated_at, sync_status, last_synced_at
       FROM ${TABLES.plantings}
       WHERE household_id = ? AND deleted_at IS NULL AND variety_id IS NOT NULL
       UNION
       SELECT DISTINCT variety_id, common_name, variety_name, NULL as crop_type, household_id,
              created_at, updated_at, sync_status, last_synced_at
       FROM ${TABLES.harvests}
       WHERE household_id = ? AND deleted_at IS NULL AND variety_id IS NOT NULL`,
      [householdId, householdId]
    );

    return rows.map((row) => ({
      ...toBaseRecordFields(row, householdId),
      commonName: (row.common_name as string) ?? 'Unknown',
      varietyName: (row.variety_name as string) ?? '',
      cropType: (row.crop_type as CropVariety['cropType']) ?? 'vegetable',
      daysToMaturity: null,
      spacingNotes: null,
      id: row.variety_id as string,
    }));
  },
};
