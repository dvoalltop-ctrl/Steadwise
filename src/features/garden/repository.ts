import type { Area, CropVariety, Planting, Harvest } from '@/types';
import { gardenRepository } from '@/lib/db/repositories/garden.repository';

export class GardenRepository {
  static async create(): Promise<GardenRepository> {
    return new GardenRepository();
  }

  async getAreas(householdId: string): Promise<Area[]> {
    return gardenRepository.listAreas(householdId);
  }

  async getVarieties(householdId: string): Promise<CropVariety[]> {
    return gardenRepository.listVarieties(householdId);
  }

  async getPlantings(householdId: string): Promise<Planting[]> {
    return gardenRepository.listPlantings(householdId);
  }

  async getActivePlantings(householdId: string): Promise<Planting[]> {
    const plantings = await gardenRepository.listPlantings(householdId);
    return plantings.filter((p) => p.status === 'active' || p.status === 'harvesting');
  }

  async getHarvests(householdId: string): Promise<Harvest[]> {
    return gardenRepository.listHarvests(householdId);
  }

  async getHarvestsSince(householdId: string, sinceDate: string): Promise<Harvest[]> {
    const harvests = await gardenRepository.listHarvests(householdId);
    return harvests.filter((h) => h.harvestedOn >= sinceDate);
  }
}
