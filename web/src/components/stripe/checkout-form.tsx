'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AlertTriangle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface CheckoutFormProps {
  onSuccess?: () => void;
  orderId?: string;
  clientSecret?: string;
}

export function CheckoutForm({ onSuccess, orderId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
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
        return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/orders${orderId ? `/${orderId}` : ''}`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment authorization failed.');
      setLoading(false);
    } else {
      if (onSuccess) {
        onSuccess();
      } else if (orderId) {
        router.push(`/orders/${orderId}`);
      } else {
        router.push('/orders');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
      <div className="p-3 bg-surface border rounded-xl border-line">
        <PaymentElement />
      </div>

      {error && (
        <div className="text-danger text-xs font-sans font-bold p-3 bg-danger-soft border rounded-xl border-danger flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="button-primary !h-12 !w-full font-display font-bold text-xs  tracking-normal flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        <span>{loading ? 'Confirming your payment...' : 'Pay securely'}</span>
      </button>
    </form>
  );
}
