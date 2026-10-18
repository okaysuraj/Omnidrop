'use client';

import {
  ClipboardList as UiClipboardList,
  CreditCard as UiCreditCard,
  Package as UiPackage,
  Settings as UiSettings,
} from 'lucide-react';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import { ArrowRight, Clock, Navigation, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function BusinessProfileSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeAddress, setStoreAddress] = useState('Indiranagar 100ft Road, Bengaluru');
  const [radius, setRadius] = useState(5.0);
  const [category, setCategory] = useState('Grocery & Fresh Produce');
  const [existingStore, setExistingStore] = useState<Models.Store | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const stores = await api.stores.myStores().catch(() => []);
        if (stores && stores.length > 0) {
          const s = stores[0];
          setExistingStore(s);
          setStoreName(s.name || '');
          setStoreDescription(s.description || '');
          if (s.address) setStoreAddress(s.address);
          if (s.radiusKm) setRadius(Number(s.radiusKm));
        }
      } catch (err) {
        console.error('Failed to load store profile', err);
      }
    };
    fetchStore();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      alert('Please provide a store name.');
      return;
    }
    setLoading(true);
    try {
      if (existingStore) {
        await api.stores.update(existingStore.id, {
          name: storeName.trim(),
          description: storeDescription.trim(),
          address: storeAddress.trim(),
          radiusKm: radius,
          lat: existingStore.lat || 12.9716,
          lng: existingStore.lng || 77.5946,
        });
      } else {
        await api.stores.create({
          name: storeName.trim(),
          description: storeDescription.trim(),
          address: storeAddress.trim(),
          radiusKm: radius,
          lat: 12.9716,
          lng: 77.5946,
        });
      }
      router.push('/shopkeeper/financial-setup');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to save store profile');
    } finally {
      setLoading(false);
    }
  };

  const estimatedHouseholds = Math.round(18000 * Math.pow(radius / 5, 1.8));

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Header Breadcrumb & Subnav */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Merchant onboarding · step 01 of 02'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Your store profile
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Configure physical store geo-fence, hyper-local corridor radius, and operational
              shifts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs bg-surface text-ink font-bold  px-3 py-1.5 border rounded-xl border-line ">
              Status: {existingStore ? 'Active Node' : 'Unregistered'}
            </span>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-sans text-xs  font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiPackage
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Inventory
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiClipboardList
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Orders
          </Link>
          <Link
            href="/shopkeeper/profile-setup"
            className="px-4 py-2 border rounded-xl border-line bg-brand-soft text-ink "
          >
            <UiSettings
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Store profile
          </Link>
          <Link
            href="/shopkeeper/financial-setup"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiCreditCard
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Banking & payouts
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Store Details & Timings */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Store Identity */}
            <div className="surface-card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg  text-ink flex items-center gap-2 pb-2 border-b border-line">
                <Store className="w-5 h-5 text-ink" />
                1. Store Identity & Street Location
              </h2>

              <div>
                <label
                  htmlFor="field-shopkeeper-profile-setup-page-1"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Commercial Store Name *
                </label>
                <input
                  id="field-shopkeeper-profile-setup-page-1"
                  type="text"
                  required
                  placeholder="e.g. Organic Greens Micro-Hub"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="field-input text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="field-shopkeeper-profile-setup-page-2"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Business Domain / Category
                </label>
                <select
                  id="field-shopkeeper-profile-setup-page-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="field-input text-sm bg-surface cursor-pointer"
                >
                  <option>Grocery & Fresh Produce</option>
                  <option>Artisan Bakery & Cafe</option>
                  <option>Pharmacy & Healthcare</option>
                  <option>Specialty Gourmet & Snacks</option>
                  <option>Dairy & Farm Fresh</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="field-shopkeeper-profile-setup-page-3"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Physical Store Address (For Courier Pickup) *
                </label>
                <input
                  id="field-shopkeeper-profile-setup-page-3"
                  type="text"
                  required
                  placeholder="e.g. 542, 12th Main Road, Indiranagar, Bengaluru"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="field-input text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="field-shopkeeper-profile-setup-page-4"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Hub Bio / Customer Description
                </label>
                <textarea
                  id="field-shopkeeper-profile-setup-page-4"
                  rows={3}
                  placeholder="Neighborhood organic micro-fulfillment depot stocked with certified farm harvest..."
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="field-input text-sm resize-none"
                />
              </div>
            </div>

            {/* 2. Operational Hours */}
            <div className="surface-card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg  text-ink flex items-center gap-2 pb-2 border-b border-line">
                <Clock className="w-5 h-5 text-ink" />
                2. Operational Shifts & Dispatch Readiness
              </h2>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between p-3 border rounded-xl border-line bg-muted">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      aria-label="Open Monday to Friday"
                      defaultChecked
                      className="w-4 h-4 accent-brand cursor-pointer"
                    />
                    <span className="font-bold text-ink">Mon - Fri Weekdays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-surface border border-line font-bold">
                      07:00 AM
                    </span>
                    <span>to</span>
                    <span className="px-2 py-1 bg-surface border border-line font-bold">
                      11:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-xl border-line bg-muted">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      aria-label="Open on Saturday"
                      defaultChecked
                      className="w-4 h-4 accent-brand cursor-pointer"
                    />
                    <span className="font-bold text-ink">Saturday Peak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-surface border border-line font-bold">
                      08:00 AM
                    </span>
                    <span>to</span>
                    <span className="px-2 py-1 bg-surface border border-line font-bold">
                      11:30 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-xl border-line bg-muted">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      aria-label="Open on Sunday"
                      defaultChecked
                      className="w-4 h-4 accent-brand cursor-pointer"
                    />
                    <span className="font-bold text-ink">Sunday Brunch & Evening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-surface border border-line font-bold">
                      08:00 AM
                    </span>
                    <span>to</span>
                    <span className="px-2 py-1 bg-surface border border-line font-bold">
                      10:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Geo-Corridor Radar & Submission */}
          <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
            <div className="surface-card p-6 bg-surface space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-display font-bold text-lg  text-ink flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-ink" />
                  Hyperlocal Service Radius
                </h3>
                <span className="px-2.5 py-0.5 bg-brand-soft text-ink font-sans text-xs font-bold border border-line ">
                  {radius.toFixed(1)} Km corridor
                </span>
              </div>

              {/* Graphic Radar Simulation */}
              <div className="relative h-64 bg-muted border rounded-xl border-line overflow-hidden flex items-center justify-center p-4">
                {/* Radial Grid Rings */}
                <div className="absolute inset-0 bg-canvas opacity-20"></div>
                <div className="absolute w-48 h-48 rounded-full border border-line"></div>
                <div className="absolute w-32 h-32 rounded-full border border-line"></div>
                <div className="absolute w-16 h-16 rounded-full border border-line"></div>

                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-muted"></div>
                <div className="absolute h-full w-[1px] bg-muted"></div>

                {/* Geo-Circle Visualization */}
                <div
                  className="rounded-full border rounded-xl border-line bg-brand-soft transition-all duration-300 flex items-center justify-center relative"
                  style={{
                    width: `${Math.min(220, 60 + radius * 12)}px`,
                    height: `${Math.min(220, 60 + radius * 12)}px`,
                  }}
                >
                  <div className="w-4 h-4 bg-brand-soft border rounded-xl border-line rounded-full animate-ping"></div>
                  <div className="w-3 h-3 bg-brand-soft border rounded-xl border-line rounded-full absolute"></div>
                </div>

                {/* Radar Floating Stat */}
                <div className="absolute bottom-3 left-3 bg-muted border border-line text-ink p-2 font-sans text-xs">
                  <p className="text-brand font-bold">Lat: 12.9716° n</p>
                  <p className="text-secondary">Lng: 77.5946° e</p>
                </div>
              </div>

              {/* Radius Control Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-sans text-xs font-bold ">
                  <span>Dispatch Perimeter</span>
                  <span className="text-ink font-bold text-sm">{radius.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  aria-label="Delivery radius in kilometers"
                  min="1"
                  max="15"
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted border rounded-xl border-line appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between font-sans text-xs text-secondary">
                  <span>1.0 km (Hyper-dense)</span>
                  <span>7.5 km (Standard)</span>
                  <span>15.0 km (Max corridor)</span>
                </div>
              </div>

              {/* Reach Forecast Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 border rounded-xl border-line bg-muted">
                  <p className="font-sans text-xs text-secondary  font-bold">Est. Households</p>
                  <p className="font-display font-bold text-xl text-ink mt-0.5">
                    ~{(estimatedHouseholds / 1000).toFixed(1)}k
                  </p>
                  <span className="text-xs font-sans text-secondary">Active app reach</span>
                </div>

                <div className="p-3 border rounded-xl border-line bg-muted">
                  <p className="font-sans text-xs text-secondary  font-bold">Avg. Courier Sla</p>
                  <p className="font-display font-bold text-xl text-ink mt-0.5">
                    {Math.round(8 + radius * 0.8)}-{Math.round(12 + radius * 1.2)} min
                  </p>
                  <span className="text-xs font-sans text-brand font-bold bg-muted px-1">
                    Guaranteed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-line space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="button-primary w-full !h-12 text-sm font-bold  tracking-normal flex items-center justify-center gap-2 "
                >
                  <span>{loading ? 'Saving Profile...' : 'Save & Proceed to Banking'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="font-sans text-xs text-secondary text-center ">
                  Step 1 of 2: KYC banking setup required next for instant settlements.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <BrutalFooter />
    </div>
  );
}
