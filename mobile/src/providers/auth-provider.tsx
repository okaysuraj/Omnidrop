import { getErrorCode, getErrorMessage } from '@/lib/errors';
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { auth } from '../lib/firebase';

import type { User } from '@/types';

export type AppUser = User;

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AppUser>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        if (!fbUser.emailVerified) {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const token = await fbUser.getIdToken();
          const dbUser = await api.auth.login(token);
          setUser(dbUser);
        } catch (error) {
          console.error('Auth sync error:', error);
          setUser(null);
          await signOut(auth);
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
        await signOut(auth);
        throw new Error(
          'Please verify your email before logging in. A new verification link has been sent to your email.',
        );
      }

      const token = await cred.user.getIdToken();
      const dbUser = await api.auth.login(token);
      setUser(dbUser);
      setFirebaseUser(cred.user);
      return dbUser;
    } catch (err) {
      const message =
        getErrorCode(err) === 'auth/invalid-credential'
          ? 'Invalid email or password.'
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

        await signOut(auth);
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
    await signOut(auth);
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
