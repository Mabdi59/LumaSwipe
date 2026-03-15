import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants';

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
  const bgColors = {
    glass: isFavorite ? 'rgba(255,101,132,0.25)' : Colors.glassBg,
    solid: isFavorite ? Colors.accent : Colors.surface,
    minimal: Colors.transparent,
  };

  const borderColors = {
    glass: isFavorite ? Colors.accent : Colors.glassBorder,
    solid: isFavorite ? Colors.accent : Colors.surface,
    minimal: Colors.transparent,
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
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
        color={isFavorite ? Colors.accent : Colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
