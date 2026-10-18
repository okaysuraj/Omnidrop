'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { ArrowRight, Search, ShoppingBag, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [stores, setStores] = useState<Models.StoreWithDistance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Models.Product[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const [cats, nearbyStores] = await Promise.all([
          api.products.categories().catch(() => []),
          api.stores.nearby(28.6139, 77.209, 25).catch(() => []),
        ]);
        setCategories(cats);
        setStores(nearbyStores);
      } catch {
        /* ignore */
      }
    };

    if (user) loadData();
  }, [user, authLoading, router]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await api.products.search(searchQuery);
      setSearchResults(results || []);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-10">
        {/* 1. WELCOME & SEARCH HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// HYPERLOCAL RADAR'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Welcome, {user?.fullName?.split(' ')[0] || 'Member'}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Active node: Central Delhi Sector 4. Verified neighborhood dark stores within 1.2km
              radius.
            </p>
          </div>

          {/* Brutalist Search Bar */}
          <div className="w-full md:w-96 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                className="input-brutal pr-9"
                placeholder="Search sourdough, milk, avocados..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              onClick={handleSearch}
              className="btn-brutal-yellow !h-auto !py-0 !px-4 text-xs font-bold uppercase"
            >
              Scan
            </button>
          </div>
        </div>

        {/* 2. FLASH DISPATCH HERO BANNER */}
        <section className="card-brutal-dark p-6 sm:p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-3">
              <span className="badge-brutal bg-[#FFE600] text-black font-bold">
                ⚡ ZERO SHELF MARKUP PROTOCOL
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight leading-tight text-white">
                Fresh farm groceries & bakery batches dispatched in under 18 mins.
              </h2>
              <p className="font-sans text-neutral-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
                Direct connection to local verified dark-store terminals. Dual-scanned at the shelf,
                sealed in tamper-evident totes, and routed via urban cycleway couriers.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="btn-brutal-yellow !h-10 !py-0 !px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse Full Shelf Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/stores"
                  className="btn-brutal-white !h-10 !py-0 !px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>View All 3 Micro-Hubs</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 hidden md:flex flex-col gap-2 font-tech text-xs bg-neutral-900 border-2 border-neutral-700 p-4 shadow-[3px_3px_0px_#FFE600]">
              <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-400">MEDIAN DISPATCH</span>
                <span className="text-[#00E599] font-bold">3.8 MINS</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-400">DOORSTEP ARRIVAL</span>
                <span className="text-[#FFE600] font-bold">17.4 MINS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">DELIVERY CHARGE</span>
                <span className="text-white font-bold">₹40 / FLAT</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SEARCH RESULTS IF ACTIVE */}
        {searchResults.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <span>Search Hits: &quot;{searchQuery}&quot;</span>
                <span className="badge-brutal bg-[#FFE600] text-black text-[11px]">
                  {searchResults.length} found
                </span>
              </h3>
              <button
                onClick={() => setSearchResults([])}
                className="font-tech text-xs font-bold underline hover:bg-[#FF4800] hover:text-white px-2 py-0.5"
              >
                Clear Results [X]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="card-brutal p-3 bg-white flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full border-2 border-black overflow-hidden mb-2.5 bg-neutral-100">
                    <img
                      src={
                        product.images?.[0] ||
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black text-white font-tech text-[9px] px-1.5 py-0.2 uppercase font-bold">
                      {product.unit}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-neutral-900 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-tech font-black text-base text-neutral-900">
                        ₹{Number(product.sellingPrice).toFixed(2)}
                      </span>
                      <Link
                        href={`/products?search=${encodeURIComponent(product.name)}`}
                        className="btn-brutal-yellow !h-7 !py-0 !px-2 text-[10px] font-bold uppercase"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. CATEGORY SELECTOR CHIPS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-neutral-900 flex items-center gap-2">
              <span>Shelf Categories</span>
              <span className="font-tech text-xs text-neutral-500 font-bold">
                ({categories.length} AISLES)
              </span>
            </h3>
            <Link
              href="/products"
              className="font-tech text-xs font-bold uppercase underline hover:bg-[#FFE600] px-1.5 py-0.5"
            >
              Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="card-brutal p-3 bg-white hover:bg-[#FFE600] transition-colors group flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full border-2 border-black overflow-hidden mb-2 bg-neutral-100">
                  <img
                    src={
                      cat.imageUrl ||
                      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <div className="font-display font-black text-sm uppercase text-neutral-900 tracking-tight">
                    {cat.name}
                  </div>
                  <div className="font-tech text-[10px] text-neutral-600 font-bold uppercase mt-0.5">
                    Live Inventory Active
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. NEARBY VERIFIED STORES (MICRO-HUBS) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <span>Verified Neighborhood Micro-Hubs</span>
              </h3>
              <p className="font-sans text-xs text-neutral-600 font-medium">
                Within 10km radius from current GPS location.
              </p>
            </div>
            <Link
              href="/stores"
              className="font-tech text-xs font-bold uppercase underline hover:bg-[#FFE600] px-1.5 py-0.5"
            >
              Stores Directory →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stores.map((store) => (
              <div
                key={store.id}
                className="card-brutal bg-white p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Store Header */}
                  <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-3 mb-3">
                    <div>
                      <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
                        STORE NODE #{store.id.slice(0, 6)}
                      </div>
                      <h4 className="font-display font-black text-lg text-neutral-900 uppercase tracking-tight">
                        {store.name}
                      </h4>
                    </div>
                    <span className="badge-brutal bg-[#00E599] text-black text-[10px] flex-shrink-0">
                      VERIFIED
                    </span>
                  </div>

                  {/* Store Image */}
                  <div className="relative aspect-[16/9] w-full border-2 border-black overflow-hidden mb-3 bg-neutral-100">
                    <img
                      src={
                        store.imageUrl ||
                        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black text-white font-tech text-[10px] px-2 py-0.5 font-bold uppercase">
                      ★ {store.rating || '4.8'} ({store.totalRatings || 42})
                    </div>
                  </div>

                  <p className="font-sans text-xs text-neutral-600 leading-relaxed font-medium line-clamp-2">
                    {store.description}
                  </p>
                </div>

                {/* Telemetry Metrics */}
                <div className="space-y-3 pt-2 border-t-2 border-black/10 font-tech text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-[#FAFAF8] border-2 border-black p-2.5">
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                        Proximity
                      </span>
                      <span className="font-black text-neutral-900">
                        {store.distance ? `${Number(store.distance).toFixed(1)} km` : '0.8 km'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                        Est. Drop
                      </span>
                      <span className="font-black text-[#FF4800]">
                        {store.estimatedDeliveryMinutes
                          ? `${store.estimatedDeliveryMinutes} min`
                          : '16 min'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/stores/${store.id}`}
                    className="w-full btn-brutal-yellow !h-10 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Shelves</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BrutalFooter />
    </div>
  );
}
