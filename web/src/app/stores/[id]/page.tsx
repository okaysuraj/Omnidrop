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
      <div className="min-h-dvh bg-canvas flex flex-col">
        <BrutalNav />
        <div className="site-container py-24 text-center font-sans text-xs font-bold flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ink" />
          <span className=" tracking-normal">Syncing micro-hub inventory telemetry...</span>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-dvh bg-canvas flex flex-col">
        <BrutalNav />
        <div className="site-container py-20 text-center space-y-4 max-w-md mx-auto">
          <Store className="w-12 h-12 text-secondary mx-auto" />
          <h2 className="font-display font-bold text-2xl  tracking-tight">
            Micro-Hub Node Not Found
          </h2>
          <p className="font-sans text-xs text-secondary">
            The requested store identifier does not exist or has been relocated in the network mesh.
          </p>
          <Link
            href="/stores"
            className="button-primary inline-flex !h-10 !px-5 text-xs font-bold "
          >
            Browse All Stores
          </Link>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      {/* Floating success toast */}
      {successToast && (
        <div className="fixed top-20 right-5 z-50 ">
          <div className="bg-brand-soft text-ink border rounded-xl border-line p-3 font-sans text-xs font-bold  flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/stores"
            className="inline-flex items-center gap-1 font-sans text-xs font-bold  underline hover:bg-brand-soft px-1.5 py-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to All Micro-Hubs</span>
          </Link>
        </div>

        {/* Store Profile Hero Banner */}
        <div className="surface-card bg-surface p-6 border rounded-xl border-line  space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-muted text-brand font-sans text-xs font-bold  px-2 py-0.5 border border-line ">
                  {'Local store'}
                </span>
                <span className="bg-brand-soft text-ink font-sans text-xs font-bold  px-2 py-0.5 border border-line">
                  Verified hyperlocal
                </span>
                {store.isActive && (
                  <span className="bg-brand-soft text-ink font-sans text-xs font-bold  px-2 py-0.5 border border-line">
                    Open now
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
                {store.name}
              </h1>

              <p className="font-sans text-sm text-secondary font-medium max-w-2xl">
                {store.description ||
                  'Dedicated neighborhood fulfillment node with real-time temperature tracking and instant dispatch verification.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-sans font-bold text-secondary pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ink" />
                  <span>{store.address || 'Central District, Zone 4'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-danger" />
                  <span>{'15'} Min Average Doorstep Drop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-brand fill-brand" />
                  <span>
                    {store.rating ? Number(store.rating).toFixed(1) : '4.9'} ({reviews.length}{' '}
                    Verified Reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Store Telemetry Box */}
            <div className="w-full lg:w-72 bg-canvas border rounded-xl border-line p-4 space-y-3 font-sans text-xs ">
              <div className="border-b border-line pb-2 font-bold  text-secondary text-xs">
                Telemetry & dispatch sla
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Delivery radius:</span>
                <span className="font-bold text-ink">{store.radiusKm || 5} KM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Packaging time:</span>
                <span className="font-bold text-brand">2.4 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shelf integrity:</span>
                <span className="font-bold text-ink">100% rfid sync</span>
              </div>
              <div className="pt-2 border-t border-line flex items-center justify-between">
                <span className="text-secondary">Shelf items:</span>
                <span className="font-bold text-sm text-ink">{inventory.length} Skus</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-t border-line pt-4 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 border rounded-xl border-line font-sans text-xs  font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-brand-soft text-ink '
                  : 'bg-surface hover:bg-muted text-ink'
              }`}
            >
              Shelved Catalog ({inventory.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 border rounded-xl border-line font-sans text-xs  font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-brand-soft text-ink '
                  : 'bg-surface hover:bg-muted text-ink'
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
                  className={`px-3 py-1.5 border rounded-xl border-line font-sans text-xs  font-bold transition-all ${
                    !selectedCategory
                      ? 'bg-brand-soft text-ink '
                      : 'bg-surface text-ink hover:bg-canvas'
                  }`}
                >
                  All Aisle SKUs
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                    className={`px-3 py-1.5 border rounded-xl border-line font-sans text-xs  font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-brand-soft text-ink '
                        : 'bg-surface text-ink hover:bg-canvas'
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
                  className="field-input !h-9 text-xs pr-8"
                />
                <Search className="w-3.5 h-3.5 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Inventory Grid */}
            {filteredItems.length === 0 ? (
              <div className="surface-card p-12 text-center bg-surface border rounded-xl border-line">
                <Package className="w-10 h-10 text-secondary mx-auto mb-2" />
                <h3 className="font-display font-bold text-lg  tracking-tight text-ink">
                  No Items Match Filter
                </h3>
                <p className="font-sans text-xs text-secondary mt-1">
                  Try clearing the category filter or searching for another keyword.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                  className="button-primary !h-9 !px-4 text-xs font-bold  mt-3"
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
                      className="surface-card bg-surface p-4 flex flex-col space-y-3"
                    >
                      <div>
                        {/* Unit & Shelf Badge */}
                        <div className="flex items-center justify-between border-b border-line pb-2 mb-2.5 font-sans text-xs font-bold">
                          <span className="bg-brand-soft px-1.5 py-0.5 border border-line  text-ink">
                            {prod?.category?.name || 'FRESH'}
                          </span>
                          <span className="text-brand ">Stock: {item.stock ?? 25} Units</span>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/3] w-full border rounded-xl border-line overflow-hidden mb-3 bg-muted">
                          <img
                            src={image}
                            alt={prod?.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-muted text-ink font-sans text-xs px-1.5 py-0.5  font-bold">
                            Shelf verified
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-base  text-ink leading-snug line-clamp-2">
                          {prod?.name}
                        </h3>
                        <p className="font-sans text-xs text-secondary font-medium line-clamp-2 mt-1">
                          {prod?.description ||
                            'Dual-scan verified grocery item direct from micro-hub shelves.'}
                        </p>
                      </div>

                      {/* Price & Add to Tote */}
                      <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                        <div>
                          <div className="font-sans font-bold text-xl text-ink tracking-tight leading-none">
                            ₹{Number(price).toFixed(2)}
                          </div>
                          {mrp > price && (
                            <span className="font-sans text-xs text-secondary line-through">
                              ₹{Number(mrp).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={isAdding}
                          className="button-primary !h-9 !py-0 !px-3 font-bold text-xs  tracking-normal flex items-center gap-1.5"
                        >
                          {isAdding ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Adding…</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to cart</span>
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
            <div className="border-b border-line pb-3">
              <h2 className="font-display font-bold text-2xl  tracking-tight text-ink">
                Verified Customer Feedback
              </h2>
              <p className="font-sans text-xs text-secondary">
                Direct debrief ratings recorded upon doorstep fulfillment.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="surface-card p-8 text-center bg-surface border rounded-xl border-line">
                <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h4 className="font-display font-bold text-base  text-ink">
                  No Reviews Recorded Yet
                </h4>
                <p className="font-sans text-xs text-secondary mt-1">
                  Be the first to rate items and delivery speed from this micro-hub!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev, idx: number) => (
                  <div
                    key={rev.id || idx}
                    className="surface-card bg-surface p-4 border rounded-xl border-line space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (rev.storeRating || 5)
                                ? 'text-brand fill-brand'
                                : 'text-secondary'
                            }`}
                          />
                        ))}
                        <span className="font-sans font-bold text-xs ml-1">
                          {rev.storeRating || 5}.0/5.0
                        </span>
                      </div>
                      <span className="font-sans text-xs text-secondary ">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString()
                          : 'VERIFIED DROP'}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-ink font-medium">
                      &quot;
                      {rev.comment ||
                        'Order was packed flawlessly and delivered ahead of schedule.'}
                      &quot;
                    </p>
                    <div className="font-sans text-xs font-bold text-secondary ">
                      Operator: {rev.user?.fullName || 'Verified Customer'}
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
