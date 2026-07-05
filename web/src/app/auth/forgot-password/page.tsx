'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Reset Password</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {sent ? 'Check your email for reset instructions' : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
              We&apos;ve sent a password reset link to <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>
            </p>
            <Link href="/auth/login" className="btn-primary" style={{ padding: '12px 32px' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Email Address
              </label>
              <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!sent && (
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Remember your password?{' '}
            <Link href="/auth/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
