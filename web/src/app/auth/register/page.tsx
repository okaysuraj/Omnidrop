'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const roles = [
  { value: 'CUSTOMER', label: '🛍️ Customer', desc: 'Browse & order from local stores' },
  { value: 'SHOPKEEPER', label: '🏪 Shopkeeper', desc: 'Manage your store & inventory' },
  { value: 'DELIVERY_PARTNER', label: '🛵 Delivery Partner', desc: 'Deliver orders & earn' },
];

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, fullName, role);
      router.push('/');
    } catch { /* error handled by context */ }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 480, padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1 }}>OMNIDROP</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Join the marketplace</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            color: '#ef4444',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{error}</span>
            <button onClick={clearError} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              I want to join as
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  style={{
                    padding: '14px 8px',
                    borderRadius: 12,
                    border: role === r.value ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: role === r.value ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{r.label.split(' ')[0]}</div>
                  <div style={{ fontWeight: 600 }}>{r.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="input-field"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button id="register-submit" type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
