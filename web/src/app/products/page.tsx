'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import { Check, Loader2, Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

async function fetchCatalog(
  storeId: string,
  categoryId: string,
  search: string,
): Promise<Models.Product[]> {
  if (storeId) {
    const inventory = await api.inventory.byStore(storeId, categoryId || undefined);
    return inventory.flatMap((item) =>
      item.product
        ? [{ ...item.product, sellingPrice: item.priceOverride ?? item.product.sellingPrice }]
        : [],
    );
  }
  const result = await api.products.list({
    categoryId: categoryId || undefined,
    search: search || undefined,
  });
  return result.items;
}

function ProductDiscoveryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';
  const initialSearch = searchParams.get('search') || '';
  const requestedStoreId = searchParams.get('storeId') || '';

  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [products, setProducts] = useState<Models.Product[]>([]);
  const [stores, setStores] = useState<Models.StoreWithDistance[]>([]);
  const [selectedStore, setSelectedStore] = useState<Models.Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [cats, nearbyStores] = await Promise.all([
          api.products.categories().catch(() => []),
          api.stores.nearby(28.6139, 77.209, 20).catch(() => []),
        ]);
        setCategories(cats);
        const storeList = nearbyStores;
        setStores(storeList);

        if (requestedStoreId) {
          try {
            const storeData = await api.stores.getById(requestedStoreId);
            setSelectedStore(storeData);
          } catch {
            const found = storeList.find((s) => s.id === requestedStoreId);
            if (found) setSelectedStore(found);
          }
        }
      } catch {
        /* ignore */
      }
    };
    initData();
  }, [requestedStoreId]);

  useEffect(() => {
    let active = true;
    fetchCatalog(requestedStoreId, selectedCategory, appliedSearch)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCategory, requestedStoreId, appliedSearch]);

  const handleAddToCart = async (product: Models.Product) => {
    setAddingId(product.id);
    try {
      const storeId =
        requestedStoreId ||
        product.inventory?.[0]?.storeId ||
        (stores.length > 0 ? stores[0].id : null);
      if (!storeId) {
        alert('No store available to fulfill this item right now.');
        return;
      }
      await api.cart.addItem(storeId, product.id, 1);
      setSuccessToast(`Added ${product.name} to Tote`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      alert(getErrorMessage(err) || 'Could not add to cart');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      {/* Floating success toast */}
      {successToast && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div className="bg-[#00E599] text-black border-2 border-black p-3 font-tech text-xs font-bold shadow-[4px_4px_0px_#000] flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Active Store Indicator */}
        {selectedStore && (
          <div className="bg-[#FFE600] border-2 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-display font-black text-sm uppercase">
                HUB
              </div>
              <div>
                <div className="font-tech text-[10px] uppercase font-bold tracking-wider text-black/70">
                  {'// FULFILLING MICRO-HUB'}
                </div>
                <div className="font-display font-black text-base uppercase text-black">
                  {selectedStore.name}
                </div>
                <div className="font-sans text-xs text-neutral-800">
                  {selectedStore.address || 'Hyperlocal Hub'} · {selectedStore.rating || '4.9'} ★
                  Rating
                </div>
              </div>
            </div>
            <Link
              href="/products"
              className="btn-brutal-white !h-8 !py-0 !px-3 font-tech text-xs uppercase font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Show All Hubs
            </Link>
          </div>
        )}

        {/* Header Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// LIVE INVENTORY SHELVES'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Direct Shelf Catalog
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Zero markup groceries, sourdoughs, and dairy with dual-scan shelf accuracy.
            </p>
          </div>

          {/* Search box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery !== appliedSearch) {
                setLoading(true);
                setAppliedSearch(searchQuery);
              }
            }}
            className="w-full md:w-80 flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                className="input-brutal pr-9"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="btn-brutal-yellow !h-auto !py-0 !px-4 text-xs font-bold uppercase"
            >
              Find
            </button>
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5 items-center pb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
              !selectedCategory
                ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000] translate-x-0.5'
                : 'bg-white text-neutral-800 hover:bg-[#FAFAF8] shadow-[2px_2px_0px_#000]'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? '' : cat.id)}
                className={`px-3.5 py-2 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                  isSelected
                    ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000] translate-x-0.5'
                    : 'bg-white text-neutral-800 hover:bg-[#FAFAF8] shadow-[2px_2px_0px_#000]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 font-tech text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="font-bold uppercase tracking-wider">
              SYNCING RFID SHELF METRICS...
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="card-brutal p-12 text-center bg-white">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
              No Items Match Filter Criteria
            </h3>
            <p className="font-sans text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
              Reset search query or select another category aisle.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setAppliedSearch('');
              }}
              className="btn-brutal-yellow !h-10 !px-5 text-xs font-bold uppercase mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const image =
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
              return (
                <div
                  key={product.id}
                  className="card-brutal bg-white p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Top Tag & Category */}
                    <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2.5 font-tech text-[10px] font-bold">
                      <span className="bg-[#FFE600] px-1.5 py-0.2 border border-black uppercase text-black">
                        {product.category?.name || 'FRESH SHELF'}
                      </span>
                      <span className="text-neutral-500 uppercase">
                        {product.weight || product.unit || 'Standard'}
                      </span>
                    </div>

                    {/* Image Container */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block relative aspect-[4/3] w-full border-2 border-black overflow-hidden mb-3 bg-neutral-100 hover:opacity-95 transition-opacity"
                    >
                      <img src={image} alt={product.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black text-white font-tech text-[9px] px-1.5 py-0.5 uppercase font-bold">
                        STOCK: IN HUB
                      </div>
                    </Link>

                    {/* Title & Description */}
                    <Link href={`/products/${product.id}`} className="hover:underline">
                      <h3 className="font-display font-black text-base uppercase text-neutral-900 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-sans text-xs text-neutral-600 font-medium line-clamp-2 mt-1">
                      {product.description ||
                        'Verified grade A local farm product with 100% shelf freshness inspection.'}
                    </p>
                  </div>

                  {/* Price Bar & Add Action */}
                  <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2">
                    <div>
                      <div className="font-tech font-black text-xl text-neutral-900 tracking-tight leading-none">
                        ₹{Number(product.sellingPrice).toFixed(2)}
                      </div>
                      {product.mrp && Number(product.mrp) > Number(product.sellingPrice) && (
                        <span className="font-tech text-[10px] text-neutral-400 line-through">
                          ₹{Number(product.mrp).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className="btn-brutal-yellow !h-9 !py-0 !px-3 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      {addingId === product.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>TOTE...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD TO TOTE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}

export default function ProductDiscoveryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-tech text-xs font-bold">
          <span>INITIALIZING CATALOG KERNEL...</span>
        </div>
      }
    >
      <ProductDiscoveryContent />
    </Suspense>
  );
}
