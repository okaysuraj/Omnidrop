import { ArrowRight, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="border-b-2 border-black bg-brutal-grid py-14 lg:py-20">
      <div className="container-brutal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_#FFE600]">
              <span className="w-2 h-2 rounded-full bg-[#FFE600]" />
              <span className="font-tech text-[11px] tracking-wider uppercase font-bold">
                AUTONOMOUS HYPERLOCAL ENGINE
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] uppercase tracking-tight leading-[1.05] text-[#0A0A0A]">
              Neighborhood commerce.
              <br />
              <span className="bg-[#FFE600] px-3 py-1 border-2 border-black inline-block my-1.5 shadow-[4px_4px_0px_#000]">
                Dispatched in 4m.
              </span>
              <br />
              At your door in 18.
            </h1>

            {/* Subcopy */}
            <p className="font-sans text-[15px] sm:text-base text-neutral-500 max-w-[520px] leading-[1.7] font-medium">
              Direct connection to verified dark stores, artisan bakeries, and pharmacies within 1.2
              km. Zero shelf markups. Live telemetry from tote seal to doorstep.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/explore"
                className="btn-brutal-yellow !h-12 !py-0 !px-7 text-sm font-bold flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Start Live Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#simulator"
                className="btn-brutal-white !h-12 !py-0 !px-6 text-sm font-bold flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Simulate Route</span>
              </a>
            </div>

            {/* Operational Metric Tiles — 2 cols mobile, 4 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white border-2 border-black p-3 sm:p-4 shadow-[3px_3px_0px_#000] text-center">
                <div className="font-tech font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight leading-none">
                  17.4m
                </div>
                <div className="font-tech text-[10px] uppercase tracking-wider text-neutral-400 font-bold mt-2">
                  Median Drop
                </div>
              </div>

              <div className="bg-white border-2 border-black p-3 sm:p-4 shadow-[3px_3px_0px_#000] text-center">
                <div className="font-tech font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight leading-none">
                  0.85km
                </div>
                <div className="font-tech text-[10px] uppercase tracking-wider text-neutral-400 font-bold mt-2">
                  Hub Radius
                </div>
              </div>

              <div className="bg-white border-2 border-black p-3 sm:p-4 shadow-[3px_3px_0px_#000] text-center">
                <div className="font-tech font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight leading-none">
                  99.8%
                </div>
                <div className="font-tech text-[10px] uppercase tracking-wider text-neutral-400 font-bold mt-2">
                  On-Time SLA
                </div>
              </div>

              <div className="bg-white border-2 border-black p-3 sm:p-4 shadow-[3px_3px_0px_#000] text-center">
                <div className="font-tech font-black text-xl sm:text-2xl text-[#059669] tracking-tight leading-none">
                  $0.00
                </div>
                <div className="font-tech text-[10px] uppercase tracking-wider text-neutral-400 font-bold mt-2">
                  Shelf Markup
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Column — Editorial hero card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="bg-white border-2 border-black p-4 shadow-[6px_6px_0px_#000]">
                {/* Top Chrome Bar */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-3 px-1 font-tech text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#FF4800] inline-block" />
                    <span>MANIFEST #8841-A</span>
                  </span>
                  <span className="bg-[#FFE600] px-2 py-0.5 border-2 border-black text-[10px] font-bold shadow-[1px_1px_0px_#000]">
                    VERIFIED PACK
                  </span>
                </div>

                {/* Editorial Photo */}
                <div className="relative aspect-[4/3] w-full border-2 border-black overflow-hidden bg-neutral-100">
                  <Image
                    src="/hero_essentials.jpg"
                    alt="Omnidrop Fresh Essentials Tote"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                  <div className="absolute top-3 left-3 bg-black text-white font-tech text-[10px] px-2.5 py-1 tracking-wider font-bold uppercase">
                    {'MICRO-HUB #04 // ACCREDITED'}
                  </div>
                </div>

                {/* Telemetry Strip */}
                <div className="mt-3 p-3.5 bg-[#FAFAF8] border-2 border-black font-tech text-xs space-y-2.5">
                  <div className="flex items-center justify-between font-bold border-b border-black/10 pb-2">
                    <span className="text-[#0A0A0A]">SECTOR 4 DISPATCH</span>
                    <span className="text-[#059669] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00E599] inline-block animate-pulse" />
                      IN TRANSIT
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                        Courier
                      </span>
                      <span className="font-bold">#41 (Bike)</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                        Distance
                      </span>
                      <span className="font-bold">0.72 km</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                        Doorstep
                      </span>
                      <span className="font-bold text-[#FF4800]">5m 12s left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 -left-3 bg-[#FFE600] border-2 border-black px-3.5 py-2 shadow-[3px_3px_0px_#000] font-tech text-[11px] font-bold uppercase tracking-wider hidden sm:block">
                ⚡ 90-SEC TOTE PACKING SLA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GetStarted() {
  return (
    <section className="bg-[#0A0A0A] text-white border-b-2 border-black py-20 lg:py-24 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container-brutal text-center flex flex-col items-center relative z-10">
        <div className="inline-block px-3.5 py-1.5 bg-transparent text-[#FFE600] font-tech text-xs uppercase font-bold tracking-widest border-2 border-[#FFE600] mb-5 shadow-[2px_2px_0px_#FFE600]">
          {'// JOIN THE HYPERLOCAL REVOLUTION'}
        </div>

        <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight max-w-2xl mx-auto leading-[1.08] text-white">
          Ready for groceries delivered in under 20 minutes?
        </h2>

        <p className="font-sans text-neutral-400 text-[15px] sm:text-base max-w-[500px] w-full mx-auto font-medium mt-4 leading-relaxed">
          Explore verified stores in your quadrant or register your business on the Omnidrop network
          today.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/explore"
            className="btn-brutal-yellow !h-12 !py-0 !px-7 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <span>Explore All Local Stores</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/auth/register"
            className="h-12 px-7 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-white text-white hover:bg-white/10 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-100 shadow-[3px_3px_0px_#FFF] flex items-center justify-center"
          >
            <span>Create Free Account</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
