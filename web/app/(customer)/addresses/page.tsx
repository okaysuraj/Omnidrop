"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SavedAddressesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 bg-background z-40 flex items-center justify-between px-5 py-4 border-b border-surface-container">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="active:scale-95 transition-transform text-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-bold text-xl text-primary">Saved Addresses</h1>
        </div>
        <Link href="/profile" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:opacity-80">
          <span className="material-symbols-outlined text-on-surface-variant">person</span>
        </Link>
      </header>

      <main className="flex-grow px-5 pt-8 pb-32 max-w-2xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="font-extrabold text-2xl text-on-background mb-2">Saved Addresses</h2>
          <p className="text-base text-on-surface-variant opacity-80">Quickly select your delivery destination</p>
        </div>

        {/* Address List (Bento-style Cards) */}
        <div className="grid grid-cols-1 gap-4">
          {/* Home Address */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex items-start gap-4 border border-transparent hover:border-primary-fixed transition-colors duration-300 shadow-sm cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-primary uppercase tracking-wider">Home</span>
                <button className="text-on-surface-variant hover:text-primary transition-colors p-1" onClick={(e) => { e.stopPropagation(); /* edit action */ }}>
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <p className="font-bold text-xl text-on-surface mt-1">1248 Oakwood Avenue</p>
              <p className="text-sm text-on-surface-variant mt-1">Los Angeles, CA 90024</p>
            </div>
          </div>

          {/* Work Address */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex items-start gap-4 border border-transparent hover:border-primary-fixed transition-colors duration-300 shadow-sm cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-secondary uppercase tracking-wider">Work</span>
                <button className="text-on-surface-variant hover:text-primary transition-colors p-1" onClick={(e) => { e.stopPropagation(); /* edit action */ }}>
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <p className="font-bold text-xl text-on-surface mt-1">Tech Park Plaza, Ste 402</p>
              <p className="text-sm text-on-surface-variant mt-1">Santa Monica, CA 90401</p>
            </div>
          </div>

          {/* Other Address */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex items-start gap-4 border border-transparent hover:border-primary-fixed transition-colors duration-300 shadow-sm cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-tertiary uppercase tracking-wider">Other (Gym)</span>
                <button className="text-on-surface-variant hover:text-primary transition-colors p-1" onClick={(e) => { e.stopPropagation(); /* edit action */ }}>
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <p className="font-bold text-xl text-on-surface mt-1">77 Sunset Blvd</p>
              <p className="text-sm text-on-surface-variant mt-1">West Hollywood, CA 90046</p>
            </div>
          </div>
        </div>

        {/* Decorative Map Section */}
        <div className="mt-10 rounded-2xl overflow-hidden h-48 relative border border-surface-container-high shadow-sm">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></div>
            <span className="font-medium text-xs text-on-surface">3 Locations Saved</span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Component (Action Shell) */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-end items-center px-5 py-6 bg-surface shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-xl md:static md:bg-transparent md:shadow-none md:max-w-2xl md:mx-auto">
        <button className="flex items-center justify-center bg-primary text-on-primary rounded-full w-full py-4 px-6 gap-4 font-bold text-sm uppercase tracking-widest active:scale-95 hover:brightness-110 duration-200 shadow-lg">
          <span>Add New Address</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </nav>
    </div>
  );
}
