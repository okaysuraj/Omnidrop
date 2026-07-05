'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ShopkeeperDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'SHOPKEEPER')) {
      router.push('/');
      return;
    }
    const loadData = async () => {
      try {
        const myStores = await api.stores.myStores() as any[];
        setStores(myStores || []);
        if (myStores?.length > 0) {
          const storeOrders = await api.orders.byStore(myStores[0].id) as any;
          setOrders(storeOrders?.items || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user) loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;
  }

  const store = stores[0];
  const pendingOrders = orders.filter((o: any) => o.status === 'PENDING');
  const todayOrders = orders.filter((o: any) => {
    const d = new Date(o.createdAt);
    return d.toDateString() === new Date().toDateString();
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏪</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Shopkeeper Dashboard</span>
          {store && <span className={`badge ${store.isVerified ? 'badge-success' : 'badge-warning'}`}>{store.isVerified ? 'Verified' : 'Pending'}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{user?.fullName}</span>
          <button onClick={logout} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </header>

      <div className="page-container">
        {/* No store — show creation */}
        {!store ? (
          <div className="glass-card animate-fade-in" style={{ padding: 40, textAlign: 'center', maxWidth: 500, margin: '40px auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
            <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Create Your Store</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Set up your store to start receiving orders</p>
            <button className="btn-primary" style={{ padding: '14px 32px' }}>Create Store</button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 4 }}>
              {(['overview', 'orders', 'inventory'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px 12px 0 0',
                    border: 'none',
                    background: activeTab === tab ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: activeTab === tab ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                    fontWeight: activeTab === tab ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                  {[
                    { label: 'Today\'s Orders', value: todayOrders.length, icon: '📦', color: '#6366f1' },
                    { label: 'Pending', value: pendingOrders.length, icon: '⏳', color: '#f59e0b' },
                    { label: 'Total Orders', value: orders.length, icon: '📊', color: '#10b981' },
                    { label: 'Rating', value: store.rating?.toFixed(1) || '0.0', icon: '⭐', color: '#8b5cf6' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>{stat.label}</p>
                          <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</p>
                        </div>
                        <div style={{ fontSize: 32 }}>{stat.icon}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Store Info */}
                <div className="glass-card" style={{ padding: 24 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Store Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Name</span><p style={{ fontWeight: 600 }}>{store.name}</p></div>
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Status</span><p><span className={`badge ${store.isActive ? 'badge-success' : 'badge-danger'}`}>{store.isActive ? 'Active' : 'Inactive'}</span></p></div>
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Address</span><p>{store.address}</p></div>
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Delivery Radius</span><p>{store.radiusKm} km</p></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Recent Orders</h3>
                {orders.length === 0 ? (
                  <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>No orders yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.map((order: any) => (
                      <div key={order.id} className="glass-card" style={{ padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontWeight: 600 }}>#{order.id.slice(-6)}</span>
                            <span style={{ color: 'var(--color-text-muted)', marginLeft: 12, fontSize: '0.85rem' }}>
                              {order.items?.length || 0} items · ₹{order.total}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span className={`badge badge-${order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                              {order.status}
                            </span>
                            {order.status === 'PENDING' && (
                              <button className="btn-success" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                onClick={() => api.orders.updateStatus(order.id, 'CONFIRMED')}>
                                Accept
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="animate-fade-in">
                <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Inventory Management</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Add products, manage stock levels, set prices, and control visibility.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
