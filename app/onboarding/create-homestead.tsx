import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, AppHeader, Button, FormInput } from '@/components/ui';
import { spacing } from '@/theme';

export default function CreateHomesteadScreen() {
  const [name, setName] = useState('');

  return (
    <AppScreen keyboardAvoiding edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <AppHeader
          title="Name your homestead"
          subtitle="This is your household workspace. You can invite family members later."
          onBack={() => router.back()}
          large
        />

        <FormInput
          label="Homestead name"
          placeholder="e.g. Oak Creek Homestead"
          value={name}
          onChangeText={setName}
          autoFocus
          hint="Choose something warm and personal"
        />

        <View style={styles.footer}>
          <Button
            title="Continue"
            disabled={name.trim().length < 2}
            onPress={() =>
              router.push({ pathname: '/onboarding/select-types', params: { name } })
            }
            fullWidth
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  footer: { marginTop: 'auto', marginBottom: spacing.lg },
});
