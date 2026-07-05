'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    const loadCart = async () => {
      try {
        const data = await api.cart.get();
        setCart(data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user) loadCart();
  }, [user, authLoading, router]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await api.cart.updateQuantity(itemId, quantity);
      setCart(updated);
    } catch { /* ignore */ }
  };

  const removeItem = async (itemId: string) => {
    try {
      const updated = await api.cart.removeItem(itemId);
      setCart(updated);
    } catch { /* ignore */ }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await api.promotions.validate(couponCode, cart?.subtotal || 0);
      setCouponResult(result);
    } catch (err: any) {
      setCouponResult({ valid: false, message: err.message });
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
        <Link href="/explore" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          ← <span style={{ fontWeight: 700 }}>Back</span>
        </Link>
        <h1 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Your Cart</h1>
        <div style={{ width: 60 }} />
      </header>

      <div className="page-container" style={{ maxWidth: 800 }}>
        {!cart || cart.items.length === 0 ? (
          <div className="glass-card animate-fade-in" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Your cart is empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Browse nearby stores and add items</p>
            <Link href="/explore" className="btn-primary" style={{ padding: '12px 32px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24, alignItems: 'flex-start' }}>
            {/* Items List */}
            <div className="animate-fade-in">
              <h2 style={{ fontWeight: 700, marginBottom: 16 }}>{cart.items.length} Items</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cart.items.map((item: any) => (
                  <div key={item.id} className="glass-card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 12,
                      background: 'var(--color-bg-input)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                      flexShrink: 0,
                    }}>🛍️</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.product?.name}</p>
                      <p style={{ color: 'var(--color-success)', fontWeight: 700 }}>₹{item.effectivePrice}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '1rem' }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '1rem' }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 20 }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="glass-card animate-fade-in" style={{ padding: 24, position: 'sticky', top: 80 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>

              {/* Coupon */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" className="input-field" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} style={{ fontSize: '0.85rem' }} />
                  <button onClick={applyCoupon} className="btn-secondary" style={{ padding: '10px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Apply</button>
                </div>
                {couponResult && (
                  <p style={{ marginTop: 6, fontSize: '0.8rem', color: couponResult.valid ? '#10b981' : '#ef4444' }}>
                    {couponResult.valid ? `Discount: -₹${couponResult.discount}` : couponResult.message}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{cart.subtotal}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery Fee</span><span>{cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}</span></div>
                {couponResult?.valid && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}><span>Discount</span><span>-₹{couponResult.discount}</span></div>
                )}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                  <span>Total</span>
                  <span>₹{(cart.total - (couponResult?.valid ? couponResult.discount : 0)).toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary" style={{ width: '100%', padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
