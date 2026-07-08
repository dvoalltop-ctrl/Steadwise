import { Tabs, router } from 'expo-router';
import { Pressable, Platform, type ColorValue } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme';

type FeatherIcon = keyof typeof Feather.glyphMap;

function TabIcon({ name, color }: { name: FeatherIcon; color: ColorValue }) {
  return <Feather name={name} size={22} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          paddingBottom: Platform.OS === 'ios' ? 4 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.bark,
        headerTitleStyle: { fontWeight: '600' },
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/settings')}
            style={{ marginRight: 16 }}
            hitSlop={8}
          >
            <Feather name="settings" size={22} color={colors.barkMuted} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="today/index"
        options={{
          title: 'Today',
          href: '/today',
          tabBarIcon: ({ color }) => <TabIcon name="sun" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: 'Tasks',
          href: '/tasks',
          tabBarIcon: ({ color }) => <TabIcon name="check-square" color={color} />,
        }}
      />
      <Tabs.Screen
        name="grow/index"
        options={{
          title: 'Grow',
          href: '/grow',
          tabBarIcon: ({ color }) => <TabIcon name="feather" color={color} />,
        }}
      />
      <Tabs.Screen
        name="animals/index"
        options={{
          title: 'Animals',
          href: '/animals',
          tabBarIcon: ({ color }) => <TabIcon name="github" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pantry/index"
        options={{
          title: 'Pantry',
          href: '/pantry',
          tabBarIcon: ({ color }) => <TabIcon name="archive" color={color} />,
        }}
      />
      <Tabs.Screen
        name="money/index"
        options={{
          title: 'Money',
          href: '/money',
          tabBarIcon: ({ color }) => <TabIcon name="dollar-sign" color={color} />,
        }}
      />
    </Tabs>
  );
}
