'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import { AlertTriangle, ArrowRight, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ShopkeeperLogin() {
  const router = useRouter();
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setLoading(true);
    try {
      await login(email, password);
      router.push('/shopkeeper/dashboard');
    } catch (err) {
      setLocalError(getErrorMessage(err) || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim() || storeName;
      await register(email, password, fullName, 'SHOPKEEPER');
      setSignupSuccess(true);
    } catch (err) {
      setLocalError(getErrorMessage(err) || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Merchant Network Value Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E599] text-black border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000]">
                {'// MERCHANT PORTAL PROTOCOL'}
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-neutral-900 leading-[1.08]">
                Turn your physical store into a high-speed micro-hub.
              </h1>
              <p className="font-sans text-sm sm:text-base text-neutral-600 font-medium leading-relaxed max-w-lg">
                Connect your shelves directly to verified customers living within 1.2km. Maintain
                full retail price parity, keep 94% of every sale, and fulfill drops in 90 seconds.
              </p>
            </div>

            {/* Merchant SLA Metrics */}
            <div className="grid grid-cols-2 gap-3 font-tech text-xs">
              <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="text-neutral-500 uppercase font-bold text-[10px]">
                  Merchant Take Rate
                </div>
                <div className="font-black text-2xl text-neutral-900 mt-1">6% FLAT</div>
                <div className="text-neutral-600 text-[11px] mt-1">
                  Keep 94% vs. 35% on food apps
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="text-neutral-500 uppercase font-bold text-[10px]">
                  Tote Pack SLA
                </div>
                <div className="font-black text-2xl text-[#059669] mt-1">90 SECONDS</div>
                <div className="text-neutral-600 text-[11px] mt-1">
                  Dual-scan handheld validation
                </div>
              </div>
            </div>

            {/* Value checklist */}
            <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_#000] space-y-2.5 font-tech text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Zero listing fees or monthly software subscriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Instant automated inventory sync via CSV or barcode</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Direct integration with localized bike courier fleet</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Instant daily settlements straight to your registered bank account</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card with Tab Switching */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="card-brutal max-w-lg w-full p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
              {/* Tab Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#FAFAF8] border-2 border-black">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setLocalError('');
                  }}
                  className={`h-10 font-tech font-bold text-xs uppercase transition-all ${
                    isLogin
                      ? 'bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setLocalError('');
                  }}
                  className={`h-10 font-tech font-bold text-xs uppercase transition-all ${
                    !isLogin
                      ? 'bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  Onboard Store
                </button>
              </div>

              {/* Form Title */}
              <div className="mb-5">
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                  {isLogin ? 'Merchant Access' : 'Register Store Node'}
                </h2>
                <p className="font-sans text-xs text-neutral-600 mt-1 font-medium">
                  {isLogin
                    ? 'Authenticate to access store stock, pending tickets, and live dispatch.'
                    : 'Submit your store credentials to deploy onto the local dispatch grid.'}
                </p>
              </div>

              {(localError || error) && (
                <div className="bg-[#FF4800]/10 border-2 border-[#FF4800] p-3 mb-5 font-tech text-xs text-neutral-900 flex items-center justify-between shadow-[2px_2px_0px_#FF4800]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FF4800] flex-shrink-0" />
                    <span className="font-bold">{localError || error}</span>
                  </div>
                  <button
                    onClick={() => {
                      setLocalError('');
                      clearError();
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {signupSuccess && (
                <div className="bg-[#00E599]/20 border-2 border-black p-3 mb-5 font-tech text-xs text-neutral-900 font-bold shadow-[2px_2px_0px_#000]">
                  Store credentials generated! A verification payload was sent to {email}. Verify
                  your inbox before logging in.
                </div>
              )}

              <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1 text-neutral-900">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="input-brutal"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1 text-neutral-900">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="input-brutal"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1 text-neutral-900">
                        Official Store Name
                      </label>
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="input-brutal"
                        placeholder="e.g. Green Valley Grocers"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1 text-neutral-900">
                    Business Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-brutal"
                    placeholder="merchant@store.com"
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1 text-neutral-900">
                    Access Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-brutal"
                    placeholder="Min 6 characters"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                >
                  <span>
                    {loading
                      ? 'COMMUNICATING WITH KERNEL...'
                      : isLogin
                        ? 'UNLOCK MERCHANT DASHBOARD'
                        : 'SUBMIT STORE FOR VERIFICATION'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-4 border-t-2 border-black/10 text-center font-tech text-[11px] text-neutral-500">
                NEED ASSISTANCE? ONBOARDING HELPLINE: +91 9876543210
              </div>
            </div>
          </div>
        </div>
      </main>

      <BrutalFooter />
    </div>
  );
}
