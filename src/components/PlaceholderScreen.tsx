import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const theme = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: theme.cream }]}>
      <Text style={[styles.title, { color: theme.earth }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.earthMuted }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
