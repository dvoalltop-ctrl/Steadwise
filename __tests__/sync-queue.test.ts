import { describe, it, expect, beforeEach } from 'vitest';
import { SyncQueue } from '@/sync/sync-queue';

describe('SyncQueue', () => {
  let queue: SyncQueue;

  beforeEach(() => {
    queue = new SyncQueue();
  });

  it('enqueues items in FIFO order', () => {
    queue.enqueue({
      id: '1',
      householdId: 'hh1',
      entityType: 'tasks',
      entityId: 't1',
      operation: 'update',
      payload: '{}',
      createdAt: '2026-07-01T10:00:00Z',
    });
    queue.enqueue({
      id: '2',
      householdId: 'hh1',
      entityType: 'tasks',
      entityId: 't2',
      operation: 'insert',
      payload: '{}',
      createdAt: '2026-07-01T11:00:00Z',
    });

    expect(queue.size()).toBe(2);
    expect(queue.peek()?.id).toBe('1');
    expect(queue.dequeue()?.id).toBe('1');
    expect(queue.dequeue()?.id).toBe('2');
  });

  it('replaces pending mutation for same entity', () => {
    queue.enqueue({
      id: '1',
      householdId: 'hh1',
      entityType: 'tasks',
      entityId: 't1',
      operation: 'update',
      payload: '{"status":"open"}',
      createdAt: '2026-07-01T10:00:00Z',
    });
    queue.enqueue({
      id: '2',
      householdId: 'hh1',
      entityType: 'tasks',
      entityId: 't1',
      operation: 'update',
      payload: '{"status":"done"}',
      createdAt: '2026-07-01T10:01:00Z',
    });

    expect(queue.size()).toBe(1);
    expect(queue.peek()?.payload).toBe('{"status":"done"}');
  });

  it('tracks retry count on failure', () => {
    queue.enqueue({
      id: '1',
      householdId: 'hh1',
      entityType: 'tasks',
      entityId: 't1',
      operation: 'update',
      payload: '{}',
      createdAt: '2026-07-01T10:00:00Z',
    });
    queue.markFailed('1', 'Network error');
    const item = queue.getPending()[0];
    expect(item.retryCount).toBe(1);
    expect(item.lastError).toBe('Network error');
  });
});
