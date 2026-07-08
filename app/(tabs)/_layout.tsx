import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';
import { colors } from '@/theme';

type FeatherName = keyof typeof Feather.glyphMap;

function icon(name: FeatherName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Feather name={name} color={color} size={size} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: 'none',
        tabBarActiveTintColor: colors.sageDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', tabBarIcon: icon('check-square') }} />
      <Tabs.Screen name="grow" options={{ title: 'Grow', tabBarIcon: icon('sun') }} />
      <Tabs.Screen name="animals" options={{ title: 'Animals', tabBarIcon: icon('feather') }} />
      <Tabs.Screen name="pantry" options={{ title: 'Pantry', tabBarIcon: icon('package') }} />
      <Tabs.Screen name="money" options={{ title: 'Money', tabBarIcon: icon('dollar-sign') }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
