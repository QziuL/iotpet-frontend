import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type TouchableOpacityProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors, FontFamily, FontSize, BorderRadius, Shadows } from '@/theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function PrimaryButton({
  label,
  loading = false,
  fullWidth = true,
  size = 'md',
  style,
  labelStyle,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <Text style={[styles.label, styles[`label_${size}`], labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.default,
    ...Shadows.glowPrimary,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.45,
  },

  // Sizes
  sm: { height: 40, paddingHorizontal: 20 },
  md: { height: 52, paddingHorizontal: 28 },
  lg: { height: 60, paddingHorizontal: 32 },

  // Labels
  label: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
  },
  label_sm: { fontSize: FontSize.sm },
  label_md: { fontSize: FontSize.base },
  label_lg: { fontSize: FontSize.md },
});
