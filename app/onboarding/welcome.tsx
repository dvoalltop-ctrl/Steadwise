import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, AppHeader, Button, Card } from '@/components/ui';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';

const FEATURES = [
  { icon: 'check-square' as const, title: 'Daily clarity', description: 'See what needs doing today' },
  { icon: 'feather' as const, title: 'Track everything', description: 'Garden, animals, pantry & more' },
  { icon: 'wifi-off' as const, title: 'Works offline', description: 'Log on the homestead, sync later' },
];

export default function WelcomeScreen() {
  return (
    <AppScreen edges={['top', 'left', 'right', 'bottom']} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Feather name="sun" size={44} color={colors.sage} />
          </View>
          <AppHeader title="Steadwise" subtitle="Run your homestead with confidence." large />
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <Card key={f.title} variant="warm" style={styles.featureCard}>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Feather name={f.icon} size={20} color={colors.sage} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Get started" onPress={() => router.push('/onboarding/create-homestead')} fullWidth />
          <Button
            title="I already have an account"
            variant="ghost"
            onPress={() => router.push('/(auth)/sign-in')}
            fullWidth
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.xl },
  hero: { alignItems: 'center', marginTop: spacing.xxl },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.sageMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  features: { flex: 1, gap: spacing.sm, marginTop: spacing.xxl },
  featureCard: { marginBottom: 0 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  featureDesc: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  actions: { gap: spacing.sm, marginBottom: spacing.lg },
});
