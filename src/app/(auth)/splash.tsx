import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { useAuthStore } from '@/store/auth.store';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Animation values
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: glow → logo → tagline → navigate
    Animated.sequence([
      Animated.timing(glowOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        router.replace((isAuthenticated ? '/(tabs)' : '/(auth)/login') as any);
      }, 1200);
    });
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing[8] }]}>
      {/* Background glow orb */}
      <Animated.View style={[styles.glowOrb, { opacity: glowOpacity }]} />

      {/* Logo area */}
      <Animated.View
        style={[
          styles.logoArea,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* Paw icon */}
        <View style={styles.iconWrapper}>
          <Text style={styles.pawEmoji}>🐾</Text>
        </View>

        <Text style={styles.appName}>
          Io<Text style={styles.appNameAccent}>Pet</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineOpacity }}>
        <Text style={styles.tagline}>Conectando você ao que mais importa.</Text>
      </Animated.View>

      {/* Bottom loading dots */}
      <View style={[styles.bottomDots, { bottom: insets.bottom + Spacing[8] }]}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              styles.dot,
              i === 1 && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[5],
  },
  glowOrb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primary.default,
    opacity: 0.08,
    top: height * 0.1,
  },
  logoArea: {
    alignItems: 'center',
    gap: Spacing[4],
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary.subtle,
    borderWidth: 2,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
  },
  pawEmoji: {
    fontSize: 48,
  },
  appName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    color: Colors.text.primary,
    letterSpacing: -1,
  },
  appNameAccent: {
    color: Colors.primary.default,
  },
  tagline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing[10],
  },
  bottomDots: {
    position: 'absolute',
    flexDirection: 'row',
    gap: Spacing[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border.primary,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary.default,
  },
});
