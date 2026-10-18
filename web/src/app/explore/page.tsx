'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { FormAlert } from '@/components/shared/form-alert';
import { ProductCard } from '@/components/shared/product-card';
import { StoreCard } from '@/components/shared/store-card';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type { Category, Product, StoreWithDistance } from '@/types';
import {
  ArrowRight,
  Carrot,
  ChevronRight,
  Cookie,
  Leaf,
  Loader2,
  Milk,
  Search,
  ShoppingBag,
  Store,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

function CategoryIcon({ name }: { name: string }) {
  const value = name.toLowerCase();
  const Icon = value.includes('bak')
    ? Cookie
    : value.includes('dairy')
      ? Milk
      : value.includes('veg')
        ? Carrot
        : value.includes('fruit')
          ? Leaf
          : ShoppingBag;
  return <Icon size={27} />;
}

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
      return;
    }
    if (!user) return;
    let active = true;
    Promise.all([api.products.categories(), api.stores.nearby(28.6139, 77.209, 25)])
      .then(([cats, nearby]) => {
        if (active) {
          setCategories(cats);
          setStores(nearby);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('We could not load your neighborhood. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, authLoading, router, reload]);
  async function search(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError('');
    try {
      const found = await api.products.search(query.trim());
      setResults(found || []);
      setSearched(query.trim());
    } catch {
      setError('Search is unavailable right now. Please try again.');
    } finally {
      setSearching(false);
    }
  }
  return (
    <div className="min-h-dvh flex flex-col">
      <BrutalNav />
      <main id="main-content" className="site-container flex-1 py-9 sm:py-12 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-secondary mb-2">A good day starts nearby.</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-.045em]">
              What&apos;s fresh today{user?.fullName ? ', ' + user.fullName.split(' ')[0] : ''}?
            </h1>
          </div>
          <form role="search" onSubmit={search} className="flex gap-2 w-full lg:w-[430px]">
            <div className="relative flex-1">
              <label htmlFor="explore-search" className="sr-only">
                Search your neighborhood
              </label>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                id="explore-search"
                className="field-input pl-11"
                type="search"
                placeholder="Milk, sourdough, something fresh…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button type="submit" className="button-primary px-4" disabled={searching}>
              {searching ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowRight size={18} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
        {error && (
          <div>
            <FormAlert message={error} />
            <button
              type="button"
              className="text-brand text-sm font-bold underline"
              onClick={() => {
                setLoading(true);
                setError('');
                setReload((value) => value + 1);
              }}
            >
              Try again
            </button>
          </div>
        )}
        {searched ? (
          <section>
            <div className="flex justify-between items-center mb-6 gap-3">
              <h2 className="text-xl font-bold">Results for &ldquo;{searched}&rdquo;</h2>
              <button
                type="button"
                className="text-sm text-brand font-semibold"
                onClick={() => {
                  setSearched('');
                  setQuery('');
                }}
              >
                Clear search
              </button>
            </div>
            {results.length ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="surface-panel empty-state">
                <span className="empty-state-icon">
                  <Search size={26} />
                </span>
                <h3 className="font-bold text-lg">No matches this time.</h3>
                <p className="text-secondary text-sm mt-2">
                  Try another product or browse your local stores.
                </p>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="grid md:grid-cols-[1.1fr_1fr] bg-brand-soft rounded-[28px] overflow-hidden">
              <div className="p-7 sm:p-10 lg:p-12 self-center">
                <span className="inline-flex items-center gap-2 text-xs text-brand font-semibold">
                  <Leaf size={16} />
                  Everyday goodness, locally found
                </span>
                <h2 className="mt-5 text-3xl lg:text-[42px] leading-[1.15] tracking-[-.045em] font-bold max-w-md">
                  Fresh finds for whatever today brings.
                </h2>
                <p className="text-sm text-secondary leading-7 max-w-sm mt-4">
                  Your trusted local stores, together in one place. Pick up a favorite or discover
                  something new.
                </p>
                <Link href="/products" className="button-primary mt-6">
                  Shop essentials
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="relative min-h-60 md:min-h-[380px]">
                <Image
                  src="/hero_essentials.jpg"
                  alt="Fresh bread, oranges and herbs ready for delivery"
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                  priority
                />
              </div>
            </section>
            {categories.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold tracking-tight">Shop by category</h2>
                  <Link
                    href="/products"
                    className="inline-flex gap-1 items-center text-sm font-semibold text-brand"
                  >
                    See all
                    <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={'/products?categoryId=' + encodeURIComponent(category.id)}
                      className="category-tile"
                    >
                      <span className="category-icon">
                        <CategoryIcon name={category.name} />
                      </span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <section>
              <div className="flex justify-between items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Good things around the corner.
                  </h2>
                  <p className="text-sm text-secondary mt-2">Discover stores near Central Delhi.</p>
                </div>
                <Link
                  href="/stores"
                  className="inline-flex gap-1 items-center text-sm font-semibold text-brand whitespace-nowrap"
                >
                  All stores
                  <ChevronRight size={16} />
                </Link>
              </div>
              {loading ? (
                <div
                  role="status"
                  className="empty-state text-secondary flex flex-col items-center gap-3"
                >
                  <Loader2 size={27} className="text-brand animate-spin" />
                  Finding your local favorites…
                </div>
              ) : stores.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.slice(0, 6).map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              ) : (
                !error && (
                  <div className="surface-panel empty-state">
                    <span className="empty-state-icon">
                      <Store size={28} />
                    </span>
                    <h3 className="font-bold text-lg">No nearby stores just yet.</h3>
                    <p className="text-sm text-secondary mt-2 mb-5">
                      Try a wider search to see what&apos;s available.
                    </p>
                    <Link href="/stores" className="button-primary">
                      Explore stores
                    </Link>
                  </div>
                )
              )}
            </section>
          </>
        )}
      </main>
      <BrutalFooter />
    </div>
  );
}
