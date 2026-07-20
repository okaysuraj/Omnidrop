'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '@/components/stripe/checkout-form';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    const loadCart = async () => {
      try {
        const data: any = await api.cart.get();
        setCart(data);
        if (data.items.length === 0) {
          router.push('/cart');
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user) loadCart();
  }, [user, authLoading, router]);

  const handleCreateOrderAndIntent = async () => {
    if (!address) return alert('Please enter delivery address');
    setIsProcessing(true);
    try {
      const order: any = await api.orders.checkout({
        deliveryAddress: address,
        deliveryLat: 28.7041,
        deliveryLng: 77.1025,
        paymentMethod: 'ONLINE',
      });
      setOrderCreated(order);

      const intent: any = await api.payments.createIntent(order.id);
      setClientSecret(intent.clientSecret);
    } catch (err) {
      console.error(err);
      alert('Failed to initialize checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <span className="material-symbols-outlined text-6xl animate-spin">refresh</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* TopNavBar */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-margin-mobile md:px-xl h-20 bg-surface shadow-sm max-w-[1440px] mx-auto border-b border-outline-variant">
        <div className="flex items-center gap-xl">
          <Link href="/explore" className="font-headline-xl text-headline-xl font-black text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span> OmniDrop
          </Link>
          <nav className="hidden md:flex gap-md">
            <Link href="/explore" className="font-label-bold text-label-bold text-secondary font-medium hover:text-primary transition-colors">Browse</Link>
            <Link href="/orders" className="font-label-bold text-label-bold text-secondary font-medium hover:text-primary transition-colors">Orders</Link>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <Link href="/cart" className="relative cursor-pointer hover:bg-surface-container-low p-xs rounded-full transition-all">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </Link>
          <div className="flex items-center gap-xs cursor-pointer hover:bg-surface-container-low px-sm py-xs rounded-full transition-all">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            <span className="font-label-bold text-label-bold text-primary hidden md:inline">Account</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-margin-mobile md:px-xl py-lg max-w-[1440px] mx-auto w-full">
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg mb-xs flex items-center gap-2">
             <Link href="/cart" className="text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">arrow_back</span></Link> 
             Checkout Command Center
          </h1>
          <p className="font-body-md text-secondary ml-8">Review your order, delivery details, and payment options.</p>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          
          {/* Left Column: Delivery & Instructions */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-md">
            {/* Delivery Address Card */}
            <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant transition-all hover:border-primary/50">
              <div className="flex justify-between items-start mb-sm">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                  <h2 className="font-headline-md text-headline-md">Delivery Address</h2>
                </div>
              </div>
              <textarea 
                className="w-full p-sm rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm min-h-[80px] resize-none mb-4" 
                placeholder="Apartment, Street, Area..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="w-full h-40 rounded-lg overflow-hidden relative bg-surface-container-high flex items-center justify-center">
                 <span className="material-symbols-outlined text-4xl text-outline-variant">map</span>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant">
              <div className="flex items-center gap-xs mb-sm">
                <span className="material-symbols-outlined text-primary">directions_run</span>
                <h2 className="font-headline-md text-headline-md">Instructions</h2>
              </div>
              <div className="grid grid-cols-2 gap-xs mb-md">
                <button className="flex flex-col items-center justify-center p-sm border border-outline-variant rounded-lg gap-xs hover:border-primary hover:bg-primary-container/20 transition-all">
                  <span className="material-symbols-outlined text-secondary">door_back</span>
                  <span className="font-label-md text-label-md">Leave at Door</span>
                </button>
                <button className="flex flex-col items-center justify-center p-sm border border-primary bg-primary-container/20 rounded-lg gap-xs transition-all">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                  <span className="font-label-md text-label-md font-bold">Hand to Me</span>
                </button>
              </div>
              <textarea 
                className="w-full p-sm rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm min-h-[100px] resize-none" 
                placeholder="Gate code, drop-off location details, etc."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </section>

          {/* Middle Column: Payment */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-md">
            <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant h-full">
              <div className="flex justify-between items-start mb-sm">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  <h2 className="font-headline-md text-headline-md">Secure Payment</h2>
                </div>
              </div>
              
              {!clientSecret ? (
                <div className="flex flex-col justify-center items-center h-64 border-2 border-dashed border-outline-variant rounded-xl p-6 text-center">
                   <span className="material-symbols-outlined text-4xl text-outline mb-2">lock</span>
                   <p className="text-secondary font-body-sm mb-4">Complete delivery details first, then proceed to secure checkout.</p>
                   <button 
                     className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-bold text-label-bold active:scale-95 transition-all shadow-md w-full disabled:opacity-50"
                     onClick={handleCreateOrderAndIntent}
                     disabled={isProcessing || !address}
                   >
                     {isProcessing ? 'Processing...' : 'Continue to Payment'}
                   </button>
                </div>
              ) : (
                <div className="animate-fade-in h-full">
                   <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                     <CheckoutForm onSuccess={() => router.push(`/orders/${orderCreated.id}`)} />
                   </Elements>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Order Summary */}
          <section className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-md">
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant max-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    <h2 className="font-headline-md text-headline-md">Your Cart</h2>
                  </div>
                  <span className="bg-secondary text-white font-label-bold text-label-bold px-2 py-0.5 rounded-full">{cart?.items?.length || 0} Items</span>
                </div>
                <div className="flex-grow overflow-y-auto pr-xs flex flex-col gap-sm">
                  {cart?.items?.map((item: any, i: number) => (
                    <div key={item.id || i} className="flex gap-sm border-b border-outline-variant/30 pb-3 last:border-0">
                      <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-label-bold text-label-bold truncate max-w-[150px]">{item.productName || 'Organic Item'}</p>
                          <p className="font-label-bold text-label-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="font-body-sm text-secondary">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-inverse-surface text-white p-md rounded-xl shadow-md">
                <h2 className="font-headline-md text-headline-md mb-sm text-primary-fixed">Order Summary</h2>
                <div className="flex flex-col gap-xs mb-md border-b border-surface-variant/20 pb-md">
                  <div className="flex justify-between font-body-sm">
                    <span className="opacity-70">Subtotal</span>
                    <span>₹{cart?.subtotal || 0}</span>
                  </div>
                  <div className="flex justify-between font-body-sm">
                    <span className="opacity-70">Delivery Fee</span>
                    <span>₹{cart?.deliveryFee || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-md">
                  <span className="font-headline-md text-headline-md">Total</span>
                  <span className="font-headline-lg text-headline-lg text-primary-fixed">₹{cart?.total || 0}</span>
                </div>
                {!clientSecret && (
                  <button 
                    onClick={handleCreateOrderAndIntent}
                    disabled={isProcessing || !address}
                    className="w-full bg-primary-container text-on-primary-fixed py-md rounded-xl font-headline-md text-headline-md hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-sm disabled:opacity-50"
                  >
                    <span>Proceed to Pay</span>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                )}
                <div className="flex items-center justify-center gap-xs mt-sm opacity-60">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span className="font-label-md text-label-md">Instant Delivery: Est. 12-18 mins</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
