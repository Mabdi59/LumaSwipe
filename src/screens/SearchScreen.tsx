import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { DestinationCard } from '../components/DestinationCard';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useFavorites } from '../hooks/useFavorites';
import { useBlurActiveElementOnBlur } from '../hooks/useBlurActiveElementOnBlur';
import { useSearch } from '../hooks/useSearch';
import type { SearchScreenProps } from '../navigation/types';

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { colors, gradients, statusBarStyle } = useAppPreferences();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { query, setQuery, results, clearSearch } = useSearch();
  const isWeb = Platform.OS === 'web';
  const styles = createStyles(colors);
  useBlurActiveElementOnBlur();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />
      <LinearGradient colors={gradients.onboarding} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>Find your next adventure</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={clearSearch}
            placeholder="Search destinations, countries…"
          />
        </View>

        {/* Results */}
        {query.trim() === '' ? (
          <EmptyState
            icon="search-outline"
            title="Explore destinations"
            subtitle="Type a destination name, country, or vibe like 'romantic' or 'adventure' to find places."
            style={styles.emptyState}
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="telescope-outline"
            title="No results found"
            subtitle={`No destinations match "${query}". Try searching for a country or vibe.`}
            style={styles.emptyState}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            <Text style={styles.resultCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </Text>
            {results.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <DestinationCard
                  destination={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() => navigation.navigate('Details', { destinationId: item.id })}
                  style={[
                    styles.card,
                    isWeb && styles.webCard,
                  ]}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  emptyState: {
    marginTop: -Layout.spacing.xl,
  },
  resultCount: {
    color: colors.textMuted,
    fontSize: FontSizes.sm,
    marginBottom: Layout.spacing.md,
  },
  list: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  cardWrapper: {
    marginBottom: Layout.spacing.md,
  },
  card: {
    width: '100%',
    height: 220,
  },
  webCard: {
    maxWidth: 720,
    alignSelf: 'center',
  },
});
