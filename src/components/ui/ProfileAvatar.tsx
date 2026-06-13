import React from 'react';
import { View, Image, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, BorderRadius, FontFamily, FontSize, Shadows } from '@/theme';

interface ProfileAvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  online?: boolean;
  style?: ViewStyle;
}

/**
 * Circular avatar with optional online status ring and initials fallback.
 */
export function ProfileAvatar({
  uri,
  name,
  size = 56,
  online,
  style,
}: ProfileAvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase())
        .join('')
    : '?';

  const ringColor = online === true
    ? Colors.state.success
    : online === false
    ? Colors.state.offline
    : Colors.border.primary;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size + 4,
          height: size + 4,
          borderRadius: (size + 4) / 2,
          borderColor: ringColor,
        },
        online !== undefined && Shadows.glowCyan,
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    backgroundColor: Colors.primary.subtle,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.primary.light,
    fontFamily: FontFamily.semiBold,
  },
});
