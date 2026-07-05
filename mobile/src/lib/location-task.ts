import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import { auth } from './firebase';

export const LOCATION_TASK_NAME = 'background-location-task';

// This runs in the background
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];
    
    if (location) {
      // In a background task, we might not have the full react context
      // So we reconnect to socket and emit
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000';
        const socketUrl = API_URL.replace('/api', '');

        const socket = io(socketUrl, {
          path: '/socket.io',
          transports: ['websocket'],
          auth: { token },
        });

        // We emit the generic location update
        // The backend expects orderId and taskId, which might be tricky in pure background without state
        // For MVP, we will emit a rider-level location update
        socket.emit('rider:location', {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });

        setTimeout(() => socket.disconnect(), 1000);
      } catch (e) {
        console.error('Failed to emit background location', e);
      }
    }
  }
});
