'use client';

import { useAuth } from '@/providers/auth-provider';
import { AlertTriangle, ArrowRight, Bike, CheckCircle2, ShoppingBag, Store, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const ROLES = [
  {
    value: 'CUSTOMER',
    label: 'Customer',
    desc: 'Browse & order from local shops',
    icon: ShoppingBag,
    color: '#FFE600',
  },
  {
    value: 'SHOPKEEPER',
    label: 'Shopkeeper',
    desc: 'Manage inventory & fulfill orders',
    icon: Store,
    color: '#00E599',
  },
  {
    value: 'DELIVERY_PARTNER',
    label: 'Courier',
    desc: 'Deliver rapid drops & earn',
    icon: Bike,
    color: '#FF4800',
  },
];

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, fullName, role);
      setRegisteredSuccess(true);
    } catch {
      /* error handled by context */
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
            <span>{'ACCOUNT_ONBOARDING // STAKEHOLDER_SELECT'}</span>
          </div>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="flex items-center justify-center p-4 my-8">
        <div className="card-brutal max-w-lg w-full p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
          {registeredSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-[#00E599] border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <CheckCircle2 className="w-7 h-7 text-black" />
              </div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                Verification Link Dispatched
              </h2>
              <p className="font-sans text-sm text-neutral-600 leading-relaxed font-medium">
                We sent a secure verification email to{' '}
                <strong className="text-black font-bold">{email}</strong>. Please verify your inbox
                to activate your credentials before signing in.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="btn-brutal-yellow inline-flex !h-11 !px-6 text-xs font-bold uppercase tracking-wider items-center gap-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFE600] text-black border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2.5">
                  {'// REGISTER OPERATOR NODE'}
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
                  Create Omnidrop Account
                </h1>
                <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
                  Connect as a buyer, neighborhood merchant, or courier rider.
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
                {/* Stakeholder Role Picker */}
                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-2 text-neutral-900">
                    1. Select Stakeholder Role
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={`p-3 border-2 border-black font-tech text-xs text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000] translate-x-0.5 translate-y-0.5'
                              : 'bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <div className="font-bold text-[11px] uppercase tracking-wider">
                            {r.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900">
                    Full Legal Name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    className="input-brutal"
                    placeholder="Alex Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900">
                    Email Address
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    className="input-brutal"
                    placeholder="operator@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900">
                    Create Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    className="input-brutal"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                >
                  <span>{loading ? 'DEPLOYING CREDENTIALS...' : 'COMPLETE REGISTRATION'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t-2 border-black/10 text-center font-tech text-xs">
                <span className="text-neutral-500">Already registered? </span>
                <Link
                  href="/auth/login"
                  className="font-bold text-neutral-900 underline hover:bg-[#FFE600] px-1 py-0.5"
                >
                  Sign In
                </Link>
              </div>
            </>
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
