'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Models.Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    discount?: number;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    const loadCart = async () => {
      try {
        const data = await api.cart.get();
        setCart(data);
      } catch {
        /* ignore */
      }
      setLoading(false);
    };
    if (user) loadCart();
  }, [user, authLoading, router]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await api.cart.updateQuantity(itemId, quantity);
      setCart(updated);
    } catch {
      /* ignore */
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const updated = await api.cart.removeItem(itemId);
      setCart(updated);
    } catch {
      /* ignore */
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await api.promotions.validate(couponCode, cart?.subtotal || 0);
      setCouponResult(result);
    } catch (err) {
      setCouponResult({ valid: false, message: getErrorMessage(err) });
    }
  };

  const items = cart?.items || [];
  const discountAmount = couponResult?.valid ? Number(couponResult.discount || 0) : 0;
  const finalTotal = Math.max(0, (cart?.total || 0) - discountAmount);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// ACTIVE MANIFEST'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Your Delivery Tote
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Dual-scan verified grocery items scheduled for sub-20 minute dispatch.
            </p>
          </div>

          <Link
            href="/explore"
            className="btn-brutal-white !h-9 !py-0 !px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Add More Items</span>
            <Plus className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-tech text-xs font-bold uppercase">
            UPDATING TOTE SERIALIZATION...
          </div>
        ) : items.length === 0 ? (
          <div className="card-brutal p-12 text-center bg-white max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
              Your Tote Is Empty
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 mt-1 mb-6">
              Explore nearby micro-hubs, fresh bakeries, and organic grocers in your quadrant.
            </p>
            <Link
              href="/explore"
              className="btn-brutal-yellow inline-flex !h-11 !px-6 text-xs font-bold uppercase tracking-wider items-center gap-2"
            >
              <span>Discover Local Stores</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="card-brutal bg-white p-5 border-2 border-black shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4 font-tech text-xs font-bold">
                  <span className="uppercase text-neutral-800">
                    ITEMS SCHEDULED FOR DISPATCH ({items.length})
                  </span>
                  <span className="text-[#059669] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
                    SHELF SYNC OK
                  </span>
                </div>

                <div className="divide-y-2 border-black/10">
                  {items.map((item) => {
                    const product = item.product;
                    const image =
                      product?.images?.[0] ||
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                    return (
                      <div
                        key={item.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Item Details */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-16 h-16 border-2 border-black relative overflow-hidden bg-neutral-100 flex-shrink-0">
                            <img
                              src={image}
                              alt={product?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-tech text-[10px] uppercase font-bold text-neutral-500">
                              {product?.unit || 'FRESH SHELF'}
                            </span>
                            <h4 className="font-display font-black text-base uppercase text-neutral-900 leading-snug">
                              {product?.name || 'Omnidrop Item'}
                            </h4>
                            <div className="font-tech text-xs text-neutral-700 font-bold mt-0.5">
                              ₹
                              {Number(item.effectivePrice || product?.sellingPrice || 0).toFixed(2)}{' '}
                              each
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls & Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FFE600] font-bold border-r-2 border-black"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-9 text-center font-tech font-bold text-xs">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FFE600] font-bold border-l-2 border-black"
                              aria-label="Increase"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="font-tech font-black text-base text-neutral-900 min-w-[70px] text-right">
                            ₹
                            {(
                              Number(item.effectivePrice || product?.sellingPrice || 0) *
                              item.quantity
                            ).toFixed(2)}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-[#FF4800] hover:text-white border-2 border-transparent hover:border-black transition-colors"
                            title="Remove Item"
                          >
                            <Trash2 className="w-4 h-4 text-neutral-500 hover:text-white" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Guarantee Callout */}
              <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] font-tech text-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#059669] flex-shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 uppercase">
                    ZERO-CRUSH PACKING PROTOCOL:{' '}
                  </span>
                  <span className="text-neutral-600 font-medium">
                    Heavy goods separated from produce and breads. Insulated food-grade barrier
                    sealed.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Receipt Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="card-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-5 sticky top-24">
                <div className="border-b-2 border-black pb-3">
                  <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                    MANIFEST SUMMARY
                  </div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900 mt-1">
                    Checkout Terminal
                  </h3>
                </div>

                {/* Promo Coupon Box */}
                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900">
                    Promo / Protocol Voucher
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input-brutal uppercase font-tech text-xs"
                      placeholder="OMNIDROP10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="btn-brutal-white !h-auto !py-0 !px-4 text-xs font-bold uppercase"
                    >
                      Apply
                    </button>
                  </div>
                  {couponResult && (
                    <div
                      className={`mt-2 font-tech text-xs font-bold ${couponResult.valid ? 'text-[#059669]' : 'text-[#FF4800]'}`}
                    >
                      {couponResult.valid
                        ? `✓ APPLIED: -₹${Number(couponResult.discount).toFixed(2)}`
                        : `⚠ ${couponResult.message}`}
                    </div>
                  )}
                </div>

                {/* Receipt Line Items */}
                <div className="space-y-2.5 font-tech text-xs border-y-2 border-black py-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal ({items.length} items)</span>
                    <span className="font-bold text-neutral-900">
                      ₹{Number(cart?.subtotal || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Hyperlocal Delivery</span>
                    <span className="font-bold text-[#059669]">
                      {cart?.deliveryFee === 0 || Number(cart?.subtotal || 0) >= 500
                        ? 'FREE (₹0.00)'
                        : `₹${Number(cart?.deliveryFee || 40).toFixed(2)}`}
                    </span>
                  </div>

                  {couponResult?.valid && (
                    <div className="flex justify-between text-[#059669] font-bold">
                      <span>Voucher Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t-2 border-black/10 pt-2 font-black text-base text-neutral-900">
                    <span className="uppercase">Due Total</span>
                    <span className="text-xl">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href={
                    couponResult?.valid && couponCode
                      ? `/checkout?promo=${encodeURIComponent(couponCode.trim())}`
                      : '/checkout'
                  }
                  className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Proceed to Final Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center font-tech text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  STRIPE SSL SECURED · ZERO CARD SURCHARGES
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
