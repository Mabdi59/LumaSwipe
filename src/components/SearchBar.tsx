import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes, Layout, type ThemeColors } from '../constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { blurWebActiveElement } from '../utils/web';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search destinations…',
  onClear,
  style,
  autoFocus = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);
  const resolvedPlaceholder = typeof placeholder === 'string'
    ? placeholder.replace(/â€¦/g, '...').replace(/…/g, '...')
    : 'Search destinations...';

  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search"
        size={18}
        color={colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            blurWebActiveElement();
            onChangeText('');
            onClear?.();
          }}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 12,
  },
  icon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: FontSizes.md,
  },
});
