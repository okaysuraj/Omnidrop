'use client';

import Link from 'next/link';

export function BrutalFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-10 pb-8 font-tech text-xs border-t-2 border-black">
      <div className="container-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b-2 border-neutral-800">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-display font-black text-sm border-2 border-white shadow-[2px_2px_0px_#FFE600]">
                ⚡
              </div>
              <span className="font-display font-black text-base tracking-tight uppercase text-white">
                OMNIDROP KERNEL
              </span>
            </div>
            <p className="font-sans text-neutral-400 text-xs leading-relaxed max-w-sm">
              Hyperlocal quick-commerce protocol connecting verified neighborhood dark stores,
              artisan bakeries, and pharmacies with sub-20m doorstep dispatch.
            </p>
            <div className="text-[11px] text-neutral-500 font-bold">
              {'LOC: 28.6139° N, 77.2090° E // CENTRAL DELHI'}
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Marketplace
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <Link href="/explore" className="hover:text-[#FFE600] transition-colors">
                  Local Stores
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#FFE600] transition-colors">
                  Live Catalog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FFE600] transition-colors">
                  Active Tote
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#FFE600] transition-colors">
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Ecosystem
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <Link href="/shopkeeper/login" className="hover:text-[#FFE600] transition-colors">
                  Merchant Portal
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-[#FFE600] transition-colors">
                  Courier Fleet
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-[#FFE600] transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Telemetry
            </div>
            <div className="p-3 bg-neutral-900 border-2 border-neutral-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>GATEWAY</span>
                <span className="text-[#00E599] font-bold">PORT :4000 ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>DB CLOUD</span>
                <span className="text-white font-bold">NEON POSTGRES 16</span>
              </div>
              <div className="flex justify-between">
                <span>AUTH ENGINE</span>
                <span className="text-[#FFE600] font-bold">FIREBASE SHA-256</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Omnidrop Autonomous Logistics Corp. Zero shelf markups.
          </div>
          <div className="flex gap-4">
            <span className="text-neutral-400">REST PROTOCOL v2.4</span>
            <span>SOCKET.IO REALTIME</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
