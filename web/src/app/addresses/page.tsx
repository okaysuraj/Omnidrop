'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Home,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function SavedAddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Models.Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  // Address Form State
  const [label, setLabel] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, router]);

  async function fetchAddresses() {
    try {
      const data = await api.users.addresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim() || !city.trim() || !pincode.trim()) {
      setFeedback({ type: 'error', message: 'Street address, city, and pincode are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      await api.users.createAddress({
        label,
        addressLine1: streetAddress,
        city,
        state,
        pincode,
        lat: 12.9716,
        lng: 77.5946,
        isDefault: addresses.length === 0,
      });
      setFeedback({ type: 'success', message: 'Delivery coordinate saved successfully!' });
      setModalOpen(false);
      setStreetAddress('');
      await fetchAddresses();
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) || 'Failed to save address.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Remove this saved address?')) return;
    setDeletingId(id);
    try {
      await api.users.deleteAddress(id);
      setFeedback({ type: 'success', message: 'Waypoint deleted.' });
      await fetchAddresses();
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) || 'Failed to remove address.' });
    } finally {
      setDeletingId(null);
    }
  };

  const getLabelIcon = (lbl: string) => {
    const l = lbl.toUpperCase();
    if (l.includes('HOME')) return <Home className="w-4 h-4" />;
    if (l.includes('WORK') || l.includes('OFFICE')) return <Briefcase className="w-4 h-4" />;
    return <Navigation className="w-4 h-4" />;
  };

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
              {'Geo-radar waypoints'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Saved Delivery Addresses
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Pre-authorized doorstep drop coordinates for rapid 15-minute dispatch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              setModalOpen(true);
            }}
            className="button-primary !h-10 !px-4 text-xs font-bold  flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Waypoint</span>
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

        {loading ? (
          <div className="py-24 text-center font-sans text-xs font-bold flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-ink" />
            <span className=" tracking-normal">Retrieving registered waypoints...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="surface-card p-12 text-center bg-surface border rounded-xl border-line max-w-lg mx-auto space-y-4">
            <MapPin className="w-12 h-12 text-secondary mx-auto" />
            <h3 className="font-display font-bold text-xl  tracking-tight text-ink">
              No Delivery Waypoints Configured
            </h3>
            <p className="font-sans text-xs text-secondary">
              Add your home, office, or apartment coordinates to enable zero-prompt checkout
              dispatches.
            </p>
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                setModalOpen(true);
              }}
              className="button-primary inline-flex !h-10 !px-5 text-xs font-bold  items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Configure First Waypoint</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => {
              const isDeleting = deletingId === addr.id;
              return (
                <div
                  key={addr.id}
                  className="surface-card bg-surface p-5 border rounded-xl border-line  flex flex-col space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-line pb-2.5">
                      <div className="flex items-center gap-2 font-sans font-bold text-xs  text-ink">
                        {getLabelIcon(addr.label || 'Home')}
                        <span>{addr.label || 'Waypoint'}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="badge-accent text-xs font-bold ">Default drop</span>
                      )}
                    </div>

                    <div>
                      <div className="font-display font-bold text-base  text-ink leading-snug">
                        {addr.addressLine1}
                      </div>
                      <div className="font-sans text-xs text-secondary mt-1 font-medium">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line flex items-center justify-between">
                    <span className="font-sans text-xs text-secondary font-bold ">
                      Geo-tagged protocol
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      disabled={isDeleting}
                      className="p-1.5 hover:bg-danger-soft hover:text-ink border rounded-xl border-line transition-colors"
                      title="Delete Waypoint"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted p-4 backdrop-blur-xs">
          <div className="surface-card bg-surface w-full max-w-lg p-6 border rounded-xl border-line  space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="font-sans text-xs  font-bold text-secondary">
                  Courier vector registration
                </span>
                <h3 className="font-display font-bold text-xl  tracking-tight text-ink">
                  Register New Waypoint
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 border rounded-xl border-line flex items-center justify-center hover:bg-danger-soft hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              {/* Label Selector */}
              <div>
                <label className="block font-sans text-xs  font-bold text-ink mb-1.5">
                  Location Type Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Office', 'Other'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLabel(l)}
                      className={`py-2 border rounded-xl border-line font-sans text-xs  font-bold transition-all ${
                        label === l
                          ? 'bg-brand-soft text-ink '
                          : 'bg-canvas text-secondary hover:bg-muted'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label
                  htmlFor="field-addresses-page-1"
                  className="block font-sans text-xs  font-bold text-ink mb-1.5"
                >
                  Street Address & Flat / Tower
                </label>
                <input
                  id="field-addresses-page-1"
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Lotus Towers, 12th Main Road"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="field-input text-xs"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="field-addresses-page-2"
                    className="block font-sans text-xs  font-bold text-ink mb-1.5"
                  >
                    City / Quadrant
                  </label>
                  <input
                    id="field-addresses-page-2"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="field-input text-xs"
                  />
                </div>
                <div>
                  <label
                    htmlFor="field-addresses-page-3"
                    className="block font-sans text-xs  font-bold text-ink mb-1.5"
                  >
                    State
                  </label>
                  <input
                    id="field-addresses-page-3"
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="field-input text-xs"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label
                  htmlFor="field-addresses-page-4"
                  className="block font-sans text-xs  font-bold text-ink mb-1.5"
                >
                  Postal Pincode
                </label>
                <input
                  id="field-addresses-page-4"
                  type="text"
                  required
                  placeholder="560038"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="field-input text-xs font-sans font-bold"
                />
              </div>

              <div className="p-3 bg-canvas border rounded-xl border-line font-sans text-xs text-secondary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0" />
                <span>Geocoded into the dispatch satellite radar for immediate routing.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 button-secondary !h-11 font-sans text-xs  font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 button-primary !h-11 font-sans text-xs  font-bold flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Confirm waypoint</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BrutalFooter />
    </div>
  );
}
