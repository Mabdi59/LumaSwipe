import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';

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

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
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
        onPress={onPress}
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
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.gradientWrapper, style]}
      disabled={loading}
    >
      <LinearGradient
        colors={GradientPresets.primaryButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, sizeStyles[size]]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={[styles.gradientText, { fontSize: textSizes[size] }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.5,
  },
  outlineButton: {
    borderRadius: Layout.radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.5,
  },
  ghostButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
