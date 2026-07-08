import { describe, it, expect } from 'vitest';
import {
  canAccessHousehold,
  hasMinimumRole,
  canManageMembers,
} from '@/lib/permissions';

describe('permissions', () => {
  const memberships = [
    { householdId: 'hh1', role: 'member' as const },
    { householdId: 'hh2', role: 'owner' as const },
  ];

  it('checks household access', () => {
    expect(canAccessHousehold(memberships, 'hh1')).toBe(true);
    expect(canAccessHousehold(memberships, 'hh3')).toBe(false);
  });

  it('enforces role hierarchy', () => {
    expect(hasMinimumRole('admin', 'member')).toBe(true);
    expect(hasMinimumRole('member', 'admin')).toBe(false);
    expect(hasMinimumRole('owner', 'admin')).toBe(true);
  });

  it('restricts member management to admin+', () => {
    expect(canManageMembers('owner')).toBe(true);
    expect(canManageMembers('admin')).toBe(true);
    expect(canManageMembers('member')).toBe(false);
    expect(canManageMembers('viewer')).toBe(false);
  });
});
