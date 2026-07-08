import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  const theme = useThemeColors();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.sage} />
      <Text style={[styles.message, { color: theme.earthMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  message: {
    fontSize: 16,
  },
});
