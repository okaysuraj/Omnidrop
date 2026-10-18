'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Star,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const RATING_LABELS = [
  'UNACCEPTABLE (1/5)',
  'SUBPAR (2/5)',
  'NOMINAL (3/5)',
  'EXCELLENT (4/5)',
  'FLAWLESS (5/5)',
];

const QUALITY_TAGS = [
  'DISPATCH SPEED',
  'PACKAGING INTEGRITY',
  'TEMPERATURE',
  'FRESHNESS',
  'COURIER COURTESY',
  'PORTION ACCURACY',
];

export default function OrderReviewPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Models.Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'DISPATCH SPEED',
    'PACKAGING INTEGRITY',
  ]);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const data = await api.orders.getById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setSubmitting(true);
    setError(null);
    try {
      const combinedComment = `${selectedTags.join(', ')}${comments ? ` - ${comments}` : ''}`;
      await api.reviews.create({
        orderId,
        storeRating: rating,
        riderRating: rating,
        comment: combinedComment,
      });
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err) || 'Could not record fulfillment review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-canvas flex flex-col">
        <BrutalNav />
        <div className="site-container py-24 text-center font-sans text-xs font-bold flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ink" />
          <span className=" tracking-normal">Retrieving dispatch telemetry...</span>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8 max-w-2xl mx-auto"
      >
        {/* Breadcrumb */}
        <div>
          <Link
            href={`/orders/${orderId}`}
            className="inline-flex items-center gap-1 font-sans text-xs font-bold  underline hover:bg-brand-soft px-1.5 py-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Dispatch Manifest</span>
          </Link>
        </div>

        {submitted ? (
          <div className="surface-card bg-surface p-8 border rounded-xl border-line  text-center space-y-5">
            <div className="w-16 h-16 bg-brand-soft text-ink border rounded-xl border-line  flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-sans text-xs  font-bold text-secondary">
                {'Your feedback matters'}
              </span>
              <h2 className="font-display font-bold text-2xl  tracking-tight text-ink mt-1">
                Fulfillment Review Recorded
              </h2>
              <p className="font-sans text-xs text-secondary mt-2 max-w-md mx-auto font-medium">
                Your rating has been written to the hyperlocal trust graph. Courier and store
                performance metrics have been updated.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link href="/orders" className="button-secondary !h-10 !px-5 text-xs font-bold ">
                All Orders
              </Link>
              <Link
                href="/explore"
                className="button-primary !h-10 !px-5 text-xs font-bold  flex items-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="surface-card bg-surface p-6 sm:p-8 border rounded-xl border-line  space-y-6">
            {/* Header */}
            <div className="border-b border-line pb-4">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-muted text-brand font-sans text-xs font-bold  mb-2">
                {'DEBRIEF // QUALITY ASSURANCE'}
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl  tracking-tight text-ink">
                Review your order #{orderId?.slice(-8)}
              </h1>
              <p className="font-sans text-xs text-secondary font-medium mt-1">
                Evaluate store packaging precision and courier fulfillment speed.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-danger-soft text-ink border rounded-xl border-line font-sans text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Order Context Card */}
            {order && (
              <div className="p-4 bg-canvas border rounded-xl border-line flex items-center justify-between gap-4 font-sans text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border rounded-xl border-line bg-brand-soft flex items-center justify-center font-bold">
                    <Store className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <div className="font-bold text-ink ">
                      {order.store?.name || 'Local Dark Store'}
                    </div>
                    <div className="text-xs text-secondary">
                      {order.items?.length || 1} Items · ₹{Number(order.total || 0).toFixed(2)}{' '}
                      Total
                    </div>
                  </div>
                </div>
                <span className="status-badge bg-muted text-ink text-xs font-bold ">
                  {order.status}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Section */}
              <div className="space-y-3 text-center p-6 bg-canvas border rounded-xl border-line">
                <span className="font-sans text-xs text-secondary font-bold  tracking-normal block">
                  Fulfillment score (1 - 5 stars)
                </span>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 border rounded-xl border-line transition-all ${
                        star <= rating
                          ? 'bg-brand-soft text-ink  scale-105'
                          : 'bg-surface text-secondary hover:text-secondary'
                      }`}
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'fill-black text-ink' : 'fill-none'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="font-sans text-xs font-bold  text-ink tracking-normal">
                  {RATING_LABELS[rating - 1]}
                </div>
              </div>

              {/* Quality Tags */}
              <div className="space-y-2">
                <label className="block font-sans text-xs  font-bold text-ink">
                  Mission Quality Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUALITY_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 border rounded-xl border-line font-sans text-xs  font-bold transition-all ${
                          isSelected ? 'bg-muted text-ink ' : 'bg-surface text-ink hover:bg-canvas'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Comments */}
              <div className="space-y-1.5">
                <label
                  htmlFor="field-orders-id-review-page-1"
                  className="block font-sans text-xs  font-bold text-ink"
                >
                  Optional Debrief Notes
                </label>
                <textarea
                  id="field-orders-id-review-page-1"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Notes on packaging, courier handling, or item freshness..."
                  className="field-input text-xs resize-none"
                />
              </div>

              <div className="p-3 bg-canvas border rounded-xl border-line font-sans text-xs text-secondary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0" />
                <span>Your review helps local stores and delivery partners improve.</span>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full button-primary !h-12 font-bold text-xs  tracking-normal flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting review...</span>
                    </>
                  ) : (
                    <span>Confirm & transmit debrief</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
