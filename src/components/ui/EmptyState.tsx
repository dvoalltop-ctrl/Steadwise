import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const theme = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.earth }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.earthMuted }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
