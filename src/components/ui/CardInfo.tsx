import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/theme';

interface CardInfoProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  noPadding?: boolean;
}

/**
 * Translucent card with subtle border — base for all cards in the IoPet UI.
 */
export function CardInfo({ children, style, glow = false, noPadding = false }: CardInfoProps) {
  return (
    <View
      style={[
        styles.card,
        glow && styles.cardGlow,
        noPadding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface.glass,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.surface.glassBorder,
    padding: Spacing[5],
    ...Shadows.md,
  },
  cardGlow: {
    borderColor: Colors.border.primary,
    ...Shadows.glowPrimary,
  },
  noPadding: {
    padding: 0,
    overflow: 'hidden',
  },
});
