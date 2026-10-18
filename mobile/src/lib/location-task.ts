import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import { auth } from './firebase';

export const LOCATION_TASK_NAME = 'background-location-task';
let backgroundSocket: Socket | null = null;

function getBackgroundSocket(token: string): Socket {
  if (!backgroundSocket) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api';
    backgroundSocket = io(apiUrl.replace(/\/api\/?$/, ''), {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  backgroundSocket.auth = { token };
  if (!backgroundSocket.connected) backgroundSocket.connect();
  return backgroundSocket;
}

// Expo must register the task at module scope so native background launches can find it.
if (Platform.OS !== 'web' && !TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
  TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
    LOCATION_TASK_NAME,
    async ({ data, error }) => {
      if (error) {
        console.error('Background location failed:', error);
        return;
      }
      const location = data?.locations[0];
      if (!location) return;
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        getBackgroundSocket(token).emit('rider:location', {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.error('Background location update failed:', error);
      }
    },
  );
}
