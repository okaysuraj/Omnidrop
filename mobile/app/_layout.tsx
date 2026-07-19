import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/providers/auth-provider';
import { View, ActivityIndicator } from 'react-native';
import '../src/lib/location-task'; // Register background task
import { registerForPushNotificationsAsync } from '../src/lib/push-notifications';


function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      // In a real app, send this token to the backend
      if (token) console.log('Initialized Push Notifications', token);
    });
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
        } else {
          // Fallback or shopkeeper/admin not supported in MVP app
          router.replace('/(auth)/login');
        }
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
