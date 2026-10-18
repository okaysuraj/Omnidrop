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
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
        <BrutalNav />
        <div className="container-brutal py-24 text-center font-tech text-xs font-bold flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="uppercase tracking-wider">RETRIEVING DISPATCH TELEMETRY...</span>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div>
          <Link
            href={`/orders/${orderId}`}
            className="inline-flex items-center gap-1 font-tech text-xs font-bold uppercase underline hover:bg-[#FFE600] px-1.5 py-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Dispatch Manifest</span>
          </Link>
        </div>

        {submitted ? (
          <div className="card-brutal bg-white p-8 border-2 border-black shadow-[8px_8px_0px_#000] text-center space-y-5">
            <div className="w-16 h-16 bg-[#00E599] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-tech text-[10px] uppercase font-bold text-neutral-500">
                {'TELEMETRY SYNCED // QOS: OK'}
              </span>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900 mt-1">
                Fulfillment Review Recorded
              </h2>
              <p className="font-sans text-xs text-neutral-600 mt-2 max-w-md mx-auto font-medium">
                Your rating has been written to the hyperlocal trust graph. Courier and store
                performance metrics have been updated.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/orders"
                className="btn-brutal-white !h-10 !px-5 text-xs font-bold uppercase"
              >
                All Orders
              </Link>
              <Link
                href="/explore"
                className="btn-brutal-yellow !h-10 !px-5 text-xs font-bold uppercase flex items-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="card-brutal bg-white p-6 sm:p-8 border-2 border-black shadow-[8px_8px_0px_#000] space-y-6">
            {/* Header */}
            <div className="border-b-2 border-black pb-4">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-black text-[#FFE600] font-tech text-[10px] font-bold uppercase mb-2">
                {'DEBRIEF // QUALITY ASSURANCE'}
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
                Rate Mission #{orderId?.slice(-8)}
              </h1>
              <p className="font-sans text-xs text-neutral-600 font-medium mt-1">
                Evaluate store packaging precision and courier fulfillment speed.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-[#FF4800] text-white border-2 border-black font-tech text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Order Context Card */}
            {order && (
              <div className="p-4 bg-[#FAFAF8] border-2 border-black flex items-center justify-between gap-4 font-tech text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-black bg-[#FFE600] flex items-center justify-center font-bold">
                    <Store className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 uppercase">
                      {order.store?.name || 'Local Dark Store'}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {order.items?.length || 1} Items · ₹{Number(order.total || 0).toFixed(2)}{' '}
                      Total
                    </div>
                  </div>
                </div>
                <span className="badge-brutal bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase">
                  {order.status}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Section */}
              <div className="space-y-3 text-center p-6 bg-[#FAFAF8] border-2 border-black">
                <span className="font-tech text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  FULFILLMENT SCORE (1 - 5 STARS)
                </span>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 border-2 border-black transition-all ${
                        star <= rating
                          ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] scale-105'
                          : 'bg-white text-neutral-300 hover:text-neutral-400'
                      }`}
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'fill-black text-black' : 'fill-none'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="font-tech text-xs font-black uppercase text-neutral-900 tracking-wider">
                  {RATING_LABELS[rating - 1]}
                </div>
              </div>

              {/* Quality Tags */}
              <div className="space-y-2">
                <label className="block font-tech text-xs uppercase font-bold text-neutral-900">
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
                        className={`px-3 py-1.5 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                          isSelected
                            ? 'bg-black text-white shadow-[2px_2px_0px_#FFE600]'
                            : 'bg-white text-neutral-800 hover:bg-[#FAFAF8]'
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
                <label className="block font-tech text-xs uppercase font-bold text-neutral-900">
                  Optional Debrief Notes
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Notes on packaging, courier handling, or item freshness..."
                  className="input-brutal text-xs resize-none"
                />
              </div>

              <div className="p-3 bg-[#FAFAF8] border-2 border-black font-tech text-[11px] text-neutral-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Verified feedback helps maintain 99.8% courier and store SLA standards.</span>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-brutal-yellow !h-12 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>TRANSMITTING REVIEW...</span>
                    </>
                  ) : (
                    <span>CONFIRM & TRANSMIT DEBRIEF</span>
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
