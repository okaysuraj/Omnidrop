import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function SystemStatus() {
  return (
    <aside
      aria-label="System Status"
      className="border-b-2 border-black bg-[#0A0A0A] text-white py-2 font-tech text-[11px] tracking-wider select-none"
    >
      <div className="container-brutal flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#00E599] inline-block animate-pulse" />
          <span className="font-bold text-[#00E599]">SYSTEM NOMINAL</span>
          <span className="text-white/30 hidden sm:inline">│</span>
          <span className="text-white/70 hidden sm:inline">38/38 MICRO-HUBS OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-4 text-white/60">
          <span>
            MEDIAN DROP: <strong className="text-white font-bold">17.4 MIN</strong>
          </span>
          <span className="hidden md:inline text-white/30">│</span>
          <span className="hidden md:inline">
            SLA: <strong className="text-white font-bold">99.8%</strong>
          </span>
          <span className="hidden lg:inline text-white/30">│</span>
          <span className="hidden lg:inline text-[#FFE600] font-bold">ZERO SHELF MARKUP</span>
        </div>
      </div>
    </aside>
  );
}

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
      <div className="container-brutal h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-display font-extrabold text-base border-2 border-black shadow-[2px_2px_0px_#FFE600] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all duration-150">
            ⚡
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg tracking-tight uppercase leading-none">
              OMNIDROP
            </span>
            <span className="font-tech text-[10px] text-neutral-400 font-bold uppercase">v2.4</span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 font-display text-[13px] tracking-wide uppercase font-bold text-neutral-600">
          <a
            href="#simulator"
            className="hover:text-black hover:underline decoration-2 decoration-[#FFE600] underline-offset-4 transition-all duration-150"
          >
            Simulator
          </a>
          <a
            href="#matrix"
            className="hover:text-black hover:underline decoration-2 decoration-[#FFE600] underline-offset-4 transition-all duration-150"
          >
            Ecosystem
          </a>
          <a
            href="#catalog"
            className="hover:text-black hover:underline decoration-2 decoration-[#FFE600] underline-offset-4 transition-all duration-150"
          >
            Live Shelf
          </a>
          <a
            href="#protocol"
            className="hover:text-black hover:underline decoration-2 decoration-[#FFE600] underline-offset-4 transition-all duration-150"
          >
            Protocol
          </a>
          <a
            href="#faq"
            className="hover:text-black hover:underline decoration-2 decoration-[#FFE600] underline-offset-4 transition-all duration-150"
          >
            Specs
          </a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="h-9 px-4 font-display font-bold text-xs uppercase tracking-wider border-2 border-black bg-white hover:bg-neutral-50 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] flex items-center justify-center whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/explore"
            className="btn-brutal-yellow !h-9 !py-0 !px-4 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Explore Stores</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-neutral-400 pt-14 pb-8 font-tech text-xs border-t-2 border-black">
      <div className="container-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-neutral-800">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#FFE600] text-black flex items-center justify-center font-display font-extrabold text-base border-2 border-black shadow-[2px_2px_0px_#FFE600]">
                ⚡
              </div>
              <span className="font-display font-black text-lg tracking-tight uppercase text-white">
                OMNIDROP
              </span>
            </div>
            <p className="text-neutral-400 font-sans text-[13px] leading-relaxed max-w-[360px]">
              Autonomous hyperlocal dispatch architecture connecting neighborhood merchants, dark
              stores, and bike fleets under a guaranteed 20-minute SLA.
            </p>
            <div className="pt-1 text-[11px] text-[#00E599] flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E599] inline-block" />
              <span>STATUS: ALL QUADRANTS OPERATIONAL</span>
            </div>
          </div>

          {/* Portals Column */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="font-bold uppercase text-[11px] mb-3 tracking-wider text-[#FFE600]">
              {'// PORTALS'}
            </div>
            <ul className="space-y-2.5 text-neutral-300">
              <li>
                <Link
                  href="/explore"
                  className="hover:text-[#FFE600] transition-colors duration-150 flex items-center gap-1.5"
                >
                  <span>Customer Marketplace</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/shopkeeper/dashboard"
                  className="hover:text-[#FFE600] transition-colors duration-150 flex items-center gap-1.5"
                >
                  <span>Merchant Console</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery/dashboard"
                  className="hover:text-[#FFE600] transition-colors duration-150 flex items-center gap-1.5"
                >
                  <span>Courier Dispatch</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="hover:text-[#FFE600] transition-colors duration-150 flex items-center gap-1.5"
                >
                  <span>Admin Telemetry</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Telemetry Column */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="font-bold uppercase text-[11px] mb-3 tracking-wider text-[#FFE600]">
              {'// TELEMETRY'}
            </div>
            <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">PLATFORM VER</span>
                <span className="font-bold text-neutral-200">v2.4.12-PROD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">DEFAULT COORD</span>
                <span className="font-bold text-neutral-200">28.6139° N, 77.2090° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">BUILD COMMIT</span>
                <span className="font-bold text-neutral-200">#7a8f09d (2026.09)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px] gap-3">
          <div>© 2026 OMNIDROP INC. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors duration-150">
              PRIVACY
            </span>
            <span className="text-neutral-700">/</span>
            <span className="hover:text-white cursor-pointer transition-colors duration-150">
              DISPATCH PROTOCOL
            </span>
            <span className="text-neutral-700">/</span>
            <span className="hover:text-white cursor-pointer transition-colors duration-150">
              SECURITY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
