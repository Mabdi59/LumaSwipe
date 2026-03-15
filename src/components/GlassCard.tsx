import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSizes, FontWeights, Layout } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassBg,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Layout.spacing.md,
  },
});
