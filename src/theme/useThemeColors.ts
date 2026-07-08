import { useColorScheme } from '@/components/useColorScheme';
import { colors, darkColors } from '@/src/theme/colors';

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : colors;
}
