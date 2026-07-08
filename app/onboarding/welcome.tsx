import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Feather name="sun" size={40} color={colors.sage} />
          </View>
          <Text style={styles.brand}>Steadwise</Text>
          <Text style={styles.tagline}>Run your homestead with confidence.</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <Feather name={f.icon} size={20} color={colors.sage} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Get started" onPress={() => router.push('/onboarding/create-homestead')} />
          <Button
            title="I already have an account"
            variant="ghost"
            onPress={() => router.push('/onboarding/create-homestead')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const FEATURES = [
  { icon: 'check-square' as const, title: 'Daily clarity', description: 'See what needs doing today' },
  { icon: 'feather' as const, title: 'Track everything', description: 'Garden, animals, pantry & more' },
  { icon: 'wifi-off' as const, title: 'Works offline', description: 'Log on the homestead, sync later' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: spacing.xxxl },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.wheat,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  brand: {
    fontSize: typography.size.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  features: { gap: spacing.lg },
  featureRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  featureDesc: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: { gap: spacing.sm, marginBottom: spacing.lg },
});
