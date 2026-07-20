"use client";

import React from 'react';
import Link from 'next/link';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar */}
      <header className="bg-surface w-full top-0 sticky z-50 flex items-center justify-between px-5 h-16 shadow-sm border-b border-surface-container">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-surface-container-low active:scale-95 transition-transform text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center justify-center bg-secondary-container text-on-secondary-container w-10 h-10 rounded-full overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-extrabold text-2xl text-primary italic tracking-tighter hidden md:block ml-2">OmniDrop</h1>
        </div>
        
        {/* Desktop Top Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/home" className="text-base text-on-surface-variant hover:opacity-80 transition-opacity">Home</Link>
          <Link href="/offers" className="text-base text-on-surface-variant hover:opacity-80 transition-opacity">Offers</Link>
          <Link href="/wallet" className="text-base text-primary font-bold hover:opacity-80 transition-opacity">Wallet</Link>
          <Link href="/support" className="text-base text-on-surface-variant hover:opacity-80 transition-opacity">Support</Link>
          <Link href="/profile" className="text-base text-on-surface-variant hover:opacity-80 transition-opacity">Profile</Link>
        </nav>

        <button className="p-2 -mr-2 rounded-full hover:bg-surface-container-low active:scale-95 transition-transform text-primary relative group">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface group-hover:border-surface-container-low transition-colors"></span>
        </button>
      </header>

      {/* Page Content Canvas */}
      <div className="flex-1 w-full max-w-5xl mx-auto p-5 pb-32 md:pb-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl md:text-3xl text-on-background">Omni Wallet</h2>
        </div>

        {/* Balance Card - Bento Grid style */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Balance Display */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-sm border border-outline-variant/10 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #00e554 0%, transparent 50%)' }}></div>
            <div>
              <p className="text-base text-on-surface-variant mb-2">Available Balance</p>
              <h3 className="font-extrabold text-4xl text-primary-container drop-shadow-sm tracking-tight" style={{ color: '#006e24' }}>$1,240.50</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs">
                  +$45.00 this week
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-0 relative z-10">
              <button className="flex-1 bg-primary-container text-on-primary-fixed font-bold text-base py-3 px-6 rounded-xl shadow-md hover:bg-primary-fixed hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex justify-center items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Add Money
              </button>
              <button className="flex-1 bg-surface-container-high text-on-surface font-bold text-base py-3 px-6 rounded-xl hover:bg-surface-variant hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 border border-surface-variant">
                <span className="material-symbols-outlined">account_balance</span>
                Send to Bank
              </button>
            </div>
          </div>

          {/* Rewards/Secondary Info Tile */}
          <div className="md:col-span-4 bg-on-background text-surface rounded-2xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-container rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <h4 className="font-bold text-xl mb-1 text-white">Omni Rewards</h4>
              <p className="text-sm text-surface-dim">You have 240 points available to redeem.</p>
            </div>
            <button className="mt-6 w-full py-2 rounded-lg border border-surface-dim/30 hover:bg-surface-dim/10 transition-colors font-bold text-xs text-white flex items-center justify-center gap-2">
              Redeem Now
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-4">
          <h3 className="font-bold text-xl text-on-background mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-3 border border-transparent hover:border-primary-container/30 group">
              <div className="w-12 h-12 rounded-full bg-secondary-container group-hover:bg-primary-container/20 transition-colors flex items-center justify-center text-on-secondary-container group-hover:text-primary">
                <span className="material-symbols-outlined">phone_iphone</span>
              </div>
              <span className="font-medium text-xs text-on-surface">Recharge</span>
            </button>
            <button className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-3 border border-transparent hover:border-primary-container/30 group">
              <div className="w-12 h-12 rounded-full bg-secondary-container group-hover:bg-primary-container/20 transition-colors flex items-center justify-center text-on-secondary-container group-hover:text-primary">
                <span className="material-symbols-outlined">redeem</span>
              </div>
              <span className="font-medium text-xs text-on-surface">Vouchers</span>
            </button>
            <button className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-3 border border-transparent hover:border-primary-container/30 group">
              <div className="w-12 h-12 rounded-full bg-secondary-container group-hover:bg-primary-container/20 transition-colors flex items-center justify-center text-on-secondary-container group-hover:text-primary">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <span className="font-medium text-xs text-on-surface">Pay Bills</span>
            </button>
            <button className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-3 border border-transparent hover:border-primary-container/30 group">
              <div className="w-12 h-12 rounded-full bg-secondary-container group-hover:bg-primary-container/20 transition-colors flex items-center justify-center text-on-secondary-container group-hover:text-primary">
                <span className="material-symbols-outlined">history</span>
              </div>
              <span className="font-medium text-xs text-on-surface">History</span>
            </button>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="mt-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-on-background">Recent Transactions</h3>
            <button className="font-bold text-xs text-primary hover:opacity-80 transition-opacity">View All</button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">restaurant</span>
                </div>
                <div>
                  <p className="text-base text-on-surface font-medium">Food Delivery</p>
                  <p className="text-sm text-on-surface-variant">Today, 1:45 PM</p>
                </div>
              </div>
              <p className="text-base text-on-surface font-bold">-$24.50</p>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/30 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <p className="text-base text-on-surface font-medium">Top Up</p>
                  <p className="text-sm text-on-surface-variant">Yesterday, 9:00 AM</p>
                </div>
              </div>
              <p className="text-base text-primary font-bold">+$100.00</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] fixed bottom-0 w-full rounded-t-xl z-50 flex justify-around items-center px-4 py-3 pb-safe">
        <Link href="/home" className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">home</span>
          <span className="font-bold text-[10px] mt-1">Home</span>
        </Link>
        <Link href="/offers" className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">local_offer</span>
          <span className="font-bold text-[10px] mt-1">Offers</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 duration-200">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          <span className="font-bold text-[10px] mt-1">Wallet</span>
        </Link>
        <Link href="/support" className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">support_agent</span>
          <span className="font-bold text-[10px] mt-1">Support</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">person</span>
          <span className="font-bold text-[10px] mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
