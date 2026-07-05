'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '@/components/stripe/checkout-form';
import Link from 'next/link';

// Load Stripe (Make sure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is in .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  
  // Create order state
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
      // 1. Create order with ONLINE payment method
      const order: any = await api.orders.checkout({
        deliveryAddress: address,
        deliveryLat: 28.7041, // Mock
        deliveryLng: 77.1025, // Mock
        paymentMethod: 'ONLINE',
      });
      setOrderCreated(order);

      // 2. Fetch PaymentIntent client_secret
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
    return <div className="page-container"><div className="skeleton" style={{ height: 300 }} /></div>;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{
        padding: '16px 24px', borderBottom: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)',
      }}>
        <Link href="/cart" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          ← <span style={{ fontWeight: 700 }}>Back to Cart</span>
        </Link>
        <h1 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Checkout</h1>
        <div style={{ width: 60 }} />
      </header>

      <div className="page-container" style={{ maxWidth: 800 }}>
        {!clientSecret ? (
          <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1.5rem' }}>Delivery Details</h2>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--color-text-secondary)' }}>Full Address</label>
              <textarea 
                className="input-field" 
                rows={3} 
                placeholder="Apartment, Street, Area..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 32, padding: 16, background: 'rgba(30,41,59,0.5)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Items ({cart?.items.length})</span>
                <span>₹{cart?.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
                <span>₹{cart?.deliveryFee}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                <span>Total to Pay</span>
                <span>₹{cart?.total}</span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
              onClick={handleCreateOrderAndIntent}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        ) : (
          <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1.5rem' }}>Secure Payment</h2>
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <CheckoutForm onSuccess={() => router.push(`/orders/${orderCreated.id}`)} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}
