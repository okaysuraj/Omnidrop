import { auth } from '@/lib/firebase';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './auth-provider';

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}
const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [connection, setConnection] = useState<(SocketContextValue & { userId: string }) | null>(
    null,
  );

  useEffect(() => {
    if (!userId) return;
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api';
    const socket = io(apiUrl.replace(/\/api\/?$/, ''), {
      transports: ['websocket'],
      auth: async (callback) => {
        try {
          callback({ token: await auth.currentUser?.getIdToken() });
        } catch {
          callback({ token: null });
        }
      },
    });
    socket.on('connect', () => setConnection({ userId, socket, connected: true }));
    socket.on('disconnect', () => {
      setConnection((previous) =>
        previous?.socket === socket ? { ...previous, connected: false } : previous,
      );
    });
    // Foreground screens reconnect on resume; the background location task owns its own socket.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') socket.connect();
      else socket.disconnect();
    });

    return () => {
      subscription.remove();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [userId]);

  // A session change immediately hides the previous user's connection.
  const value =
    userId && connection?.userId === userId
      ? { socket: connection.socket, connected: connection.connected }
      : { socket: null, connected: false };
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
