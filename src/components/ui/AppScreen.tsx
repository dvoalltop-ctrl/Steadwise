import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
  type ScrollViewProps,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface AppScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padded?: boolean;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  edges?: Edge[];
  scrollProps?: Omit<ScrollViewProps, 'children' | 'style'>;
  footer?: React.ReactNode;
}

export function AppScreen({
  children,
  style,
  contentStyle,
  padded = true,
  scrollable = false,
  keyboardAvoiding = false,
  edges = ['left', 'right'],
  scrollProps,
  footer,
}: AppScreenProps) {
  const paddingStyle = padded ? styles.padded : undefined;

  const body = scrollable ? (
    <ScrollView
      {...scrollProps}
      style={styles.flex}
      contentContainerStyle={[paddingStyle, contentStyle, scrollProps?.contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, paddingStyle, contentStyle]}>{children}</View>
  );

  const content = (
    <>
      {body}
      {footer}
    </>
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
