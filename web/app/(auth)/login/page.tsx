"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/home'); // Redirect after login
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 opacity-30 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-container rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container rounded-full blur-[100px]"></div>
      </div>

      <header className="w-full absolute top-0 flex items-center justify-between px-5 py-4 z-50">
        <button onClick={() => router.back()} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container active:scale-95 transition-all">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="font-bold text-xl text-primary">Create Account</h1>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-md px-5 flex flex-col justify-center py-10 mt-12">
        <div className="mb-10">
          <div className="w-20 h-20 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <h2 className="font-extrabold text-4xl text-on-background mb-2">Welcome Back</h2>
          <p className="text-on-surface-variant">Log in to continue your lightning-fast deliveries.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-xs text-on-surface-variant uppercase tracking-wider" htmlFor="identifier">Email or Mobile</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
              <input 
                id="identifier" 
                type="text" 
                placeholder="name@example.com" 
                className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-xs text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="font-bold text-xs text-primary hover:opacity-80 transition-opacity">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all text-base"
                required
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                <span className="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary-container text-on-primary-container font-bold text-xl py-3 rounded-xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6">
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span> Logging in...
              </>
            ) : (
              <>
                Login <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-10 flex items-center">
          <div className="flex-grow border-t border-outline-variant"></div>
          <span className="px-6 font-medium text-xs text-outline uppercase tracking-widest bg-background">Or continue with</span>
          <div className="flex-grow border-t border-outline-variant"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="font-bold text-xs text-on-surface">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 1.72-1.16 0-1.54-.73-2.92-.73-1.36 0-1.84.71-2.92.71-1.14 0-2.34-.84-3.35-1.87-2.03-2.08-3.08-5.18-3.08-7.58 0-3.64 2.37-5.56 4.67-5.56 1.2 0 2.22.75 2.94.75.7 0 1.93-.89 3.28-.89 1.54 0 2.6.78 3.34 1.83-3.03 1.4-2.54 5.33.47 6.64-.7 1.76-1.55 3.51-3.22 4.98zM13.03 4.28c0-1.78 1.48-3.32 3.19-3.28.16 1.92-1.8 3.54-3.19 3.28z" fill="currentColor"></path>
            </svg>
            <span className="font-bold text-xs text-on-surface">Apple</span>
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-on-surface-variant">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
