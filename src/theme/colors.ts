/**
 * Rustic-modern palette: warm creams, sage greens, wheat, and terracotta
 * accents grounded by soft earthy neutrals.
 */
export const colors = {
  // Surfaces
  background: '#FAF7F0',
  surface: '#FFFFFF',
  surfaceAlt: '#F3ECDD',

  // Borders / dividers
  border: '#E7DFCB',
  borderLight: '#F0E9DA',

  // Brand greens
  sage: '#7A8C5C',
  sageDark: '#5C6B45',
  sageLight: '#E4EAD7',

  // Warm accents
  wheat: '#E8D9B5',
  terracotta: '#C2694A',
  clay: '#B4744F',

  // Text
  textPrimary: '#2E2A24',
  textSecondary: '#6B6355',
  textMuted: '#9A9080',
  textInverse: '#FDFBF6',

  // Semantic
  success: '#5C8A4A',
  warning: '#D08C3F',
  danger: '#B4472F',
} as const;

export type ColorToken = keyof typeof colors;
