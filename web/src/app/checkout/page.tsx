'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { CheckoutForm } from '@/components/stripe/checkout-form';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowRight, Banknote, Clock, CreditCard, FileText, MapPin, Wallet } from 'lucide-react';
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
  const [address, setAddress] = useState(
    'Flat 402, Block C, Connaught Place, Central Delhi - 110001',
  );
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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// DISPATCH TERMINAL'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Order Dispatch Authorization
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Select delivery coordinates, drop instructions, and settlement method.
            </p>
          </div>

          <Link
            href="/cart"
            className="btn-brutal-white !h-9 !py-0 !px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Modify Tote</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-tech text-xs font-bold uppercase">
            CALCULATING COURIER VECTOR...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Delivery Coordinate & Payment Selection */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Delivery Coordinates Card */}
              <div className="card-brutal bg-white p-6 border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#FF4800]" />
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                      1. Delivery Coordinates
                    </h3>
                  </div>
                  <span className="badge-brutal bg-[#00E599] text-black text-[10px]">
                    IN-RANGE (&lt; 1.2 KM)
                  </span>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 font-tech text-xs">
                    {savedAddresses.map((addr) => {
                      const isSel = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`px-3 py-1 font-bold border-2 border-black transition-all ${
                            isSel
                              ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                              : 'bg-[#FAFAF8] text-neutral-800'
                          }`}
                        >
                          {addr.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div>
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900">
                    Exact Street / Apartment / Landmark
                  </label>
                  <textarea
                    rows={3}
                    className="input-brutal font-sans text-xs resize-none"
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
                  <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-900 flex items-center justify-between">
                    <span>Gate Access / Drop-off Directives (Optional)</span>
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  </label>
                  <input
                    type="text"
                    className="input-brutal font-sans text-xs"
                    placeholder="Leave with front security / Ring door bell #4..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Payment Protocol Card */}
              <div className="card-brutal bg-white p-6 border-2 border-black shadow-[4px_4px_0px_#000] space-y-5">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-neutral-900" />
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                      2. Settlement Protocol
                    </h3>
                  </div>
                  <span className="font-tech text-xs text-neutral-600 font-bold uppercase">
                    Zero Surcharges
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'ONLINE',
                      label: 'Stripe Pay',
                      desc: 'Credit / Debit / UPI',
                      icon: CreditCard,
                      color: '#FFE600',
                    },
                    {
                      id: 'COD',
                      label: 'Cash On Door',
                      desc: 'Verify tote before paying',
                      icon: Banknote,
                      color: '#00E599',
                    },
                    {
                      id: 'WALLET',
                      label: 'Omni Wallet',
                      desc: `Balance: ₹${wallet?.balance || 0}`,
                      icon: Wallet,
                      color: '#FF4800',
                    },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                        className={`p-4 border-2 border-black font-tech text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000] translate-x-0.5 translate-y-0.5'
                            : 'bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <div className="font-black text-sm uppercase">{m.label}</div>
                        <div className="text-[10px] text-neutral-600 mt-0.5 font-bold">
                          {m.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Stripe Embedded Form if clientSecret present */}
                {clientSecret && paymentMethod === 'ONLINE' ? (
                  <div className="p-4 bg-[#FAFAF8] border-2 border-black">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm orderId={orderCreated?.id} clientSecret={clientSecret} />
                    </Elements>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                  >
                    <span>
                      {isProcessing
                        ? 'AUTHORIZING DISPATCH...'
                        : `AUTHORIZE ₹${Number(cart?.total || 0).toFixed(2)} ORDER`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Perforated Courier Ticket Manifest */}
            <div className="lg:col-span-4">
              <div className="receipt-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-4 sticky top-24">
                <div className="border-b-2 border-black pb-3 text-center">
                  <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-display font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000] mx-auto mb-2">
                    ⚡
                  </div>
                  <div className="font-tech text-xs font-bold uppercase tracking-wider text-neutral-900">
                    OMNIDROP LOGISTICS CORP
                  </div>
                  <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
                    SECTOR 4 COURIER TICKET
                  </div>
                </div>

                {/* Items listing */}
                <div className="space-y-2 font-tech text-xs border-b-2 border-black pb-4">
                  {cart?.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-baseline">
                      <span className="text-neutral-700 truncate max-w-[180px]">
                        {item.quantity}x {item.product?.name}
                      </span>
                      <span className="font-bold text-neutral-900">
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
                <div className="space-y-2 font-tech text-xs border-b-2 border-black pb-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Shelf Subtotal</span>
                    <span className="font-bold text-neutral-900">
                      ₹{Number(cart?.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Hyperlocal Transit</span>
                    <span className="font-bold text-[#059669]">
                      {cart?.deliveryFee === 0 || Number(cart?.subtotal || 0) > 500
                        ? 'FREE (₹0.00)'
                        : '₹30.00'}
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#059669] font-bold">
                      <span>Voucher Discount ({promoCode})</span>
                      <span>-₹{promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Platform Commission</span>
                    <span className="font-bold text-[#059669]">₹0.00 (Zero Surcharge)</span>
                  </div>
                </div>

                {/* Final Bill */}
                <div className="flex justify-between items-baseline font-tech font-black text-lg text-neutral-900 pt-1">
                  <span className="uppercase">TOTAL DUE</span>
                  <span className="text-2xl">
                    ₹{Math.max(0, Number(cart?.total || 0) - promoDiscount).toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-[#FAFAF8] border-2 border-black font-tech text-[10px] space-y-1 text-neutral-600">
                  <div className="flex items-center gap-1 font-bold text-black uppercase">
                    <Clock className="w-3 h-3 text-[#FF4800]" />
                    <span>ESTIMATED DOORSTEP WINDOW</span>
                  </div>
                  <div>15 — 20 MIN FROM DISPATCH EXECUTION</div>
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
        <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans flex flex-col justify-between">
          <BrutalNav />
          <div className="container-brutal py-24 text-center font-tech text-xs font-bold uppercase">
            {'// PREPARING SECURE DISPATCH TERMINAL...'}
          </div>
          <BrutalFooter />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
