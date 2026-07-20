"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/reset-password'); // Navigate to reset password
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <header className="w-full sticky top-0 bg-background z-40">
        <div className="flex items-center justify-between px-5 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="active:scale-95 transition-transform text-on-surface-variant hover:opacity-80">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-bold text-xl text-primary">Forgot Password?</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-10 pb-16 max-w-md mx-auto w-full">
        {/* Visual Anchor */}
        <div className="w-full aspect-square mb-10 rounded-xl overflow-hidden relative shadow-sm border border-surface-variant flex items-center justify-center bg-surface-container-low">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          <div className="w-4/5 h-4/5 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614064641913-a520faff1608?auto=format&fit=crop&q=80&w=800')" }}></div>
        </div>

        {/* Typography */}
        <div className="space-y-4 mb-10">
          <h2 className="font-extrabold text-4xl text-on-background tracking-tight">Forgot Password?</h2>
          <p className="text-lg text-on-surface-variant">
            Don't worry, it happens. Enter your email to reset.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-xs text-outline uppercase tracking-widest" htmlFor="recovery_id">Email or Mobile Number</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">alternate_email</span>
              <input 
                id="recovery_id" 
                type="text" 
                placeholder="e.g. name@omnidrop.com" 
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all duration-200" 
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-on-primary font-bold text-xl rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-4">
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span> Sending...
              </>
            ) : (
              <>
                <span>Send Link</span>
                <span className="material-symbols-outlined">send</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-16 text-center">
          <p className="text-sm text-secondary">
            Remember your password? 
            <Link href="/login" className="text-primary font-bold hover:underline ml-1">Log in</Link>
          </p>
        </div>
      </main>

      {/* Bottom Nav Shell for Mobile Action */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-end items-center px-5 py-6 bg-surface shadow-[0_-8px_30px_rgb(0,0,0,0.06)] md:hidden">
        <button onClick={handleSubmit} disabled={loading} className="flex items-center justify-center bg-primary text-on-primary rounded-full w-14 h-14 shadow-lg hover:brightness-110 active:scale-90 duration-200">
          {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">arrow_forward</span>}
        </button>
      </nav>
    </div>
  );
}
