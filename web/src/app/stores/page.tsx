'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import type * as Models from '@/types';
import { ArrowRight, Search, ShoppingBag, SlidersHorizontal, Store } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StoresDiscoveryPage() {
  const [stores, setStores] = useState<Models.StoreWithDistance[]>([]);
  const [radiusFilter, setRadiusFilter] = useState<number>(10);
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const nearbyStores = await api.stores.nearby(28.6139, 77.209, radiusFilter);
        setStores(nearbyStores);
      } catch {
        /* ignore */
      }
    };
    loadData();
  }, [radiusFilter]);

  const filteredStores = stores.filter((s) => {
    if (!searchFilter.trim()) return true;
    return (
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.address?.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// STORE DISCOVERY NODE'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Verified Neighborhood Dark Stores
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Active dispatch hubs accredited for 90-second packing and barcode synchronization.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                className="input-brutal pr-9"
                placeholder="Search bakery, supermarket..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="flex flex-wrap items-center gap-2 font-tech text-xs">
            <span className="font-bold text-neutral-700 uppercase flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Radius Corridor:
            </span>
            {[5, 10, 15, 25].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setRadiusFilter(km)}
                className={`px-3 py-1 font-bold border-2 border-black transition-all ${
                  radiusFilter === km
                    ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#FAFAF8] text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                &le; {km} KM
              </button>
            ))}
          </div>

          <div className="font-tech text-xs text-neutral-600 font-bold">
            SHOWING {filteredStores.length} ACTIVE MICRO-HUBS
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="card-brutal p-12 text-center bg-white">
            <Store className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
              No Stores Located in Corridor
            </h3>
            <p className="font-sans text-xs text-neutral-600 mt-1 max-w-md mx-auto">
              Try expanding your radius threshold or reset search filters.
            </p>
            <button
              onClick={() => {
                setRadiusFilter(25);
                setSearchFilter('');
              }}
              className="btn-brutal-yellow !h-10 !px-5 text-xs font-bold uppercase mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="card-brutal bg-white p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Status Strip */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-3 font-tech text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-neutral-800">
                      <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
                      <span>DISPATCH READY</span>
                    </span>
                    <span className="badge-brutal bg-[#FFE600] text-black text-[10px]">
                      ★ {store.rating || '4.8'}
                    </span>
                  </div>

                  {/* Store Name & Description */}
                  <h3 className="font-display font-black text-xl text-neutral-900 uppercase tracking-tight mb-1">
                    {store.name}
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 font-medium line-clamp-2 mb-3">
                    {store.description}
                  </p>

                  {/* Photo Container */}
                  <div className="relative aspect-[16/9] w-full border-2 border-black overflow-hidden mb-3 bg-neutral-100">
                    <img
                      src={
                        store.imageUrl ||
                        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black text-white font-tech text-[10px] px-2 py-0.5 font-bold uppercase">
                      LOC: {store.address?.split(',')[0] || 'Central Delhi'}
                    </div>
                  </div>

                  {/* Operational Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#FAFAF8] border-2 border-black font-tech text-xs text-center">
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                        Corridor
                      </span>
                      <span className="font-black text-neutral-900">
                        {store.distance ? `${Number(store.distance).toFixed(1)} km` : '0.8 km'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                        Doorstep
                      </span>
                      <span className="font-black text-[#FF4800]">
                        {store.estimatedDeliveryMinutes
                          ? `${store.estimatedDeliveryMinutes} min`
                          : '15 min'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                        SLA
                      </span>
                      <span className="font-black text-[#059669]">99.8%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/stores/${store.id}`}
                    className="flex-1 btn-brutal-white !h-10 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>Hub Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/products?storeId=${store.id}`}
                    className="flex-1 btn-brutal-yellow !h-10 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop Items</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
