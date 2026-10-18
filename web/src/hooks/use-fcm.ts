import { api } from '@/lib/api';
import { app } from '@/lib/firebase';
import { useAuth } from '@/providers/auth-provider';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

export function useFCM() {
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!userId || !vapidKey || typeof Notification === 'undefined') return;

    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    async function register() {
      try {
        if (!(await isSupported()) || disposed) return;
        const permission = await Notification.requestPermission();
        if (permission !== 'granted' || disposed) return;

        const messaging = getMessaging(app);
        const token = await getToken(messaging, { vapidKey });
        if (disposed) return;
        if (token) await api.auth.updateProfile({ fcmToken: token });
        if (disposed) return;

        unsubscribe = onMessage(messaging, ({ notification }) => {
          if (notification)
            new Notification(notification.title || 'Omnidrop', { body: notification.body });
        });
      } catch (error) {
        console.error('Push notification registration failed:', error);
      }
    }

    void register();
    // Registration can finish after sign-out; avoid keeping its listener alive.
    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [userId]);
}
