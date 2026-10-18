import { ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from './brand-logo';

export function BrutalFooter() {
  return (
    <footer className="bg-surface border-t border-line pt-14 pb-7">
      <div className="site-container">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 pb-12">
          <div className="col-span-2 lg:col-span-5">
            <BrandLogo />
            <p className="mt-5 max-w-xs text-sm leading-7 text-secondary">
              Your neighborhood, delivered. Fresh finds and everyday essentials from the local
              stores you love.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs text-secondary">
              <Heart size={15} className="text-brand" />A little more local. A lot more convenient.
            </span>
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-bold text-sm mb-5">Your marketplace</h2>
            <ul className="space-y-3 text-sm text-secondary">
              <li>
                <Link href="/explore" className="hover:text-brand">
                  Explore nearby
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-brand">
                  Local stores
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand">
                  Shop essentials
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-brand">
                  Track an order
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-bold text-sm mb-5">Our community</h2>
            <ul className="space-y-3 text-sm text-secondary">
              <li>
                <Link
                  href="/shopkeeper/login"
                  className="inline-flex gap-1 items-center hover:text-brand"
                >
                  For shopkeepers
                  <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="inline-flex gap-1 items-center hover:text-brand"
                >
                  Become a courier
                  <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-brand">
                  Your account
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand">
                  Questions & answers
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-3 rounded-2xl bg-muted p-6 self-start">
            <ShoppingBag size={24} className="text-brand" />
            <h2 className="font-bold text-sm mt-3">Good things are close by.</h2>
            <p className="text-xs text-secondary mt-2 leading-6">
              Discover what your neighborhood has in store.
            </p>
            <Link
              href="/stores"
              className="inline-flex gap-2 items-center text-sm font-bold text-brand mt-4"
            >
              Find your local store
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-secondary">
          <p>© {new Date().getFullYear()} Omnidrop. All rights reserved.</p>
          <p>Made for your everyday.</p>
        </div>
      </div>
    </footer>
  );
}
