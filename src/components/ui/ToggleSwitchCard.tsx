import React from 'react';
import { View, Text, Switch, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, FontFamily, FontSize, BorderRadius, Spacing } from '@/theme';
import { CardInfo } from './CardInfo';

interface ToggleSwitchCardProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function ToggleSwitchCard({
  label,
  description,
  value,
  onValueChange,
  style,
  icon,
}: ToggleSwitchCardProps) {
  return (
    <CardInfo style={[styles.card, style] as any}>
      <View style={styles.row}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.text}>
          <Text style={styles.label}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          thumbColor={value ? Colors.white : Colors.text.tertiary}
          trackColor={{
            false: Colors.surface.elevated,
            true: Colors.primary.default,
          }}
          ios_backgroundColor={Colors.surface.elevated}
        />
      </View>
    </CardInfo>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});
