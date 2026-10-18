'use client';

import { AuthShell } from '@/components/shared/auth-shell';
import { FormAlert } from '@/components/shared/form-alert';
import { useAuth } from '@/providers/auth-provider';
import { ArrowRight, Bike, CheckCircle2, Loader2, ShoppingBag, Store } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const roles = [
  { value: 'CUSTOMER', label: 'Customer', icon: ShoppingBag },
  { value: 'SHOPKEEPER', label: 'Shopkeeper', icon: Store },
  { value: 'DELIVERY_PARTNER', label: 'Courier', icon: Bike },
];

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await register(email, password, fullName, role);
      setRegisteredSuccess(true);
    } catch {
      /* The auth provider displays the error. */
    }
  };
  return (
    <AuthShell>
      {registeredSuccess ? (
        <div role="status">
          <span className="empty-state-icon ml-0">
            <CheckCircle2 size={30} />
          </span>
          <h1>Check your inbox.</h1>
          <p className="auth-description">
            We sent a verification link to <strong className="text-ink">{email}</strong>. Verify
            your email, then sign in to get started.
          </p>
          <Link href="/auth/login" className="button-primary w-full">
            Continue to sign in
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <h1>A little more local.</h1>
          <p className="auth-description mb-6">
            Create your Omnidrop account and find your place in the neighborhood.
          </p>
          {error && <FormAlert message={error} onDismiss={clearError} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset>
              <legend className="field-label">How will you use Omnidrop?</legend>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, icon: Icon }) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      className="peer sr-only"
                      name="role"
                      value={value}
                      checked={role === value}
                      onChange={() => setRole(value)}
                    />
                    <span className="flex flex-col items-center gap-2 border border-line rounded-xl py-3 text-secondary text-xs font-semibold peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:text-brand peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-focus-visible:outline-offset-2">
                      <Icon size={21} />
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="register-name" className="field-label">
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                className="field-input"
                placeholder="Your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="register-email" className="field-label">
                Email address
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="field-label">
                Create a password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="field-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="button-primary w-full mt-2"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
              {loading ? 'Creating your account…' : 'Create account'}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-secondary">
            Already part of the neighborhood?{' '}
            <Link href="/auth/login" className="font-bold text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
