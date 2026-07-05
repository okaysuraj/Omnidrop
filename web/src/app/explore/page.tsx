'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const [cats, nearbyStores] = await Promise.all([
          api.products.categories().catch(() => []),
          api.stores.nearby(28.6139, 77.209, 20).catch(() => []),
        ]);
        setCategories(cats as any[] || []);
        setStores(nearbyStores as any[] || []);
      } catch { /* ignore */ }
      setLoading(false);
    };

    if (user) loadData();
  }, [user, authLoading, router]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await api.products.search(searchQuery) as any[];
      setSearchResults(results || []);
    } catch { /* ignore */ }
  };

  if (authLoading || loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ width: 300, height: 200 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>OMNIDROP</span>
        </div>

        <div style={{ flex: 1, maxWidth: 500, margin: '0 24px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ borderRadius: '12px 0 0 12px' }}
            />
            <button onClick={handleSearch} className="btn-primary" style={{ borderRadius: '0 12px 12px 0', padding: '12px 20px' }}>
              🔍
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/cart" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 24 }}>
            🛒
          </Link>
          <Link href="/orders" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 24 }}>
            📦
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
            }}>
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <button onClick={logout} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="page-container">
        {/* Welcome */}
        <div className="animate-fade-in" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>
            Hey {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>What would you like to order today?</p>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Search Results</h2>
              <button onClick={() => setSearchResults([])} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Clear</button>
            </div>
            <div className="product-grid">
              {searchResults.map((product: any) => (
                <div key={product.id} className="glass-card" style={{ padding: 16 }}>
                  <div style={{ width: '100%', height: 120, background: 'var(--color-bg-input)', borderRadius: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                    🛍️
                  </div>
                  <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>₹{product.sellingPrice}</span>
                    {product.mrp > product.sellingPrice && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>₹{product.mrp}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Shop by Category</h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/products?categoryId=${cat.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    minWidth: 120,
                    cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🏷️</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>{cat.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Stores */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Nearby Stores</h2>
          {stores.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
              <p style={{ color: 'var(--color-text-secondary)' }}>No stores found nearby. Try expanding your search radius.</p>
            </div>
          ) : (
            <div className="store-grid">
              {stores.map((store: any) => (
                <Link key={store.id} href={`/stores/${store.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: 20, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{store.name}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{store.address?.substring(0, 50)}...</p>
                      </div>
                      <span className={`badge ${store.isOpen ? 'badge-success' : 'badge-danger'}`}>
                        {store.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      <span>⭐ {store.rating?.toFixed(1) || '4.0'}</span>
                      <span>📍 {store.distance?.toFixed(1) || '?'} km</span>
                      <span>🕐 {store.estimatedDeliveryMinutes || '~20'} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
