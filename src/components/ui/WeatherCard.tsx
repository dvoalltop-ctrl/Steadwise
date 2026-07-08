import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import type { WeatherAlert, WeatherAlertType, WeatherSnapshot } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';

interface WeatherCardProps {
  weather: WeatherSnapshot;
}

const alertIcons: Record<WeatherAlertType, keyof typeof Feather.glyphMap> = {
  frost: 'thermometer',
  heat: 'sun',
  rain: 'cloud-rain',
};

const alertColors: Record<WeatherAlert['severity'], string> = {
  info: colors.info,
  warning: colors.warning,
};

export function WeatherCard({ weather }: WeatherCardProps) {
  const alerts = weather.alerts ?? [];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather name="cloud" size={26} color={colors.sage} />
        </View>
        <View style={styles.main}>
          <Text style={styles.temp}>{Math.round(weather.tempF)}°F</Text>
          <Text style={styles.conditions}>{weather.conditions}</Text>
          <Text style={styles.subtle}>Feels like homestead weather · mock data</Text>
        </View>
      </View>

      {alerts.length > 0 ? (
        <View style={styles.alerts}>
          {alerts.map((alert, index) => (
            <View
              key={`${alert.type}-${index}`}
              style={[
                styles.alertRow,
                alert.severity === 'warning' && styles.alertRowWarning,
              ]}>
              <Feather
                name={alertIcons[alert.type]}
                size={16}
                color={alertColors[alert.severity]}
              />
              <Text style={styles.alertText}>{alert.message}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noAlerts}>No weather alerts right now.</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.wheat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    gap: 2,
  },
  temp: {
    fontSize: typography.size.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: typography.size.xxxl * typography.lineHeight.tight,
  },
  conditions: {
    fontSize: typography.size.lg,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subtle: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  alerts: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.gray50,
  },
  alertRowWarning: {
    backgroundColor: '#FBF6E8',
  },
  alertText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  noAlerts: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
});
