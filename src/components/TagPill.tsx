import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { blurWebActiveElement } from '../utils/web';

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
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);
  const Component = onPress ? TouchableOpacity : View;
  const handlePress = onPress
    ? () => {
        blurWebActiveElement();
        onPress();
      }
    : undefined;

  return (
    <Component
      onPress={handlePress}
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
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
    color: colors.white,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
});
