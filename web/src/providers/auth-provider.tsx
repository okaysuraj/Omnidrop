'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  FirebaseUser,
} from '@/lib/firebase';
import { api } from '@/lib/api';

export interface AppUser {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'SHOPKEEPER' | 'DELIVERY_PARTNER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  isAvailable?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        if (!fbUser.emailVerified) {
          await firebaseSignOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const token = await fbUser.getIdToken();
          const profile = await api.auth.login(token) as any;
          setUser(profile);
        } catch {
          // User exists in Firebase but not in backend — likely needs to register
          await firebaseSignOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      if (!cred.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error('Please verify your email before logging in.');
      }
      
      const token = await cred.user.getIdToken();
      const profile = await api.auth.login(token) as any;
      setUser(profile);
      setFirebaseUser(cred.user);
    } catch (err: any) {
      const message = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string, role = 'CUSTOMER') => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      const token = await cred.user.getIdToken();

      const profile = await api.auth.register({
        firebaseToken: token,
        email,
        fullName,
        role,
      }) as any;

      await firebaseSignOut(auth);
      // We don't set user, forcing them to login after verification
      setUser(null);
      setFirebaseUser(null);
      // We could throw a special error or just let the caller handle success
    } catch (err: any) {
      const message = err.code === 'auth/email-already-in-use'
        ? 'Email is already registered'
        : err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, error, login, register, logout, resetPassword, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
