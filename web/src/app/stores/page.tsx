'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { FormAlert } from '@/components/shared/form-alert';
import { StoreCard } from '@/components/shared/store-card';
import { api } from '@/lib/api';
import type { StoreWithDistance } from '@/types';
import { Loader2, Search, SlidersHorizontal, Store } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StoresDiscoveryPage() {
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [radiusFilter, setRadiusFilter] = useState(10);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    api.stores
      .nearby(28.6139, 77.209, radiusFilter)
      .then((data) => {
        if (active) {
          setStores(data);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('We could not load nearby stores. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [radiusFilter, reload]);
  const query = searchFilter.trim().toLowerCase();
  const filtered = stores.filter(
    (store) =>
      !query ||
      [store.name, store.description, store.address].some((value) =>
        value?.toLowerCase().includes(query),
      ),
  );
  function reset() {
    setSearchFilter('');
    setLoading(true);
    setRadiusFilter(25);
    setReload((value) => value + 1);
  }
  return (
    <div className="min-h-dvh flex flex-col">
      <BrutalNav />
      <main id="main-content" className="site-container flex-1 py-10 sm:py-14">
        <h1 className="section-heading">Your neighborhood stores.</h1>
        <p className="section-copy text-sm">
          Fresh finds, familiar faces, and your next favorite shop. Discover what&apos;s close by.
        </p>
        <div className="surface-panel shadow-none p-4 sm:p-5 mt-8 mb-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 text-sm text-secondary mr-2">
              <SlidersHorizontal size={17} />
              Within
            </span>
            {[5, 10, 15, 25].map((km) => (
              <button
                key={km}
                type="button"
                className="filter-pill px-3 py-2 min-h-10"
                aria-pressed={radiusFilter === km}
                onClick={() => {
                  setLoading(true);
                  setRadiusFilter(km);
                  if (km === radiusFilter) setReload((value) => value + 1);
                }}
              >
                {km} km
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <label htmlFor="store-search" className="sr-only">
              Search nearby stores
            </label>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="store-search"
              type="search"
              className="field-input pl-11"
              placeholder="Search bakery, grocer, or address"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
            />
          </div>
        </div>
        {error ? (
          <div className="surface-panel p-6">
            <FormAlert message={error} />
            <button
              type="button"
              className="button-primary"
              onClick={() => {
                setLoading(true);
                setError('');
                setReload((value) => value + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div
            role="status"
            className="empty-state flex flex-col items-center gap-4 text-secondary"
          >
            <Loader2 size={28} className="animate-spin text-brand" />
            Finding nearby stores…
          </div>
        ) : filtered.length ? (
          <>
            <p className="text-xs text-secondary mb-5">
              {filtered.length} {filtered.length === 1 ? 'store' : 'stores'} found near Central
              Delhi
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        ) : (
          <div className="surface-panel empty-state">
            <span className="empty-state-icon">
              <Store size={28} />
            </span>
            <h2 className="text-xl font-bold">No stores found nearby.</h2>
            <p className="text-sm text-secondary mt-2 mb-6">
              Try a wider distance or a different search.
            </p>
            <button type="button" className="button-primary" onClick={reset}>
              Reset filters
            </button>
          </div>
        )}
      </main>
      <BrutalFooter />
    </div>
  );
}
