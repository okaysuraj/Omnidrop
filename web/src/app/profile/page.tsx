'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Loader2,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [nameInput, setFullName] = useState<string | null>(null);
  const fullName = nameInput ?? user?.fullName ?? '';
  const [phoneInput, setPhone] = useState<string | null>(null);
  const phone = phoneInput ?? user?.phone ?? '';
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await api.auth.updateProfile({ fullName, phone });
      setFeedback({ type: 'success', message: 'Operator profile credentials updated in mesh.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to terminate your Omnidrop session?')) return;
    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
        <BrutalNav />
        <div className="container-brutal py-24 text-center font-tech text-xs font-bold flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="uppercase tracking-wider">INITIALIZING OPERATOR CONSOLE...</span>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  const initial = (user.fullName || user.email || 'O').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// AUTHENTICATED OPERATOR CONSOLE'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Account Control
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Manage your identity telemetry, linked wallets, and delivery credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-brutal-white !h-10 !px-4 text-xs font-bold uppercase flex items-center gap-2 hover:!bg-[#FF4800] hover:!text-white self-start sm:self-auto transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 border-2 border-black shadow-[4px_4px_0px_#000] font-tech text-xs font-bold flex items-center gap-3 ${
              feedback.type === 'success' ? 'bg-[#00E599] text-black' : 'bg-[#FF4800] text-white'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: User Identity Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] text-center space-y-4">
              <div className="w-20 h-20 bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-display font-black text-3xl uppercase mx-auto">
                {initial}
              </div>

              <div>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                  {user.fullName || 'Verified Operator'}
                </h3>
                <p className="font-tech text-xs text-neutral-500 mt-0.5">{user.email}</p>
                <div className="mt-2.5">
                  <span className="badge-brutal-yellow font-tech text-xs font-black uppercase">
                    ROLE: {user.role || 'CUSTOMER'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#FAFAF8] border-2 border-black font-tech text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase font-bold">UID:</span>
                  <span className="font-bold text-neutral-900 truncate max-w-[180px]">
                    {user.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase font-bold">PHONE:</span>
                  <span className="font-bold text-neutral-900">{user.phone || 'Not Set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase font-bold">SESSION STATUS:</span>
                  <span className="font-bold text-[#059669]">ACTIVE PROTOCOL</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-3 font-tech text-xs font-bold uppercase">
              <Link
                href="/orders"
                className="card-brutal bg-white p-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600] hover:shadow-[4px_4px_0px_#000] transition-all flex flex-col justify-between h-24"
              >
                <Package className="w-5 h-5 text-black" />
                <div className="flex items-center justify-between">
                  <span>My Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/wallet"
                className="card-brutal bg-white p-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600] hover:shadow-[4px_4px_0px_#000] transition-all flex flex-col justify-between h-24"
              >
                <Wallet className="w-5 h-5 text-black" />
                <div className="flex items-center justify-between">
                  <span>Omni Wallet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/addresses"
                className="card-brutal bg-white p-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600] hover:shadow-[4px_4px_0px_#000] transition-all flex flex-col justify-between h-24"
              >
                <MapPin className="w-5 h-5 text-black" />
                <div className="flex items-center justify-between">
                  <span>Waypoints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/cart"
                className="card-brutal bg-white p-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600] hover:shadow-[4px_4px_0px_#000] transition-all flex flex-col justify-between h-24"
              >
                <ShoppingBag className="w-5 h-5 text-black" />
                <div className="flex items-center justify-between">
                  <span>Active Tote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-5">
              <div className="border-b-2 border-black pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                    Modify Operator Telemetry
                  </h3>
                  <p className="font-tech text-xs text-neutral-500">
                    UPDATE YOUR CREDENTIALS ACROSS THE MESH
                  </p>
                </div>
                <Edit3 className="w-5 h-5 text-neutral-400" />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-brutal text-xs"
                    placeholder="e.g. Alex Henderson"
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                    Primary Email (Locked)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="input-brutal text-xs bg-neutral-100 cursor-not-allowed opacity-75 font-tech"
                  />
                  <span className="font-tech text-[10px] text-neutral-400 mt-1 block">
                    Secured by Firebase Authentication. Contact system admin to change.
                  </span>
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-brutal text-xs font-tech font-bold"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-brutal-yellow !h-11 !px-6 text-xs font-bold uppercase flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>UPDATING TELEMETRY...</span>
                      </>
                    ) : (
                      <span>Save Profile Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <BrutalFooter />
    </div>
  );
}
