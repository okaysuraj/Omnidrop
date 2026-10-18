'use client';

import { ArrowRight, Bike, Check, Layers, ShoppingBag, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SectionTag } from './section-tag';

export function StakeholderTabs() {
  const [activeTab, setActiveTab] = useState<'customer' | 'merchant' | 'fleet' | 'ops'>('customer');
  return (
    <section id="matrix" className="border-b-2 border-black bg-[#FAFAF8] py-16 lg:py-20">
      <div className="container-brutal">
        <div className="max-w-xl mb-10">
          <SectionTag variant="black">{'// 02 ECOSYSTEM'}</SectionTag>
          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
            One Engine. Four Stakeholders.
          </h2>
          <p className="font-sans text-neutral-500 text-[15px] font-medium mt-2.5 leading-relaxed">
            Omnidrop provides tailored interfaces linking buyers, neighborhood merchants, fleet
            couriers, and automated operations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-8">
          {[
            { id: 'customer', label: 'Customers', icon: ShoppingBag },
            { id: 'merchant', label: 'Shopkeepers', icon: Store },
            { id: 'fleet', label: 'Courier Fleet', icon: Bike },
            { id: 'ops', label: 'Platform Ops', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`h-12 px-4 border-2 border-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-100 ${
                  isActive
                    ? 'bg-[#FFE600] text-black shadow-[4px_4px_0px_#000]'
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 shadow-[3px_3px_0px_#000]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="border-2 border-black bg-white p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_#000]">
          {activeTab === 'customer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="badge-brutal bg-[#FFE600] text-black">BUYER INTERFACE</span>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
                  Instant Access To Every Real Store On Your Street
                </h3>
                <p className="text-neutral-500 text-[15px] leading-relaxed">
                  Stop ordering stale warehouse products shipped from industrial outskirts. Omnidrop
                  aggregates your true neighborhood artisan bakeries, organic grocers, and 24/7
                  pharmacies with direct shelf transparency.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-tech text-xs">
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Zero price inflation vs. store shelves</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Live 1-tap substitution approvals</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Direct courier GPS coordinates</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Under 20m delivery window guarantee</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link href="/explore" className="btn-brutal-yellow !h-11 !px-6 text-xs font-bold">
                    <span>Browse Stores in Your Area</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#FAFAF8] border-2 border-black p-5 font-tech text-xs space-y-3.5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between border-b-2 border-black pb-2.5 font-bold">
                  <span>CUSTOMER WALLET & TRACKING</span>
                  <span className="text-[#059669]">AUTO-SYNCED</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white p-3 border-2 border-black flex justify-between">
                    <span className="text-neutral-400">ACTIVE DROP</span>
                    <span className="font-bold">#ORD-9021</span>
                  </div>
                  <div className="bg-white p-3 border-2 border-black flex justify-between">
                    <span className="text-neutral-400">SOURCE STORE</span>
                    <span className="font-bold">Ferment & Flour Bakery</span>
                  </div>
                  <div className="bg-white p-3 border-2 border-black flex justify-between">
                    <span className="text-neutral-400">PAYMENT ROUTE</span>
                    <span className="font-bold">Stripe / Apple Pay / Wallet</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'merchant' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="badge-brutal bg-[#00E599] text-black">MERCHANT TERMINAL</span>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
                  Turn Any Local Shop Into A High-Velocity Fulfillment Hub
                </h3>
                <p className="text-neutral-500 text-[15px] leading-relaxed">
                  Local retailers lose 30-40% of their revenue to predatory mega-apps. Omnidrop
                  provides neighborhood merchants with an ultra-lightweight scanner portal,
                  real-time inventory management, and instant same-day settlement.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-tech text-xs">
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>T+0 same-day merchant settlement</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Barcode inventory scanner support</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Flat fair fees: Keep 94% of cart value</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Automated low-stock re-order alerts</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    href="/auth/register"
                    className="btn-brutal-black !h-11 !px-6 text-xs font-bold"
                  >
                    <span>Register As Merchant Partner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#FAFAF8] border-2 border-black p-5 font-tech text-xs space-y-3.5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between border-b-2 border-black pb-2.5 font-bold">
                  <span>{'STORE CONSOLE // LIVE METRICS'}</span>
                  <span className="text-[#059669]">ONLINE</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white p-3 border-2 border-black flex justify-between">
                    <span className="text-neutral-400">ORDERS TODAY</span>
                    <span className="font-bold">64 FULFILLED</span>
                  </div>
                  <div className="bg-white p-3 border-2 border-black flex justify-between">
                    <span className="text-neutral-400">AVG PACK TIME</span>
                    <span className="font-bold text-[#059669]">1m 18s (Grade A)</span>
                  </div>
                  <div className="bg-white p-3 border-2 border-black flex justify-between">
                    <span className="text-neutral-400">DAILY REVENUE</span>
                    <span className="font-bold">$1,480.50 (Settled)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="badge-brutal bg-[#FF4800] text-white">COURIER DISPATCH</span>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
                  Ultra-Short Radii. High Hourly Efficiency. Zero Gimmicks.
                </h3>
                <p className="text-neutral-500 text-[15px] leading-relaxed">
                  Say goodbye to 12-kilometer cross-city slogs. Omnidrop delivery partners operate
                  within hyper-tight 1-2km neighborhood clusters. Fast bike turns, guaranteed
                  tipping transparency, and instant digital wallet payouts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-tech text-xs">
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Max 2.0 km drop radius per dispatch</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Instant in-app wallet cashouts</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>100% of customer tips routed to rider</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Bike & light EV friendly routes</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    href="/auth/register"
                    className="btn-brutal-yellow !h-11 !px-6 text-xs font-bold"
                  >
                    <span>Apply For Courier Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] w-full border-2 border-black overflow-hidden shadow-[4px_4px_0px_#000]">
                <Image
                  src="/hub_courier.jpg"
                  alt="Courier Workstation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                />
                <div className="absolute bottom-3 left-3 bg-black text-white px-2.5 py-1 font-tech text-[10px] font-bold border-2 border-black">
                  HUB FULFILLMENT STATION #04
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ops' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="badge-brutal bg-white text-black">OPERATIONAL TELEMETRY</span>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
                  Autonomous Dispatch & SLA Guardrails
                </h3>
                <p className="text-neutral-500 text-[15px] leading-relaxed">
                  Platform administrators maintain granular control through live geofenced heatmaps,
                  automatic SLA breach rerouting, and real-time fraud arbitration tools.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-tech text-xs">
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Automated courier dispatch arbitration</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Live WebSocket fleet coordinates</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Instant refund & substitution resolution</span>
                  </div>
                  <div className="p-3 border-2 border-black bg-[#FAFAF8] flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                    <span>Store-level stock accuracy scoring</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    href="/auth/login"
                    className="btn-brutal-white !h-11 !px-6 text-xs font-bold"
                  >
                    <span>Access Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0A0A0A] text-white border-2 border-black p-5 font-tech text-xs space-y-3.5 shadow-[4px_4px_0px_#FFE600]">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 font-bold text-[#FFE600]">
                  <span>ADMIN TELEMETRY CORE</span>
                  <span>99.98% UPTIME</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-neutral-900 p-3 border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">ACTIVE DROPS</span>
                    <span className="font-bold text-[#00E599]">1,420 IN-TRANSIT</span>
                  </div>
                  <div className="bg-neutral-900 p-3 border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">SLA BREACHES</span>
                    <span className="font-bold text-white">0.08% (2 CASES)</span>
                  </div>
                  <div className="bg-neutral-900 p-3 border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">HOT ZONES</span>
                    <span className="font-bold text-[#FF4800]">SECTOR 4 & DOWNTOWN</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
