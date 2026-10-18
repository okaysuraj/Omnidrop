'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import {
  Check,
  ChevronLeft,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Search,
  Star,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params?.id as string;

  const [store, setStore] = useState<Models.Store | null>(null);
  const [inventory, setInventory] = useState<Models.InventoryItem[]>([]);
  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<Models.Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'reviews'>('catalog');

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      try {
        setLoading(true);
        const [storeRes, invRes, catsRes, reviewsRes] = await Promise.all([
          api.stores.getById(storeId).catch(() => null),
          api.inventory.byStore(storeId).catch(() => []),
          api.products.categories().catch(() => []),
          api.reviews.byStore(storeId).catch(() => []),
        ]);

        setStore(storeRes);
        setCategories(Array.isArray(catsRes) ? catsRes : []);
        setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);

        setInventory(invRes);
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleAddToCart = async (item: Models.InventoryItem) => {
    const prodId = item.productId || item.product?.id || item.id;
    if (!prodId || !storeId) return;
    setAddingId(prodId);
    try {
      await api.cart.addItem(storeId, prodId, 1);
      const name = item.product?.name || 'Item';
      setSuccessToast(`Added ${name} to Tote`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      alert(getErrorMessage(err) || 'Could not add item to tote');
    } finally {
      setAddingId(null);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const prod = item.product;
    const matchesCat = !selectedCategory || prod?.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery || prod?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
        <BrutalNav />
        <div className="container-brutal py-24 text-center font-tech text-xs font-bold flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="uppercase tracking-wider">SYNCING MICRO-HUB INVENTORY TELEMETRY...</span>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
        <BrutalNav />
        <div className="container-brutal py-20 text-center space-y-4 max-w-md mx-auto">
          <Store className="w-12 h-12 text-neutral-400 mx-auto" />
          <h2 className="font-display font-black text-2xl uppercase tracking-tight">
            Micro-Hub Node Not Found
          </h2>
          <p className="font-sans text-xs text-neutral-600">
            The requested store identifier does not exist or has been relocated in the network mesh.
          </p>
          <Link
            href="/stores"
            className="btn-brutal-yellow inline-flex !h-10 !px-5 text-xs font-bold uppercase"
          >
            Browse All Stores
          </Link>
        </div>
        <BrutalFooter />
      </div>
    );
  }

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
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/stores"
            className="inline-flex items-center gap-1 font-tech text-xs font-bold uppercase underline hover:bg-[#FFE600] px-1.5 py-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to All Micro-Hubs</span>
          </Link>
        </div>

        {/* Store Profile Hero Banner */}
        <div className="card-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-black text-[#FFE600] font-tech text-[10px] font-bold uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  {'HUB PROTOCOL // ACTIVE'}
                </span>
                <span className="bg-[#00E599] text-black font-tech text-[10px] font-bold uppercase px-2 py-0.5 border border-black">
                  VERIFIED HYPERLOCAL
                </span>
                {store.isActive && (
                  <span className="bg-[#FFE600] text-black font-tech text-[10px] font-bold uppercase px-2 py-0.5 border border-black">
                    OPEN NOW
                  </span>
                )}
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
                {store.name}
              </h1>

              <p className="font-sans text-sm text-neutral-600 font-medium max-w-2xl">
                {store.description ||
                  'Dedicated neighborhood fulfillment node with real-time temperature tracking and instant dispatch verification.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-tech font-bold text-neutral-700 pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-black" />
                  <span>{store.address || 'Central District, Zone 4'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF4800]" />
                  <span>{'15'} Min Average Doorstep Drop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
                  <span>
                    {store.rating ? Number(store.rating).toFixed(1) : '4.9'} ({reviews.length}{' '}
                    Verified Reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Store Telemetry Box */}
            <div className="w-full lg:w-72 bg-[#FAFAF8] border-2 border-black p-4 space-y-3 font-tech text-xs shadow-[3px_3px_0px_#000]">
              <div className="border-b-2 border-black pb-2 font-bold uppercase text-neutral-500 text-[10px]">
                TELEMETRY & DISPATCH SLA
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">DELIVERY RADIUS:</span>
                <span className="font-bold text-neutral-900">{store.radiusKm || 5} KM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">PACKAGING TIME:</span>
                <span className="font-bold text-[#059669]">2.4 MINS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">SHELF INTEGRITY:</span>
                <span className="font-bold text-neutral-900">100% RFID SYNC</span>
              </div>
              <div className="pt-2 border-t-2 border-black flex items-center justify-between">
                <span className="text-neutral-600">SHELF ITEMS:</span>
                <span className="font-black text-sm text-neutral-900">{inventory.length} SKUS</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-t-2 border-black pt-4 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              Shelved Catalog ({inventory.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 border-2 border-black font-tech text-xs uppercase font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Reviews ({reviews.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1.5 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                    !selectedCategory
                      ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-neutral-800 hover:bg-[#FAFAF8]'
                  }`}
                >
                  All Aisle SKUs
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                    className={`px-3 py-1.5 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                        : 'bg-white text-neutral-800 hover:bg-[#FAFAF8]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter store items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-brutal !h-9 text-xs pr-8"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Inventory Grid */}
            {filteredItems.length === 0 ? (
              <div className="card-brutal p-12 text-center bg-white border-2 border-black">
                <Package className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-neutral-900">
                  No Items Match Filter
                </h3>
                <p className="font-sans text-xs text-neutral-600 mt-1">
                  Try clearing the category filter or searching for another keyword.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                  className="btn-brutal-yellow !h-9 !px-4 text-xs font-bold uppercase mt-3"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => {
                  const prod = item.product;
                  const price = item.priceOverride ?? prod?.sellingPrice ?? 0;
                  const mrp = prod?.mrp || price * 1.15;
                  const image =
                    prod?.images?.[0] ||
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80';
                  const prodId = item.productId || prod?.id;
                  const isAdding = addingId === prodId;

                  return (
                    <div
                      key={item.id || prod?.id}
                      className="card-brutal bg-white p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Unit & Shelf Badge */}
                        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2.5 font-tech text-[10px] font-bold">
                          <span className="bg-[#FFE600] px-1.5 py-0.5 border border-black uppercase text-black">
                            {prod?.category?.name || 'FRESH'}
                          </span>
                          <span className="text-[#059669] uppercase">
                            STOCK: {item.stock ?? 25} UNITS
                          </span>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/3] w-full border-2 border-black overflow-hidden mb-3 bg-neutral-100">
                          <img
                            src={image}
                            alt={prod?.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black text-white font-tech text-[9px] px-1.5 py-0.5 uppercase font-bold">
                            SHELF VERIFIED
                          </div>
                        </div>

                        <h3 className="font-display font-black text-base uppercase text-neutral-900 leading-snug line-clamp-2">
                          {prod?.name}
                        </h3>
                        <p className="font-sans text-xs text-neutral-600 font-medium line-clamp-2 mt-1">
                          {prod?.description ||
                            'Dual-scan verified grocery item direct from micro-hub shelves.'}
                        </p>
                      </div>

                      {/* Price & Add to Tote */}
                      <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2">
                        <div>
                          <div className="font-tech font-black text-xl text-neutral-900 tracking-tight leading-none">
                            ₹{Number(price).toFixed(2)}
                          </div>
                          {mrp > price && (
                            <span className="font-tech text-[10px] text-neutral-400 line-through">
                              ₹{Number(mrp).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={isAdding}
                          className="btn-brutal-yellow !h-9 !py-0 !px-3 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                        >
                          {isAdding ? (
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
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="border-b-2 border-black pb-3">
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                Verified Customer Feedback
              </h2>
              <p className="font-sans text-xs text-neutral-600">
                Direct debrief ratings recorded upon doorstep fulfillment.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="card-brutal p-8 text-center bg-white border-2 border-black">
                <Star className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <h4 className="font-display font-black text-base uppercase text-neutral-900">
                  No Reviews Recorded Yet
                </h4>
                <p className="font-sans text-xs text-neutral-600 mt-1">
                  Be the first to rate items and delivery speed from this micro-hub!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev, idx: number) => (
                  <div
                    key={rev.id || idx}
                    className="card-brutal bg-white p-4 border-2 border-black space-y-2"
                  >
                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (rev.storeRating || 5)
                                ? 'text-[#FFE600] fill-[#FFE600]'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                        <span className="font-tech font-bold text-xs ml-1">
                          {rev.storeRating || 5}.0/5.0
                        </span>
                      </div>
                      <span className="font-tech text-[10px] text-neutral-500 uppercase">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString()
                          : 'VERIFIED DROP'}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-neutral-800 font-medium">
                      &quot;
                      {rev.comment ||
                        'Order was packed flawlessly and delivered ahead of schedule.'}
                      &quot;
                    </p>
                    <div className="font-tech text-[10px] font-bold text-neutral-500 uppercase">
                      OPERATOR: {rev.user?.fullName || 'Verified Customer'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
