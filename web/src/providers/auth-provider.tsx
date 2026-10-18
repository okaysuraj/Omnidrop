'use client';

import { api } from '@/lib/api';
import { getErrorCode, getErrorMessage } from '@/lib/errors';
import {
  auth,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  FirebaseUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@/lib/firebase';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import type { User } from '@/types';

export type AppUser = User;

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
          const profile = await api.auth.login(token);
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
        await sendEmailVerification(cred.user);
        await firebaseSignOut(auth);
        throw new Error(
          'Please verify your email before logging in. A new verification link has been sent to your email.',
        );
      }

      const token = await cred.user.getIdToken();
      const profile = await api.auth.login(token);
      setUser(profile);
      setFirebaseUser(cred.user);
    } catch (err) {
      const message =
        getErrorCode(err) === 'auth/invalid-credential'
          ? 'Invalid email or password. Please sign up if you do not have an account.'
          : getErrorMessage(err) || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string, role = 'CUSTOMER') => {
      setError(null);
      setLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        const token = await cred.user.getIdToken();

        await api.auth.register({
          firebaseToken: token,
          email,
          fullName,
          role,
        });

        await firebaseSignOut(auth);
        // Email verification is required before starting a signed-in session.
        setUser(null);
        setFirebaseUser(null);
      } catch (err) {
        const message =
          getErrorCode(err) === 'auth/email-already-in-use'
            ? 'Email is already registered'
            : getErrorMessage(err) || 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
      value={{
        user,
        firebaseUser,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        clearError,
      }}
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
