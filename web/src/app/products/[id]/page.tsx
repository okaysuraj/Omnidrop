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
      <div className="min-h-dvh bg-canvas text-ink font-sans flex flex-col">
        <BrutalNav />
        <main id="main-content" tabIndex={-1} className="flex-1 site-container py-24 text-center">
          <div className="inline-block p-6 bg-surface border rounded-xl border-line  font-sans text-xs font-bold  tracking-normal ">
            {'Querying sku telemetry database...'}
          </div>
        </main>
        <BrutalFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-dvh bg-canvas text-ink font-sans flex flex-col">
        <BrutalNav />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 site-container py-20 text-center space-y-6"
        >
          <div className="max-w-md mx-auto p-8 bg-surface border rounded-xl border-line  space-y-4">
            <AlertTriangle className="w-12 h-12 text-danger mx-auto" />
            <h1 className="font-display font-bold text-2xl ">Product unavailable</h1>
            <p className="font-sans text-xs text-secondary">
              The requested catalog item does not exist or has been retired from regional inventory.
            </p>
            <Link
              href="/explore"
              className="button-primary inline-flex !h-10 !px-6 text-xs font-bold "
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
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-10"
      >
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 font-sans text-xs  font-bold text-secondary">
          <Link href="/explore" className="hover:text-ink flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Radar Catalog</span>
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-ink">
            Products
          </Link>
          <span>/</span>
          <span className="text-ink bg-brand-soft px-1.5 py-0.5 border border-line ">
            {product.category?.name || 'Groceries'}
          </span>
          <span>/</span>
          <span className="text-ink truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Bento Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Visual Specimen */}
          <div className="lg:col-span-6 space-y-4">
            <div className="surface-card p-6 bg-surface border rounded-xl border-line  relative overflow-hidden group">
              <div className="relative w-full aspect-square bg-muted border rounded-xl border-line overflow-hidden flex items-center justify-center">
                {product.images?.[0] ? (
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-secondary p-8 text-center">
                    <Tag className="w-16 h-16 stroke-[1.5] mb-2 text-secondary" />
                    <span className="font-sans text-xs  font-bold text-secondary">
                      Standardized SKU Packaging
                    </span>
                  </div>
                )}

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-soft text-ink border rounded-xl border-line font-sans text-xs font-bold  ">
                    <Zap className="w-3 h-3 fill-black" />
                    12-min dispatch
                  </span>
                  {discountPercent > 0 && (
                    <span className="inline-flex px-2 py-0.5 bg-brand-soft text-ink border rounded-xl border-line font-sans text-xs font-bold  ">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span
                    className={`inline-flex px-2.5 py-1 border rounded-xl border-line font-sans text-xs font-bold   ${
                      stock > 5 ? 'bg-surface text-ink' : 'bg-danger-soft text-ink'
                    }`}
                  >
                    {stock > 5 ? `${stock} IN STOCK` : `ONLY ${stock} LEFT`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-2 gap-3 font-sans text-xs">
              <div className="p-3 bg-surface border rounded-xl border-line  flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand flex-shrink-0" />
                <div>
                  <div className="font-bold  text-ink">Cold-Chain Insulated</div>
                  <div className="text-xs text-secondary font-medium">Maintained at &lt; 4°C</div>
                </div>
              </div>

              <div className="p-3 bg-surface border rounded-xl border-line  flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-ink flex-shrink-0" />
                <div>
                  <div className="font-bold  text-ink">Same-Day Harvest</div>
                  <div className="text-xs text-secondary font-medium">Under 6h from supplier</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Spec Sheet & Order summary */}
          <div className="lg:col-span-6 space-y-6">
            <div className="surface-card p-6 sm:p-8 bg-surface border rounded-xl border-line  space-y-6">
              {/* Category & Brand Header */}
              <div className="border-b border-line pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs  font-bold text-secondary tracking-normal">
                    Sku #{product.id.slice(0, 8).toUpperCase()} {''}
                    {'OMNIDROP VERIFIED'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-ink font-sans text-xs  font-bold">
                    Batch certified
                  </span>
                </div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink leading-tight">
                  {product.name}
                </h1>
                <div className="font-sans text-xs text-secondary font-bold mt-1 ">
                  Net Weight: {product.unit || 'Standard Unit'} · Shelf-Life: Guaranteed Fresh
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 py-2">
                <div className="font-display font-bold text-4xl text-ink">
                  ₹{sellingPrice.toFixed(2)}
                </div>
                {mrp > sellingPrice && (
                  <div className="font-sans text-lg text-secondary line-through font-bold">
                    ₹{mrp.toFixed(2)}
                  </div>
                )}
                <div className="font-sans text-xs  text-brand font-bold">Taxes Included</div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t border-line pt-4">
                <h3 className="font-sans text-xs font-bold  tracking-normal text-ink">
                  Product Overview & Provenance
                </h3>
                <p className="font-sans text-sm text-secondary leading-relaxed font-normal">
                  {product.description ||
                    'Premium quality item sourced directly from certified organic partners and stored under temperature-controlled conditions in regional micro-fulfillment dark stores.'}
                </p>
              </div>

              {/* Error / Success Feedback */}
              {errorMessage && (
                <div className="p-3 bg-danger-soft border rounded-xl border-danger text-danger font-sans text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {addSuccess && (
                <div className="p-3 bg-brand-soft border rounded-xl border-line text-brand font-sans text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Added {quantity} unit(s) to your active tote!</span>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-xl border-line  bg-surface">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted active:bg-muted border-r border-line font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-display font-bold text-base">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={quantity >= stock}
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted active:bg-muted border-l border-line font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || stock <= 0}
                    className="flex-1 button-primary !h-11 font-bold text-xs  tracking-normal flex items-center justify-center gap-2 "
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

                <div className="flex items-center justify-between font-sans text-xs text-secondary font-bold  tracking-wide border-t border-line pt-3">
                  <span>Dispatch: sub-15 min from local hub</span>
                  <Link href="/cart" className="text-ink underline hover:text-secondary">
                    View Manifest Tote →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related SKUs Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 border-t border-line pt-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-sans text-xs  font-bold text-secondary">
                  {'Related catalog nodes'}
                </span>
                <h2 className="font-display font-bold text-2xl  tracking-tight text-ink">
                  Recommended Additions
                </h2>
              </div>
              <Link href="/products" className="button-secondary !h-8 !px-3 text-xs font-bold ">
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
                    className="surface-card p-3 bg-surface border rounded-xl border-line   transition-all flex flex-col"
                  >
                    <div className="w-full aspect-square bg-muted border border-line mb-2 flex items-center justify-center overflow-hidden">
                      {rel.images?.[0] ? (
                        <img
                          src={rel.images?.[0]}
                          alt={rel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Tag className="w-8 h-8 text-secondary" />
                      )}
                    </div>
                    <div>
                      <div className="font-sans text-xs  font-bold text-secondary">
                        {rel.category?.name || 'General'}
                      </div>
                      <h4 className="font-display font-bold text-xs  line-clamp-1 text-ink mt-0.5">
                        {rel.name}
                      </h4>
                      <div className="font-display font-bold text-sm text-ink mt-1">
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
