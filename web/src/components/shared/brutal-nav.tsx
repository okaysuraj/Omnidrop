'use client';

import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Layers,
  LogOut,
  MapPin,
  Package,
  ShieldAlert,
  ShoppingBag,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function BrutalNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.cart
        .get()
        .then((c) => {
          if (c && c.items) {
            const count = c.items.reduce((sum: number, item) => sum + (item.quantity || 1), 0);
            setCartCount(count);
          }
        })
        .catch(() => {});
    }
  }, [user, pathname]);

  const navLinks = [
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/stores', label: 'Stores', icon: Store },
    { href: '/products', label: 'Catalog', icon: Package },
    { href: '/orders', label: 'Orders', icon: Layers },
  ];

  return (
    <>
      {/* 1. TOP TELEMETRY STRIP */}
      <aside
        aria-label="System Status"
        className="border-b-2 border-black bg-neutral-950 text-white py-1.5 font-tech text-[11px] tracking-wider select-none"
      >
        <div className="container-brutal flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] inline-block animate-pulse"></span>
            <span className="font-bold text-[#00E599]">SYSTEM NOMINAL</span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/80 hidden sm:inline">38/38 MICRO-HUBS ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <span>
              MEDIAN DROP: <strong className="text-white font-bold">17.4M</strong>
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-[#FFE600] font-bold">ZERO SHELF MARKUP</span>
            {user && (
              <span className="bg-[#FFE600] text-black px-2 py-0.2 font-tech font-bold uppercase text-[10px] hidden sm:inline border border-black">
                ROLE: {user.role}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN BRUTALIST STICKY NAV */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black shadow-[0_2px_0px_#000]">
        <div className="container-brutal h-16 flex items-center justify-between">
          {/* Logo & Version */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-display font-extrabold text-base border-2 border-black shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
                ⚡
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-lg tracking-tight uppercase leading-none text-neutral-900">
                  OMNIDROP
                </span>
                <span className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
                  v2.4
                </span>
              </div>
            </Link>

            {/* Location selector indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#FAFAF8] border-2 border-black font-tech text-xs shadow-[2px_2px_0px_#000]">
              <MapPin className="w-3.5 h-3.5 text-[#FF4800]" />
              <span className="font-bold text-neutral-900">DELHI CORE / SECTOR 4</span>
              <span className="text-[10px] text-[#059669] font-bold">(0.6 KM)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 font-display text-xs tracking-wider uppercase font-bold text-neutral-900">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#FFE600] border-black text-black shadow-[2px_2px_0px_#000] translate-x-0.5'
                      : 'border-transparent hover:border-black hover:bg-[#FAFAF8] text-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Portal links based on user role */}
            {user?.role === 'SHOPKEEPER' && (
              <Link
                href="/shopkeeper/dashboard"
                className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/shopkeeper')
                    ? 'bg-[#00E599] border-black text-black shadow-[2px_2px_0px_#000]'
                    : 'border-transparent hover:border-black hover:bg-[#FAFAF8] text-neutral-800'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Console</span>
              </Link>
            )}

            {user?.role === 'DELIVERY_PARTNER' && (
              <Link
                href="/delivery/dashboard"
                className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/delivery')
                    ? 'bg-[#00E599] border-black text-black shadow-[2px_2px_0px_#000]'
                    : 'border-transparent hover:border-black hover:bg-[#FAFAF8] text-neutral-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Fleet Console</span>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/admin')
                    ? 'bg-black border-black text-white shadow-[2px_2px_0px_#FFE600]'
                    : 'border-transparent hover:border-black hover:bg-[#FAFAF8] text-neutral-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>Admin Ops</span>
              </Link>
            )}
          </nav>

          {/* Action Tools: Cart + Account */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button with Hard Badge */}
            <Link
              href="/cart"
              className={`h-9 px-3 border-2 border-black font-tech font-bold text-xs uppercase flex items-center gap-2 transition-all ${
                pathname === '/cart'
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]'
                  : 'bg-white hover:bg-neutral-100 text-neutral-900 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tote</span>
              <span className="bg-black text-[#FFE600] px-1.5 py-0.2 text-[10px] font-bold border border-black">
                {cartCount}
              </span>
            </Link>

            {/* User Session Menu / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-9 px-3 border-2 border-black bg-white hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 font-tech font-bold text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0px_#000]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00E599]"></span>
                  <span className="max-w-[90px] truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-2 z-50 font-tech text-xs space-y-1">
                    <div className="p-2 border-b-2 border-black/10 mb-1">
                      <div className="font-bold text-neutral-900 truncate">
                        {user.fullName || 'User'}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">{user.email}</div>
                      <span className="inline-block mt-1 badge-brutal bg-[#FFE600] text-black text-[9px] py-0.5 px-1.5">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                    >
                      👤 Account Console
                    </Link>

                    <Link
                      href="/wallet"
                      onClick={() => setMenuOpen(false)}
                      className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                    >
                      💳 Omni Wallet
                    </Link>

                    <Link
                      href="/addresses"
                      onClick={() => setMenuOpen(false)}
                      className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                    >
                      📍 Saved Waypoints
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                    >
                      📦 My Orders
                    </Link>

                    {user.role === 'SHOPKEEPER' && (
                      <Link
                        href="/shopkeeper/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                      >
                        🏪 Merchant Portal
                      </Link>
                    )}

                    {user.role === 'DELIVERY_PARTNER' && (
                      <Link
                        href="/delivery/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                      >
                        🛵 Courier Fleet
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block p-2 hover:bg-[#FFE600] hover:text-black font-bold uppercase transition-colors"
                      >
                        ⚡ Platform Operations
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left p-2 border-t-2 border-black/10 hover:bg-[#FF4800] hover:text-white font-bold uppercase transition-colors flex items-center justify-between"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="h-9 px-3.5 font-display font-bold text-xs uppercase tracking-wider border-2 border-black bg-white hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#000] flex items-center justify-center whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-brutal-yellow !h-9 !py-0 !px-3.5 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
