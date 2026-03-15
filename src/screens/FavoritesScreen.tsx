import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { destinations } from '../data/destinations';
import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { DestinationCard } from '../components/DestinationCard';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const favoriteDestinations = destinations.filter((d) => favorites.includes(d.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={GradientPresets.onboarding} style={StyleSheet.absoluteFill} />

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
          <FlatList
            data={favoriteDestinations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            numColumns={1}
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
