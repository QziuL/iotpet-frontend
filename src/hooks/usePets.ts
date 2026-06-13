import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockGetPets, mockGetPet } from '@/mocks/pets.mock';
import type { CreatePetPayload, Pet } from '@/types/pet.types';

// Mock create (simulates POST /pets)
async function mockCreatePet(payload: CreatePetPayload): Promise<Pet> {
  await new Promise(r => setTimeout(r, 800));
  return {
    id: `pet-${Date.now()}`,
    ownerId: 'usr-001',
    createdAt: new Date().toISOString(),
    deviceId: undefined,
    ...payload,
  };
}

// Mock update (simulates PUT /pets/:id)
async function mockUpdatePet(id: string, payload: Partial<CreatePetPayload>): Promise<Pet> {
  await new Promise(r => setTimeout(r, 600));
  const pet = await mockGetPet(id);
  return { ...pet, ...payload };
}

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: mockGetPets,
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => mockGetPet(id),
    enabled: !!id,
  });
}

export function useCreatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePetPayload) => mockCreatePet(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  });
}

export function useUpdatePet(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreatePetPayload>) => mockUpdatePet(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pets'] });
      qc.invalidateQueries({ queryKey: ['pets', id] });
    },
  });
}
