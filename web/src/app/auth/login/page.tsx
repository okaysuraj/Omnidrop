'use client';

import { AuthShell } from '@/components/shared/auth-shell';
import { FormAlert } from '@/components/shared/form-alert';
import { useAuth } from '@/providers/auth-provider';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      router.push('/explore');
    } catch {
      /* The auth provider displays the error. */
    }
  };
  return (
    <AuthShell>
      <h1>Welcome back.</h1>
      <p className="auth-description">
        Sign in for your local favorites, saved addresses, and a fresh start to your day.
      </p>
      {error && <FormAlert message={error} onDismiss={clearError} />}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="field-label">
            Email address
          </label>
          <input
            id="login-email"
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
        <div>
          <div className="flex justify-between items-center gap-3 mb-2">
            <label htmlFor="login-password" className="field-label mb-0">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-brand font-bold hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={visible ? 'text' : 'password'}
              autoComplete="current-password"
              className="field-input pr-12"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="icon-button absolute right-1 top-0.5"
              onClick={() => setVisible(!visible)}
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="button-primary w-full mt-2"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-7 text-sm text-center text-secondary">
        New to the neighborhood?{' '}
        <Link href="/auth/register" className="font-bold text-brand hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-xs text-center text-secondary">
        Own a local store?{' '}
        <Link href="/shopkeeper/login" className="font-semibold text-brand hover:underline">
          Visit the merchant portal
        </Link>
      </p>
    </AuthShell>
  );
}
