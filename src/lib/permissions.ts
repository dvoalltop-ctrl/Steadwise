import type { MembershipRole } from '@/types';

const ROLE_HIERARCHY: Record<MembershipRole, number> = {
  viewer: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

export function canAccessHousehold(
  userMemberships: Array<{ householdId: string; role: MembershipRole }>,
  householdId: string
): boolean {
  return userMemberships.some((m) => m.householdId === householdId);
}

export function hasMinimumRole(
  role: MembershipRole,
  required: MembershipRole
): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[required];
}

export function canManageMembers(role: MembershipRole): boolean {
  return hasMinimumRole(role, 'admin');
}

export function canDeleteRecords(role: MembershipRole): boolean {
  return hasMinimumRole(role, 'member');
}
