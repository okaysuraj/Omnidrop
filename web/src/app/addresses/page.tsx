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
    if (!confirm('Are you sure you want to remove this delivery waypoint?')) return;
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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// GEO-RADAR WAYPOINTS'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Saved Delivery Addresses
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Pre-authorized doorstep drop coordinates for rapid 15-minute dispatch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              setModalOpen(true);
            }}
            className="btn-brutal-yellow !h-10 !px-4 text-xs font-bold uppercase flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Waypoint</span>
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

        {loading ? (
          <div className="py-24 text-center font-tech text-xs font-bold flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="uppercase tracking-wider">RETRIEVING REGISTERED WAYPOINTS...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="card-brutal p-12 text-center bg-white border-2 border-black max-w-lg mx-auto space-y-4">
            <MapPin className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
              No Delivery Waypoints Configured
            </h3>
            <p className="font-sans text-xs text-neutral-600">
              Add your home, office, or apartment coordinates to enable zero-prompt checkout
              dispatches.
            </p>
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                setModalOpen(true);
              }}
              className="btn-brutal-yellow inline-flex !h-10 !px-5 text-xs font-bold uppercase items-center gap-2"
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
                  className="card-brutal bg-white p-5 border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
                      <div className="flex items-center gap-2 font-tech font-bold text-xs uppercase text-neutral-900">
                        {getLabelIcon(addr.label || 'Home')}
                        <span>{addr.label || 'Waypoint'}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="badge-brutal-yellow text-[9px] font-black uppercase">
                          DEFAULT DROP
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="font-display font-black text-base uppercase text-neutral-900 leading-snug">
                        {addr.addressLine1}
                      </div>
                      <div className="font-sans text-xs text-neutral-600 mt-1 font-medium">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                    <span className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
                      GEO-TAGGED PROTOCOL
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      disabled={isDeleting}
                      className="p-1.5 hover:bg-[#FF4800] hover:text-white border-2 border-black transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="card-brutal bg-white w-full max-w-lg p-6 border-2 border-black shadow-[8px_8px_0px_#000] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="font-tech text-[10px] uppercase font-bold text-neutral-500">
                  COURIER VECTOR REGISTRATION
                </span>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                  Register New Waypoint
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#FF4800] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              {/* Label Selector */}
              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                  Location Type Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Office', 'Other'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLabel(l)}
                      className={`py-2 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                        label === l
                          ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                          : 'bg-[#FAFAF8] text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                  Street Address & Flat / Tower
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Lotus Towers, 12th Main Road"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="input-brutal text-xs"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                    City / Quadrant
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-brutal text-xs"
                  />
                </div>
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-brutal text-xs"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                  Postal Pincode
                </label>
                <input
                  type="text"
                  required
                  placeholder="560038"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="input-brutal text-xs font-tech font-bold"
                />
              </div>

              <div className="p-3 bg-[#FAFAF8] border-2 border-black font-tech text-[11px] text-neutral-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Geocoded into the dispatch satellite radar for immediate routing.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 btn-brutal-white !h-11 font-tech text-xs uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 btn-brutal-yellow !h-11 font-tech text-xs uppercase font-bold flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>CONFIRM WAYPOINT</span>
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
