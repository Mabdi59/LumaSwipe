export const Colors = {
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

export const GradientPresets = {
  heroOverlay: ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)'] as const,
  heroOverlayLight: ['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] as const,
  primaryButton: ['#6C63FF', '#A855F7', '#EC4899'] as const,
  card: ['rgba(108,99,255,0.1)', 'rgba(168,85,247,0.1)'] as const,
  onboarding: ['#0D0D1A', '#1A1A2E', '#16213E'] as const,
  tab: ['rgba(13,13,26,0.95)', '#0D0D1A'] as const,
};
