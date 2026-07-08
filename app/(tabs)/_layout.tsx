import { Tabs, router } from 'expo-router';
import { Platform, type ColorValue } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { IconButton } from '@/components/ui';
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
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.charcoal,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        headerRight: () => (
          <IconButton
            icon="settings"
            onPress={() => router.push('/settings')}
            variant="ghost"
            size="sm"
            style={{ marginRight: 8 }}
            accessibilityLabel="Settings"
          />
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
        name="tasks"
        options={{
          title: 'Tasks',
          href: '/tasks',
          headerShown: false,
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
          tabBarIcon: ({ color }) => <TabIcon name="heart" color={color} />,
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
