'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { FormAlert } from '@/components/shared/form-alert';
import { ProductCard } from '@/components/shared/product-card';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type { Category, Product, Store, StoreWithDistance } from '@/types';
import { CheckCircle2, Loader2, Package, Search, Store as StoreIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

async function fetchCatalog(
  storeId: string,
  categoryId: string,
  search: string,
): Promise<Product[]> {
  if (storeId) {
    const inventory = await api.inventory.byStore(storeId, categoryId || undefined);
    return inventory
      .flatMap((item) =>
        item.product
          ? [{ ...item.product, sellingPrice: item.priceOverride ?? item.product.sellingPrice }]
          : [],
      )
      .filter((product) => !search || product.name.toLowerCase().includes(search.toLowerCase()));
  }
  return (
    await api.products.list({ categoryId: categoryId || undefined, search: search || undefined })
  ).items;
}

function ProductDiscoveryContent() {
  const params = useSearchParams();
  const { user } = useAuth();
  const storeId = params.get('storeId') || '';
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(params.get('categoryId') || '');
  const [query, setQuery] = useState(params.get('search') || '');
  const [search, setSearch] = useState(params.get('search') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.products.categories().catch(() => []),
      api.stores.nearby(28.6139, 77.209, 20).catch(() => []),
    ]).then(([cats, nearby]) => {
      if (active) {
        setCategories(cats);
        setStores(nearby);
      }
    });
    if (storeId)
      api.stores
        .getById(storeId)
        .then((data) => {
          if (active) setStore(data);
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, [storeId]);
  useEffect(() => {
    let active = true;
    fetchCatalog(storeId, category, search)
      .then((items) => {
        if (active) {
          setProducts(items);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('We could not load the catalog. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [storeId, category, search, reload]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function add(product: Product) {
    setActionError('');
    if (!user) {
      setActionError('Sign in to add items to your cart.');
      return;
    }
    setAdding(product.id);
    try {
      const fulfillingStore = storeId || product.inventory?.[0]?.storeId || stores[0]?.id;
      if (!fulfillingStore) throw new Error('No local store is available for this item right now.');
      await api.cart.addItem(fulfillingStore, product.id, 1);
      window.dispatchEvent(new Event('omnidrop:cart-updated'));
      setAdded(product.id);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(null), 3000);
    } catch (failure) {
      setActionError(getErrorMessage(failure) || 'We could not add this item. Please try again.');
    } finally {
      setAdding(null);
    }
  }
  function reset() {
    setCategory('');
    setQuery('');
    setSearch('');
    setLoading(true);
    setReload((value) => value + 1);
  }
  return (
    <div className="min-h-dvh flex flex-col">
      <BrutalNav />
      <main id="main-content" className="site-container flex-1 py-10 sm:py-14">
        {storeId && store && (
          <div className="rounded-2xl bg-brand-soft p-5 mb-7 flex items-center justify-between gap-3">
            <div className="flex gap-3 items-center">
              <StoreIcon size={24} className="text-brand" />
              <div>
                <p className="text-xs text-secondary">Shopping from</p>
                <p className="font-bold">{store.name}</p>
              </div>
            </div>
            <Link
              href="/products"
              className="text-xs text-brand font-bold underline underline-offset-4"
            >
              All stores
            </Link>
          </div>
        )}
        <h1 className="section-heading">Groceries & everyday essentials.</h1>
        <p className="section-copy text-sm">
          Fresh favorites and little necessities. Find what you need, close to home.
        </p>
        <form
          role="search"
          className="mt-7 flex gap-3 max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
            setLoading(true);
            setSearch(query.trim());
            setReload((value) => value + 1);
          }}
        >
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Search the product catalog
            </label>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="catalog-search"
              type="search"
              className="field-input pl-11"
              placeholder="Search milk, bread, avocados…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button type="submit" className="button-primary">
            Search
          </button>
        </form>
        <div
          className="flex gap-2 overflow-x-auto py-1 mt-7 mb-7"
          aria-label="Filter products by category"
        >
          <button
            type="button"
            className="filter-pill"
            aria-pressed={!category}
            onClick={() => {
              setCategory('');
              if (category) setLoading(true);
            }}
          >
            Everything
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className="filter-pill"
              aria-pressed={category === item.id}
              onClick={() => {
                setCategory(category === item.id ? '' : item.id);
                setLoading(true);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        {actionError && (
          <div className="mb-6">
            <FormAlert message={actionError} onDismiss={() => setActionError('')} />
            {!user && (
              <Link href="/auth/login" className="text-sm text-brand font-bold underline">
                Sign in to continue
              </Link>
            )}
          </div>
        )}
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
            <Loader2 size={28} className="text-brand animate-spin" />
            Loading fresh finds…
          </div>
        ) : products.length ? (
          <>
            <p className="text-xs text-secondary mb-5">
              {products.length} {products.length === 1 ? 'item' : 'items'}
              {search ? ' matching “' + search + '”' : ' to discover'}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={add}
                  adding={adding === product.id}
                  added={added === product.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="surface-panel empty-state">
            <span className="empty-state-icon">
              <Package size={28} />
            </span>
            <h2 className="text-xl font-bold">Nothing here just yet.</h2>
            <p className="text-sm text-secondary mt-2 mb-6">
              Try a different search or explore another category.
            </p>
            <button type="button" className="button-primary" onClick={reset}>
              Reset filters
            </button>
          </div>
        )}
      </main>
      {added && (
        <div
          role="status"
          className="fixed bottom-5 left-5 right-5 sm:left-auto sm:w-auto z-50 surface-panel p-4 flex items-center gap-3 shadow-lg"
        >
          <CheckCircle2 size={19} className="text-brand" />
          <span className="text-sm">Added to your cart.</span>
          <Link href="/cart" className="font-bold text-sm text-brand underline ml-3">
            View cart
          </Link>
          <button
            type="button"
            onClick={() => setAdded(null)}
            className="p-1"
            aria-label="Dismiss confirmation"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <BrutalFooter />
    </div>
  );
}
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="empty-state" role="status">
          Loading catalog…
        </div>
      }
    >
      <ProductDiscoveryContent />
    </Suspense>
  );
}
