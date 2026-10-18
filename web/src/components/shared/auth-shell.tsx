import { ArrowLeft, ArrowUpRight, Leaf, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandLogo } from './brand-logo';
import { ThemeToggle } from './theme-toggle';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-line bg-surface">
        <div className="site-container header-inner">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Link href="/stores" className="nav-link hidden sm:inline-flex">
              Discover local stores
              <ArrowUpRight size={16} />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="main-content" className="auth-layout">
        <aside className="auth-visual" aria-label="About Omnidrop">
          <div>
            <span className="eyebrow inline-flex items-center gap-2">
              <Leaf size={17} />
              Your neighborhood, delivered.
            </span>
            <h2 className="mt-7 max-w-md text-[42px] lg:text-[50px] font-extrabold tracking-[-.055em] leading-[1.12]">
              Good things are closer than you think.
            </h2>
            <p className="mt-5 text-secondary max-w-sm text-sm leading-7">
              Fresh finds, familiar stores, and a simpler way to shop for your everyday.
            </p>
          </div>
          <div className="relative aspect-[1.4] w-full max-w-lg mt-9 rounded-3xl overflow-hidden bg-muted">
            <Image
              src="/hero_essentials.jpg"
              alt="Bread, fresh fruit and herbs from local shops"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
          <span className="mt-7 inline-flex items-center gap-2 text-xs text-secondary">
            <ShieldCheck size={16} className="text-brand" />
            Your account connects your orders, addresses, and wallet.
          </span>
        </aside>
        <div className="auth-form-wrap">
          <div className="auth-form">
            {children}
            <div className="mt-8 pt-6 border-t border-line flex justify-between items-center text-xs text-secondary">
              <Link href="/" className="inline-flex gap-1.5 items-center hover:text-brand">
                <ArrowLeft size={14} />
                Back to home
              </Link>
              <span>Omnidrop</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
