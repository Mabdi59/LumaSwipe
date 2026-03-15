export const DarkColors = {
  // Primary palette
  primary: '#6C63FF',
  primaryDark: '#4A43D4',
  primaryLight: '#9B94FF',
  accent: '#FF6584',
  accentAlt: '#FFD166',

  // Backgrounds
  background: '#0D0D1A',
  backgroundCard: '#1A1A2E',
  backgroundElevated: '#16213E',
  surface: '#1E1E30',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A8A8C0',
  textMuted: '#6B6B85',
  textInverse: '#0D0D1A',

  // Grads
  gradientStart: '#6C63FF',
  gradientMid: '#A855F7',
  gradientEnd: '#EC4899',

  // Status
  success: '#4CAF50',
  warning: '#FFD166',
  error: '#FF6584',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
  overlayDark: 'rgba(0,0,0,0.7)',
  glassBg: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.15)',
  cardShadow: 'rgba(108,99,255,0.3)',
};

export const LightColors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  accent: '#E11D48',
  accentAlt: '#F59E0B',

  background: '#F4F7FB',
  backgroundCard: '#FFFFFF',
  backgroundElevated: '#E8EEF8',
  surface: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  gradientStart: '#4F46E5',
  gradientMid: '#7C3AED',
  gradientEnd: '#EC4899',

  success: '#16A34A',
  warning: '#D97706',
  error: '#E11D48',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(15,23,42,0.18)',
  overlayDark: 'rgba(15,23,42,0.38)',
  glassBg: 'rgba(255,255,255,0.75)',
  glassBorder: 'rgba(71,85,105,0.16)',
  cardShadow: 'rgba(79,70,229,0.16)',
};

export const DarkGradients = {
  heroOverlay: ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)'] as const,
  heroOverlayLight: ['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] as const,
  primaryButton: ['#6C63FF', '#A855F7', '#EC4899'] as const,
  card: ['rgba(108,99,255,0.1)', 'rgba(168,85,247,0.1)'] as const,
  onboarding: ['#0D0D1A', '#1A1A2E', '#16213E'] as const,
  tab: ['rgba(13,13,26,0.95)', '#0D0D1A'] as const,
};

export const LightGradients = {
  heroOverlay: ['transparent', 'rgba(15,23,42,0.2)', 'rgba(15,23,42,0.76)'] as const,
  heroOverlayLight: ['transparent', 'rgba(15,23,42,0.14)', 'rgba(15,23,42,0.56)'] as const,
  primaryButton: ['#4F46E5', '#7C3AED', '#EC4899'] as const,
  card: ['rgba(79,70,229,0.08)', 'rgba(236,72,153,0.08)'] as const,
  onboarding: ['#F8FAFC', '#EEF2FF', '#FCE7F3'] as const,
  tab: ['rgba(255,255,255,0.96)', '#F4F7FB'] as const,
};

export const Colors = DarkColors;
export const GradientPresets = DarkGradients;

export type ThemeColors = typeof DarkColors;
export type ThemeGradients = {
  heroOverlay: readonly [string, string, string];
  heroOverlayLight: readonly [string, string, string];
  primaryButton: readonly [string, string, string];
  card: readonly [string, string];
  onboarding: readonly [string, string, string];
  tab: readonly [string, string];
};
