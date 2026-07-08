import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { AppScreen, EmptyState, Button } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <AppScreen>
        <EmptyState
          icon="map"
          title="This screen doesn't exist"
          description="The page you're looking for may have moved or isn't built yet."
        />
        <Button title="Back to Today" variant="secondary" onPress={() => router.replace('/')} fullWidth />
      </AppScreen>
    </>
  );
}
