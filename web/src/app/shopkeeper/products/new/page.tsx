'use client';

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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <Link
              href="/shopkeeper/dashboard"
              className="inline-flex items-center gap-1.5 font-tech text-xs font-bold text-neutral-600 hover:text-black mb-2 uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Merchant Console
            </Link>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] ml-3 mb-2">
              {'// HUB:'}
              {store?.name || 'MICRO-HUB'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Register New Shelf SKU
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Add catalog inventory directly to local store shelf. Instant propagation to nearby
              customer apps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-tech text-xs bg-[#00E599] text-black font-bold uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
              Take-Rate: Fixed 6.0%
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-[#FF4800]/15 border-2 border-[#FF4800] text-black font-tech text-xs font-bold shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF4800] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Identification Box */}
            <div className="card-brutal p-6 space-y-4">
              <h2 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2 pb-2 border-b-2 border-black">
                <Tag className="w-5 h-5 text-black" />
                1. Product Identification
              </h2>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Product Title / Commercial Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Hass Avocados (2 Pack)"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="input-brutal text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Category Taxonomy *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-brutal text-sm bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Pack / Measurement Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="input-brutal text-sm bg-white cursor-pointer"
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
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Consumer Description & Origin Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Freshly sourced quality grade, locally packaged with 100% biodegradable seal..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="input-brutal text-sm resize-none"
                />
              </div>
            </div>

            {/* 2. Pricing & Financial Ledger */}
            <div className="card-brutal p-6 space-y-4">
              <h2 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2 pb-2 border-b-2 border-black">
                <DollarSign className="w-5 h-5 text-black" />
                2. Pricing & Shelf Stock
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="120"
                    value={productPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="input-brutal text-sm font-tech font-bold"
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    MRP / List Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="150"
                    value={productMrp}
                    onChange={(e) => setProductMrp(e.target.value)}
                    className="input-brutal text-sm font-tech text-neutral-600"
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Shelf Stock (Units) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="input-brutal text-sm font-tech font-bold"
                  />
                </div>
              </div>

              {/* Real-time Economic Calculator */}
              <div className="p-4 bg-neutral-100 border-2 border-black space-y-2">
                <p className="font-tech text-xs uppercase font-bold text-neutral-800 flex items-center justify-between">
                  <span>Omnidrop Merchant Settlement Breakdown</span>
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 bg-[#FF4800] text-white text-[10px]">
                      {discountPercent}% OFF MRP
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-3 gap-2 font-tech text-xs text-neutral-600 pt-2 border-t border-neutral-300">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">
                      Customer Pays
                    </span>
                    <strong className="text-neutral-900 text-sm">₹{numPrice.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">
                      Omnidrop Fee (6%)
                    </span>
                    <strong className="text-[#FF4800] text-sm">-₹{takeRate.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">
                      Your Bank Payout
                    </span>
                    <strong className="text-[#00E599] bg-black px-1.5 py-0.5 text-sm inline-block">
                      ₹{merchantNet.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Media Assets */}
            <div className="card-brutal p-6 space-y-4">
              <h2 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2 pb-2 border-b-2 border-black">
                <ImageIcon className="w-5 h-5 text-black" />
                3. Imagery & Catalog Asset
              </h2>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Image CDN / Web Link
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input-brutal text-sm font-tech text-xs"
                />
              </div>

              <div>
                <p className="font-tech text-xs uppercase font-bold text-neutral-600 mb-2">
                  Or Pick a High-Resolution Preset:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`p-2 border-2 border-black text-left flex items-center gap-2 transition-all ${
                        imageUrl === preset.url
                          ? 'bg-[#FFE600] font-bold shadow-[2px_2px_0px_#000]'
                          : 'bg-white hover:bg-neutral-50 shadow-[1px_1px_0px_#000]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-8 h-8 object-cover border border-black"
                      />
                      <span className="font-tech text-[11px] truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Card Preview & Submit */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="card-brutal p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="font-display font-black text-base uppercase text-neutral-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-black" />
                  Live Shelf Preview
                </h3>
                <span className="font-tech text-[10px] bg-black text-[#FFE600] px-2 py-0.5 uppercase font-bold">
                  Customer App View
                </span>
              </div>

              <p className="font-sans text-xs text-neutral-600">
                This is exactly how this item will be presented to shoppers within your delivery
                radius:
              </p>

              {/* Neo-Brutalist Customer Card */}
              <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
                <div className="h-44 bg-neutral-100 relative border-b-2 border-black overflow-hidden">
                  <img
                    src={imageUrl || PRESET_IMAGES[0].url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-black text-white font-tech text-[10px] font-bold uppercase border border-white">
                      {currentCategoryName}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 bg-[#FFE600] text-black font-tech text-[10px] font-bold uppercase border border-black">
                      ⚡ 12-MIN DISPATCH
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-sans font-black text-base text-neutral-900 leading-tight">
                      {productName || 'Product Title Goes Here'}
                    </h4>
                    <p className="font-tech text-xs text-neutral-500 mt-0.5">
                      Per {unit} · In Stock ({stockQuantity || 0})
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-display font-black text-2xl text-neutral-900">
                      ₹{numPrice ? numPrice.toFixed(2) : '0.00'}
                    </span>
                    {numMrp > numPrice && (
                      <span className="font-tech text-xs text-neutral-500 line-through">
                        ₹{numMrp.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 bg-neutral-900 text-white font-tech text-xs font-bold uppercase border-2 border-black cursor-not-allowed opacity-80"
                  >
                    + ADD TO TOTE (DEMO)
                  </button>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="space-y-1.5 pt-2 font-tech text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${productName.trim() ? 'text-[#00E599]' : 'text-neutral-400'}`}
                  />
                  <span className={productName.trim() ? 'text-black' : 'text-neutral-500'}>
                    Product Title Configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${numPrice > 0 ? 'text-[#00E599]' : 'text-neutral-400'}`}
                  />
                  <span className={numPrice > 0 ? 'text-black' : 'text-neutral-500'}>
                    Price & Margins Calculated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${parseInt(stockQuantity, 10) > 0 ? 'text-[#00E599]' : 'text-neutral-400'}`}
                  />
                  <span
                    className={parseInt(stockQuantity, 10) > 0 ? 'text-black' : 'text-neutral-500'}
                  >
                    Initial Shelf Stock Loaded
                  </span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-4 border-t-2 border-black space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-brutal-yellow w-full !h-12 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{loading ? 'Publishing SKU...' : 'Publish to Active Shelf'}</span>
                </button>

                <Link
                  href="/shopkeeper/dashboard"
                  className="block text-center font-tech text-xs font-bold uppercase text-neutral-600 hover:text-black py-1"
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
