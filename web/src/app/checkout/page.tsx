'use client';

import { Zap as UiZap } from 'lucide-react';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { CheckoutForm } from '@/components/stripe/checkout-form';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  ArrowRight,
  Banknote,
  CreditCard,
  FileText,
  MapPin,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

function CheckoutContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPromo = searchParams.get('promo') || '';

  const [cart, setCart] = useState<Models.Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<Models.Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD' | 'WALLET'>('ONLINE');
  const [wallet, setWallet] = useState<Models.WalletDetails | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState<Models.Order | null>(null);
  const promoCode = initialPromo;
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    const loadInitialData = async () => {
      try {
        const [cartData, addrs, userWallet] = await Promise.all([
          api.cart.get().catch(() => null),
          api.users.addresses().catch(() => []),
          api.wallet.get().catch(() => null),
        ]);
        setCart(cartData);
        if (!cartData || cartData.items?.length === 0) {
          router.push('/cart');
          return;
        }
        setSavedAddresses(addrs || []);
        if (addrs && addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr.id);
          setAddress(
            `${defaultAddr.addressLine1}${defaultAddr.addressLine2 ? ', ' + defaultAddr.addressLine2 : ''}, ${defaultAddr.city} - ${defaultAddr.pincode}`,
          );
        }
        setWallet(userWallet);

        if (initialPromo && cartData?.subtotal) {
          try {
            const promoRes = await api.promotions.validate(initialPromo, cartData.subtotal);
            if (promoRes?.valid) {
              setPromoDiscount(Number(promoRes.discount || 0));
            }
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
    };
    if (user) loadInitialData();
  }, [user, authLoading, router, initialPromo]);

  const handleSelectSavedAddress = (addr: Models.Address) => {
    setSelectedAddressId(addr.id);
    setAddress(
      `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city} - ${addr.pincode}`,
    );
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert('Please input or select a delivery address');
    const selectedAddr = savedAddresses.find((a) => a.id === selectedAddressId);
    const orderTotal = Math.max(0, Number(cart?.total || 0) - promoDiscount);

    if (paymentMethod === 'WALLET' && wallet && Number(wallet.balance) < orderTotal) {
      return alert(
        `Insufficient wallet balance. You have ₹${Number(wallet.balance).toFixed(2)}, order total is ₹${orderTotal.toFixed(2)}. Choose another method or top up wallet.`,
      );
    }

    setIsProcessing(true);
    try {
      const order = await api.orders.checkout({
        deliveryAddress: address,
        deliveryAddressId: selectedAddressId || undefined,
        deliveryLat: selectedAddr?.lat ? Number(selectedAddr.lat) : 28.6139,
        deliveryLng: selectedAddr?.lng ? Number(selectedAddr.lng) : 77.209,
        deliveryInstructions: instructions || undefined,
        paymentMethod,
        promotionCode: promoCode || undefined,
      });
      setOrderCreated(order);

      if (paymentMethod === 'ONLINE') {
        try {
          const intent = await api.payments.createIntent(order.id);
          if (intent.provider === 'stripe') setClientSecret(intent.clientSecret);
        } catch {
          router.push(`/orders/${order.id}`);
        }
      } else {
        router.push(`/orders/${order.id}`);
      }
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Dispatch terminal'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Checkout
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Choose where to deliver and how you would like to pay.
            </p>
          </div>

          <Link
            href="/cart"
            className="button-secondary !h-9 !py-0 !px-4 text-xs font-bold  tracking-normal flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Edit cart</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-sans text-xs font-bold ">
            Preparing your checkout...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Delivery Coordinate & Payment Selection */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Delivery Coordinates Card */}
              <div className="surface-card bg-surface p-6 border rounded-xl border-line  space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand" />
                    <h3 className="font-display font-bold text-xl  tracking-tight text-ink">
                      Delivery address
                    </h3>
                  </div>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 font-sans text-xs">
                    {savedAddresses.map((addr) => {
                      const isSel = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          aria-pressed={isSel}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`px-3 py-1 font-bold border rounded-xl border-line transition-all ${
                            isSel ? 'bg-brand-soft text-ink ' : 'bg-canvas text-ink'
                          }`}
                        >
                          {addr.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="field-checkout-page-1"
                    className="block font-sans text-xs  tracking-normal font-bold mb-1.5 text-ink"
                  >
                    Street address, apartment, or landmark
                  </label>
                  <textarea
                    id="field-checkout-page-1"
                    rows={3}
                    className="field-input font-sans text-xs resize-none"
                    placeholder="Enter complete address..."
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setSelectedAddressId('');
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-checkout-page-2"
                    className="block font-sans text-xs  tracking-normal font-bold mb-1.5 text-ink flex items-center justify-between"
                  >
                    <span>Delivery instructions (optional)</span>
                    <FileText className="w-3.5 h-3.5 text-secondary" />
                  </label>
                  <input
                    id="field-checkout-page-2"
                    type="text"
                    className="field-input font-sans text-xs"
                    placeholder="Leave with front security / Ring door bell #4..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Payment Protocol Card */}
              <div className="surface-card bg-surface p-6 border rounded-xl border-line  space-y-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-ink" />
                    <h3 className="font-display font-bold text-xl  tracking-tight text-ink">
                      Payment method
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'ONLINE',
                      label: 'Pay online',
                      desc: 'Credit or debit card',
                      icon: CreditCard,
                      color: 'var(--brand-soft)',
                    },
                    {
                      id: 'COD',
                      label: 'Cash on delivery',
                      desc: 'Pay when your order arrives',
                      icon: Banknote,
                      color: 'var(--brand-soft)',
                    },
                    {
                      id: 'WALLET',
                      label: 'Omni Wallet',
                      desc: `Balance: ₹${wallet?.balance || 0}`,
                      icon: Wallet,
                      color: 'var(--brand-soft)',
                    },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                        className={`p-4 border rounded-xl border-line font-sans text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-brand-soft text-ink   '
                            : 'bg-surface hover:bg-muted text-ink '
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <div className="font-bold text-sm ">{m.label}</div>
                        <div className="text-xs text-secondary mt-0.5 font-bold">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Stripe Embedded Form if clientSecret present */}
                {clientSecret && paymentMethod === 'ONLINE' ? (
                  <div className="p-4 bg-canvas border rounded-xl border-line">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm orderId={orderCreated?.id} clientSecret={clientSecret} />
                    </Elements>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full button-primary !h-12 !py-0 font-bold text-xs  tracking-normal flex items-center justify-center gap-2 mt-2"
                  >
                    <span>
                      {isProcessing
                        ? 'Placing your order...'
                        : `Place order · ₹${Math.max(0, Number(cart?.total || 0) - promoDiscount).toFixed(2)}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Perforated Courier Ticket Manifest */}
            <div className="lg:col-span-4">
              <div className="surface-panel bg-surface p-6 border rounded-xl border-line  space-y-4 sticky top-24">
                <div className="border-b border-line pb-3 text-center">
                  <div className="w-8 h-8 bg-muted text-brand flex items-center justify-center font-display font-bold text-sm border rounded-xl border-line  mx-auto mb-2">
                    <UiZap
                      className="inline-block size-4 align-text-bottom mr-1.5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="font-sans text-xs font-bold  tracking-normal text-ink">
                    Order summary
                  </div>
                  <div className="font-sans text-xs text-secondary font-bold ">
                    {cart?.store?.name || 'Your neighborhood order'}
                  </div>
                </div>

                {/* Items listing */}
                <div className="space-y-2 font-sans text-xs border-b border-line pb-4">
                  {cart?.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-baseline">
                      <span className="text-secondary truncate max-w-[180px]">
                        {item.quantity}x {item.product?.name}
                      </span>
                      <span className="font-bold text-ink">
                        ₹
                        {(
                          Number(item.effectivePrice || item.product?.sellingPrice || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-2 font-sans text-xs border-b border-line pb-4">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span className="font-bold text-ink">
                      ₹{Number(cart?.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Delivery</span>
                    <span className="font-bold text-brand">
                      {Number(cart?.deliveryFee || 0) === 0
                        ? 'Free'
                        : `₹${Number(cart?.deliveryFee).toFixed(2)}`}
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-brand font-bold">
                      <span>Voucher Discount ({promoCode})</span>
                      <span>-₹{promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {Number(cart?.discount) > 0 && (
                    <div className="flex justify-between text-brand">
                      <span>Discount</span>
                      <span className="font-bold">-₹{Number(cart?.discount).toFixed(2)}</span>
                    </div>
                  )}
                  {Number(cart?.tax) > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Tax</span>
                      <span className="font-bold text-ink">₹{Number(cart?.tax).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Final Bill */}
                <div className="flex justify-between items-baseline font-sans font-bold text-lg text-ink pt-1">
                  <span className="">Total due</span>
                  <span className="text-2xl">
                    ₹{Math.max(0, Number(cart?.total || 0) - promoDiscount).toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-canvas border rounded-xl border-line font-sans text-xs space-y-1 text-secondary">
                  <div className="flex items-center gap-1 font-bold text-ink ">
                    <ShieldCheck className="w-4 h-4 text-brand" />
                    <span>Secure checkout</span>
                  </div>
                  <div>Track updates from your order page after checkout.</div>
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-canvas text-ink font-sans flex flex-col">
          <BrutalNav />
          <div className="site-container py-24 text-center font-sans text-xs font-bold ">
            {'Preparing secure dispatch terminal...'}
          </div>
          <BrutalFooter />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
