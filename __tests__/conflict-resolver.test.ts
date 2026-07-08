import { describe, it, expect } from 'vitest';
import { resolveConflict, getConflictStrategy } from '@/sync/conflict-resolver';

describe('conflict-resolver', () => {
  it('uses last_write_wins for tasks', () => {
    expect(getConflictStrategy('tasks')).toBe('last_write_wins');
  });

  it('uses append_only for animal_logs', () => {
    expect(getConflictStrategy('animal_logs')).toBe('append_only');
  });

  it('picks newer record in last_write_wins', () => {
    const local = { updated_at: '2026-07-01T10:00:00Z', title: 'Local' };
    const remote = { updated_at: '2026-07-02T10:00:00Z', title: 'Remote' };
    const result = resolveConflict('tasks', local, remote);
    expect(result.title).toBe('Remote');
  });

  it('keeps local when newer in last_write_wins', () => {
    const local = { updated_at: '2026-07-03T10:00:00Z', title: 'Local' };
    const remote = { updated_at: '2026-07-02T10:00:00Z', title: 'Remote' };
    const result = resolveConflict('tasks', local, remote);
    expect(result.title).toBe('Local');
  });
});
