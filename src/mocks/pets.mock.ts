import type { Pet } from '@/types/pet.types';
import type { TrackingState, Device, LocationPoint } from '@/types/tracking.types';

export const MOCK_PETS: Pet[] = [
  {
    id: 'pet-001',
    name: 'Thor',
    species: 'dog',
    breed: 'Golden Retriever',
    size: 'large',
    age: 3,
    weight: 28,
    description: 'Brincalhão e adora correr no parque.',
    avatarUrl: undefined,
    ownerId: 'usr-001',
    deviceId: 'IOPET-001',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'pet-002',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês',
    size: 'small',
    age: 2,
    weight: 4,
    description: 'Curiosa e adora janelas.',
    avatarUrl: undefined,
    ownerId: 'usr-001',
    deviceId: undefined,
    createdAt: '2026-03-20T09:30:00Z',
  },
];

export const MOCK_DEVICES: Device[] = [
  {
    id: 'dev-001',
    deviceCode: 'IOPET-001',
    petId: 'pet-001',
    petName: 'Thor',
    status: 'online',
    battery: 85,
    linkedAt: '2026-01-20T10:00:00Z',
  },
];

export const MOCK_LOCATION_HISTORY: LocationPoint[] = [
  { latitude: -25.514, longitude: -48.522, timestamp: '2026-06-10T08:15:00Z', address: 'Rua das Flores, 123 - Centro, São Paulo - SP' },
  { latitude: -25.516, longitude: -48.524, timestamp: '2026-06-10T08:10:00Z' },
  { latitude: -25.518, longitude: -48.526, timestamp: '2026-06-10T08:05:00Z' },
  { latitude: -25.519, longitude: -48.527, timestamp: '2026-06-10T08:00:00Z' },
  { latitude: -25.520, longitude: -48.525, timestamp: '2026-06-10T07:55:00Z' },
  { latitude: -25.518, longitude: -48.522, timestamp: '2026-06-10T07:50:00Z' },
];

export const MOCK_TRACKING: TrackingState = {
  petId: 'pet-001',
  deviceId: 'IOPET-001',
  currentLocation: MOCK_LOCATION_HISTORY[0],
  battery: 85,
  signalStatus: 'online',
  precision: 12,
  lastUpdated: '2026-06-10T08:15:00Z',
};

/** Async helpers (simulate network) */
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function mockGetPets(): Promise<Pet[]> {
  await delay(600);
  return MOCK_PETS;
}

export async function mockGetPet(id: string): Promise<Pet> {
  await delay(400);
  const pet = MOCK_PETS.find(p => p.id === id);
  if (!pet) throw new Error('Pet não encontrado');
  return pet;
}

export async function mockGetTracking(petId: string): Promise<TrackingState> {
  await delay(500);
  if (petId !== 'pet-001') throw new Error('Rastreamento não disponível');
  return MOCK_TRACKING;
}

export async function mockGetLocationHistory(_petId: string): Promise<LocationPoint[]> {
  await delay(700);
  return MOCK_LOCATION_HISTORY;
}

export async function mockGetDevices(): Promise<Device[]> {
  await delay(500);
  return MOCK_DEVICES;
}
