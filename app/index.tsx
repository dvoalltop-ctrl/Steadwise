import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/app-store';
import { useAuth } from '@/providers/auth-provider';
import { colors } from '@/theme';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const { isAuthenticated, initialized, loading } = useAuth();

  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.sage} />
      </View>
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
