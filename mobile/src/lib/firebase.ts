import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  type Auth,
  type Persistence,
} from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'omnidrop-dev.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'omnidrop-dev',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'omnidrop-dev.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:0000:web:0000',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use AsyncStorage for React Native persistence, browser persistence for web
let auth: Auth;
try {
  if (Platform.OS === 'web') {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    // Firebase exposes this helper in the native bundle, but its browser types omit it.
    const { getReactNativePersistence } = FirebaseAuth as typeof FirebaseAuth & {
      getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
    };
    if (typeof getReactNativePersistence === 'function') {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      auth = getAuth(app);
    }
  }
} catch {
  auth = getAuth(app);
}

export { app, auth };
