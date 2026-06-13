/** Alert types */

export type AlertType =
  | 'geofence_exit'
  | 'geofence_enter'
  | 'battery_low'
  | 'device_reconnected'
  | 'device_disconnected';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  petId: string;
  petName: string;
  petAvatarUrl?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
