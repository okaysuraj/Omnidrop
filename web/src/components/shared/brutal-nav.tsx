'use client';

import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import {
  ArrowRight,
  ChevronDown,
  Compass,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  ShoppingBag,
  Store,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './brand-logo';
import { ThemeToggle } from './theme-toggle';

export function SiteNav({ landing = false }: { landing?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      if (!user) return;
      api.cart
        .get()
        .then((cart) => {
          if (active)
            setCartCount((cart?.items || []).reduce((sum, item) => sum + item.quantity, 0));
        })
        .catch(() => {
          if (active) setCartCount(0);
        });
    };
    load();
    window.addEventListener('omnidrop:cart-updated', load);
    return () => {
      active = false;
      window.removeEventListener('omnidrop:cart-updated', load);
    };
  }, [user, pathname]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (header.current?.querySelector('#mobile-navigation')) {
          header.current
            .querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]')
            ?.focus();
        }
        setMobileOpen(false);
        const details = header.current?.querySelector('details');
        if (details?.open) {
          details.open = false;
          details.querySelector('summary')?.focus();
        }
      }
    };
    const outside = (event: PointerEvent) => {
      const details = header.current?.querySelector('details');
      if (details && !details.contains(event.target as Node)) details.open = false;
      if (header.current && !header.current.contains(event.target as Node)) setMobileOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
    };
  }, []);

  const links = landing
    ? [
        { href: '#catalog', label: 'Fresh finds', icon: ShoppingBag },
        { href: '#protocol', label: 'How it works', icon: Package },
        { href: '#matrix', label: 'Our community', icon: Store },
        { href: '#simulator', label: 'Delivery preview', icon: Compass },
        { href: '#faq', label: 'FAQs', icon: Package },
      ]
    : [
        { href: '/explore', label: 'Explore', icon: Compass },
        { href: '/stores', label: 'Stores', icon: Store },
        { href: '/products', label: 'Catalog', icon: ShoppingBag },
        { href: '/orders', label: 'Orders', icon: Package },
      ];
  const portal =
    user?.role === 'SHOPKEEPER'
      ? { href: '/shopkeeper/dashboard', label: 'Shop Console' }
      : user?.role === 'DELIVERY_PARTNER'
        ? { href: '/delivery/dashboard', label: 'Fleet Console' }
        : user?.role === 'ADMIN'
          ? { href: '/admin/dashboard', label: 'Admin Ops' }
          : null;
  const accountLinks = [
    { href: '/profile', label: 'Your account', icon: UserRound },
    { href: '/orders', label: 'Your orders', icon: Package },
    { href: '/wallet', label: 'Omni Wallet', icon: Wallet },
    { href: '/addresses', label: 'Saved addresses', icon: MapPin },
    ...(portal ? [{ ...portal, icon: LayoutDashboard }] : []),
  ];

  return (
    <header ref={header} className="site-header">
      <div className="site-container header-inner">
        <BrandLogo />
        <nav
          aria-label="Main navigation"
          className={'hidden items-center gap-1 ' + (landing ? 'xl:flex' : 'lg:flex')}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-link"
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          {portal && !landing && (
            <Link
              href={portal.href}
              className="nav-link text-brand"
              aria-current={
                pathname.startsWith(portal.href.split('/dashboard')[0]) ? 'page' : undefined
              }
            >
              {portal.label}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {!landing && (
            <Link
              href="/cart"
              className="relative icon-button"
              aria-label={'Shopping cart, ' + (user ? cartCount : 0) + ' items'}
            >
              <ShoppingBag size={20} />
              {user && cartCount > 0 && (
                <span className="absolute top-0.5 right-0 min-w-4 rounded-full bg-brand px-1 text-center text-[10px] font-bold text-on-brand">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <details className="relative">
              <summary
                className="icon-button sm:w-auto sm:px-3 sm:gap-2"
                aria-label="Your account menu"
              >
                <UserRound size={19} />
                <span className="hidden sm:inline max-w-24 truncate text-sm font-semibold">
                  {user.fullName?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={14} className="hidden sm:block" />
              </summary>
              <div className="account-popover">
                <div className="px-3 py-3 border-b border-line mb-2">
                  <p className="font-bold text-sm truncate">{user.fullName || 'Your account'}</p>
                  <p className="text-xs text-secondary truncate">{user.email}</p>
                </div>
                {accountLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="nav-link w-full"
                    onClick={() => {
                      const details = header.current?.querySelector('details');
                      if (details) details.open = false;
                    }}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="nav-link w-full text-danger mt-1"
                  onClick={() => {
                    void logout();
                  }}
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={'nav-link px-2 sm:px-3 ' + (landing ? '' : 'hidden sm:inline-flex')}
              >
                Sign In
              </Link>
              <Link
                href={landing ? '/explore' : '/auth/register'}
                className="button-primary hidden sm:inline-flex min-h-10 px-4 py-2 text-xs"
              >
                {landing ? 'Explore Stores' : 'Register'}
                <ArrowRight size={15} />
              </Link>
            </>
          )}
          <button
            type="button"
            className={'icon-button ' + (landing ? 'xl:hidden' : 'lg:hidden')}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className={'border-t border-line p-4 bg-surface ' + (landing ? 'xl:hidden' : 'lg:hidden')}
        >
          <div className="site-container grid grid-cols-2 gap-2">
            {!user && (
              <Link href="/auth/login" className="nav-link" onClick={() => setMobileOpen(false)}>
                <UserRound size={17} />
                Sign In
              </Link>
            )}
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
            {portal && (
              <Link href={portal.href} className="nav-link" onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={17} />
                {portal.label}
              </Link>
            )}
            {!user && (
              <Link href="/auth/register" className="nav-link" onClick={() => setMobileOpen(false)}>
                <UserRound size={17} />
                Create an account
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export function BrutalNav() {
  return <SiteNav />;
}
