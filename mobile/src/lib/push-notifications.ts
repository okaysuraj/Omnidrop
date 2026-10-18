import { isRunningInExpoGo } from 'expo';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

// Android Expo Go does not include remote push support. Avoid loading its native module.
const canUseNotifications =
  Platform.OS !== 'web' && !(isRunningInExpoGo() && Platform.OS === 'android');
const notifications: NotificationsModule | null = canUseNotifications
  ? require('expo-notifications')
  : null;

notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!notifications || !Device.isDevice) return null;
  try {
    if (Platform.OS === 'android') {
      await notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    let { status } = await notifications.getPermissionsAsync();
    if (status !== 'granted') ({ status } = await notifications.requestPermissionsAsync());
    if (status !== 'granted') return null;
    const token = await notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    console.warn('Push notification registration failed:', error);
    return null;
  }
}
