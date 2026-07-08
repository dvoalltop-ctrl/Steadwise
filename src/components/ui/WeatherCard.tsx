import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import type { WeatherSnapshot } from '@/types';
import { colors, spacing, typography } from '@/theme';

interface WeatherCardProps {
  weather: WeatherSnapshot;
}

function parseTodayForecast(forecastJson: string | null): { high?: number; low?: number } {
  if (!forecastJson) return {};
  try {
    const forecast = JSON.parse(forecastJson) as { high?: number; low?: number }[];
    return forecast[0] ?? {};
  } catch {
    return {};
  }
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { high, low } = parseTodayForecast(weather.forecastJson);

  return (
    <Card variant="warm">
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Feather name="cloud" size={28} color={colors.sage} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Today's weather</Text>
          <Text style={styles.temp}>{Math.round(weather.tempF)}°F</Text>
          <Text style={styles.conditions}>{weather.conditions}</Text>
        </View>
        {(high != null || low != null) && (
          <View style={styles.meta}>
            {high != null && <Text style={styles.metaText}>H {Math.round(high)}°</Text>}
            {low != null && <Text style={styles.metaText}>L {Math.round(low)}°</Text>}
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.sageMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  label: {
    fontSize: typography.size.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  temp: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  conditions: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  meta: { alignItems: 'flex-end', gap: 2 },
  metaText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
