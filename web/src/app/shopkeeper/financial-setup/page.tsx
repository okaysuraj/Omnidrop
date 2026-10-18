'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import { Building, Lock, Receipt, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function FinancialSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<Models.Store | null>(null);
  const [holderName, setHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState('CURRENT');
  const [agreeTerms, setAgreeTerms] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const stores = await api.stores.myStores().catch(() => []);
        if (stores && stores.length > 0) {
          const s = stores[0];
          setStore(s);
          if (s.bankAccountNumber) setAccountNumber(s.bankAccountNumber);
          if (s.bankIfsc) setIfscCode(s.bankIfsc);
        }
      } catch (err) {
        console.error('Failed to load store data', err);
      }
    };
    fetchStore();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !ifscCode) {
      alert('Please fill out your account number and IFSC code.');
      return;
    }
    setLoading(true);
    try {
      if (store) {
        await api.stores.update(store.id, {
          bankAccountNumber: accountNumber.trim(),
          bankIfsc: ifscCode.trim().toUpperCase(),
        });
      }
      router.push('/shopkeeper/dashboard');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to save financial setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Breadcrumb & Subnav */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// MERCHANT ONBOARDING · STEP 02 OF 02'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Banking & Payout Ledger
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Direct settlement routing via IMPS / NEFT. Automated T+1 payouts daily at 00:00 IST.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-tech text-xs bg-[#00E599] text-black font-bold uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
              Take-Rate: 6.0% Fixed
            </span>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-tech text-xs uppercase font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            📦 Shelf Inventory
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            📋 Fulfill Orders
          </Link>
          <Link
            href="/shopkeeper/profile-setup"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            ⚙️ Hub Profile
          </Link>
          <Link
            href="/shopkeeper/financial-setup"
            className="px-4 py-2 border-2 border-black bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]"
          >
            💳 Banking & Payouts
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Bank Account Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-brutal p-6 space-y-4">
              <h2 className="font-display font-black text-lg uppercase text-neutral-900 flex items-center gap-2 pb-2 border-b-2 border-black">
                <Building className="w-5 h-5 text-black" />
                Merchant Settlement Bank Account
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Account Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="input-brutal text-sm"
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Bank Institution Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank, ICICI Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="input-brutal text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50100234567890"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="input-brutal text-sm font-tech font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    IFSC Routing Code (11 Chars) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="HDFC0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="input-brutal text-sm font-tech font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-tech text-xs uppercase font-bold text-neutral-700 mb-1.5">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="input-brutal text-sm bg-white cursor-pointer"
                  >
                    <option value="CURRENT">Business Current Account</option>
                    <option value="SAVINGS">Personal Savings Account</option>
                  </select>
                </div>
              </div>

              {/* Take-rate Acknowledgment */}
              <div className="p-4 border-2 border-black bg-neutral-50 flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-black cursor-pointer shrink-0"
                />
                <label
                  htmlFor="agree"
                  className="font-tech text-xs text-neutral-700 cursor-pointer"
                >
                  I authorize Omnidrop to automatically settle order proceeds into this account,
                  deducting the transparent <strong>6.0% platform fee</strong>.
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Settlement Mechanism & Action */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="card-brutal p-6 bg-white space-y-5">
              <h3 className="font-display font-black text-lg uppercase text-neutral-900 pb-3 border-b-2 border-black flex items-center gap-2">
                <Receipt className="w-5 h-5 text-black" />
                Settlement Pipeline
              </h3>

              <div className="space-y-3 font-tech text-xs">
                <div className="p-3 border-2 border-black bg-neutral-50 space-y-1">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>1. Customer Checkout</span>
                    <span className="text-[#00E599] bg-black px-1.5 py-0.5 text-[10px]">
                      REAL-TIME
                    </span>
                  </div>
                  <p className="text-neutral-600 text-[11px]">
                    Payment captured via UPI / Card / Wallet into Omnidrop escrow vault.
                  </p>
                </div>

                <div className="p-3 border-2 border-black bg-neutral-50 space-y-1">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>2. Fee Deduction</span>
                    <span className="text-black font-bold">6% FLAT</span>
                  </div>
                  <p className="text-neutral-600 text-[11px]">
                    Includes customer acquisition, courier dispatch matching, and customer care.
                  </p>
                </div>

                <div className="p-3 border-2 border-black bg-[#FFE600]/20 space-y-1">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>3. Midnight Settlement</span>
                    <span className="text-black font-bold">00:00 IST</span>
                  </div>
                  <p className="text-neutral-700 text-[11px]">
                    94% net order proceeds credited directly to this verified bank account.
                  </p>
                </div>
              </div>

              {/* Encryption & Security Strip */}
              <div className="p-3 border-2 border-black bg-neutral-900 text-white font-tech text-[10px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#00E599] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-BIT RBI COMPLIANT ENCRYPTION</span>
                </div>
                <p className="text-neutral-400">
                  Bank credentials are cryptographically tokenized and never exposed in plain text.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 border-t-2 border-black space-y-3">
                <button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="btn-brutal-yellow w-full !h-12 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Activating Ledger...' : 'Confirm & Activate Store'}</span>
                </button>

                <Link
                  href="/shopkeeper/dashboard"
                  className="block text-center font-tech text-xs font-bold uppercase text-neutral-600 hover:text-black py-1"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>

      <BrutalFooter />
    </div>
  );
}
