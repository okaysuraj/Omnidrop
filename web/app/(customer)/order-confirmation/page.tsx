"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderConfirmationPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <main className="flex-1 flex flex-col items-center justify-center p-5 md:px-auto w-full max-w-lg mx-auto relative overflow-hidden">
        {/* Decorative subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/20 via-surface to-surface -z-10 pointer-events-none rounded-full blur-3xl"></div>
        
        {/* Animated Checkmark Core */}
        <div className="relative mb-10 animate-[scaleInElastic_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary-container flex items-center justify-center animate-[pulseRing_2s_infinite_cubic-bezier(0.66,0,0,1)] shadow-lg shadow-primary-container/30">
            <span className="material-symbols-outlined text-[64px] md:text-[80px] text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          {/* Speed spark elements */}
          <span className="material-symbols-outlined absolute -top-4 right-0 text-primary-fixed text-[32px] rotate-12 drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
          <span className="material-symbols-outlined absolute bottom-4 -left-6 text-primary-fixed text-[24px] -rotate-12 drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
        </div>

        {/* Typography */}
        <div className="text-center mb-16 w-full px-4 animate-[slideUpFade_0.5s_ease-out_0.2s_forwards] opacity-0">
          <h1 className="font-bold text-2xl md:font-extrabold md:text-4xl text-primary mb-2 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-lg text-on-surface-variant">
            Order <span className="font-bold text-xs text-on-surface bg-surface-container-high px-2 py-1 rounded-md ml-1">#OMNI-8924</span> is locked in.
          </p>
        </div>

        {/* Bento Grid Info Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-surface-container p-6 mb-16 animate-[slideUpFade_0.5s_ease-out_0.4s_forwards] opacity-0 relative overflow-hidden">
          {/* Subtle gradient slice indicating speed */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary-container"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[28px]">timer</span>
              </div>
              <div>
                <h2 className="font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-1">Estimated Delivery</h2>
                <p className="font-bold text-2xl md:text-3xl text-on-surface flex items-baseline gap-1">
                  12–18 <span className="text-sm text-on-surface-variant font-normal">mins</span>
                </p>
              </div>
            </div>
          </div>
          
          <hr className="border-surface-container mb-6"/>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-xs text-on-surface">Preparing at <span className="font-bold">Downtown Hub</span></p>
              <div className="w-full h-1.5 bg-surface-container mt-2 rounded-full overflow-hidden">
                {/* Indeterminate progress pulse */}
                <div className="h-full bg-primary w-1/3 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] relative">
                  <div className="absolute top-0 right-0 w-4 h-full bg-white/40 blur-[2px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4 animate-[slideUpFade_0.5s_ease-out_0.6s_forwards] opacity-0">
          <Link href="/tracking" className="w-full bg-primary text-on-primary font-bold text-xl py-4 px-6 rounded-xl shadow-md hover:bg-on-primary-container hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2">
              Track Order
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
            {/* Hover highlight effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] pointer-events-none"></div>
          </Link>
          <Link href="/home" className="w-full text-center bg-transparent text-on-surface-variant font-bold text-xl py-3 px-6 rounded-xl hover:bg-surface-container hover:text-on-surface transition-colors active:scale-[0.98]">
            Back to Home
          </Link>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleInElastic {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulseRing {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 95, 0.5); }
            70% { box-shadow: 0 0 0 30px rgba(0, 255, 95, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 95, 0); }
        }

        @keyframes slideUpFade {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
