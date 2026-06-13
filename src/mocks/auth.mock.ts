import type { User, AuthResponse } from '@/types/auth.types';

export const MOCK_USER: User = {
  id: 'usr-001',
  name: 'Maria Oliveira',
  email: 'maria@iopet.com',
  avatarUrl: undefined,
  createdAt: '2026-01-10T10:00:00Z',
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  token: 'mock-jwt-token-iopet-2026',
  user: MOCK_USER,
};

/**
 * Simulates login — always succeeds with the mock user.
 * Replace with real API call when backend is ready.
 */
export async function mockLogin(email: string, _password: string): Promise<AuthResponse> {
  await delay(800);
  if (!email.includes('@')) throw new Error('E-mail inválido');
  return MOCK_AUTH_RESPONSE;
}

export async function mockRegister(
  name: string,
  email: string,
  _password: string,
): Promise<AuthResponse> {
  await delay(1000);
  return {
    token: 'mock-jwt-token-iopet-2026',
    user: { ...MOCK_USER, name, email },
  };
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
