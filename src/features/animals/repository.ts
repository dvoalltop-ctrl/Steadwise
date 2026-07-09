import type { AnimalGroup, AnimalLog } from '@/types';
import { animalsRepository } from '@/lib/db/repositories/animals.repository';

export class AnimalsRepository {
  static async create(): Promise<AnimalsRepository> {
    return new AnimalsRepository();
  }

  async getGroups(householdId: string): Promise<AnimalGroup[]> {
    return animalsRepository.listGroups(householdId);
  }

  async getLogs(householdId: string): Promise<AnimalLog[]> {
    return animalsRepository.listLogs(householdId);
  }
}
