export type SyncOperation = 'insert' | 'update' | 'delete';

export interface SyncQueueItem {
  id: string;
  householdId: string;
  entityType: string;
  entityId: string;
  operation: SyncOperation;
  payload: string;
  createdAt: string;
  retryCount: number;
  lastError: string | null;
}

export class SyncQueue {
  private items: SyncQueueItem[] = [];

  enqueue(item: Omit<SyncQueueItem, 'retryCount' | 'lastError'>): void {
    // Replace pending mutation for same entity+operation
    this.items = this.items.filter(
      (i) => !(i.entityType === item.entityType && i.entityId === item.entityId)
    );
    this.items.push({ ...item, retryCount: 0, lastError: null });
    this.items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  peek(): SyncQueueItem | undefined {
    return this.items[0];
  }

  dequeue(): SyncQueueItem | undefined {
    return this.items.shift();
  }

  markFailed(id: string, error: string): void {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.retryCount += 1;
      item.lastError = error;
    }
  }

  getPending(): SyncQueueItem[] {
    return [...this.items];
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

export const syncQueue = new SyncQueue();
