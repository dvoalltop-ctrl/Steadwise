import type { PantryItem } from '@/types';
import { pantryRepository } from '@/lib/db/repositories/pantry.repository';

export class PantryRepository {
  static async create(): Promise<PantryRepository> {
    return new PantryRepository();
  }

  async getAll(householdId: string): Promise<PantryItem[]> {
    return pantryRepository.listItems(householdId);
  }
}
