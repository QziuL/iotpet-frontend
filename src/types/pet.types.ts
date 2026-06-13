/** Pet types */

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type PetSize = 'small' | 'medium' | 'large' | 'giant';
export type DeviceStatus = 'online' | 'offline' | 'connecting';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  size: PetSize;
  age: number;
  weight: number;
  description?: string;
  avatarUrl?: string;
  ownerId: string;
  deviceId?: string;
  createdAt: string;
}

export interface CreatePetPayload {
  name: string;
  species: PetSpecies;
  breed: string;
  size: PetSize;
  age: number;
  weight: number;
  description?: string;
  avatarUrl?: string;
}

export interface UpdatePetPayload extends Partial<CreatePetPayload> {
  id: string;
}
