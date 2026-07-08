import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HomesteadType } from '@/types';

interface AppState {
  onboardingComplete: boolean;
  homesteadName: string;
  homesteadTypes: HomesteadType[];
  useLocalDb: boolean;
  completeOnboarding: (data: {
    homesteadName: string;
    homesteadTypes: HomesteadType[];
  }) => void;
  resetOnboarding: () => void;
  setUseLocalDb: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingComplete: false,
      homesteadName: '',
      homesteadTypes: [],
      useLocalDb: false,
      completeOnboarding: ({ homesteadName, homesteadTypes }) =>
        set({ onboardingComplete: true, homesteadName, homesteadTypes }),
      resetOnboarding: () =>
        set({ onboardingComplete: false, homesteadName: '', homesteadTypes: [] }),
      setUseLocalDb: (value) => set({ useLocalDb: value }),
    }),
    {
      name: 'steadwise-app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
