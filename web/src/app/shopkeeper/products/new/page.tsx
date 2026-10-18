'use client';

import { Zap as UiZap } from 'lucide-react';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Eye,
  Image as ImageIcon,
  Rocket,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PRESET_IMAGES = [
  {
    name: 'Fresh Fruits',
    url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Dairy & Milk',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Artisan Bakery',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Snacks & Chips',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Cold Beverages',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Farm Veggies',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
  },
];

export default function ProductManagementScreen() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productMrp, setProductMrp] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [unit, setUnit] = useState('pack');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [store, setStore] = useState<Models.Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [cats, myStores] = await Promise.all([
          api.products.categories().catch(() => []),
          api.stores.myStores().catch(() => []),
        ]);
        setCategories(cats || []);
        if (cats && cats.length > 0) setSelectedCategory(cats[0].id);
        if (myStores && myStores.length > 0) setStore(myStores[0]);
      } catch (err) {
        console.error('Failed to load categories or store', err);
      }
    };
    init();
  }, []);

  const numPrice = parseFloat(productPrice) || 0;
  const numMrp = parseFloat(productMrp) || (numPrice ? Math.round(numPrice * 1.2) : 0);
  const takeRate = numPrice * 0.06;
  const merchantNet = numPrice - takeRate;
  const discountPercent = numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;

  const handlePriceChange = (val: string) => {
    setProductPrice(val);
    if (!productMrp) {
      const p = parseFloat(val);
      if (p) setProductMrp(String(Math.round(p * 1.2)));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!productName.trim() || !productPrice) {
      setErrorMsg('Please specify both product title and selling price.');
      return;
    }
    if (!store) {
      setErrorMsg('No merchant store hub registered. Please configure store profile first.');
      return;
    }

    setLoading(true);
    try {
      const createdProduct = await api.products.create({
        name: productName.trim(),
        sellingPrice: numPrice,
        mrp: numMrp,
        description: productDescription.trim() || undefined,
        categoryId: selectedCategory || categories[0]?.id,
        images: [imageUrl.trim() || PRESET_IMAGES[0].url],
        unit: unit || 'pack',
      });

      await api.inventory.upsert(store.id, {
        productId: createdProduct.id,
        stock: parseInt(stockQuantity, 10) || 50,
        priceOverride: numPrice,
        isVisible: true,
      });

      router.push('/shopkeeper/dashboard');
    } catch (err) {
      setErrorMsg(getErrorMessage(err) || 'Failed to publish product SKU');
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryName = categories.find((c) => c.id === selectedCategory)?.name || 'General';

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <Link
              href="/shopkeeper/dashboard"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-secondary hover:text-ink mb-2 "
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Merchant Console
            </Link>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   ml-3 mb-2">
              {'Hub:'}
              {store?.name || 'MICRO-HUB'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Add a product
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Add catalog inventory directly to local store shelf. Instant propagation to nearby
              customer apps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs bg-brand-soft text-ink font-bold  px-3 py-1.5 border rounded-xl border-line ">
              Take-Rate: Fixed 6.0%
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-danger-soft border rounded-xl border-danger text-ink font-sans text-xs font-bold  flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Identification Box */}
            <div className="surface-card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg  text-ink flex items-center gap-2 pb-2 border-b border-line">
                <Tag className="w-5 h-5 text-ink" />
                1. Product Identification
              </h2>

              <div>
                <label
                  htmlFor="field-shopkeeper-products-new-page-1"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Product Title / Commercial Name *
                </label>
                <input
                  id="field-shopkeeper-products-new-page-1"
                  type="text"
                  required
                  placeholder="e.g. Organic Hass Avocados (2 Pack)"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="field-input text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-shopkeeper-products-new-page-2"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Category Taxonomy *
                  </label>
                  <select
                    id="field-shopkeeper-products-new-page-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="field-input text-sm bg-surface cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="field-shopkeeper-products-new-page-3"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Pack / Measurement Unit
                  </label>
                  <select
                    id="field-shopkeeper-products-new-page-3"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="field-input text-sm bg-surface cursor-pointer"
                  >
                    <option value="pack">Pack / Box</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="500g">500 grams</option>
                    <option value="piece">Single Piece</option>
                    <option value="litre">1 Litre</option>
                    <option value="bottle">Bottle</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="field-shopkeeper-products-new-page-4"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Consumer Description & Origin Notes
                </label>
                <textarea
                  id="field-shopkeeper-products-new-page-4"
                  rows={3}
                  placeholder="Freshly sourced quality grade, locally packaged with 100% biodegradable seal..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="field-input text-sm resize-none"
                />
              </div>
            </div>

            {/* 2. Pricing & Financial Ledger */}
            <div className="surface-card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg  text-ink flex items-center gap-2 pb-2 border-b border-line">
                <DollarSign className="w-5 h-5 text-ink" />
                2. Pricing & Shelf Stock
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="field-shopkeeper-products-new-page-5"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Selling Price (₹) *
                  </label>
                  <input
                    id="field-shopkeeper-products-new-page-5"
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="120"
                    value={productPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="field-input text-sm font-sans font-bold"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-shopkeeper-products-new-page-6"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    MRP / List Price (₹)
                  </label>
                  <input
                    id="field-shopkeeper-products-new-page-6"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="150"
                    value={productMrp}
                    onChange={(e) => setProductMrp(e.target.value)}
                    className="field-input text-sm font-sans text-secondary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-shopkeeper-products-new-page-7"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Shelf Stock (Units) *
                  </label>
                  <input
                    id="field-shopkeeper-products-new-page-7"
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="field-input text-sm font-sans font-bold"
                  />
                </div>
              </div>

              {/* Real-time Economic Calculator */}
              <div className="p-4 bg-muted border rounded-xl border-line space-y-2">
                <p className="font-sans text-xs  font-bold text-ink flex items-center justify-between">
                  <span>Omnidrop Merchant Settlement Breakdown</span>
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 bg-danger-soft text-ink text-xs">
                      {discountPercent}% off mrp
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-3 gap-2 font-sans text-xs text-secondary pt-2 border-t border-line">
                  <div>
                    <span className="text-xs text-secondary  block">Customer Pays</span>
                    <strong className="text-ink text-sm">₹{numPrice.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-secondary  block">Omnidrop Fee (6%)</span>
                    <strong className="text-danger text-sm">-₹{takeRate.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-secondary  block">Your Bank Payout</span>
                    <strong className="text-brand bg-muted px-1.5 py-0.5 text-sm inline-block">
                      ₹{merchantNet.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Media Assets */}
            <div className="surface-card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg  text-ink flex items-center gap-2 pb-2 border-b border-line">
                <ImageIcon className="w-5 h-5 text-ink" />
                3. Imagery & Catalog Asset
              </h2>

              <div>
                <label
                  htmlFor="field-shopkeeper-products-new-page-8"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Image CDN / Web Link
                </label>
                <input
                  id="field-shopkeeper-products-new-page-8"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="field-input text-sm font-sans text-xs"
                />
              </div>

              <div>
                <p className="font-sans text-xs  font-bold text-secondary mb-2">
                  Or Pick a High-Resolution Preset:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`p-2 border rounded-xl border-line text-left flex items-center gap-2 transition-all ${
                        imageUrl === preset.url
                          ? 'bg-brand-soft font-bold '
                          : 'bg-surface hover:bg-muted '
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-8 h-8 object-cover border border-line"
                      />
                      <span className="font-sans text-xs truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Card Preview & Submit */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="surface-card p-6 bg-surface space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-display font-bold text-base  text-ink flex items-center gap-2">
                  <Eye className="w-4 h-4 text-ink" />
                  Live Shelf Preview
                </h3>
                <span className="font-sans text-xs bg-muted text-brand px-2 py-0.5  font-bold">
                  Customer App View
                </span>
              </div>

              <p className="font-sans text-xs text-secondary">
                This is exactly how this item will be presented to shoppers within your delivery
                radius:
              </p>

              {/* Neo-Brutalist Customer Card */}
              <div className="border rounded-xl border-line bg-surface  overflow-hidden">
                <div className="h-44 bg-muted relative border-b border-line overflow-hidden">
                  <img
                    src={imageUrl || PRESET_IMAGES[0].url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-muted text-ink font-sans text-xs font-bold  border border-line">
                      {currentCategoryName}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 bg-brand-soft text-ink font-sans text-xs font-bold  border border-line">
                      <UiZap
                        className="inline-block size-4 align-text-bottom mr-1.5"
                        aria-hidden="true"
                      />{' '}
                      12-MIN DISPATCH
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-sans font-bold text-base text-ink leading-tight">
                      {productName || 'Product Title Goes Here'}
                    </h4>
                    <p className="font-sans text-xs text-secondary mt-0.5">
                      Per {unit} · In Stock ({stockQuantity || 0})
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-display font-bold text-2xl text-ink">
                      ₹{numPrice ? numPrice.toFixed(2) : '0.00'}
                    </span>
                    {numMrp > numPrice && (
                      <span className="font-sans text-xs text-secondary line-through">
                        ₹{numMrp.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 bg-muted text-ink font-sans text-xs font-bold  border rounded-xl border-line cursor-not-allowed opacity-80"
                  >
                    + add to tote (demo)
                  </button>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="space-y-1.5 pt-2 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${productName.trim() ? 'text-brand' : 'text-secondary'}`}
                  />
                  <span className={productName.trim() ? 'text-ink' : 'text-secondary'}>
                    Product Title Configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${numPrice > 0 ? 'text-brand' : 'text-secondary'}`}
                  />
                  <span className={numPrice > 0 ? 'text-ink' : 'text-secondary'}>
                    Price & Margins Calculated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${parseInt(stockQuantity, 10) > 0 ? 'text-brand' : 'text-secondary'}`}
                  />
                  <span className={parseInt(stockQuantity, 10) > 0 ? 'text-ink' : 'text-secondary'}>
                    Initial Shelf Stock Loaded
                  </span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-4 border-t border-line space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="button-primary w-full !h-12 text-sm font-bold  tracking-normal flex items-center justify-center gap-2 "
                >
                  <Rocket className="w-4 h-4" />
                  <span>{loading ? 'Publishing SKU...' : 'Publish to Active Shelf'}</span>
                </button>

                <Link
                  href="/shopkeeper/dashboard"
                  className="block text-center font-sans text-xs font-bold  text-secondary hover:text-ink py-1"
                >
                  Cancel and Return
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>

      <BrutalFooter />
    </div>
  );
}
