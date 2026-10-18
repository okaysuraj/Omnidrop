'use client';

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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Breadcrumb & Subnav */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// MERCHANT ONBOARDING · STEP 01 OF 02'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Micro-Hub Store Profile
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Configure physical store geo-fence, hyper-local corridor radius, and operational
              shifts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-tech text-xs bg-white text-black font-bold uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
              Status: {existingStore ? 'Active Node' : 'Unregistered'}
            </span>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-tech text-xs uppercase font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            📦 Shelf Inventory
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            📋 Fulfill Orders
          </Link>
          <Link
            href="/shopkeeper/profile-setup"
            className="px-4 py-2 border-2 border-black bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]"
          >
            ⚙️ Hub Profile
          </Link>
          <Link
            href="/shopkeeper/financial-setup"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            💳 Banking & Payouts
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Store Details & Timings */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Store Identity */}
            <div className="card-brutal p-6 space-y-4">
              <h2 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2 pb-2 border-b-2 border-black">
                <Store className="w-5 h-5 text-black" />
                1. Store Identity & Street Location
              </h2>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Commercial Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Greens Micro-Hub"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="input-brutal text-sm"
                />
              </div>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Business Domain / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-brutal text-sm bg-white cursor-pointer"
                >
                  <option>Grocery & Fresh Produce</option>
                  <option>Artisan Bakery & Cafe</option>
                  <option>Pharmacy & Healthcare</option>
                  <option>Specialty Gourmet & Snacks</option>
                  <option>Dairy & Farm Fresh</option>
                </select>
              </div>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Physical Store Address (For Courier Pickup) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 542, 12th Main Road, Indiranagar, Bengaluru"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="input-brutal text-sm"
                />
              </div>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Hub Bio / Customer Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Neighborhood organic micro-fulfillment depot stocked with certified farm harvest..."
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="input-brutal text-sm resize-none"
                />
              </div>
            </div>

            {/* 2. Operational Hours */}
            <div className="card-brutal p-6 space-y-4">
              <h2 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2 pb-2 border-b-2 border-black">
                <Clock className="w-5 h-5 text-black" />
                2. Operational Shifts & Dispatch Readiness
              </h2>

              <div className="space-y-3 font-tech text-xs">
                <div className="flex items-center justify-between p-3 border-2 border-black bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="font-bold text-neutral-900">Mon - Fri Weekdays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white border border-black font-bold">
                      07:00 AM
                    </span>
                    <span>to</span>
                    <span className="px-2 py-1 bg-white border border-black font-bold">
                      11:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border-2 border-black bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="font-bold text-neutral-900">Saturday Peak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white border border-black font-bold">
                      08:00 AM
                    </span>
                    <span>to</span>
                    <span className="px-2 py-1 bg-white border border-black font-bold">
                      11:30 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border-2 border-black bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="font-bold text-neutral-900">Sunday Brunch & Evening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white border border-black font-bold">
                      08:00 AM
                    </span>
                    <span>to</span>
                    <span className="px-2 py-1 bg-white border border-black font-bold">
                      10:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Geo-Corridor Radar & Submission */}
          <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
            <div className="card-brutal p-6 bg-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-black" />
                  Hyperlocal Service Radius
                </h3>
                <span className="px-2.5 py-0.5 bg-[#FFE600] text-black font-tech text-xs font-bold border border-black shadow-[1px_1px_0px_#000]">
                  {radius.toFixed(1)} KM CORRIDOR
                </span>
              </div>

              {/* Graphic Radar Simulation */}
              <div className="relative h-64 bg-neutral-900 border-2 border-black overflow-hidden flex items-center justify-center p-4">
                {/* Radial Grid Rings */}
                <div className="absolute inset-0 bg-brutal-grid opacity-20"></div>
                <div className="absolute w-48 h-48 rounded-full border border-neutral-700"></div>
                <div className="absolute w-32 h-32 rounded-full border border-neutral-600"></div>
                <div className="absolute w-16 h-16 rounded-full border border-neutral-500"></div>

                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-neutral-700"></div>
                <div className="absolute h-full w-[1px] bg-neutral-700"></div>

                {/* Geo-Circle Visualization */}
                <div
                  className="rounded-full border-2 border-[#00E599] bg-[#00E599]/20 transition-all duration-300 flex items-center justify-center relative"
                  style={{
                    width: `${Math.min(220, 60 + radius * 12)}px`,
                    height: `${Math.min(220, 60 + radius * 12)}px`,
                  }}
                >
                  <div className="w-4 h-4 bg-[#FFE600] border-2 border-black rounded-full animate-ping"></div>
                  <div className="w-3 h-3 bg-[#FFE600] border-2 border-black rounded-full absolute"></div>
                </div>

                {/* Radar Floating Stat */}
                <div className="absolute bottom-3 left-3 bg-black/90 border border-white text-white p-2 font-tech text-[10px]">
                  <p className="text-[#00E599] font-bold">LAT: 12.9716° N</p>
                  <p className="text-neutral-400">LNG: 77.5946° E</p>
                </div>
              </div>

              {/* Radius Control Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-tech text-xs font-bold uppercase">
                  <span>Dispatch Perimeter</span>
                  <span className="text-black font-black text-sm">{radius.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-200 border-2 border-black appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between font-tech text-[10px] text-neutral-500">
                  <span>1.0 km (Hyper-dense)</span>
                  <span>7.5 km (Standard)</span>
                  <span>15.0 km (Max corridor)</span>
                </div>
              </div>

              {/* Reach Forecast Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 border-2 border-black bg-neutral-50">
                  <p className="font-tech text-[10px] text-neutral-500 uppercase font-bold">
                    Est. Households
                  </p>
                  <p className="font-display font-black text-xl text-neutral-900 mt-0.5">
                    ~{(estimatedHouseholds / 1000).toFixed(1)}k
                  </p>
                  <span className="text-[10px] font-tech text-neutral-600">Active app reach</span>
                </div>

                <div className="p-3 border-2 border-black bg-neutral-50">
                  <p className="font-tech text-[10px] text-neutral-500 uppercase font-bold">
                    Avg. Courier Sla
                  </p>
                  <p className="font-display font-black text-xl text-neutral-900 mt-0.5">
                    {Math.round(8 + radius * 0.8)}-{Math.round(12 + radius * 1.2)} min
                  </p>
                  <span className="text-[10px] font-tech text-[#00E599] font-bold bg-black px-1">
                    Guaranteed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-black space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-brutal-yellow w-full !h-12 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
                >
                  <span>{loading ? 'Saving Profile...' : 'Save & Proceed to Banking'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="font-tech text-[11px] text-neutral-500 text-center uppercase">
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
