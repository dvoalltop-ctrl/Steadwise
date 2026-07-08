/**
 * Steadwise design tokens — rustic-modern, warm, earthy palette.
 */
export const colors = {
  // Brand
  sage: '#5C7A5E',
  sageLight: '#8FA892',
  sageDark: '#3D5240',
  clay: '#B87D5C',
  clayLight: '#D4A088',
  wheat: '#F5EDD6',
  cream: '#FAF7F0',
  bark: '#3D3229',
  barkMuted: '#6B5D52',
  moss: '#4A6741',

  // Semantic
  success: '#5C7A5E',
  warning: '#C9A227',
  danger: '#C45C4A',
  info: '#5B8FA8',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#FAF9F7',
  gray100: '#F0EDE8',
  gray200: '#E0DBD3',
  gray300: '#C4BDB2',
  gray400: '#9A9288',
  gray500: '#6B6560',
  gray600: '#4A4540',
  gray700: '#3D3229',
  gray800: '#2A231C',
  gray900: '#1A1612',

  // Backgrounds
  background: '#FAF7F0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#3D3229',
  textSecondary: '#6B5D52',
  textMuted: '#9A9288',
  textInverse: '#FAF7F0',

  // Borders
  border: '#E0DBD3',
  borderLight: '#F0EDE8',

  // Tab bar
  tabActive: '#5C7A5E',
  tabInactive: '#9A9288',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#3D3229',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#3D3229',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

export const theme = { colors, spacing, radius, typography, shadows } as const;

export type Theme = typeof theme;
