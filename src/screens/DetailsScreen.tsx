import React, { useCallback } from 'react';
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
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
import { FavoriteButton } from '../components/FavoriteButton';
import { TagPill } from '../components/TagPill';
import { GlassCard } from '../components/GlassCard';
import { useFavorites } from '../hooks/useFavorites';
import { getDestinationById } from '../utils/destinationUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_WIDTH * 0.85;

export default function DetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ Details: { destinationId: string } }, 'Details'>>();
  const { destinationId } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();

  const destination = getDestinationById(destinationId);

  if (!destination) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: Colors.textSecondary }}>Destination not found</Text>
      </View>
    );
  }

  const favorited = isFavorite(destination.id);

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
            colors={GradientPresets.heroOverlay}
            locations={[0, 0.4, 1]}
            style={styles.heroGradient}
          >
            {/* Back and Favorite buttons */}
            <SafeAreaView style={styles.heroTop}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={22} color={Colors.white} />
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
                <Ionicons name="location" size={14} color={Colors.accent} />
                <Text style={styles.heroCountry}>{destination.country}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color={Colors.accentAlt} />
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
                  colors={GradientPresets.primaryButton}
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
              <FlatList
                horizontal
                data={destination.gallery}
                keyExtractor={(_, i) => i.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryList}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
                )}
              />
            </Section>
          )}

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveCTA, favorited && styles.saveCTAActive]}
            onPress={() => toggleFavorite(destination.id)}
            activeOpacity={0.85}
          >
            {favorited ? (
              <LinearGradient
                colors={[Colors.accent, '#FF8FA3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveCTAGradient}
              >
                <Ionicons name="heart" size={20} color={Colors.white} />
                <Text style={styles.saveCTAText}>Saved to Favorites</Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={GradientPresets.primaryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveCTAGradient}
              >
                <Ionicons name="heart-outline" size={20} color={Colors.white} />
                <Text style={styles.saveCTAText}>Save Destination</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const StatCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color={Colors.primary} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
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
    color: Colors.white,
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
    color: Colors.textSecondary,
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
    color: Colors.white,
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
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  vibeCard: {
    gap: 4,
  },
  vibeLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  vibeText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
  },
  section: {
    gap: Layout.spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    letterSpacing: -0.3,
  },
  description: {
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    flex: 1,
  },
  galleryList: {
    paddingBottom: 4,
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
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.3,
  },
});
