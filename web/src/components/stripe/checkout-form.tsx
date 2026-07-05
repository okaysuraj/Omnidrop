'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe requires a return_url even though we may redirect client-side
        return_url: `${window.location.origin}/orders`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'An unexpected error occurred.');
      setLoading(false);
    } else {
      // Payment successful
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      {error && <div className="text-red-400 text-sm font-semibold p-3 bg-red-900/20 rounded-lg">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing...' : 'Pay & Confirm Order'}
      </button>
    </form>
  );
}
