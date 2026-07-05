'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  PENDING: 'badge-warning', CONFIRMED: 'badge-info', PREPARING: 'badge-info',
  READY_FOR_PICKUP: 'badge-info', PICKED_UP: 'badge-info',
  OUT_FOR_DELIVERY: 'badge-info', DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger', REFUNDED: 'badge-neutral',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    const loadOrders = async () => {
      try {
        const data = await api.orders.myOrders() as any;
        setOrders(data?.items || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user) loadOrders();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="page-container">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, marginBottom: 12 }} />)}</div>;
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
        <h1 style={{ fontWeight: 800, fontSize: '1.2rem' }}>My Orders</h1>
        <div style={{ width: 60 }} />
      </header>

      <div className="page-container" style={{ maxWidth: 800 }}>
        {orders.length === 0 ? (
          <div className="glass-card animate-fade-in" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h2 style={{ fontWeight: 800, marginBottom: 8 }}>No orders yet</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Start shopping to see your orders here</p>
            <Link href="/explore" className="btn-primary" style={{ padding: '12px 32px' }}>Browse Stores</Link>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map((order: any) => (
              <Link key={order.id} href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: 20, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                        Order #{order.id?.slice(-6)}
                      </p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {order.store?.name || 'Store'} · {order.items?.length || 0} items
                      </p>
                    </div>
                    <span className={`badge ${statusColors[order.status] || 'badge-neutral'}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{order.total}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
