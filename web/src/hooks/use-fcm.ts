import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { app } from '@/lib/firebase';

export function useFCM() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const setupFCM = async () => {
      try {
        const messaging = getMessaging(app);
        
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          return;
        }

        // Get token
        // In a real app, pass vapidKey from Firebase console Web Push certificates
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'default-vapid-key-needs-replacement',
        });

        if (currentToken) {
          // Send token to backend profile
          await api.users.updateProfile({ fcmToken: currentToken });
          console.log('FCM Token registered successfully');
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('Received foreground message ', payload);
          // E.g., show a toast notification here
          if (payload.notification) {
            new Notification(payload.notification.title || 'Omnidrop', {
              body: payload.notification.body,
            });
          }
        });
      } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
      }
    };

    setupFCM();
  }, [user]);
}
