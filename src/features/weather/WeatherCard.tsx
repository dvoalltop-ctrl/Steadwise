import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components';
import { colors, spacing, typography } from '@/theme';
import type { Weather } from '@/types';

/** Compact current-conditions summary for the Today dashboard. */
export function WeatherCard({ weather }: { weather: Weather }) {
  return (
    <Card>
      <View style={styles.row}>
        <Feather name="cloud" size={32} color={colors.sageDark} />
        <View style={styles.info}>
          <Text style={styles.temp}>{weather.tempF}°F</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
        </View>
        <View style={styles.range}>
          <Text style={styles.rangeText}>H {weather.high}°</Text>
          <Text style={styles.rangeText}>L {weather.low}°</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  temp: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  condition: { fontSize: typography.size.sm, color: colors.textSecondary },
  range: { alignItems: 'flex-end' },
  rangeText: { fontSize: typography.size.sm, color: colors.textSecondary },
});
