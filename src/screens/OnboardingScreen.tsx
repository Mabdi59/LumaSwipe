import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, FontSizes, FontWeights, Layout, GradientPresets } from '../constants';
import { PrimaryButton } from '../components';

const { width: W, height: H } = Dimensions.get('window');

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background hero image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1080&q=90',
        }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Dark gradient overlay */}
      <LinearGradient
        colors={['rgba(13,13,26,0.3)', 'rgba(13,13,26,0.55)', 'rgba(13,13,26,0.96)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Top decorative element */}
        <Animated.View style={[styles.topBadge, { opacity: fadeAnim }]}>
          <View style={styles.dotIndicator} />
          <Text style={styles.topBadgeText}>Travel Discovery</Text>
          <View style={styles.dotIndicator} />
        </Animated.View>

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.appName}>LumaSwipe</Text>
          <Text style={styles.tagline}>Discover the world's most{'\n'}beautiful destinations</Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.featurePills, { opacity: fadeAnim }]}>
          {['🌊 Beach', '🏔️ Mountains', '🏙️ Cities', '🌿 Nature'].map((pill) => (
            <View key={pill} style={styles.pill}>
              <Text style={styles.pillText}>{pill}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA buttons */}
        <Animated.View
          style={[styles.cta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <PrimaryButton
            title="Start Exploring"
            onPress={() => navigation.replace('Main')}
            size="lg"
            style={styles.ctaButton}
          />
          <Text style={styles.byline}>Designed & Developed by Mohamed Abdi</Text>
        </Animated.View>
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
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: Layout.spacing.xl,
    paddingTop: Layout.spacing.lg,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: Layout.spacing.sm,
  },
  dotIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryLight,
  },
  topBadgeText: {
    color: Colors.primaryLight,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  appName: {
    color: Colors.white,
    fontSize: 56,
    fontWeight: FontWeights.black,
    letterSpacing: -2,
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.lg,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: FontWeights.regular,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
  },
  pill: {
    backgroundColor: Colors.glassBg,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  pillText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  cta: {
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  ctaButton: {
    width: '100%',
  },
  byline: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    letterSpacing: 0.5,
  },
});
