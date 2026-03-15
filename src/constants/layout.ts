import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Layout = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  // Border radius
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },
  // Card dimensions
  card: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.68,
  },
  // Tab bar
  tabBarHeight: 80,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  display: 48,
};

export const FontWeights: Record<string, '400' | '500' | '600' | '700' | '800' | '900'> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};
