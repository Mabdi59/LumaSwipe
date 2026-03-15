import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { destinations, categories } from '../data/destinations';
import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
import { DestinationCard } from '../components/DestinationCard';
import { TagPill } from '../components/TagPill';
import { useFavorites } from '../hooks/useFavorites';
import { getRandomDestination, filterByCategory } from '../utils/destinationUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Layout.card.width;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const filteredDestinations = filterByCategory(activeCategory);

  const handleRandom = useCallback(() => {
    const random = getRandomDestination();
    const idx = filteredDestinations.findIndex((d) => d.id === random.id);
    if (idx >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: idx, animated: true });
    }
  }, [filteredDestinations]);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient colors={GradientPresets.onboarding} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Discover</Text>
            <Text style={styles.headerSub}>Where will you go next?</Text>
          </View>
          <TouchableOpacity
            style={styles.randomButton}
            onPress={handleRandom}
            activeOpacity={0.8}
          >
            <Ionicons name="shuffle" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Category chips */}
        <View style={styles.categoriesWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TagPill
                label={item}
                active={activeCategory === item}
                onPress={() => {
                  setActiveCategory(item);
                  setActiveIndex(0);
                  flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
                }}
              />
            )}
          />
        </View>

        {/* Destination cards */}
        <Animated.FlatList
          ref={flatListRef}
          data={filteredDestinations}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + Layout.spacing.md}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: SIDE_PADDING,
            paddingBottom: Layout.spacing.md,
          }}
          ItemSeparatorComponent={() => <View style={{ width: Layout.spacing.md }} />}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * (ITEM_WIDTH + Layout.spacing.md),
              index * (ITEM_WIDTH + Layout.spacing.md),
              (index + 1) * (ITEM_WIDTH + Layout.spacing.md),
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.92, 1, 0.92],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <DestinationCard
                  destination={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() =>
                    navigation.navigate('Details', { destinationId: item.id })
                  }
                />
              </Animated.View>
            );
          }}
        />

        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {filteredDestinations.slice(0, 8).map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                i === activeIndex % filteredDestinations.length && styles.dotActive,
              ]}
            />
          ))}
          {filteredDestinations.length > 8 && (
            <Text style={styles.dotsMore}>+{filteredDestinations.length - 8}</Text>
          )}
        </View>

        {/* Bottom action bar */}
        <View style={styles.actionBar}>
          <Text style={styles.countLabel}>
            {activeIndex + 1} / {filteredDestinations.length} destinations
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            activeOpacity={0.8}
            onPress={() => {
              const dest = filteredDestinations[activeIndex];
              if (dest) navigation.navigate('Details', { destinationId: dest.id });
            }}
          >
            <Text style={styles.exploreBtnText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
  },
  headerGreeting: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -1,
  },
  headerSub: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  randomButton: {
    width: 46,
    height: 46,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesWrapper: {
    marginBottom: Layout.spacing.md,
  },
  categoriesList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingVertical: Layout.spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  dotsMore: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginLeft: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  countLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    paddingVertical: 10,
    paddingHorizontal: Layout.spacing.md,
  },
  exploreBtnText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
});
