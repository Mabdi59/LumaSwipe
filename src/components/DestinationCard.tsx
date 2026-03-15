import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Destination } from '../data/destinations';
import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
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
  const cardHeight = compact ? 220 : Layout.card.height;
  const cardWidth = compact ? SCREEN_WIDTH / 2 - 24 : Layout.card.width;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
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
          colors={GradientPresets.heroOverlay}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        >
          {/* Top row */}
          <View style={styles.topRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color={Colors.accentAlt} />
              <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
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
              <Ionicons name="location" size={12} color={Colors.accent} />
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
}) => (
  <View style={styles.metaPill}>
    <Ionicons name={icon} size={11} color={Colors.textSecondary} />
    <Text style={styles.metaText} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.radius.xl,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
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
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
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
    color: Colors.white,
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.glassBg,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 160,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    flexShrink: 1,
  },
});
