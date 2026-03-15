import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { DestinationCard } from '../components/DestinationCard';
import { useFavorites } from '../hooks/useFavorites';
import { useSearch } from '../hooks/useSearch';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { query, setQuery, results, clearSearch } = useSearch();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={GradientPresets.onboarding} style={StyleSheet.absoluteFill} />

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
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultCount}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <DestinationCard
                  destination={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() => navigation.navigate('Details', { destinationId: item.id })}
                  style={styles.card}
                />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -1,
  },
  subtitle: {
    color: Colors.textSecondary,
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
    color: Colors.textMuted,
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
});
