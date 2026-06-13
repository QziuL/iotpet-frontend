import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockGetGeofences, mockSaveGeofence } from '@/mocks/geofencing.mock';
import type { Geofence, CreateGeofencePayload } from '@/types/geofencing.types';

export function useGeofences(petId: string) {
  return useQuery({
    queryKey: ['geofences', petId],
    queryFn: () => mockGetGeofences(petId),
    enabled: !!petId,
  });
}

export function useSaveGeofence() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Geofence, 'id' | 'createdAt' | 'updatedAt'>) =>
      mockSaveGeofence(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['geofences', data.petId] });
    },
  });
}
