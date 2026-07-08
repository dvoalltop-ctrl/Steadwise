import { create } from 'zustand';
import { syncQueue } from '@/sync/sync-queue';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

interface SyncState {
  status: SyncStatus;
  lastPushAt: string | null;
  lastPullAt: string | null;
  pendingCount: number;
  lastError: string | null;
  setStatus: (status: SyncStatus) => void;
  setLastPushAt: (at: string) => void;
  setLastPullAt: (at: string) => void;
  setPendingCount: (count: number) => void;
  setLastError: (error: string | null) => void;
  refreshPendingCount: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  lastPushAt: null,
  lastPullAt: null,
  pendingCount: 0,
  lastError: null,
  setStatus: (status) => set({ status }),
  setLastPushAt: (at) => set({ lastPushAt: at }),
  setLastPullAt: (at) => set({ lastPullAt: at }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setLastError: (error) => set({ lastError: error }),
  refreshPendingCount: () => set({ pendingCount: syncQueue.size() }),
}));
