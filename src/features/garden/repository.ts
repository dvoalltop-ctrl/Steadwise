import type { SQLiteDatabase } from 'expo-sqlite';
import type { Area, CropVariety, Planting, Harvest } from '@/types';
import { getDatabase } from '@/db/client';
import { mapBaseRecord } from '@/lib/repositories/sync-helper';

function rowToArea(row: Record<string, unknown>): Area {
  return {
    ...mapBaseRecord(row),
    propertyId: (row.property_id as string) ?? null,
    name: row.name as string,
    areaType: row.area_type as Area['areaType'],
    description: (row.description as string) ?? null,
    sortOrder: row.sort_order as number,
    metadata: JSON.parse((row.metadata as string) || '{}'),
  };
}

function rowToVariety(row: Record<string, unknown>): CropVariety {
  return {
    ...mapBaseRecord(row),
    commonName: row.common_name as string,
    varietyName: row.variety_name as string,
    cropType: row.crop_type as CropVariety['cropType'],
    daysToMaturity: (row.days_to_maturity as number) ?? null,
    spacingNotes: (row.spacing_notes as string) ?? null,
  };
}

function rowToPlanting(row: Record<string, unknown>): Planting {
  return {
    ...mapBaseRecord(row),
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
    ...mapBaseRecord(row),
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

export class GardenRepository {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<GardenRepository> {
    return new GardenRepository(await getDatabase());
  }

  async getAreas(householdId: string): Promise<Area[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM areas WHERE household_id = ? AND deleted_at IS NULL ORDER BY sort_order`,
      [householdId]
    );
    return rows.map(rowToArea);
  }

  async getVarieties(householdId: string): Promise<CropVariety[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM crop_varieties WHERE household_id = ? AND deleted_at IS NULL`,
      [householdId]
    );
    return rows.map(rowToVariety);
  }

  async getPlantings(householdId: string): Promise<Planting[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM plantings WHERE household_id = ? AND deleted_at IS NULL`,
      [householdId]
    );
    return rows.map(rowToPlanting);
  }

  async getActivePlantings(householdId: string): Promise<Planting[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM plantings WHERE household_id = ? AND deleted_at IS NULL
       AND status IN ('active', 'harvesting')`,
      [householdId]
    );
    return rows.map(rowToPlanting);
  }

  async getHarvests(householdId: string): Promise<Harvest[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM harvests WHERE household_id = ? AND deleted_at IS NULL ORDER BY harvested_on DESC`,
      [householdId]
    );
    return rows.map(rowToHarvest);
  }

  async getHarvestsSince(householdId: string, sinceDate: string): Promise<Harvest[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM harvests WHERE household_id = ? AND deleted_at IS NULL AND harvested_on >= ?`,
      [householdId, sinceDate]
    );
    return rows.map(rowToHarvest);
  }
}
