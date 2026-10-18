'use client';

import { useAuth } from '@/providers/auth-provider';
import { AlertTriangle, ArrowRight, Lock, Mail, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/explore');
    } catch {
      /* error handled by context */
    }
  };

  return (
    <div className="min-h-screen bg-brutal-grid flex flex-col justify-between selection:bg-[#FFE600] selection:text-black">
      {/* Top Telemetry Header */}
      <div className="border-b-2 border-black bg-white p-4">
        <div className="container-brutal flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-display font-extrabold text-base border-2 border-black shadow-[2px_2px_0px_#000]">
              ⚡
            </div>
            <span className="font-display font-black text-lg tracking-tight uppercase text-neutral-900">
              OMNIDROP
            </span>
          </Link>
          <div className="font-tech text-xs text-neutral-600 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
            <span>{'AUTH_KERNEL // SHA-256'}</span>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex items-center justify-center p-4 my-8">
        <div className="card-brutal max-w-md w-full p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFE600] text-black border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-3">
              {'// AUTHENTICATION NODE'}
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
              Sign In To Omnidrop
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Access your saved addresses, live order telemetry, and store consoles.
            </p>
          </div>

          {error && (
            <div className="bg-[#FF4800]/10 border-2 border-[#FF4800] p-3 mb-5 font-tech text-xs text-neutral-900 flex items-start justify-between gap-2 shadow-[2px_2px_0px_#FF4800]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF4800] flex-shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
              <button onClick={clearError} className="p-0.5 hover:bg-neutral-200">
                <X className="w-3.5 h-3.5 text-neutral-600" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900 flex items-center justify-between">
                <span>Email Address</span>
                <Mail className="w-3 h-3 text-neutral-500" />
              </label>
              <input
                id="login-email"
                type="email"
                className="input-brutal"
                placeholder="operator@omnidrop.network"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-tech text-xs uppercase tracking-wider font-bold text-neutral-900 flex items-center gap-1">
                  <span>Password</span>
                  <Lock className="w-3 h-3 text-neutral-500" />
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="font-tech text-[11px] text-neutral-600 hover:text-black font-bold uppercase underline"
                >
                  Forgot Key?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                className="input-brutal"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'AUTHORIZE SESSION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Alternative links */}
          <div className="mt-6 pt-5 border-t-2 border-black/10 text-center font-tech text-xs space-y-2">
            <div>
              <span className="text-neutral-500">New buyer or driver? </span>
              <Link
                href="/auth/register"
                className="font-bold text-neutral-900 underline hover:bg-[#FFE600] px-1 py-0.5"
              >
                Create Account
              </Link>
            </div>
            <div>
              <span className="text-neutral-500">Local store owner? </span>
              <Link
                href="/shopkeeper/login"
                className="font-bold text-neutral-900 underline hover:bg-[#00E599] px-1 py-0.5"
              >
                Merchant Gateway →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="border-t-2 border-black bg-white p-3 text-center font-tech text-[11px] text-neutral-500">
        OMNIDROP PROTOCOL · ENCRYPTED VIA GOOGLE FIREBASE & NEON POSTGRES
      </div>
    </div>
  );
}
