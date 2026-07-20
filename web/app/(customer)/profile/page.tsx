"use client";

import React from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      <header className="w-full sticky top-0 bg-background flex items-center justify-between px-5 py-4 z-50">
        <div className="flex items-center gap-4">
          <Link href="/home" className="active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <h1 className="font-bold text-xl text-on-background">Account</h1>
        </div>
        <button className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity">more_vert</button>
      </header>

      <main className="flex-grow px-5 pb-32 max-w-lg mx-auto w-full">
        {/* Hero Profile Section */}
        <section className="py-10 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-fixed-dim">
              <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-surface-container-high">
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="Profile" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:brightness-110">
              <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>edit</span>
            </button>
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-2xl text-on-background">Alex Rivers</h2>
            <p className="text-sm text-on-surface-variant mt-1">alex.rivers@omnidrop.com</p>
          </div>
        </section>

        {/* Bento Grid Navigation */}
        <div className="grid grid-cols-2 gap-4">
          {/* My Orders */}
          <Link href="/orders" className="col-span-2 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between hover:scale-[0.98] transition-transform active:scale-95">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
              </div>
              <div>
                <span className="font-bold text-xl block text-on-surface">My Orders</span>
                <span className="text-xs text-primary font-bold">2 Active Deliveries</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </Link>

          {/* Saved Addresses */}
          <Link href="/addresses" className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between aspect-square hover:scale-[0.98] transition-transform active:scale-95">
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">location_on</span>
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant block mb-1">Addresses</span>
              <span className="font-bold text-xl block leading-tight text-on-surface">Saved Places</span>
            </div>
          </Link>

          {/* Payment Methods */}
          <Link href="/wallet" className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between aspect-square hover:scale-[0.98] transition-transform active:scale-95">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container">payments</span>
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant block mb-1">Payments</span>
              <span className="font-bold text-xl block leading-tight text-on-surface">Wallet & Cards</span>
            </div>
          </Link>

          {/* Language */}
          <div className="col-span-2 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between hover:scale-[0.98] transition-transform cursor-pointer active:scale-95">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface">language</span>
              </div>
              <span className="font-bold text-lg text-on-surface">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface-variant">English (US)</span>
              <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
            </div>
          </div>

          {/* Settings */}
          <div className="col-span-2 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center justify-between hover:scale-[0.98] transition-transform cursor-pointer active:scale-95">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface">settings</span>
              </div>
              <span className="font-bold text-lg text-on-surface">Settings</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-16">
          <button className="w-full py-4 px-4 rounded-xl border-2 border-error/20 text-error font-bold text-xl flex items-center justify-center gap-2 active:bg-error/5 transition-colors hover:bg-error/10">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
          <p className="mt-6 text-center text-xs text-on-surface-variant opacity-50 font-medium">OmniDrop v2.4.0</p>
        </div>
      </main>
    </div>
  );
}
