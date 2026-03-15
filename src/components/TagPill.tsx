import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, FontSizes, FontWeights, Layout } from '../constants';

interface TagPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  small?: boolean;
}

export const TagPill: React.FC<TagPillProps> = ({
  label,
  active = false,
  onPress,
  style,
  small = false,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.pill,
        small && styles.pillSmall,
        active ? styles.pillActive : styles.pillInactive,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          small && styles.labelSmall,
          active ? styles.labelActive : styles.labelInactive,
        ]}
      >
        {label}
      </Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    marginRight: Layout.spacing.sm,
  },
  pillSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.glassBorder,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: FontSizes.xs,
  },
  labelActive: {
    color: Colors.white,
  },
  labelInactive: {
    color: Colors.textSecondary,
  },
});
