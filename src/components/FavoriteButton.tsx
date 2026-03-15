import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Layout, type ThemeColors } from '../constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { blurWebActiveElement } from '../utils/web';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
  style?: ViewStyle;
  variant?: 'glass' | 'solid' | 'minimal';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 24,
  style,
  variant = 'glass',
}) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  const bgColors = {
    glass: isFavorite ? 'rgba(255,101,132,0.25)' : colors.glassBg,
    solid: isFavorite ? colors.accent : colors.surface,
    minimal: colors.transparent,
  };

  const borderColors = {
    glass: isFavorite ? colors.accent : colors.glassBorder,
    solid: isFavorite ? colors.accent : colors.surface,
    minimal: colors.transparent,
  };
  const handleToggle = () => {
    blurWebActiveElement();
    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.8}
      style={[
        styles.button,
        variant !== 'minimal' && {
          backgroundColor: bgColors[variant],
          borderColor: borderColors[variant],
        },
        style,
      ]}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite ? colors.accent : colors.white}
      />
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
