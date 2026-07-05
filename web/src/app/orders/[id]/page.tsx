'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useSocket } from '@/providers/socket-provider';
import { api } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { LiveMap } from '@/components/shared/live-map';

const statusColors: Record<string, string> = {
  PENDING: 'badge-warning', CONFIRMED: 'badge-info', PREPARING: 'badge-info',
  READY_FOR_PICKUP: 'badge-info', PICKED_UP: 'badge-info',
  OUT_FOR_DELIVERY: 'badge-info', DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger', REFUNDED: 'badge-neutral',
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const { socket, connected } = useSocket();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    const loadOrder = async () => {
      try {
        const data = await api.orders.byId(id);
        setOrder(data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user && id) loadOrder();
  }, [user, authLoading, id, router]);

  useEffect(() => {
    if (!connected || !socket || !id) return;
    socket.emit('room:join_order', { orderId: id });
    socket.on('order:status_updated', (data) => {
      if (data.orderId === id) {
        setOrder((prev: any) => prev ? { ...prev, status: data.status } : prev);
      }
    });
    return () => {
      socket.off('order:status_updated');
      socket.emit('room:leave_order', { orderId: id });
    };
  }, [connected, socket, id]);

  if (authLoading || loading) {
    return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;
  }

  if (!order) {
    return <div className="page-container"><h2 style={{ textAlign: 'center' }}>Order not found</h2></div>;
  }

  const isDeliveryActive = ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status);

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{
        padding: '16px 24px', borderBottom: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)',
      }}>
        <Link href="/orders" style={{ textDecoration: 'none', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          ← <span style={{ fontWeight: 700 }}>Orders</span>
        </Link>
        <h1 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Order #{order.id.slice(-6)}</h1>
        <div style={{ width: 60 }} />
      </header>

      <div className="page-container" style={{ maxWidth: 1000, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
        {/* Order Details */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Status</h3>
              <span className={`badge ${statusColors[order.status] || 'badge-neutral'} ${isDeliveryActive ? 'pulse-live' : ''}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
            
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order.items?.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.quantity} × {item.name}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Live Tracking Map */}
        <div className="animate-fade-in glass-card" style={{ padding: 8, height: 500 }}>
          {isDeliveryActive ? (
            <LiveMap 
              orderId={order.id} 
              initialLat={Number(order.store?.lat || 0)} 
              initialLng={Number(order.store?.lng || 0)} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: 16, background: 'rgba(30,41,59,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🗺️</div>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                {order.status === 'DELIVERED' ? 'Order delivered successfully' : 'Map will appear when order is picked up'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
