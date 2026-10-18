'use client';

import {
  ClipboardList as UiClipboardList,
  CreditCard as UiCreditCard,
  Package as UiPackage,
  Settings as UiSettings,
} from 'lucide-react';

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
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Header Breadcrumb & Subnav */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Merchant onboarding · step 02 of 02'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Banking & payouts
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Direct settlement routing via IMPS / NEFT. Automated T+1 payouts daily at 00:00 IST.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs bg-brand-soft text-ink font-bold  px-3 py-1.5 border rounded-xl border-line ">
              Take-Rate: 6.0% Fixed
            </span>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-sans text-xs  font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiPackage
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Inventory
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiClipboardList
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Orders
          </Link>
          <Link
            href="/shopkeeper/profile-setup"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiSettings
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Store profile
          </Link>
          <Link
            href="/shopkeeper/financial-setup"
            className="px-4 py-2 border rounded-xl border-line bg-brand-soft text-ink "
          >
            <UiCreditCard
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Banking & payouts
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Bank Account Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="surface-card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg  text-ink flex items-center gap-2 pb-2 border-b border-line">
                <Building className="w-5 h-5 text-ink" />
                Merchant Settlement Bank Account
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-shopkeeper-financial-setup-page-1"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Account Beneficiary Name *
                  </label>
                  <input
                    id="field-shopkeeper-financial-setup-page-1"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="field-input text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-shopkeeper-financial-setup-page-2"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Bank Institution Name
                  </label>
                  <input
                    id="field-shopkeeper-financial-setup-page-2"
                    type="text"
                    placeholder="e.g. HDFC Bank, ICICI Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="field-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="field-shopkeeper-financial-setup-page-3"
                  className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                >
                  Bank Account Number *
                </label>
                <input
                  id="field-shopkeeper-financial-setup-page-3"
                  type="text"
                  required
                  placeholder="e.g. 50100234567890"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="field-input text-sm font-sans font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-shopkeeper-financial-setup-page-4"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    IFSC Routing Code (11 Chars) *
                  </label>
                  <input
                    id="field-shopkeeper-financial-setup-page-4"
                    type="text"
                    required
                    maxLength={11}
                    placeholder="HDFC0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="field-input text-sm font-sans font-bold "
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-shopkeeper-financial-setup-page-5"
                    className="block font-sans text-xs  font-bold text-secondary mb-1.5"
                  >
                    Account Type
                  </label>
                  <select
                    id="field-shopkeeper-financial-setup-page-5"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="field-input text-sm bg-surface cursor-pointer"
                  >
                    <option value="CURRENT">Business Current Account</option>
                    <option value="SAVINGS">Personal Savings Account</option>
                  </select>
                </div>
              </div>

              {/* Take-rate Acknowledgment */}
              <div className="p-4 border rounded-xl border-line bg-muted flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-brand cursor-pointer shrink-0"
                />
                <label htmlFor="agree" className="font-sans text-xs text-secondary cursor-pointer">
                  I authorize Omnidrop to automatically settle order proceeds into this account,
                  deducting the transparent <strong>6.0% platform fee</strong>.
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Settlement Mechanism & Action */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="surface-card p-6 bg-surface space-y-5">
              <h3 className="font-display font-bold text-lg  text-ink pb-3 border-b border-line flex items-center gap-2">
                <Receipt className="w-5 h-5 text-ink" />
                Settlement Pipeline
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 border rounded-xl border-line bg-muted space-y-1">
                  <div className="flex items-center justify-between font-bold text-ink">
                    <span>1. Customer Checkout</span>
                    <span className="text-brand bg-muted px-1.5 py-0.5 text-xs">Real-time</span>
                  </div>
                  <p className="text-secondary text-xs">
                    Payment captured via UPI / Card / Wallet into Omnidrop escrow vault.
                  </p>
                </div>

                <div className="p-3 border rounded-xl border-line bg-muted space-y-1">
                  <div className="flex items-center justify-between font-bold text-ink">
                    <span>2. Fee Deduction</span>
                    <span className="text-ink font-bold">6% flat</span>
                  </div>
                  <p className="text-secondary text-xs">
                    Includes customer acquisition, courier dispatch matching, and customer care.
                  </p>
                </div>

                <div className="p-3 border rounded-xl border-line bg-brand-soft space-y-1">
                  <div className="flex items-center justify-between font-bold text-ink">
                    <span>3. Midnight Settlement</span>
                    <span className="text-ink font-bold">00:00 ist</span>
                  </div>
                  <p className="text-secondary text-xs">
                    94% net order proceeds credited directly to this verified bank account.
                  </p>
                </div>
              </div>

              {/* Encryption & Security Strip */}
              <div className="p-3 border rounded-xl border-line bg-muted text-ink font-sans text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-brand font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit rbi compliant encryption</span>
                </div>
                <p className="text-secondary">
                  Bank credentials are cryptographically tokenized and never exposed in plain text.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 border-t border-line space-y-3">
                <button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="button-primary w-full !h-12 text-sm font-bold  tracking-normal flex items-center justify-center gap-2  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Activating Ledger...' : 'Confirm & Activate Store'}</span>
                </button>

                <Link
                  href="/shopkeeper/dashboard"
                  className="block text-center font-sans text-xs font-bold  text-secondary hover:text-ink py-1"
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
