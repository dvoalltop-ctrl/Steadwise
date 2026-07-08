import type { SyncQueueItem } from '@/sync/sync-queue';

export type ConflictStrategy = 'last_write_wins' | 'append_only' | 'server_wins';

const ENTITY_STRATEGIES: Record<string, ConflictStrategy> = {
  tasks: 'last_write_wins',
  expenses: 'last_write_wins',
  incomes: 'last_write_wins',
  pantry_items: 'last_write_wins',
  areas: 'last_write_wins',
  crop_varieties: 'last_write_wins',
  plantings: 'last_write_wins',
  harvests: 'last_write_wins',
  animal_groups: 'last_write_wins',
  animal_logs: 'append_only',
  inventory_transactions: 'append_only',
  households: 'server_wins',
  memberships: 'server_wins',
};

export function getConflictStrategy(entityType: string): ConflictStrategy {
  return ENTITY_STRATEGIES[entityType] ?? 'last_write_wins';
}

export function resolveConflict(
  entityType: string,
  local: Record<string, unknown>,
  remote: Record<string, unknown>
): Record<string, unknown> {
  const strategy = getConflictStrategy(entityType);

  switch (strategy) {
    case 'append_only':
      return remote;
    case 'server_wins':
      return remote;
    case 'last_write_wins':
    default: {
      const localUpdated = new Date(local.updated_at as string ?? local.updatedAt as string ?? 0);
      const remoteUpdated = new Date(remote.updated_at as string ?? remote.updatedAt as string ?? 0);
      return remoteUpdated >= localUpdated ? remote : local;
    }
  }
}

export function shouldSkipPush(item: SyncQueueItem): boolean {
  return item.retryCount >= 5;
}
