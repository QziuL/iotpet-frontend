import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

/**
 * Root index — redirects to the correct stack based on auth state.
 */
export default function Index() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return <Redirect href={(isAuthenticated ? '/(tabs)' : '/(auth)/splash') as any} />;
}
