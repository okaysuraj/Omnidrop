'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useSocket } from '@/providers/socket-provider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DeliveryDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { socket, connected } = useSocket();
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'earnings'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'DELIVERY_PARTNER')) {
      router.push('/');
      return;
    }
    const loadData = async () => {
      try {
        const [active, available, earn] = await Promise.all([
          api.delivery.activeTask().catch(() => null),
          api.delivery.available().catch(() => []),
          api.delivery.earnings().catch(() => null),
        ]);
        setActiveTask(active);
        setAvailableTasks(available as any[] || []);
        setEarnings(earn);
        setIsAvailable(user?.isAvailable || false);
      } catch { /* ignore */ }
      setLoading(false);
    };
    if (user) loadData();
  }, [user, authLoading, router]);

  useEffect(() => {
    // Location simulator if active task is IN_TRANSIT
    if (!connected || !socket || !activeTask || activeTask.status !== 'IN_TRANSIT') return;

    // Simulate location updates every 5 seconds
    const interval = setInterval(() => {
      // In a real app, this would be navigator.geolocation.watchPosition
      // We'll simulate a random jump around the current coordinate
      const jitterLat = (Math.random() - 0.5) * 0.001;
      const jitterLng = (Math.random() - 0.5) * 0.001;
      
      const newLocation = {
        lat: Number(activeTask.currentLat || activeTask.pickupLat) + jitterLat,
        lng: Number(activeTask.currentLng || activeTask.pickupLng) + jitterLng,
      };

      socket.emit('delivery:location_update', {
        taskId: activeTask.id,
        orderId: activeTask.orderId,
        ...newLocation,
      });
      
      // Update local state to avoid rubber-banding in simulation
      setActiveTask((prev: any) => ({ ...prev, currentLat: newLocation.lat, currentLng: newLocation.lng }));
    }, 5000);

    return () => clearInterval(interval);
  }, [connected, socket, activeTask]);

  const toggleAvailability = async () => {
    try {
      const result = await api.delivery.toggleAvailability() as any;
      setIsAvailable(result.isAvailable);
    } catch { /* ignore */ }
  };

  const acceptTask = async (taskId: string) => {
    try {
      const task = await api.delivery.acceptTask(taskId);
      setActiveTask(task);
      setAvailableTasks(prev => prev.filter(t => t.id !== taskId));
    } catch { /* ignore */ }
  };

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
          <span style={{ fontSize: 24 }}>🛵</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Delivery Partner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleAvailability}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
              color: isAvailable ? '#10b981' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`} />
            {isAvailable ? 'Online' : 'Offline'}
          </button>
          <button onClick={logout} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </header>

      <div className="page-container">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 4 }}>
          {(['active', 'available', 'earnings'] as const).map(tab => (
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
              {tab === 'active' ? 'Active Delivery' : tab === 'available' ? `Available (${availableTasks.length})` : 'Earnings'}
            </button>
          ))}
        </div>

        {activeTab === 'active' && (
          <div className="animate-fade-in">
            {activeTask ? (
              <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700 }}>Current Delivery</h3>
                  <span className="badge badge-info pulse-live">{activeTask.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Pickup</p>
                    <p style={{ fontWeight: 600 }}>{activeTask.order?.store?.name}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Drop</p>
                    <p style={{ fontWeight: 600 }}>{activeTask.order?.deliveryAddress?.substring(0, 40)}...</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {activeTask.status === 'ACCEPTED' && (
                    <button className="btn-primary" onClick={() => api.delivery.updateStatus(activeTask.id, 'PICKED_UP')}>
                      Mark Picked Up
                    </button>
                  )}
                  {activeTask.status === 'PICKED_UP' && (
                    <button className="btn-primary" onClick={() => api.delivery.updateStatus(activeTask.id, 'IN_TRANSIT')}>
                      Start Delivery
                    </button>
                  )}
                  {activeTask.status === 'IN_TRANSIT' && (
                    <button className="btn-success" onClick={() => api.delivery.updateStatus(activeTask.id, 'DELIVERED')}>
                      Mark Delivered ✓
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
                <p style={{ color: 'var(--color-text-secondary)' }}>No active delivery. Check available tasks.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="animate-fade-in">
            {availableTasks.length === 0 ? (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>No deliveries available right now</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {availableTasks.map((task: any) => (
                  <div key={task.id} className="glass-card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{task.order?.store?.name}</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Order #{task.orderId?.slice(-6)} · ₹{task.order?.total}</p>
                      </div>
                      <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => acceptTask(task.id)}>
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Today\'s Earnings', value: `₹${earnings?.todayEarnings || 0}`, icon: '💰' },
                { label: 'Today\'s Deliveries', value: earnings?.todayDeliveries || 0, icon: '📦' },
                { label: 'Total Earnings', value: `₹${earnings?.totalEarnings || 0}`, icon: '🏦' },
                { label: 'Total Deliveries', value: earnings?.totalDeliveries || 0, icon: '🛵' },
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
          </div>
        )}
      </div>
    </div>
  );
}
