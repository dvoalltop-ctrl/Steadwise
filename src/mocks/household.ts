import type { Household, User, Membership } from '@/types';

const now = new Date().toISOString();
const householdId = 'hh-demo-001';
const userId = 'user-demo-001';

export const mockUser: User = {
  id: userId,
  email: 'homesteader@steadwise.app',
  displayName: 'Alex Morgan',
  avatarUrl: null,
};

export const mockHousehold: Household = {
  id: householdId,
  householdId,
  name: 'Oak Creek Homestead',
  slug: 'oak-creek',
  timezone: 'America/Chicago',
  latitude: 41.8781,
  longitude: -87.6298,
  homesteadTypes: ['garden', 'chickens', 'pantry'],
  settings: {},
  createdBy: userId,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
  localSyncStatus: 'synced',
  lastSyncedAt: null,
};

export const mockMembership: Membership = {
  id: 'mem-001',
  householdId,
  userId,
  role: 'owner',
  acceptedAt: now,
  createdBy: userId,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
  localSyncStatus: 'synced',
  lastSyncedAt: null,
};

export const DEMO_HOUSEHOLD_ID = householdId;
export const DEMO_USER_ID = userId;
