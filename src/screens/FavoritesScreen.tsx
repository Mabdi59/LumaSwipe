import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { destinations } from '../data/destinations';
import { Layout, type ThemeColors } from '../constants';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { DestinationCard } from '../components/DestinationCard';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useBlurActiveElementOnBlur } from '../hooks/useBlurActiveElementOnBlur';
import { useFavorites } from '../hooks/useFavorites';
import { useTripPlanner } from '../context/TripPlannerContext';
import { getTripStatusRank } from '../utils/tripPlanner';
import type { FavoritesScreenProps } from '../navigation/types';

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { colors, gradients, statusBarStyle } = useAppPreferences();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { getTripPlan } = useTripPlanner();
  const isWeb = Platform.OS === 'web';
  const styles = createStyles(colors);
  useBlurActiveElementOnBlur();

  const favoriteDestinations = destinations
    .filter((d) => favorites.includes(d.id))
    .sort((left, right) => {
      const leftPlan = getTripPlan(left.id);
      const rightPlan = getTripPlan(right.id);
      const statusGap = getTripStatusRank(leftPlan?.status) - getTripStatusRank(rightPlan?.status);

      if (statusGap !== 0) {
        return statusGap;
      }

      return left.name.localeCompare(right.name);
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />
      <LinearGradient colors={gradients.onboarding} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <SectionHeader
            title="Favorites"
            subtitle={
              favoriteDestinations.length > 0
                ? `${favoriteDestinations.length} saved destination${favoriteDestinations.length !== 1 ? 's' : ''}`
                : 'Your saved destinations'
            }
          />
        </View>

        {favoriteDestinations.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            subtitle="Swipe through destinations and tap the heart to save your favorite places."
          >
            <PrimaryButton
              title="Start Discovering"
              onPress={() => navigation.navigate('Discover')}
              size="md"
            />
          </EmptyState>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {favoriteDestinations.map((item) => (
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
