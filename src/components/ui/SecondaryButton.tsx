import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { Colors, FontFamily, FontSize, BorderRadius } from '@/theme';

interface SecondaryButtonProps extends TouchableOpacityProps {
  label: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function SecondaryButton({
  label,
  fullWidth = true,
  style,
  disabled,
  ...rest
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.subtle,
    paddingHorizontal: 28,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.45 },
  label: {
    color: Colors.primary.light,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
});
