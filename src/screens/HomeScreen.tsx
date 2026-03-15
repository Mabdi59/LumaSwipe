import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  StatusBar,
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { categories, destinations, type Destination } from '../data/destinations';
import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { DestinationCard } from '../components/DestinationCard';
import { GlassCard } from '../components/GlassCard';
import { TagPill } from '../components/TagPill';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useBlurActiveElementOnBlur } from '../hooks/useBlurActiveElementOnBlur';
import { useTripPlanner } from '../context/TripPlannerContext';
import { useFavorites } from '../hooks/useFavorites';
import { getRandomDestination, filterByCategory } from '../utils/destinationUtils';
import {
  getChecklistProgress,
  getTripStatusColor,
  getTripPlanDisplayLabel,
  getTripStatusTextColor,
} from '../utils/tripPlanner';
import { blurWebActiveElement } from '../utils/web';
import type { DiscoverScreenProps } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Layout.card.width;
const CARD_INTERVAL = ITEM_WIDTH + Layout.spacing.md;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

export default function HomeScreen({ navigation }: DiscoverScreenProps) {
  const { colors, gradients, statusBarStyle } = useAppPreferences();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { activePlans, tripStats } = useTripPlanner();
  const isWeb = Platform.OS === 'web';
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Destination>>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const styles = createStyles(colors);
  useBlurActiveElementOnBlur();

  const filteredDestinations = filterByCategory(activeCategory);
  const currentDestination = filteredDestinations[activeIndex] ?? filteredDestinations[0];
  const featuredPlans = useMemo(
    () =>
      activePlans
        .map((plan) => ({
          plan,
          destination: destinations.find((destination) => destination.id === plan.destinationId),
        }))
        .filter(
          (entry): entry is { plan: (typeof activePlans)[number]; destination: Destination } =>
            entry.destination !== undefined
        )
        .slice(0, 3),
    [activePlans]
  );

  const handleRandom = useCallback(() => {
    const currentDestinationId = filteredDestinations[activeIndex]?.id;
    const random = getRandomDestination(filteredDestinations, currentDestinationId);

    if (!random) {
      return;
    }

    const nextIndex = filteredDestinations.findIndex((destination) => destination.id === random.id);
    if (nextIndex >= 0) {
      if (isWeb) {
        scrollViewRef.current?.scrollTo({ x: nextIndex * CARD_INTERVAL, animated: true });
        setActiveIndex(nextIndex);
      } else {
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    }
  }, [activeIndex, filteredDestinations, isWeb]);

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const firstVisibleItem = viewableItems.find((item) => item.index != null);
    if (firstVisibleItem?.index != null) {
      setActiveIndex(firstVisibleItem.index);
    }
  }).current;

  const handleCategorySelect = useCallback((category: string) => {
    setActiveCategory(category);
    setActiveIndex(0);

    if (isWeb) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    } else {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [isWeb]);

  const handleWebCardScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_INTERVAL);
    const clampedIndex = Math.max(0, Math.min(filteredDestinations.length - 1, nextIndex));
    setActiveIndex(clampedIndex);
  }, [filteredDestinations.length]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient colors={gradients.onboarding} style={StyleSheet.absoluteFill} />

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
            <Ionicons name="shuffle" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Category chips */}
        <View style={styles.categoriesWrapper}>
          {isWeb ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {categories.map((item) => (
                <TagPill
                  key={item}
                  label={item}
                  active={activeCategory === item}
                  onPress={() => handleCategorySelect(item)}
                />
              ))}
            </ScrollView>
          ) : (
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
                  onPress={() => handleCategorySelect(item)}
                />
              )}
            />
          )}
        </View>

        <View style={styles.plannerWrapper}>
          <GlassCard style={styles.plannerCard}>
            <View style={styles.plannerHeader}>
              <View style={styles.plannerCopy}>
                <Text style={styles.plannerTitle}>Continue Planning</Text>
                <Text style={styles.plannerSubtitle}>
                  {tripStats.total > 0
                    ? tripStats.checklistTotal > 0
                      ? `${tripStats.total} trip${tripStats.total !== 1 ? 's' : ''} saved - ${tripStats.checklistCompleted}/${tripStats.checklistTotal} tasks done`
                      : `${tripStats.total} trip${tripStats.total !== 1 ? 's' : ''} saved in your board`
                    : 'Open a destination and set a stage to start your trip board.'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.plannerBoardButton}
                onPress={() => {
                  blurWebActiveElement();
                  navigation.navigate('Profile');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.plannerBoardButtonText}>Trip Board</Text>
              </TouchableOpacity>
            </View>

            {featuredPlans.length > 0 ? (
              <View style={styles.planList}>
                {featuredPlans.map(({ plan, destination }) => {
                  const checklistProgress = getChecklistProgress(plan);

                  return (
                    <TouchableOpacity
                      key={plan.destinationId}
                      style={styles.planRow}
                      activeOpacity={0.85}
                      onPress={() => {
                        blurWebActiveElement();
                        navigation.navigate('Details', { destinationId: destination.id });
                      }}
                    >
                      <View style={styles.planTextWrap}>
                        <Text style={styles.planName} numberOfLines={1}>
                          {destination.name}
                        </Text>
                        <Text style={styles.planMeta}>{destination.country}</Text>
                        {checklistProgress.total > 0 && (
                          <Text style={styles.planTaskMeta}>
                            {checklistProgress.completed}/{checklistProgress.total} tasks done
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.planBadge,
                          { backgroundColor: getTripStatusColor(colors, plan.status) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.planBadgeText,
                            { color: getTripStatusTextColor(colors, plan.status) },
                          ]}
                        >
                          {getTripPlanDisplayLabel(plan)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              currentDestination && (
                <TouchableOpacity
                  style={styles.planPrompt}
                  activeOpacity={0.85}
                  onPress={() => {
                    blurWebActiveElement();
                    navigation.navigate('Details', { destinationId: currentDestination.id });
                  }}
                >
                  <View style={styles.planPromptIcon}>
                    <Ionicons name="map-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.planPromptCopy}>
                    <Text style={styles.planPromptTitle}>
                      Start with {currentDestination.name}
                    </Text>
                    <Text style={styles.planPromptSubtitle}>
                      Open the current card, pick a stage, and start a checklist.
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </GlassCard>
        </View>

        {/* Destination cards */}
        {isWeb ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_INTERVAL}
            decelerationRate="fast"
            contentContainerStyle={styles.webCardsContent}
            scrollEventThrottle={16}
            onScroll={handleWebCardScroll}
          >
            {filteredDestinations.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.webCardWrapper,
                  index === filteredDestinations.length - 1 && styles.webCardWrapperLast,
                ]}
              >
                <DestinationCard
                  destination={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() =>
                    navigation.navigate('Details', { destinationId: item.id })
                  }
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Animated.FlatList
            ref={flatListRef}
            data={filteredDestinations}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_INTERVAL}
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
                (index - 1) * CARD_INTERVAL,
                index * CARD_INTERVAL,
                (index + 1) * CARD_INTERVAL,
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
        )}

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
              if (dest) {
                blurWebActiveElement();
                navigation.navigate('Details', { destinationId: dest.id });
              }
            }}
          >
            <Text style={styles.exploreBtnText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
  },
  headerGreeting: {
    color: colors.textPrimary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -1,
  },
  headerSub: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  randomButton: {
    width: 46,
    height: 46,
    borderRadius: Layout.radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesWrapper: {
    marginBottom: Layout.spacing.md,
  },
  categoriesList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  webCardsContent: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: Layout.spacing.md,
  },
  webCardWrapper: {
    marginRight: Layout.spacing.md,
  },
  webCardWrapperLast: {
    marginRight: 0,
  },
  plannerWrapper: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  plannerCard: {
    gap: Layout.spacing.md,
  },
  plannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  plannerCopy: {
    flex: 1,
    gap: 4,
  },
  plannerTitle: {
    color: colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  plannerSubtitle: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  plannerBoardButton: {
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 10,
  },
  plannerBoardButtonText: {
    color: colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.3,
  },
  planList: {
    gap: Layout.spacing.sm,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  planTextWrap: {
    flex: 1,
    gap: 2,
  },
  planName: {
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  planMeta: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  planTaskMeta: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  planBadge: {
    borderRadius: Layout.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  planBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.3,
  },
  planPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    backgroundColor: colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: Layout.spacing.md,
  },
  planPromptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planPromptCopy: {
    flex: 1,
    gap: 2,
  },
  planPromptTitle: {
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  planPromptSubtitle: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
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
    backgroundColor: colors.textMuted,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  dotsMore: {
    color: colors.textMuted,
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
    color: colors.textMuted,
    fontSize: FontSizes.sm,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: Layout.radius.full,
    paddingVertical: 10,
    paddingHorizontal: Layout.spacing.md,
  },
  exploreBtnText: {
    color: colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
});
