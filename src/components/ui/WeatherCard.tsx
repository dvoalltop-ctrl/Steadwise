import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import type { WeatherSnapshot } from '@/types';
import { colors, spacing, typography } from '@/theme';

interface WeatherCardProps {
  weather: WeatherSnapshot;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Feather name="cloud" size={28} color={colors.sage} />
        <View style={styles.info}>
          <Text style={styles.temp}>{Math.round(weather.tempF)}°F</Text>
          <Text style={styles.conditions}>{weather.conditions}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  info: { flex: 1 },
  temp: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  conditions: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
});
