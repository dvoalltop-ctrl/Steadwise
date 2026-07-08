import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const theme = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.earth }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.earthMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
});
