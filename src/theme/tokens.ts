/**
 * Steadwise design tokens — calm, warm, rustic-modern homestead palette.
 * Natural tones: cream, sage, clay, soil, charcoal.
 */
export const colors = {
  // Brand — earthy naturals
  sage: '#5C7A5E',
  sageLight: '#8FA892',
  sageDark: '#3D5240',
  sageMuted: '#E8F0E8',
  clay: '#B87D5C',
  clayLight: '#D4A088',
  clayMuted: '#F5E8DF',
  wheat: '#F5EDD6',
  cream: '#FAF7F0',
  soil: '#6B5D52',
  charcoal: '#2A231C',
  bark: '#3D3229',
  barkMuted: '#6B5D52',
  moss: '#4A6741',

  // Semantic
  success: '#5C7A5E',
  successMuted: '#E8F0E8',
  warning: '#C9A227',
  warningMuted: '#FDF6E3',
  danger: '#C45C4A',
  dangerMuted: '#FCEAE7',
  info: '#5B8FA8',
  infoMuted: '#E8F2F6',

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

  // Surfaces
  background: '#FAF7F0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceWarm: '#F5EDD6',

  // Text
  textPrimary: '#2A231C',
  textSecondary: '#6B5D52',
  textMuted: '#9A9288',
  textInverse: '#FAF7F0',

  // Borders
  border: '#E0DBD3',
  borderLight: '#F0EDE8',
  borderFocus: '#5C7A5E',

  // Tab bar
  tabActive: '#5C7A5E',
  tabInactive: '#9A9288',

  // Interactive
  pressed: 'rgba(42, 35, 28, 0.06)',
  overlay: 'rgba(42, 35, 28, 0.4)',
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
    shadowColor: '#2A231C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#2A231C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#2A231C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const theme = { colors, spacing, radius, typography, shadows } as const;

export type Theme = typeof theme;
