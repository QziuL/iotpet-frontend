import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontFamily, FontSize, Spacing, Shadows, BorderRadius } from '@/theme';

// Tab bar icon labels and icons
const TABS = [
  { name: 'index', icon: 'home-outline' as const, activeIcon: 'home' as const, label: 'Início' },
  { name: 'map', icon: 'map-outline' as const, activeIcon: 'map' as const, label: 'Mapa' },
  { name: 'alerts', icon: 'notifications-outline' as const, activeIcon: 'notifications' as const, label: 'Alertas' },
  { name: 'profile', icon: 'person-outline' as const, activeIcon: 'person' as const, label: 'Perfil' },
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom || Spacing[4] }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = TABS[index];
          if (!tab) return null;

          // Center FAB (+) button
          const isCenter = index === 2;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, isCenter && styles.tabItemCenter]}
              activeOpacity={0.7}
            >
              {isCenter ? (
                <TouchableOpacity
                  style={styles.fabBtnWrapper}
                  onPress={() => router.push('/pets' as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.fabBtn}>
                    <Ionicons name="add" size={28} color={Colors.white} />
                  </View>
                </TouchableOpacity>
              ) : (
                <>
                  <Ionicons
                    name={isFocused ? tab.activeIcon : tab.icon}
                    size={22}
                    color={isFocused ? Colors.primary.default : Colors.text.tertiary}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused && styles.tabLabelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {isFocused && <View style={styles.activeIndicator} />}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    ...Shadows.md,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 60,
    position: 'relative',
  },
  tabItemCenter: {
    // Reserve space for FAB
  },
  fabBtnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    ...Shadows.glowPrimary,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  tabLabelActive: {
    color: Colors.primary.default,
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary.default,
  },
});
