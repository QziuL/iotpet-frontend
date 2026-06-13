import type { Geofence } from '@/types/geofencing.types';

export const MOCK_GEOFENCES: Geofence[] = [
  {
    id: 'geo-001',
    petId: 'pet-001',
    name: 'Casa',
    points: [
      { latitude: -25.512, longitude: -48.520 },
      { latitude: -25.512, longitude: -48.525 },
      { latitude: -25.517, longitude: -48.525 },
      { latitude: -25.517, longitude: -48.520 },
      { latitude: -25.514, longitude: -48.518 },
    ],
    area: 120,
    active: true,
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function mockGetGeofences(petId: string): Promise<Geofence[]> {
  await delay(500);
  return MOCK_GEOFENCES.filter(g => g.petId === petId);
}

export async function mockSaveGeofence(geofence: Omit<Geofence, 'id' | 'createdAt' | 'updatedAt'>): Promise<Geofence> {
  await delay(700);
  return {
    ...geofence,
    id: `geo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
