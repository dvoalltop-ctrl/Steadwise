import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/app-store';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  if (!onboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
