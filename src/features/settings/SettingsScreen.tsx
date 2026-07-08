import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Screen, SectionHeader } from '@/components';
import { colors, spacing, typography } from '@/theme';

interface Row {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}

const ROWS: Row[] = [
  { icon: 'database', label: 'Data source', value: 'Mock' },
  { icon: 'moon', label: 'Appearance', value: 'Light' },
  { icon: 'bell', label: 'Reminders', value: 'Off' },
  { icon: 'info', label: 'Version', value: '0.1.0' },
];

export function SettingsScreen() {
  return (
    <Screen title="Settings" subtitle="Preferences & about">
      <SectionHeader title="General" />
      <Card padded={false}>
        {ROWS.map((row, i) => (
          <View
            key={row.label}
            style={[styles.row, i < ROWS.length - 1 && styles.divider]}
          >
            <Feather name={row.icon} size={18} color={colors.sageDark} />
            <View style={styles.labelWrap}>
              <Text style={styles.label}>{row.label}</Text>
            </View>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  labelWrap: { flex: 1, minWidth: 0 },
  label: { fontSize: typography.size.md, color: colors.textPrimary },
  value: { fontSize: typography.size.md, color: colors.textSecondary },
});
