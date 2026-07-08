import { Stack } from 'expo-router';

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tasks' }} />
      <Stack.Screen name="new" options={{ title: 'New Task', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Task' }} />
    </Stack>
  );
}
