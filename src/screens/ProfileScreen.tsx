import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
import { GlassCard } from '../components/GlassCard';
import { useFavorites } from '../hooks/useFavorites';
import { destinations } from '../data/destinations';

export default function ProfileScreen() {
  const { favorites, clearFavorites } = useFavorites();
  const [darkMode, setDarkMode] = useState(true);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={GradientPresets.onboarding} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Avatar + Name */}
          <View style={styles.profileSection}>
            <LinearGradient
              colors={GradientPresets.primaryButton}
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
              <StatBox value={destinations.length.toString()} label="Discovered" />
              <View style={styles.statDivider} />
              <StatBox value="12" label="Countries" />
            </View>
          </View>

          {/* Settings */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <GlassCard style={styles.settingsCard}>
            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              right={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: Colors.surface, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
            <Divider />
            <SettingRow icon="notifications-outline" label="Notifications" right={<Chevron />} />
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
            <TouchableOpacity onPress={handleResetFavorites} activeOpacity={0.7}>
              <SettingRow
                icon="trash-outline"
                label="Clear Favorites"
                danger
              />
            </TouchableOpacity>
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
              colors={GradientPresets.primaryButton}
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

const StatBox: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Chevron = () => (
  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
);

const Divider = () => <View style={styles.divider} />;

const SettingRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  right?: React.ReactNode;
  danger?: boolean;
}> = ({ icon, label, value, right, danger = false }) => (
  <View style={styles.settingRow}>
    <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
      <Ionicons name={icon} size={18} color={danger ? Colors.error : Colors.primary} />
    </View>
    <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
    {value && <Text style={styles.settingValue}>{value}</Text>}
    {right && <View style={styles.settingRight}>{right}</View>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
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
    color: Colors.textPrimary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.extrabold,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.glassBorder,
  },
  sectionTitle: {
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  settingLabelDanger: {
    color: Colors.error,
  },
  settingValue: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  settingRight: {
    marginLeft: Layout.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginLeft: 68,
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
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.extrabold,
    letterSpacing: -0.5,
  },
  footerBy: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  footerName: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  footerVersion: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 4,
  },
});
