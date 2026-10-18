import { Stack } from 'expo-router';

export default function DeliveryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAFAF8' },
      }}
    />
  );
}
