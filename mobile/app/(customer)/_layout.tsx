import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: 'Omnidrop', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="cart" options={{ title: 'Your Cart', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#fff' }} />
    </Stack>
  );
}
