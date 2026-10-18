import '@/global.css';
import '@/lib/location-task'; // Register background task
import { registerForPushNotificationsAsync } from '@/lib/push-notifications';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { SocketProvider } from '@/providers/socket-provider';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    void registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not logged in
      router.replace('/(auth)/login');
    } else if (user) {
      // Redirect to appropriate dashboard if logged in but on auth screens or root
      if (inAuthGroup || !segments[0]) {
        if (user.role === 'CUSTOMER') {
          router.replace('/(customer)/home');
        } else if (user.role === 'DELIVERY_PARTNER') {
          router.replace('/(delivery)/dashboard');
        } else if (user.role === 'SHOPKEEPER' || user.role === 'ADMIN') {
          router.replace('/(merchant)/orders');
        } else {
          router.replace('/(customer)/home');
        }
      }
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FAFAF8',
        }}
      >
        <ActivityIndicator size="large" color="#0A0A0A" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RootLayoutNav />
      </SocketProvider>
    </AuthProvider>
  );
}
