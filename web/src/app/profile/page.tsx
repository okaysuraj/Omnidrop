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
      setFeedback({ type: 'success', message: 'Your profile has been updated.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Sign out of Omnidrop?')) return;
    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-dvh bg-canvas flex flex-col">
        <BrutalNav />
        <div className="site-container py-24 text-center font-sans text-xs font-bold flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ink" />
          <span className=" tracking-normal">Loading your account…</span>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  const initial = (user.fullName || user.email || 'O').charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Authenticated operator console'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Your account
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Manage your identity telemetry, linked wallets, and delivery credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="button-secondary !h-10 !px-4 text-xs font-bold  flex items-center gap-2 hover:!bg-danger-soft hover:!text-ink self-start sm:self-auto transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 border rounded-xl border-line  font-sans text-xs font-bold flex items-center gap-3 ${
              feedback.type === 'success' ? 'bg-brand-soft text-ink' : 'bg-danger-soft text-ink'
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
            <div className="surface-card bg-surface p-6 border rounded-xl border-line  text-center space-y-4">
              <div className="w-20 h-20 bg-brand-soft text-ink border rounded-xl border-line  flex items-center justify-center font-display font-bold text-3xl  mx-auto">
                {initial}
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl  tracking-tight text-ink">
                  {user.fullName || 'Verified Operator'}
                </h3>
                <p className="font-sans text-xs text-secondary mt-0.5">{user.email}</p>
                <div className="mt-2.5">
                  <span className="badge-accent font-sans text-xs font-bold ">
                    Role: {user.role || 'CUSTOMER'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-canvas border rounded-xl border-line font-sans text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-secondary  font-bold">Uid:</span>
                  <span className="font-bold text-ink truncate max-w-[180px]">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary  font-bold">Phone:</span>
                  <span className="font-bold text-ink">{user.phone || 'Not Set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary  font-bold">Session status:</span>
                  <span className="font-bold text-brand">Active protocol</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-3 font-sans text-xs font-bold ">
              <Link
                href="/orders"
                className="surface-card bg-surface p-4 border rounded-xl border-line  hover:bg-brand-soft  transition-all flex flex-col h-24"
              >
                <Package className="w-5 h-5 text-ink" />
                <div className="flex items-center justify-between">
                  <span>My Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/wallet"
                className="surface-card bg-surface p-4 border rounded-xl border-line  hover:bg-brand-soft  transition-all flex flex-col h-24"
              >
                <Wallet className="w-5 h-5 text-ink" />
                <div className="flex items-center justify-between">
                  <span>Omni Wallet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/addresses"
                className="surface-card bg-surface p-4 border rounded-xl border-line  hover:bg-brand-soft  transition-all flex flex-col h-24"
              >
                <MapPin className="w-5 h-5 text-ink" />
                <div className="flex items-center justify-between">
                  <span>Waypoints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/cart"
                className="surface-card bg-surface p-4 border rounded-xl border-line  hover:bg-brand-soft  transition-all flex flex-col h-24"
              >
                <ShoppingBag className="w-5 h-5 text-ink" />
                <div className="flex items-center justify-between">
                  <span>Active Tote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="surface-card bg-surface p-6 border rounded-xl border-line  space-y-5">
              <div className="border-b border-line pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl  tracking-tight text-ink">
                    Modify Operator Telemetry
                  </h3>
                  <p className="font-sans text-xs text-secondary">
                    Update your credentials across the mesh
                  </p>
                </div>
                <Edit3 className="w-5 h-5 text-secondary" />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label
                    htmlFor="field-profile-page-1"
                    className="block font-sans text-xs  font-bold text-ink mb-1.5"
                  >
                    Full Legal Name
                  </label>
                  <input
                    id="field-profile-page-1"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="field-input text-xs"
                    placeholder="e.g. Alex Henderson"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-profile-page-2"
                    className="block font-sans text-xs  font-bold text-ink mb-1.5"
                  >
                    Primary Email (Locked)
                  </label>
                  <input
                    id="field-profile-page-2"
                    type="email"
                    disabled
                    value={user.email}
                    className="field-input text-xs bg-muted cursor-not-allowed opacity-75 font-sans"
                  />
                  <span className="font-sans text-xs text-secondary mt-1 block">
                    Secured by Firebase Authentication. Contact system admin to change.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="field-profile-page-3"
                    className="block font-sans text-xs  font-bold text-ink mb-1.5"
                  >
                    Mobile Phone Number
                  </label>
                  <input
                    id="field-profile-page-3"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="field-input text-xs font-sans font-bold"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="button-primary !h-11 !px-6 text-xs font-bold  flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating telemetry...</span>
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
