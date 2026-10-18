'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [wallet, setWallet] = useState<Models.WalletDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('500');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      fetchWallet();
    }
  }, [user, authLoading, router]);

  async function fetchWallet() {
    try {
      const data = await api.wallet.get();
      setWallet(data);
    } catch (err) {
      console.error('Failed to load wallet:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleTopup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amountNum = parseFloat(topupAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid top-up amount greater than zero.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await api.wallet.topup(amountNum, 'Direct Mesh Vault Credit');
      setFeedback({
        type: 'success',
        message: `₹${amountNum.toFixed(2)} successfully credited to your Omni Wallet!`,
      });
      setModalOpen(false);
      await fetchWallet();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err) || 'Failed to top up wallet balance.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const balance = Number(wallet?.balance ?? 0);
  const transactions = wallet?.transactions || [];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// ZERO-LATENCY SETTLEMENT'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Omni Wallet Vault
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Store digital cash balances for instantaneous, 1-click checkout dispatches without
              payment gateway latency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchWallet}
              disabled={refreshing}
              className="btn-brutal-white !h-9 !py-0 !px-3 font-tech text-xs uppercase font-bold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Vault</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                setModalOpen(true);
              }}
              className="btn-brutal-yellow !h-9 !py-0 !px-4 text-xs font-bold uppercase flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Balance</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 border-2 border-black shadow-[4px_4px_0px_#000] font-tech text-xs font-bold flex items-center gap-3 ${
              feedback.type === 'success' ? 'bg-[#00E599] text-black' : 'bg-[#FF4800] text-white'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center font-tech text-xs font-bold flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="uppercase tracking-wider">CONNECTING TO VAULT LEDGER...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Balance Display Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-brutal bg-[#FFE600] p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-black" />
                    <span className="font-tech text-xs font-black uppercase tracking-wider text-black">
                      ACTIVE DIGITAL BALANCE
                    </span>
                  </div>
                  <span className="bg-black text-white font-tech text-[10px] font-bold uppercase px-2 py-0.5">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <div className="font-tech text-xs text-black/70 font-bold uppercase">
                    Available Spend Power
                  </div>
                  <div className="font-tech font-black text-4xl sm:text-5xl text-black tracking-tight mt-1">
                    ₹{balance.toFixed(2)}
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-black flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTopupAmount('200');
                      setModalOpen(true);
                    }}
                    className="btn-brutal-white !h-8 !py-0 !px-2.5 text-xs font-bold uppercase"
                  >
                    +₹200
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTopupAmount('500');
                      setModalOpen(true);
                    }}
                    className="btn-brutal-white !h-8 !py-0 !px-2.5 text-xs font-bold uppercase"
                  >
                    +₹500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTopupAmount('1000');
                      setModalOpen(true);
                    }}
                    className="btn-brutal-white !h-8 !py-0 !px-2.5 text-xs font-bold uppercase"
                  >
                    +₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTopupAmount('2000');
                      setModalOpen(true);
                    }}
                    className="btn-brutal-white !h-8 !py-0 !px-2.5 text-xs font-bold uppercase"
                  >
                    +₹2,000
                  </button>
                </div>
              </div>

              {/* Protocol Features List */}
              <div className="card-brutal bg-white p-5 border-2 border-black shadow-[4px_4px_0px_#000] space-y-3 font-tech text-xs">
                <div className="font-bold uppercase tracking-wider text-neutral-500 border-b-2 border-black pb-2">
                  VAULT PROTOCOL ADVANTAGES
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900">0.0ms Checkout Gate:</strong>
                    <span className="text-neutral-600">
                      Immediate fulfillment without OTP waits or bank failures.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#FF4800] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900">100% Refund Guarantee:</strong>
                    <span className="text-neutral-600">
                      Immediate refund restoration if out-of-stock items occur.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900">Zero Transaction Fees:</strong>
                    <span className="text-neutral-600">
                      No processing overhead or merchant commissions.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Transaction Ledger */}
            <div className="lg:col-span-7 space-y-4">
              <div className="card-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                      Vault Ledger Audit Trail
                    </h3>
                    <p className="font-tech text-xs text-neutral-500">
                      CRYPTOGRAPHIC RECORD OF ALL TRANSIT ACTIONS
                    </p>
                  </div>
                  <span className="badge-brutal bg-neutral-100 text-neutral-800 text-[10px] font-bold">
                    {transactions.length} ENTRIES
                  </span>
                </div>

                {transactions.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Wallet className="w-10 h-10 text-neutral-300 mx-auto" />
                    <div className="font-display font-bold uppercase text-neutral-900">
                      No Prior Vault Movements
                    </div>
                    <p className="font-sans text-xs text-neutral-500 max-w-xs mx-auto">
                      Top up your balance using UPI or cards to activate instant drops.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y-2 divide-black/10">
                    {transactions.map((tx, idx: number) => {
                      const isCredit = tx.type === 'CREDIT' || Number(tx.amount) > 0;
                      return (
                        <div
                          key={tx.id || idx}
                          className="py-3 flex items-center justify-between gap-4 font-tech text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 border-2 border-black flex items-center justify-center font-bold shadow-[2px_2px_0px_#000] ${
                                isCredit ? 'bg-[#00E599] text-black' : 'bg-[#FF4800] text-white'
                              }`}
                            >
                              {isCredit ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900 uppercase">
                                {tx.description ||
                                  (isCredit ? 'Wallet Top-Up Credit' : 'Order Payment Debit')}
                              </div>
                              <div className="text-[10px] text-neutral-500">
                                {tx.createdAt
                                  ? new Date(tx.createdAt).toLocaleString()
                                  : 'Recent Movement'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`font-black text-sm tracking-tight ${
                                isCredit ? 'text-[#059669]' : 'text-neutral-900'
                              }`}
                            >
                              {isCredit ? '+' : '-'}₹{Math.abs(Number(tx.amount)).toFixed(2)}
                            </div>
                            <span className="text-[9px] uppercase font-bold text-neutral-400">
                              {'CONFIRMED'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Topup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="card-brutal bg-white w-full max-w-md p-6 border-2 border-black shadow-[8px_8px_0px_#000] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="font-tech text-[10px] uppercase font-bold text-neutral-500">
                  PROTOCOL SETTLEMENT
                </span>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-900">
                  Add Wallet Balance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#FF4800] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-900 mb-1.5">
                  Top-Up Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-tech font-bold text-base text-neutral-700">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="input-brutal !pl-8 font-tech text-base font-bold"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Quick Select Chips */}
              <div className="grid grid-cols-4 gap-2">
                {['100', '500', '1000', '2000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`py-1.5 border-2 border-black font-tech text-xs uppercase font-bold transition-all ${
                      topupAmount === amt
                        ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                        : 'bg-[#FAFAF8] text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-[#FAFAF8] border-2 border-black font-tech text-[11px] text-neutral-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0" />
                <span>Instant simulated credit for seamless checkout testing.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 btn-brutal-white !h-11 font-tech text-xs uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 btn-brutal-yellow !h-11 font-tech text-xs uppercase font-bold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>CREDITING...</span>
                    </>
                  ) : (
                    <span>CONFIRM DEPOSIT</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BrutalFooter />
    </div>
  );
}
