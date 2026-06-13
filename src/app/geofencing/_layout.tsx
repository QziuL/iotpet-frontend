import { Stack } from 'expo-router';
import { Colors } from '@/theme';

export default function GeofencingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'slide_from_bottom',
      }}
    />
  );
}
