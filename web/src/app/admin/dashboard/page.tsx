'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stores' | 'orders'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
      return;
    }
    const loadData = async () => {
      try {
        const [uStats, oStats, dStats, userList, storeList, orderList] = await Promise.all([
          api.users.stats().catch(() => null),
          api.orders.stats().catch(() => null),
          api.admin.dashboardStats().catch(() => null),
          api.users.all(1).catch(() => ({ items: [] })) as Promise<any>,
          api.stores.getAll(1).catch(() => ({ items: [] })) as Promise<any>,
          api.orders.all(1).catch(() => ({ items: [] })) as Promise<any>,
        ]);
        setUserStats(uStats);
        setOrderStats(oStats);
        setDashboardStats(dStats);
        setUsers(userList?.items || []);
        setStores(storeList?.items || []);
        setOrders(orderList?.items || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user) loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
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
          <span style={{ fontSize: 24 }}>🧑‍💼</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Admin Panel</span>
          <span className="badge badge-danger">ADMIN</span>
        </div>
        <button onClick={logout} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Logout</button>
      </header>

      <div className="page-container">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 4 }}>
          {(['overview', 'users', 'stores', 'orders'] as const).map(tab => (
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total Users', value: dashboardStats?.users?.totalActive || userStats?.total || 0, icon: '👥', color: '#6366f1' },
                { label: 'Customers', value: dashboardStats?.users?.customers || userStats?.customers || 0, icon: '🛍️', color: '#10b981' },
                { label: 'Shopkeepers', value: dashboardStats?.users?.shopkeepers || userStats?.shopkeepers || 0, icon: '🏪', color: '#f59e0b' },
                { label: 'Riders', value: dashboardStats?.users?.riders || userStats?.riders || 0, icon: '🛵', color: '#8b5cf6' },
                { label: 'Total Orders', value: dashboardStats?.orders?.total || orderStats?.total || 0, icon: '📦', color: '#06b6d4' },
                { label: 'Revenue', value: `₹${dashboardStats?.revenue || orderStats?.revenue || 0}`, icon: '💰', color: '#10b981' },
                { label: 'Pending Orders', value: orderStats?.pending || 0, icon: '⏳', color: '#f59e0b' },
                { label: 'Delivered', value: orderStats?.delivered || 0, icon: '✅', color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} className="glass-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</p>
                    </div>
                    <div style={{ fontSize: 28 }}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Users</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map((u: any) => (
                <div key={u.id} className="glass-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}>{u.fullName?.[0]}</div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{u.fullName}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{u.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`badge badge-info`}>{u.role}</span>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Blocked'}</span>
                    <button
                      className={u.isActive ? 'btn-danger' : 'btn-success'}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      onClick={() => api.users.toggleActive(u.id)}
                    >
                      {u.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="animate-fade-in">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Stores</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stores.map((s: any) => (
                <div key={s.id} className="glass-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{s.name}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{s.address?.substring(0, 50)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${s.isVerified ? 'badge-success' : 'badge-warning'}`}>{s.isVerified ? 'Verified' : 'Pending'}</span>
                    {!s.isVerified && (
                      <button className="btn-success" style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        onClick={() => api.stores.verify(s.id)}>
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Recent Orders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.map((o: any) => (
                <div key={o.id} className="glass-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>#{o.id?.slice(-6)}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 12, fontSize: '0.85rem' }}>
                      ₹{o.total} · {o.store?.name || 'Unknown Store'}
                    </span>
                  </div>
                  <span className={`badge badge-${o.status === 'DELIVERED' ? 'success' : o.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
