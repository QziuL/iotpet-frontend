import type { Alert } from '@/types/alert.types';

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    petId: 'pet-001',
    petName: 'Thor',
    type: 'geofence_exit',
    severity: 'critical',
    title: 'Possível fuga detectada!',
    message: 'Thor saiu da área segura.',
    timestamp: '2026-06-10T08:45:00Z',
    read: false,
  },
  {
    id: 'alert-002',
    petId: 'pet-001',
    petName: 'Thor',
    type: 'geofence_enter',
    severity: 'info',
    title: 'Pet voltou para a área segura',
    message: 'Thor retornou para a área segura.',
    timestamp: '2026-06-10T07:15:00Z',
    read: true,
  },
  {
    id: 'alert-003',
    petId: 'pet-001',
    petName: 'Thor',
    type: 'device_reconnected',
    severity: 'info',
    title: 'Dispositivo reconectado',
    message: 'O dispositivo de Thor está online.',
    timestamp: '2026-06-09T14:20:00Z',
    read: true,
  },
  {
    id: 'alert-004',
    petId: 'pet-001',
    petName: 'Thor',
    type: 'battery_low',
    severity: 'warning',
    title: 'Bateria abaixo de 20%',
    message: 'Carregue o dispositivo de Thor.',
    timestamp: '2026-06-09T16:10:00Z',
    read: false,
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function mockGetAlerts(): Promise<Alert[]> {
  await delay(500);
  return MOCK_ALERTS;
}
