'use client';

import { AuthShell } from '@/components/shared/auth-shell';
import { FormAlert } from '@/components/shared/form-alert';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (failure) {
      setError(getErrorMessage(failure) || 'We could not send your reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthShell>
      {sent ? (
        <div role="status">
          <span className="empty-state-icon ml-0">
            <CheckCircle2 size={30} />
          </span>
          <h1>Check your inbox.</h1>
          <p className="auth-description">
            Password reset instructions have been sent to{' '}
            <strong className="text-ink">{email}</strong>. Follow the link to choose a new password.
          </p>
          <Link href="/auth/login" className="button-primary w-full">
            Return to sign in
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <h1>Forgot your password?</h1>
          <p className="auth-description">
            It happens. Enter your account email and we&apos;ll send you a link to reset it.
          </p>
          {error && <FormAlert message={error} />}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="field-label">
                Email address
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                className="field-input"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <button
              id="reset-submit"
              type="submit"
              disabled={loading}
              className="button-primary w-full"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
              {loading ? 'Sending your link…' : 'Send reset link'}
            </button>
          </form>
          <p className="mt-7 text-sm text-center text-secondary">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-brand font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
