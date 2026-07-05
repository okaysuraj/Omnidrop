'use client';

import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      switch (user.role) {
        case 'SHOPKEEPER':
          router.push('/shopkeeper/dashboard');
          break;
        case 'DELIVERY_PARTNER':
          router.push('/delivery/dashboard');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/explore');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow effects */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div className="animate-fade-in" style={{ maxWidth: 700, position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            padding: '8px 20px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 100,
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>OMNIDROP</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 20,
            background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Everything You Need,
            <br />
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Delivered in Minutes
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 550,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Discover local stores nearby, browse thousands of products, and get them
            delivered to your doorstep with live tracking.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/login" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              Get Started →
            </Link>
            <Link href="/auth/register" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          maxWidth: 900,
          marginTop: 80,
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}>
          {[
            { icon: '🏪', title: 'Local Stores', desc: 'Shop from verified stores near you' },
            { icon: '⚡', title: 'Fast Delivery', desc: 'Get orders in under 30 minutes' },
            { icon: '📍', title: 'Live Tracking', desc: 'Track your delivery in real-time' },
            { icon: '💳', title: 'Easy Payments', desc: 'Pay online or cash on delivery' },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in"
              style={{
                padding: 24,
                textAlign: 'center',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 20px',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        © 2026 Omnidrop. All rights reserved.
      </footer>
    </main>
  );
}
