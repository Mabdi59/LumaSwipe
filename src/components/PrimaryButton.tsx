import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { blurWebActiveElement } from '../utils/web';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
  variant?: 'gradient' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  loading = false,
  variant = 'gradient',
  size = 'md',
}) => {
  const { colors, gradients } = useAppPreferences();
  const styles = createStyles(colors);

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 20 },
    md: { paddingVertical: 16, paddingHorizontal: 32 },
    lg: { paddingVertical: 20, paddingHorizontal: 40 },
  };

  const textSizes = {
    sm: FontSizes.sm,
    md: FontSizes.base,
    lg: FontSizes.lg,
  };
  const handlePress = () => {
    blurWebActiveElement();
    onPress();
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.outlineButton, sizeStyles[size], style]}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={[styles.outlineText, { fontSize: textSizes[size] }]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.ghostButton, sizeStyles[size], style]}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text style={[styles.ghostText, { fontSize: textSizes[size] }]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={[styles.gradientWrapper, style]}
      disabled={loading}
    >
      <LinearGradient
        colors={gradients.primaryButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, sizeStyles[size]]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.gradientText, { fontSize: textSizes[size] }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  gradientWrapper: {
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientText: {
    color: colors.white,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.5,
  },
  outlineButton: {
    borderRadius: Layout.radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.5,
  },
  ghostButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
