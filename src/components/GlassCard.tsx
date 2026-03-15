import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Layout, type ThemeColors } from '../constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return <View style={[styles.card, style]}>{children}</View>;
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.glassBg,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: Layout.spacing.md,
  },
});
