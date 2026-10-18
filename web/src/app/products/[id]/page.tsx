'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<Models.Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Models.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadProductData = async () => {
      try {
        setLoading(true);
        const [prodData, allProds] = await Promise.all([
          api.products.getById(id),
          api.products.list({ page: 1 }).catch(() => null),
        ]);
        setProduct(prodData);

        const list = allProds?.items || [];
        setRelatedProducts(list.filter((p) => p.id !== id).slice(0, 4));
      } catch (err) {
        setErrorMessage(getErrorMessage(err) || 'Product SKU could not be loaded');
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!product) return;

    setAdding(true);
    setErrorMessage(null);
    try {
      let targetStoreId = product?.inventory?.[0]?.storeId;
      if (!targetStoreId) {
        const nearby = await api.stores.nearby(28.6139, 77.209, 25).catch(() => []);
        targetStoreId = Array.isArray(nearby) && nearby.length > 0 ? nearby[0].id : undefined;
      }
      if (!targetStoreId) {
        throw new Error('No local micro-hub currently carries this SKU in your delivery zone.');
      }

      await api.cart.addItem(targetStoreId, product.id, quantity);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || 'Could not queue SKU in cart tote.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans flex flex-col justify-between">
        <BrutalNav />
        <main className="container-brutal py-24 text-center">
          <div className="inline-block p-6 bg-white border-2 border-black shadow-[4px_4px_0px_#000] font-tech text-xs font-bold uppercase tracking-wider animate-pulse">
            {'// QUERYING SKU TELEMETRY DATABASE...'}
          </div>
        </main>
        <BrutalFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans flex flex-col justify-between">
        <BrutalNav />
        <main className="container-brutal py-20 text-center space-y-6">
          <div className="max-w-md mx-auto p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000] space-y-4">
            <AlertTriangle className="w-12 h-12 text-[#FF6B00] mx-auto" />
            <h1 className="font-display font-black text-2xl uppercase">Product Not Located</h1>
            <p className="font-sans text-xs text-neutral-600">
              The requested catalog item does not exist or has been retired from regional inventory.
            </p>
            <Link
              href="/explore"
              className="btn-brutal-yellow inline-flex !h-10 !px-6 text-xs font-bold uppercase"
            >
              Explore Available SKUs
            </Link>
          </div>
        </main>
        <BrutalFooter />
      </div>
    );
  }

  const sellingPrice = Number(product.sellingPrice || 0);
  const mrp = Number(product.mrp || sellingPrice);
  const discountPercent = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const stock = product.inventory?.[0]?.stock ?? 0;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-10">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 font-tech text-xs uppercase font-bold text-neutral-600">
          <Link href="/explore" className="hover:text-black flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Radar Catalog</span>
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">
            Products
          </Link>
          <span>/</span>
          <span className="text-black bg-[#FFE600] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            {product.category?.name || 'Groceries'}
          </span>
          <span>/</span>
          <span className="text-neutral-900 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Bento Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Visual Specimen */}
          <div className="lg:col-span-6 space-y-4">
            <div className="card-brutal p-6 bg-white border-2 border-black shadow-[6px_6px_0px_#000] relative overflow-hidden group">
              <div className="relative w-full aspect-square bg-[#F4F4F0] border-2 border-black overflow-hidden flex items-center justify-center">
                {product.images?.[0] ? (
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400 p-8 text-center">
                    <Tag className="w-16 h-16 stroke-[1.5] mb-2 text-neutral-700" />
                    <span className="font-tech text-xs uppercase font-bold text-neutral-600">
                      Standardized SKU Packaging
                    </span>
                  </div>
                )}

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFE600] text-black border-2 border-black font-tech text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                    <Zap className="w-3 h-3 fill-black" />
                    12-MIN DISPATCH
                  </span>
                  {discountPercent > 0 && (
                    <span className="inline-flex px-2 py-0.5 bg-[#00F59B] text-black border-2 border-black font-tech text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span
                    className={`inline-flex px-2.5 py-1 border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] ${
                      stock > 5 ? 'bg-white text-black' : 'bg-[#FF4800] text-white'
                    }`}
                  >
                    {stock > 5 ? `${stock} IN STOCK` : `ONLY ${stock} LEFT`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-2 gap-3 font-tech text-xs">
              <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#059669] flex-shrink-0" />
                <div>
                  <div className="font-bold uppercase text-neutral-900">Cold-Chain Insulated</div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    Maintained at &lt; 4°C
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#0A0A0A] flex-shrink-0" />
                <div>
                  <div className="font-bold uppercase text-neutral-900">Same-Day Harvest</div>
                  <div className="text-[10px] text-neutral-500 font-medium">
                    Under 6h from supplier
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Spec Sheet & Checkout Terminal */}
          <div className="lg:col-span-6 space-y-6">
            <div className="card-brutal p-6 sm:p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000] space-y-6">
              {/* Category & Brand Header */}
              <div className="border-b-2 border-black pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-tech text-xs uppercase font-bold text-neutral-500 tracking-wider">
                    SKU #{product.id.slice(0, 8).toUpperCase()} {'//'}
                    {'OMNIDROP VERIFIED'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white font-tech text-[10px] uppercase font-bold">
                    BATCH CERTIFIED
                  </span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900 leading-tight">
                  {product.name}
                </h1>
                <div className="font-tech text-xs text-neutral-600 font-bold mt-1 uppercase">
                  Net Weight: {product.unit || 'Standard Unit'} · Shelf-Life: Guaranteed Fresh
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 py-2">
                <div className="font-display font-black text-4xl text-neutral-900">
                  ₹{sellingPrice.toFixed(2)}
                </div>
                {mrp > sellingPrice && (
                  <div className="font-tech text-lg text-neutral-400 line-through font-bold">
                    ₹{mrp.toFixed(2)}
                  </div>
                )}
                <div className="font-tech text-xs uppercase text-[#059669] font-bold">
                  Taxes Included
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t-2 border-black/10 pt-4">
                <h3 className="font-tech text-xs font-black uppercase tracking-wider text-neutral-900">
                  Product Overview & Provenance
                </h3>
                <p className="font-sans text-sm text-neutral-700 leading-relaxed font-normal">
                  {product.description ||
                    'Premium quality item sourced directly from certified organic partners and stored under temperature-controlled conditions in regional micro-fulfillment dark stores.'}
                </p>
              </div>

              {/* Error / Success Feedback */}
              {errorMessage && (
                <div className="p-3 bg-[#FFF0EE] border-2 border-[#FF4800] text-[#FF4800] font-tech text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {addSuccess && (
                <div className="p-3 bg-[#E8FBF4] border-2 border-[#059669] text-[#059669] font-tech text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Added {quantity} unit(s) to your active tote!</span>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-black shadow-[3px_3px_0px_#000] bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 border-r-2 border-black font-black"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-display font-black text-base">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 border-l-2 border-black font-black"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || stock <= 0}
                    className="flex-1 btn-brutal-yellow !h-11 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {adding
                        ? 'Securing Item...'
                        : stock <= 0
                          ? 'Out of Stock'
                          : `Add to Tote · ₹${(sellingPrice * quantity).toFixed(2)}`}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between font-tech text-[11px] text-neutral-500 font-bold uppercase tracking-wide border-t-2 border-black/10 pt-3">
                  <span>DISPATCH: SUB-15 MIN FROM LOCAL HUB</span>
                  <Link href="/cart" className="text-black underline hover:text-neutral-700">
                    View Manifest Tote →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related SKUs Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 border-t-2 border-black pt-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-tech text-xs uppercase font-bold text-neutral-500">
                  {'// RELATED CATALOG NODES'}
                </span>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
                  Recommended Additions
                </h2>
              </div>
              <Link
                href="/products"
                className="btn-brutal-white !h-8 !px-3 text-xs font-bold uppercase"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => {
                const rPrice = Number(rel.sellingPrice || 0);
                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.id}`}
                    className="card-brutal p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square bg-[#F4F4F0] border border-black mb-2 flex items-center justify-center overflow-hidden">
                      {rel.images?.[0] ? (
                        <img
                          src={rel.images?.[0]}
                          alt={rel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Tag className="w-8 h-8 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-tech text-[10px] uppercase font-bold text-neutral-500">
                        {rel.category?.name || 'General'}
                      </div>
                      <h4 className="font-display font-bold text-xs uppercase line-clamp-1 text-neutral-900 mt-0.5">
                        {rel.name}
                      </h4>
                      <div className="font-display font-black text-sm text-neutral-900 mt-1">
                        ₹{rPrice.toFixed(0)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
