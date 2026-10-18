'use client';

import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import { AlertTriangle, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to dispatch password recovery payload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brutal-grid flex flex-col justify-between selection:bg-[#FFE600] selection:text-black">
      {/* Top Header */}
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
            <span className="w-2 h-2 rounded-full bg-[#FFE600]"></span>
            <span>{'SECURITY // CREDENTIAL_RECOVERY'}</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex items-center justify-center p-4 my-8">
        <div className="card-brutal max-w-md w-full p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFE600] text-black border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2.5">
              {'// RECOVERY DISPATCH'}
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
              Recover Access
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              {sent
                ? 'Payload dispatched to your registered address'
                : 'Input your registered email to reset your private session token'}
            </p>
          </div>

          {error && (
            <div className="bg-[#FF4800]/10 border-2 border-[#FF4800] p-3 mb-5 font-tech text-xs text-neutral-900 flex items-center gap-2 shadow-[2px_2px_0px_#FF4800]">
              <AlertTriangle className="w-4 h-4 text-[#FF4800] flex-shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-[#00E599] border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <CheckCircle2 className="w-7 h-7 text-black" />
              </div>
              <p className="font-tech text-xs text-neutral-700 leading-relaxed font-bold">
                Recovery instructions successfully transmitted to:
                <br />
                <span className="text-black bg-[#FFE600] px-2 py-0.5 border border-black inline-block mt-2">
                  {email}
                </span>
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="btn-brutal-yellow inline-flex !h-11 !px-6 text-xs font-bold uppercase tracking-wider items-center gap-2"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900 flex items-center justify-between">
                  <span>Registered Email</span>
                  <Mail className="w-3 h-3 text-neutral-500" />
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className="input-brutal"
                  placeholder="operator@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                id="reset-submit"
                type="submit"
                disabled={loading}
                className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-3"
              >
                <span>{loading ? 'DISPATCHING PAYLOAD...' : 'TRANSMIT RESET TOKEN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {!sent && (
            <div className="mt-6 pt-5 border-t-2 border-black/10 text-center font-tech text-xs">
              <span className="text-neutral-500">Remember credentials? </span>
              <Link
                href="/auth/login"
                className="font-bold text-neutral-900 underline hover:bg-[#FFE600] px-1 py-0.5"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black bg-white p-3 text-center font-tech text-[11px] text-neutral-500">
        OMNIDROP PROTOCOL · ENCRYPTED VIA GOOGLE FIREBASE & NEON POSTGRES
      </div>
    </div>
  );
}
