import { Stack } from 'expo-router';

export default function DeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Rider Dashboard', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#fff' }} />
    </Stack>
  );
}
