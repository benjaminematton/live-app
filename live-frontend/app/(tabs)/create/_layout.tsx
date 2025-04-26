// app/(tabs)/create/_layout.tsx

import { Stack } from 'expo-router';
import { ExperienceCreationProvider } from '@/app/contexts/ExperienceCreationContext';

export default function CreateLayout() {
  return (
    <ExperienceCreationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ExperienceCreationProvider>
  );
}
