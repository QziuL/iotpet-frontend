import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Shadows } from '@/theme';

interface GlowIconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  size?: number;
  variant?: 'primary' | 'surface' | 'error';
  style?: ViewStyle;
}

/**
 * Circular icon button with glow — used for quick actions and FAB-style buttons.
 */
export function GlowIconButton({
  icon,
  size = 48,
  variant = 'primary',
  style,
  ...rest
}: GlowIconButtonProps) {
  const variantStyle = {
    primary: {
      bg: Colors.primary.default,
      shadow: Shadows.glowPrimary,
      border: Colors.border.bright,
    },
    surface: {
      bg: Colors.surface.elevated,
      shadow: Shadows.md,
      border: Colors.border.default,
    },
    error: {
      bg: Colors.state.errorSubtle,
      shadow: Shadows.glowError,
      border: Colors.state.error,
    },
  }[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          ...variantStyle.shadow,
        },
        style,
      ]}
      {...rest}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
