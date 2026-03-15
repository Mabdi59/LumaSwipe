import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { FavoriteButton } from '../components/FavoriteButton';
import { TagPill } from '../components/TagPill';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useBlurActiveElementOnBlur } from '../hooks/useBlurActiveElementOnBlur';
import { useDestinationWeather } from '../hooks/useDestinationWeather';
import { useFavorites } from '../hooks/useFavorites';
import { useTripPlanner } from '../context/TripPlannerContext';
import { getDestinationById } from '../utils/destinationUtils';
import type { DetailsScreenProps } from '../navigation/types';
import {
  TRIP_STATUS_OPTIONS,
  createDefaultTripChecklist,
  getChecklistProgress,
  getTripStatusLabel,
  type TripStatus,
} from '../utils/tripPlanner';
import { blurWebActiveElement } from '../utils/web';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_WIDTH * 0.85;

export default function DetailsScreen({ navigation, route }: DetailsScreenProps) {
  const { destinationId } = route.params;
  const { colors, gradients } = useAppPreferences();
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    getTripPlan,
    setTripStatus,
    saveTripNotes,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    clearTripPlan,
  } = useTripPlanner();
  const styles = createStyles(colors);
  useBlurActiveElementOnBlur();

  const destination = getDestinationById(destinationId);
  const { data: liveWeather, loading: liveWeatherLoading, error: liveWeatherError } =
    useDestinationWeather(destination);
  const tripPlan = destination ? getTripPlan(destination.id) : undefined;
  const [noteDraft, setNoteDraft] = useState('');
  const [checklistDraft, setChecklistDraft] = useState('');
  const hasTripPlan = Boolean(tripPlan?.status || tripPlan?.notes.trim());
  const checklistItems = tripPlan?.checklist ?? createDefaultTripChecklist();
  const checklistProgress = getChecklistProgress({ checklist: checklistItems });

  useEffect(() => {
    setNoteDraft(tripPlan?.notes ?? '');
  }, [destinationId, tripPlan?.notes]);

  if (!destination) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Destination not found</Text>
      </View>
    );
  }

  const favorited = isFavorite(destination.id);

  const handleStatusSelect = (status: TripStatus) => {
    setTripStatus(destination.id, tripPlan?.status === status ? null : status);
  };

  const handleSaveNotes = () => {
    saveTripNotes(destination.id, noteDraft);
  };

  const handleClearPlan = () => {
    clearTripPlan(destination.id);
    setNoteDraft('');
    setChecklistDraft('');
  };

  const handleChecklistToggle = (itemId: string) => {
    blurWebActiveElement();
    toggleChecklistItem(destination.id, itemId);
  };

  const handleChecklistAdd = () => {
    const trimmedDraft = checklistDraft.trim();
    if (!trimmedDraft) {
      return;
    }

    blurWebActiveElement();
    addChecklistItem(destination.id, trimmedDraft);
    setChecklistDraft('');
  };

  const handleChecklistRemove = (itemId: string) => {
    blurWebActiveElement();
    removeChecklistItem(destination.id, itemId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <ImageBackground
          source={{ uri: destination.heroImage }}
          style={[styles.hero, { height: HERO_HEIGHT }]}
          resizeMode="cover"
        >
          <LinearGradient
            colors={gradients.heroOverlay}
            locations={[0, 0.4, 1]}
            style={styles.heroGradient}
          >
            {/* Back and Favorite buttons */}
            <SafeAreaView style={styles.heroTop}>
              <TouchableOpacity
                onPress={() => {
                  blurWebActiveElement();
                  navigation.goBack();
                }}
                style={styles.backButton}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={22} color={colors.white} />
              </TouchableOpacity>
              <FavoriteButton
                isFavorite={favorited}
                onToggle={() => toggleFavorite(destination.id)}
                size={22}
                variant="glass"
              />
            </SafeAreaView>

            {/* Hero info */}
            <View style={styles.heroBottom}>
              <View style={styles.categoryRow}>
                {destination.category.map((cat) => (
                  <TagPill key={cat} label={cat} small active />
                ))}
              </View>
              <Text style={styles.heroName}>{destination.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={colors.accent} />
                <Text style={styles.heroCountry}>{destination.country}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color={colors.accentAlt} />
                  <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.heroTagline}>{destination.tagline}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          {/* Quick stats */}
          <View style={styles.statsRow}>
            <StatCard icon="sunny-outline" label="Best Season" value={destination.bestSeason} />
            <StatCard icon="wallet-outline" label="Budget" value={destination.budget} />
            <StatCard icon="time-outline" label="Trip Length" value={destination.tripLength} />
          </View>

          <Section title="Live Conditions">
            <GlassCard style={styles.liveWeatherCard}>
              {liveWeatherLoading ? (
                <View style={styles.liveWeatherState}>
                  <Ionicons name="cloud-outline" size={20} color={colors.primary} />
                  <Text style={styles.liveWeatherStateTitle}>Fetching current weather</Text>
                  <Text style={styles.liveWeatherStateText}>
                    Pulling a live snapshot for {destination.name}.
                  </Text>
                </View>
              ) : liveWeatherError ? (
                <View style={styles.liveWeatherState}>
                  <Ionicons name="cloud-offline-outline" size={20} color={colors.accent} />
                  <Text style={styles.liveWeatherStateTitle}>Live weather unavailable</Text>
                  <Text style={styles.liveWeatherStateText}>{liveWeatherError}</Text>
                </View>
              ) : liveWeather ? (
                <>
                  <View style={styles.liveWeatherHeader}>
                    <View style={styles.liveWeatherCopy}>
                      <Text style={styles.liveWeatherEyebrow}>Powered by Open-Meteo</Text>
                      <Text style={styles.liveWeatherLocation}>{liveWeather.locationLabel}</Text>
                      <Text style={styles.liveWeatherSummary}>{liveWeather.weatherSummary}</Text>
                    </View>
                    <View style={styles.liveWeatherNow}>
                      <Text style={styles.liveWeatherTemp}>
                        {formatTemperature(liveWeather.temperatureC)}
                      </Text>
                      <Text style={styles.liveWeatherNowLabel}>right now</Text>
                    </View>
                  </View>

                  <View style={styles.liveWeatherMetrics}>
                    <WeatherMetric
                      icon="arrow-down-outline"
                      label="Low"
                      value={formatTemperature(liveWeather.lowTemperatureC)}
                    />
                    <WeatherMetric
                      icon="arrow-up-outline"
                      label="High"
                      value={formatTemperature(liveWeather.highTemperatureC)}
                    />
                    <WeatherMetric
                      icon="leaf-outline"
                      label="Wind"
                      value={formatWindSpeed(liveWeather.windSpeedKmh)}
                    />
                  </View>

                  <Text style={styles.liveWeatherFootnote}>
                    Observed {formatObservedAt(liveWeather.observedAt)} / {liveWeather.timezoneLabel} local time
                  </Text>
                </>
              ) : null}
            </GlassCard>
          </Section>

          <Section title="Trip Planner">
            <GlassCard style={styles.plannerCard}>
              <Text style={styles.plannerHeading}>
                {tripPlan?.status
                  ? `${getTripStatusLabel(tripPlan.status)} stage selected`
                  : 'Pick a stage for this destination'}
              </Text>
              <Text style={styles.plannerText}>
                Save where this trip stands and keep quick notes for later.
              </Text>

              <View style={styles.statusWrap}>
                {TRIP_STATUS_OPTIONS.map((option) => (
                  <TagPill
                    key={option.value}
                    label={option.label}
                    active={tripPlan?.status === option.value}
                    onPress={() => handleStatusSelect(option.value)}
                    style={styles.statusPill}
                  />
                ))}
              </View>

              <TextInput
                value={noteDraft}
                onChangeText={setNoteDraft}
                placeholder="Add ideas, restaurants, routes, or timing notes..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                style={styles.noteInput}
              />

              <View style={styles.plannerActions}>
                <PrimaryButton
                  title="Save Notes"
                  onPress={handleSaveNotes}
                  size="sm"
                  style={styles.plannerActionButton}
                />
                {hasTripPlan && (
                  <PrimaryButton
                    title="Clear Plan"
                    onPress={handleClearPlan}
                    variant="outline"
                    size="sm"
                    style={styles.plannerActionButton}
                  />
                )}
              </View>

              <View style={styles.checklistSection}>
                <View style={styles.checklistHeader}>
                  <View style={styles.checklistCopy}>
                    <Text style={styles.checklistTitle}>Trip Checklist</Text>
                    <Text style={styles.checklistSubtitle}>
                      {checklistProgress.total > 0
                        ? `${checklistProgress.completed} of ${checklistProgress.total} tasks complete`
                        : 'Add planning tasks for this trip'}
                    </Text>
                  </View>
                  {checklistProgress.total > 0 && (
                    <View style={styles.checklistCounter}>
                      <Text style={styles.checklistCounterText}>
                        {checklistProgress.remaining} left
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.checklistList}>
                  {checklistItems.map((item) => (
                    <View key={item.id} style={styles.checklistRow}>
                      <TouchableOpacity
                        style={[
                          styles.checklistToggle,
                          item.completed && styles.checklistToggleActive,
                        ]}
                        onPress={() => handleChecklistToggle(item.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={item.completed ? 'checkmark' : 'ellipse-outline'}
                          size={16}
                          color={item.completed ? colors.white : colors.textMuted}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.checklistLabel,
                          item.completed && styles.checklistLabelDone,
                        ]}
                      >
                        {item.label}
                      </Text>
                      <TouchableOpacity
                        style={styles.checklistRemoveButton}
                        onPress={() => handleChecklistRemove(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <View style={styles.checklistComposer}>
                  <TextInput
                    value={checklistDraft}
                    onChangeText={setChecklistDraft}
                    placeholder="Add a checklist item"
                    placeholderTextColor={colors.textMuted}
                    style={styles.checklistComposerInput}
                    returnKeyType="done"
                    onSubmitEditing={handleChecklistAdd}
                  />
                  <TouchableOpacity
                    style={styles.checklistAddButton}
                    onPress={handleChecklistAdd}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.checklistAddButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Section>

          {/* Vibe */}
          <GlassCard style={styles.vibeCard}>
            <Text style={styles.vibeLabel}>✨ Vibe</Text>
            <Text style={styles.vibeText}>{destination.vibe}</Text>
          </GlassCard>

          {/* Overview */}
          <Section title="Overview">
            <Text style={styles.description}>{destination.description}</Text>
          </Section>

          {/* Highlights */}
          <Section title="Top Highlights">
            {destination.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <LinearGradient
                  colors={gradients.primaryButton}
                  style={styles.highlightDot}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </Section>

          {/* Gallery */}
          {destination.gallery.length > 0 && (
            <Section title="Gallery">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryList}
              >
                {destination.gallery.map((item, index) => (
                  <View
                    key={`${item}-${index}`}
                    style={index < destination.gallery.length - 1 ? styles.galleryItemSpacer : undefined}
                  >
                    <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
                  </View>
                ))}
              </ScrollView>
            </Section>
          )}

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveCTA, favorited && styles.saveCTAActive]}
            onPress={() => {
              blurWebActiveElement();
              toggleFavorite(destination.id);
            }}
            activeOpacity={0.85}
          >
            {favorited ? (
              <LinearGradient
                colors={[colors.accent, '#FF8FA3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveCTAGradient}
              >
                <Ionicons name="heart" size={20} color={colors.white} />
                <Text style={styles.saveCTAText}>Saved to Favorites</Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={gradients.primaryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveCTAGradient}
              >
                <Ionicons name="heart-outline" size={20} color={colors.white} />
                <Text style={styles.saveCTAText}>Save Destination</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const StatCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
};

const WeatherMetric: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return (
    <View style={styles.liveWeatherMetric}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.liveWeatherMetricLabel}>{label}</Text>
      <Text style={styles.liveWeatherMetricValue}>{value}</Text>
    </View>
  );
};

function formatTemperature(value: number | null): string {
  if (value === null) {
    return 'N/A';
  }

  return `${Math.round(value)} C`;
}

function formatWindSpeed(value: number | null): string {
  if (value === null) {
    return 'N/A';
  }

  return `${Math.round(value)} km/h`;
}

function formatObservedAt(value: string | null): string {
  if (!value) {
    return 'recently';
  }

  return value.replace('T', ' ');
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    width: SCREEN_WIDTH,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.full,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    gap: 6,
    paddingBottom: Layout.spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  heroName: {
    color: colors.white,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCountry: {
    color: colors.textSecondary,
    fontSize: FontSizes.md,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FontSizes.md,
    fontStyle: 'italic',
  },
  content: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    gap: Layout.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  liveWeatherCard: {
    gap: Layout.spacing.md,
  },
  liveWeatherHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  liveWeatherCopy: {
    flex: 1,
    gap: 4,
  },
  liveWeatherEyebrow: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  liveWeatherLocation: {
    color: colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  liveWeatherSummary: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  liveWeatherNow: {
    alignItems: 'flex-end',
    gap: 2,
  },
  liveWeatherTemp: {
    color: colors.textPrimary,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -0.5,
  },
  liveWeatherNowLabel: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
  },
  liveWeatherMetrics: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  liveWeatherMetric: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  liveWeatherMetricLabel: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
  },
  liveWeatherMetricValue: {
    color: colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  liveWeatherFootnote: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    lineHeight: 18,
  },
  liveWeatherState: {
    alignItems: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
  },
  liveWeatherStateTitle: {
    color: colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  liveWeatherStateText: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  vibeCard: {
    gap: 4,
  },
  plannerCard: {
    gap: Layout.spacing.md,
  },
  plannerHeading: {
    color: colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  plannerText: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  statusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusPill: {
    marginBottom: Layout.spacing.sm,
  },
  noteInput: {
    minHeight: 104,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    fontSize: FontSizes.sm,
  },
  plannerActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    flexWrap: 'wrap',
  },
  plannerActionButton: {
    minWidth: 132,
  },
  checklistSection: {
    gap: Layout.spacing.sm,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  checklistCopy: {
    flex: 1,
    gap: 2,
  },
  checklistTitle: {
    color: colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  checklistSubtitle: {
    color: colors.textMuted,
    fontSize: FontSizes.sm,
  },
  checklistCounter: {
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  checklistCounterText: {
    color: colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.3,
  },
  checklistList: {
    gap: Layout.spacing.sm,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  checklistToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checklistToggleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checklistLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  checklistLabelDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  checklistRemoveButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  checklistComposerInput: {
    flex: 1,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 12,
    fontSize: FontSizes.sm,
  },
  checklistAddButton: {
    borderRadius: Layout.radius.full,
    backgroundColor: colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 12,
  },
  checklistAddButtonText: {
    color: colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.3,
  },
  vibeLabel: {
    color: colors.textMuted,
    fontSize: FontSizes.sm,
  },
  vibeText: {
    color: colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
  },
  section: {
    gap: Layout.spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    letterSpacing: -0.3,
  },
  description: {
    color: colors.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  highlightText: {
    color: colors.textSecondary,
    fontSize: FontSizes.md,
    flex: 1,
  },
  galleryList: {
    paddingBottom: 4,
  },
  galleryItemSpacer: {
    marginRight: 12,
  },
  galleryImage: {
    width: 180,
    height: 130,
    borderRadius: Layout.radius.lg,
  },
  saveCTA: {
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
    marginTop: Layout.spacing.sm,
  },
  saveCTAActive: {},
  saveCTAGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 18,
    paddingHorizontal: Layout.spacing.xl,
  },
  saveCTAText: {
    color: colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.3,
  },
});
