'use client';

import { AuthShell } from '@/components/shared/auth-shell';
import { FormAlert } from '@/components/shared/form-alert';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function ShopkeeperLogin() {
  const router = useRouter();
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLocalError('');
    clearError();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        router.push('/shopkeeper/dashboard');
      } else {
        await register(
          email,
          password,
          (firstName + ' ' + lastName).trim() || storeName,
          'SHOPKEEPER',
        );
        setSignupSuccess(true);
      }
    } catch (failure) {
      setLocalError(getErrorMessage(failure) || 'Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthShell>
      <div className="flex gap-2 p-1.5 bg-canvas border border-line rounded-xl mb-7">
        <button
          type="button"
          className="filter-pill flex-1 rounded-lg border-0"
          aria-pressed={isLogin}
          onClick={() => {
            setIsLogin(true);
            setLocalError('');
            clearError();
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          className="filter-pill flex-1 rounded-lg border-0"
          aria-pressed={!isLogin}
          onClick={() => {
            setIsLogin(false);
            setLocalError('');
            clearError();
          }}
        >
          Onboard Store
        </button>
      </div>
      <h1>{isLogin ? 'Welcome, shopkeeper.' : 'Grow your local store.'}</h1>
      <p className="auth-description">
        {isLogin
          ? 'Sign in to manage your products, prepare orders, and keep your neighborhood stocked.'
          : 'Create your merchant account. Once your email is verified, you can complete your store profile.'}
      </p>
      {(localError || error) && (
        <FormAlert
          message={localError || error || ''}
          onDismiss={() => {
            setLocalError('');
            clearError();
          }}
        />
      )}
      {signupSuccess ? (
        <div role="status" className="rounded-2xl bg-brand-soft p-6">
          <CheckCircle2 size={28} className="text-brand" />
          <h2 className="font-bold text-lg mt-4">Check your inbox.</h2>
          <p className="text-sm text-secondary mt-2 leading-7">
            We sent a verification email to {email}. Verify your email before signing in, then add
            your store details.
          </p>
          <button
            type="button"
            className="button-primary mt-5"
            onClick={() => {
              setIsLogin(true);
              setSignupSuccess(false);
            }}
          >
            Continue to sign in
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="merchant-first-name" className="field-label">
                    First name
                  </label>
                  <input
                    id="merchant-first-name"
                    name="given-name"
                    autoComplete="given-name"
                    className="field-input"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="merchant-last-name" className="field-label">
                    Last name
                  </label>
                  <input
                    id="merchant-last-name"
                    name="family-name"
                    autoComplete="family-name"
                    className="field-input"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="merchant-store-name" className="field-label">
                  Store name
                </label>
                <input
                  id="merchant-store-name"
                  name="organization"
                  autoComplete="organization"
                  className="field-input"
                  placeholder="Your neighborhood store"
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="merchant-email" className="field-label">
              Business email
            </label>
            <input
              id="merchant-email"
              name="email"
              type="email"
              autoComplete="email"
              className="field-input"
              placeholder="you@yourstore.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="merchant-password" className="field-label">
              Password
            </label>
            <input
              id="merchant-password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={6}
              className="field-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="button-primary w-full mt-2">
            {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
            {loading
              ? 'Please wait…'
              : isLogin
                ? 'Open merchant dashboard'
                : 'Create merchant account'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
