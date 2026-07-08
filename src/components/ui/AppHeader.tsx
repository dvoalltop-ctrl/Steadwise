import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { IconButton } from './IconButton';
import { colors, spacing, typography } from '@/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  greeting?: string;
  onBack?: () => void;
  rightAction?: { icon: keyof typeof Feather.glyphMap; onPress: () => void; label?: string };
  style?: ViewStyle;
  large?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  greeting,
  onBack,
  rightAction,
  style,
  large = false,
}: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        {onBack ? (
          <IconButton icon="arrow-left" onPress={onBack} variant="ghost" size="sm" />
        ) : (
          <View style={styles.spacer} />
        )}
        {rightAction && (
          <IconButton
            icon={rightAction.icon}
            onPress={rightAction.onPress}
            variant="ghost"
            size="sm"
            accessibilityLabel={rightAction.label}
          />
        )}
      </View>

      {greeting && <Text style={styles.greeting}>{greeting}</Text>}
      <Text style={[styles.title, large && styles.titleLarge]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    minHeight: 40,
  },
  spacer: { width: 40 },
  greeting: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  titleLarge: {
    fontSize: typography.size.xxl,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
  },
});
