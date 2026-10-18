'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { FormAlert } from '@/components/shared/form-alert';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type { Cart } from '@/types';
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [validating, setValidating] = useState(false);
  const [promotion, setPromotion] = useState<{
    valid: boolean;
    discount?: number;
    message?: string;
  } | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
      return;
    }
    if (!user) return;
    let active = true;
    api.cart
      .get()
      .then((data) => {
        if (active) {
          setCart(data);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('We could not load your cart. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, authLoading, router, reload]);
  async function update(id: string, quantity: number) {
    setPending(id);
    setError('');
    try {
      const next =
        quantity <= 0 ? await api.cart.removeItem(id) : await api.cart.updateQuantity(id, quantity);
      setCart(next);
      setPromotion(null);
      setAppliedCoupon('');
      window.dispatchEvent(new Event('omnidrop:cart-updated'));
    } catch (failure) {
      setError(getErrorMessage(failure) || 'We could not update your cart. Please try again.');
    } finally {
      setPending(null);
    }
  }
  async function applyCoupon() {
    if (!coupon.trim()) return;
    setValidating(true);
    try {
      const result = await api.promotions.validate(coupon.trim(), cart?.subtotal || 0);
      setPromotion(result);
      setAppliedCoupon(result.valid ? coupon.trim() : '');
    } catch (failure) {
      setPromotion({ valid: false, message: getErrorMessage(failure) });
      setAppliedCoupon('');
    } finally {
      setValidating(false);
    }
  }
  const items = cart?.items || [];
  const discount = promotion?.valid ? Number(promotion.discount || 0) : 0;
  const total = Math.max(0, Number(cart?.total || 0) - discount);
  return (
    <div className="min-h-dvh flex flex-col">
      <BrutalNav />
      <main id="main-content" className="site-container flex-1 py-9 sm:py-12">
        <Link
          href="/products"
          className="text-sm text-secondary inline-flex items-center gap-1 hover:text-brand mb-6"
        >
          <ChevronLeft size={16} />
          Continue shopping
        </Link>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-heading">Your cart.</h1>
            <p className="text-sm text-secondary mt-3">A few good things for your everyday.</p>
          </div>
          {!loading && items.length > 0 && (
            <span className="status-badge">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        {error && (
          <div className="mb-6">
            <FormAlert message={error} onDismiss={() => setError('')} />
            {!cart && (
              <button
                type="button"
                className="button-primary mb-4"
                onClick={() => {
                  setLoading(true);
                  setReload((value) => value + 1);
                }}
              >
                Try again
              </button>
            )}
          </div>
        )}
        {loading ? (
          <div
            role="status"
            className="empty-state flex flex-col items-center gap-4 text-secondary"
          >
            <Loader2 size={28} className="animate-spin text-brand" />
            Loading your cart…
          </div>
        ) : !items.length ? (
          <div className="surface-panel empty-state">
            <span className="empty-state-icon">
              <ShoppingBag size={29} />
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Your next fresh find is waiting.</h2>
            <p className="text-secondary text-sm mt-3 mb-7">
              Your cart is empty. Let&apos;s change that with something local.
            </p>
            <Link href="/explore" className="button-primary">
              Explore your neighborhood
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.65fr_1fr] gap-7 lg:gap-10 items-start">
            <section className="surface-panel px-5 sm:px-7" aria-label="Items in your cart">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 sm:gap-5 py-6 border-b border-line last:border-b-0"
                >
                  <Link
                    href={'/products/' + item.productId}
                    className="size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                  >
                    <img
                      src={item.product?.images?.[0] || '/hero_essentials.jpg'}
                      alt={item.product?.name || 'Grocery item'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-secondary">
                          {item.product?.unit || 'Everyday essentials'}
                        </p>
                        <Link
                          href={'/products/' + item.productId}
                          className="font-bold text-sm sm:text-base mt-1 block hover:text-brand"
                        >
                          {item.product?.name || 'Grocery item'}
                        </Link>
                      </div>
                      <button
                        type="button"
                        className="icon-button size-9 text-secondary hover:text-danger"
                        disabled={pending !== null}
                        onClick={() => update(item.id, 0)}
                        aria-label={'Remove ' + (item.product?.name || 'item') + ' from cart'}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <div className="quantity-control">
                        <button
                          type="button"
                          disabled={pending !== null}
                          onClick={() => update(item.id, item.quantity - 1)}
                          aria-label={'Decrease quantity of ' + (item.product?.name || 'item')}
                        >
                          <Minus size={15} />
                        </button>
                        <output aria-label="Quantity">
                          {pending === item.id ? (
                            <Loader2 size={13} className="animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </output>
                        <button
                          type="button"
                          disabled={pending !== null}
                          onClick={() => update(item.id, item.quantity + 1)}
                          aria-label={'Increase quantity of ' + (item.product?.name || 'item')}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <span className="font-bold tabular-nums">
                        ₹
                        {(
                          Number(item.effectivePrice ?? item.product?.sellingPrice ?? 0) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <aside
              className="surface-panel p-6 sm:p-7 lg:sticky lg:top-28"
              aria-label="Order summary"
            >
              <h2 className="text-xl font-bold tracking-tight">The good things add up.</h2>
              <div className="my-6 py-5 border-y border-line">
                <label htmlFor="cart-promo" className="field-label flex gap-2 items-center">
                  <Tag size={15} />
                  Have a promo code?
                </label>
                <div className="flex gap-2">
                  <input
                    id="cart-promo"
                    className="field-input"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(event) => {
                      setCoupon(event.target.value);
                      setPromotion(null);
                      setAppliedCoupon('');
                    }}
                  />
                  <button
                    type="button"
                    className="button-secondary px-4"
                    disabled={validating || !coupon.trim()}
                    onClick={applyCoupon}
                  >
                    {validating ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {promotion && (
                  <p
                    role="status"
                    className={'text-xs mt-3 ' + (promotion.valid ? 'text-brand' : 'text-danger')}
                  >
                    {promotion.valid
                      ? 'Promo applied. You saved ₹' +
                        Number(promotion.discount || 0).toFixed(2) +
                        '.'
                      : promotion.message || 'This code is not valid for your order.'}
                  </p>
                )}
              </div>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">
                    ₹{Number(cart?.subtotal || 0).toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">Delivery</dt>
                  <dd className="font-semibold tabular-nums">
                    {Number(cart?.deliveryFee || 0) === 0
                      ? 'Free'
                      : '₹' + Number(cart?.deliveryFee).toFixed(2)}
                  </dd>
                </div>
                {Number(cart?.tax) > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-secondary">Tax</dt>
                    <dd className="font-semibold tabular-nums">₹{Number(cart?.tax).toFixed(2)}</dd>
                  </div>
                )}
                {Number(cart?.discount) > 0 && (
                  <div className="flex justify-between gap-4 text-brand">
                    <dt>Discount</dt>
                    <dd className="font-semibold tabular-nums">
                      -₹{Number(cart?.discount).toFixed(2)}
                    </dd>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between gap-4 text-brand">
                    <dt>Promo savings</dt>
                    <dd className="font-semibold tabular-nums">-₹{discount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 pt-5 border-t border-line text-lg font-bold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">₹{total.toFixed(2)}</dd>
                </div>
              </dl>
              <Link
                href={
                  appliedCoupon
                    ? '/checkout?promo=' + encodeURIComponent(appliedCoupon)
                    : '/checkout'
                }
                className="button-primary w-full mt-7"
              >
                Continue to checkout
                <ArrowRight size={17} />
              </Link>
              <p className="text-xs text-secondary flex gap-2 items-center justify-center mt-5">
                <ShieldCheck size={15} className="text-brand" />
                Secure checkout. Clear order totals.
              </p>
            </aside>
          </div>
        )}
      </main>
      <BrutalFooter />
    </div>
  );
}
