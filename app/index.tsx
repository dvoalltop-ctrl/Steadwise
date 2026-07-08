import { Redirect } from 'expo-router';
import { AppScreen, LoadingState } from '@/components/ui';
import { useAppStore } from '@/stores/app-store';
import { useAuth } from '@/providers/auth-provider';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const { isAuthenticated, initialized, loading } = useAuth();

  if (!initialized || loading) {
    return (
      <AppScreen padded={false}>
        <LoadingState message="Preparing your homestead…" />
      </AppScreen>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
