import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { AppHeader, LoadingState, EmptyState, CardInfo } from '@/components';
import { useAlerts, useMarkAlertAsRead } from '@/hooks/useAlerts';
import type { Alert, AlertType } from '@/types/alert.types';

type Filter = 'all' | 'geofence_exit' | 'battery_low' | 'system';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'geofence_exit', label: 'Fuga' },
  { key: 'battery_low', label: 'Bateria' },
  { key: 'system', label: 'Sistema' },
];

const ALERT_ICONS: Record<AlertType, keyof typeof Ionicons.glyphMap> = {
  geofence_exit: 'warning-outline',
  geofence_enter: 'checkmark-circle-outline',
  battery_low: 'battery-dead-outline',
  device_reconnected: 'wifi-outline',
  device_disconnected: 'wifi-outline',
};

const ALERT_COLORS: Record<AlertType, string> = {
  geofence_exit: Colors.state.error,
  geofence_enter: Colors.state.success,
  battery_low: Colors.state.warning,
  device_reconnected: Colors.accent.cyan,
  device_disconnected: Colors.state.offline,
};

function AlertItem({ alert }: { alert: Alert }) {
  const icon = ALERT_ICONS[alert.type];
  const color = ALERT_COLORS[alert.type];
  const date = new Date(alert.timestamp);
  const isToday = new Date().toDateString() === date.toDateString();
  const timeLabel = isToday
    ? `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    : `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const markAsRead = useMarkAlertAsRead();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (!alert.read) markAsRead.mutate(alert.id);
      }}
    >
      <CardInfo style={[styles.alertCard, !alert.read && styles.alertUnread] as any}>
        <View style={styles.alertRow}>
          {!alert.read && <View style={styles.unreadDot} />}
          <View style={[styles.alertIcon, { backgroundColor: `${color}22` }]}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertMessage} numberOfLines={2}>
              {alert.message}
            </Text>
            <Text style={styles.alertTime}>{timeLabel}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
        </View>
      </CardInfo>
    </TouchableOpacity>
  );
}

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');

  const { data: alerts, isLoading } = useAlerts();

  const filtered = alerts?.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'system') return a.type === 'device_reconnected' || a.type === 'device_disconnected';
    return a.type === filter;
  }) ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Alertas" />

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.chip, filter === f.key && styles.chipActive]}
          >
            <Text style={[styles.chipLabel, filter === f.key && styles.chipLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <LoadingState fullScreen={false} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="Nenhum alerta"
          description="Tudo tranquilo por aqui!"
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <AlertItem alert={item} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },

  filtersRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
  },
  chip: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  chipActive: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.default,
  },
  chipLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  chipLabelActive: { color: Colors.primary.light },

  list: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[3],
  },

  alertCard: { padding: Spacing[4] },
  alertUnread: { borderColor: Colors.border.primary },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.default,
    position: 'absolute',
    top: -4,
    left: -4,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: { flex: 1 },
  alertTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  alertMessage: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  alertTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
});
