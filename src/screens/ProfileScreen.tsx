import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { FontSizes, FontWeights, Layout, type ThemeColors } from '../constants';
import { GlassCard } from '../components/GlassCard';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useBlurActiveElementOnBlur } from '../hooks/useBlurActiveElementOnBlur';
import { useFavorites } from '../hooks/useFavorites';
import { destinations } from '../data/destinations';
import type { ProfileScreenProps } from '../navigation/types';
import { useTripPlanner } from '../context/TripPlannerContext';
import {
  getChecklistProgress,
  getTripStatusColor,
  getTripPlanDisplayLabel,
  getTripStatusRank,
  getTripStatusTextColor,
  type TripPlan,
} from '../utils/tripPlanner';
import { blurWebActiveElement } from '../utils/web';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const {
    colors,
    gradients,
    statusBarStyle,
    themeMode,
    toggleTheme,
    notificationsEnabled,
    setNotificationsEnabled,
    resetOnboarding,
  } = useAppPreferences();
  const { favorites, clearFavorites } = useFavorites();
  const { activePlans, tripStats } = useTripPlanner();
  const styles = createStyles(colors);
  useBlurActiveElementOnBlur();
  const recentPlans = activePlans
    .map((plan) => ({
      plan,
      destination: destinations.find((destination) => destination.id === plan.destinationId),
    }))
    .filter((entry): entry is { plan: TripPlan; destination: (typeof destinations)[number] } => Boolean(entry.destination))
    .sort((left, right) => {
      const statusGap = getTripStatusRank(left.plan.status) - getTripStatusRank(right.plan.status);
      if (statusGap !== 0) {
        return statusGap;
      }

      return new Date(right.plan.updatedAt).getTime() - new Date(left.plan.updatedAt).getTime();
    })
    .slice(0, 4);

  const handleResetFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all saved destinations?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearFavorites,
        },
      ]
    );
  };

  const handleReplayOnboarding = () => {
    blurWebActiveElement();
    resetOnboarding();
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />
      <LinearGradient colors={gradients.onboarding} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Avatar + Name */}
          <View style={styles.profileSection}>
            <LinearGradient
              colors={gradients.primaryButton}
              style={styles.avatarRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>MA</Text>
              </View>
            </LinearGradient>
            <Text style={styles.name}>Mohamed Abdi</Text>
            <Text style={styles.subtitle}>Travel Enthusiast · Explorer</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatBox value={favorites.length.toString()} label="Saved" />
              <View style={styles.statDivider} />
              <StatBox value={tripStats.booked.toString()} label="Booked" />
              <View style={styles.statDivider} />
              <StatBox value={tripStats.visited.toString()} label="Visited" />
            </View>
          </View>

          {/* Settings */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <GlassCard style={styles.settingsCard}>
            <SettingRow
              icon="moon-outline"
              label={themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              right={
                <Switch
                  value={themeMode === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.surface, true: colors.primary }}
                  thumbColor={colors.white}
                />
              }
            />
            <Divider />
            <SettingRow
              icon="notifications-outline"
              label="Notifications"
              right={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.surface, true: colors.primary }}
                  thumbColor={colors.white}
                />
              }
            />
            <Divider />
            <SettingRow icon="language-outline" label="Language" value="English" right={<Chevron />} />
          </GlassCard>

          {/* Data */}
          <Text style={styles.sectionTitle}>Data</Text>
          <GlassCard style={styles.settingsCard}>
            <SettingRow
              icon="heart-outline"
              label="Saved Destinations"
              value={`${favorites.length} places`}
              right={<Chevron />}
            />
            <Divider />
            <SettingRow
              icon="map-outline"
              label="Trip Plans"
              value={`${tripStats.total} trips`}
              right={<Chevron />}
            />
            <Divider />
            <TouchableOpacity onPress={handleReplayOnboarding} activeOpacity={0.7}>
              <SettingRow
                icon="sparkles-outline"
                label="Replay Intro"
                value="Show onboarding again"
                right={<Chevron />}
              />
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={handleResetFavorites} activeOpacity={0.7}>
              <SettingRow
                icon="trash-outline"
                label="Clear Favorites"
                danger
              />
            </TouchableOpacity>
          </GlassCard>

          <Text style={styles.sectionTitle}>Trip Board</Text>
          <GlassCard style={styles.settingsCard}>
            {recentPlans.length === 0 ? (
              <View style={styles.tripEmptyState}>
                <Ionicons name="map-outline" size={22} color={colors.primary} />
                <Text style={styles.tripEmptyTitle}>No trip plans yet</Text>
                <Text style={styles.tripEmptyText}>
                  Open a destination and set a stage like Planning or Booked to build your travel board.
                </Text>
              </View>
            ) : (
              recentPlans.map((entry, index) => {
                const checklistProgress = getChecklistProgress(entry.plan);

                return (
                  <TouchableOpacity
                    key={entry.plan.destinationId}
                    onPress={() => {
                      blurWebActiveElement();
                      navigation.navigate('Details', { destinationId: entry.plan.destinationId });
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.tripRow}>
                      <View style={styles.tripCopy}>
                        <Text style={styles.tripDestination}>{entry.destination.name}</Text>
                        <Text style={styles.tripMeta}>{entry.destination.country}</Text>
                        {checklistProgress.total > 0 && (
                          <Text style={styles.tripTaskMeta}>
                            {checklistProgress.completed}/{checklistProgress.total} checklist tasks complete
                          </Text>
                        )}
                        {entry.plan.notes.trim() !== '' && (
                          <Text style={styles.tripNote} numberOfLines={2}>
                            {entry.plan.notes.trim()}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.tripBadge,
                          { backgroundColor: getTripStatusColor(colors, entry.plan.status) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tripBadgeText,
                            { color: getTripStatusTextColor(colors, entry.plan.status) },
                          ]}
                        >
                          {getTripPlanDisplayLabel(entry.plan)}
                        </Text>
                      </View>
                    </View>
                    {index < recentPlans.length - 1 && <Divider />}
                  </TouchableOpacity>
                );
              })
            )}
          </GlassCard>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <GlassCard style={styles.settingsCard}>
            <SettingRow icon="information-circle-outline" label="App Version" value="1.0.0" />
            <Divider />
            <SettingRow icon="code-slash-outline" label="Built with" value="Expo + React Native" />
            <Divider />
            <SettingRow icon="globe-outline" label="Destinations" value={`${destinations.length} in database`} />
          </GlassCard>

          {/* Footer */}
          <View style={styles.footer}>
            <LinearGradient
              colors={gradients.primaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerGradient}
            >
              <Text style={styles.footerApp}>LumaSwipe</Text>
            </LinearGradient>
            <Text style={styles.footerBy}>Designed & Developed by</Text>
            <Text style={styles.footerName}>Mohamed Abdi</Text>
            <Text style={styles.footerVersion}>v1.0.0 · Built with ❤️ using Expo</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const StatBox: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const Chevron = () => {
  const { colors } = useAppPreferences();
  return <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />;
};

const Divider = () => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);
  return <View style={styles.divider} />;
};

const SettingRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  right?: React.ReactNode;
  danger?: boolean;
}> = ({ icon, label, value, right, danger = false }) => {
  const { colors } = useAppPreferences();
  const styles = createStyles(colors);

  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {right && <View style={styles.settingRight}>{right}</View>}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    gap: Layout.spacing.sm,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  name: {
    color: colors.textPrimary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: Layout.radius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    marginTop: Layout.spacing.md,
    gap: Layout.spacing.xl,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.extrabold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.glassBorder,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Layout.spacing.sm,
    marginTop: Layout.spacing.lg,
  },
  settingsCard: {
    padding: 0,
    gap: 0,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.sm,
    backgroundColor: 'rgba(108,99,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingIconDanger: {
    backgroundColor: 'rgba(255,101,132,0.12)',
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  settingLabelDanger: {
    color: colors.error,
  },
  settingValue: {
    color: colors.textMuted,
    fontSize: FontSizes.sm,
  },
  settingRight: {
    marginLeft: Layout.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginLeft: 68,
  },
  tripEmptyState: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
    gap: Layout.spacing.sm,
  },
  tripEmptyTitle: {
    color: colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  tripEmptyText: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  tripCopy: {
    flex: 1,
    gap: 2,
  },
  tripDestination: {
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  tripMeta: {
    color: colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  tripTaskMeta: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  tripNote: {
    color: colors.textMuted,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginTop: 4,
  },
  tripBadge: {
    borderRadius: Layout.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  tripBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    marginTop: Layout.spacing.xxl,
    gap: 4,
  },
  footerGradient: {
    borderRadius: Layout.radius.sm,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  footerApp: {
    color: colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -0.5,
  },
  footerBy: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
  },
  footerName: {
    color: colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  footerVersion: {
    color: colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 4,
  },
});
