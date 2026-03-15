import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Destination } from '../data/destinations';
import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useTripPlanner } from '../context/TripPlannerContext';
import {
  getTripStatusColor,
  getTripPlanDisplayLabel,
  getTripStatusTextColor,
} from '../utils/tripPlanner';
import { blurWebActiveElement } from '../utils/web';
import { FavoriteButton } from './FavoriteButton';
import { TagPill } from './TagPill';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
  style?: object;
  compact?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isFavorite,
  onToggleFavorite,
  onPress,
  style,
  compact = false,
}) => {
  const { colors, gradients } = useAppPreferences();
  const { getTripPlan } = useTripPlanner();
  const styles = createStyles(colors);
  const cardHeight = compact ? 220 : Layout.card.height;
  const cardWidth = compact ? SCREEN_WIDTH / 2 - 24 : Layout.card.width;
  const tripPlan = getTripPlan(destination.id);
  const tripBadgeLabel = tripPlan ? getTripPlanDisplayLabel(tripPlan) : null;
  const tripBadgeColor = getTripStatusColor(colors, tripPlan?.status);
  const tripBadgeTextColor = getTripStatusTextColor(colors, tripPlan?.status);

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => {
        blurWebActiveElement();
        onPress();
      }}
      style={[styles.card, { width: cardWidth, height: cardHeight }, style]}
    >
      <ImageBackground
        source={{ uri: destination.heroImage }}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Gradient overlay */}
        <LinearGradient
          colors={gradients.heroOverlay}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        >
          {/* Top row */}
          <View style={styles.topRow}>
            <View style={styles.topMeta}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={10} color={colors.accentAlt} />
                <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
              </View>
              {tripBadgeLabel && (
                <View style={[styles.tripBadge, { backgroundColor: tripBadgeColor }]}>
                  <Text style={[styles.tripBadgeText, { color: tripBadgeTextColor }]}>
                    {tripBadgeLabel}
                  </Text>
                </View>
              )}
            </View>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
              size={20}
              variant="glass"
            />
          </View>

          {/* Category chips */}
          {!compact && (
            <View style={styles.categoryRow}>
              {destination.category.slice(0, 2).map((cat) => (
                <TagPill key={cat} label={cat} small active />
              ))}
            </View>
          )}

          {/* Bottom info */}
          <View style={styles.bottomInfo}>
            <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
              {destination.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={12} color={colors.accent} />
              <Text style={styles.country}>{destination.country}</Text>
            </View>
            {!compact && (
              <>
                <Text style={styles.tagline} numberOfLines={1}>
                  {destination.tagline}
                </Text>
                <View style={styles.metaRow}>
                  <MetaPill icon="sunny-outline" label={destination.bestSeason} />
                  <MetaPill icon="cash-outline" label={destination.budget} />
                </View>
              </>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const MetaPill: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string }> = ({
  icon,
  label,
}) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return (
    <View style={styles.metaPill}>
      <Ionicons name={icon} size={11} color={colors.textSecondary} />
      <Text style={styles.metaText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    borderRadius: Layout.radius.xl,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: `0px 8px 20px ${colors.cardShadow}`,
        }
      : {
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 10,
        }),
  },
  image: {
    flex: 1,
  },
  imageStyle: {
    borderRadius: Layout.radius.xl,
  },
  gradient: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topMeta: {
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  ratingText: {
    color: colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  tripBadge: {
    alignSelf: 'flex-start',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tripBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.3,
  },
  categoryRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
  },
  bottomInfo: {
    gap: 4,
  },
  name: {
    color: colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -0.5,
  },
  nameCompact: {
    fontSize: FontSizes.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  country: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.glassBg,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 160,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: FontSizes.xs,
    flexShrink: 1,
  },
});
