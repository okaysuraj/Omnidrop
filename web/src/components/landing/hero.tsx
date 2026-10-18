import {
  ArrowRight,
  ArrowUpRight,
  Carrot,
  ChevronRight,
  Cookie,
  Egg,
  Leaf,
  Milk,
  Pill,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-surface pt-10 pb-12 lg:pt-14 lg:pb-16">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="py-2 lg:py-6">
            <p className="eyebrow inline-flex items-center gap-2 mb-5">
              <Leaf size={16} />
              Good things, closer to home
            </p>
            <h1 className="text-[42px] sm:text-[56px] lg:text-[64px] font-extrabold leading-[1.08] tracking-[-0.065em] max-w-[580px]">
              Your neighborhood.
              <br className="hidden sm:block" /> At your doorstep.
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-[1.8] text-secondary max-w-[440px]">
              Fresh groceries, daily essentials, and your favorite local stores. A better everyday
              starts nearby.
            </p>
            <form
              action="/products"
              className="mt-8 flex items-center gap-3 bg-canvas border border-line rounded-2xl p-2 max-w-[490px]"
              role="search"
            >
              <Search size={20} className="text-subtle ml-3" aria-hidden="true" />
              <label htmlFor="home-search" className="sr-only">
                Search groceries and essentials
              </label>
              <input
                id="home-search"
                name="search"
                type="search"
                placeholder="What do you need today?"
                className="min-w-0 w-full py-3 bg-transparent text-sm outline-none focus-visible:outline-none"
              />
              <button className="button-primary min-h-11 px-4 sm:px-5 py-2" type="submit">
                <span className="hidden sm:inline">Find it nearby</span>
                <ArrowRight size={18} />
                <span className="sr-only sm:hidden">Search</span>
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-secondary">
              <span className="inline-flex items-center gap-2">
                <Store size={16} className="text-brand" />
                Shop local
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand" />
                Secure checkout
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck size={17} className="text-brand" />
                Live order tracking
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[1.06] sm:aspect-[1.2] lg:aspect-[1.06] rounded-[28px] overflow-hidden bg-muted">
              <Image
                src="/hero_essentials.jpg"
                alt="Fresh sourdough, oranges and herbs packed together in a grocery box"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center gap-3 px-1">
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <ShoppingBag size={20} />
              </span>
              <p className="text-xs leading-5 text-secondary">
                <strong className="block text-ink font-bold text-sm">
                  A small shop. A fresh start.
                </strong>
                Every order keeps your neighborhood growing.
              </p>
              <Link
                href="/stores"
                className="icon-button ml-auto"
                aria-label="Discover local stores"
              >
                <ArrowUpRight size={21} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const categories = [
  { label: 'Fruit & vegetables', search: 'vegetables', icon: Carrot },
  { label: 'Dairy & eggs', search: 'milk', icon: Milk },
  { label: 'Bakery', search: 'bread', icon: Cookie },
  { label: 'Pantry staples', search: 'pantry', icon: ShoppingBag },
  { label: 'Breakfast', search: 'eggs', icon: Egg },
  { label: 'Health & care', search: 'health', icon: Pill },
];

export function ShopCategories() {
  return (
    <section
      className="bg-surface pb-12 lg:pb-16 border-b border-line"
      aria-labelledby="categories-heading"
    >
      <div className="site-container">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 id="categories-heading" className="text-lg font-bold tracking-tight">
            A little of everything you need
          </h2>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-brand font-semibold"
          >
            Browse all
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-5">
          {categories.map(({ label, search, icon: Icon }) => (
            <Link
              href={'/products?search=' + encodeURIComponent(search)}
              key={label}
              className="category-tile"
            >
              <span className="category-icon">
                <Icon size={30} />
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GetStarted() {
  return (
    <section className="pb-16 lg:pb-24 bg-canvas">
      <div className="site-container">
        <div className="rounded-[28px] bg-brand-soft px-7 py-10 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="section-heading text-[28px] sm:text-[36px]">
              Make room for a little more local.
            </h2>
            <p className="text-secondary mt-3 text-sm">
              Your next favorite find might be just around the corner.
            </p>
          </div>
          <Link href="/auth/register" className="button-primary self-start md:self-center">
            Create your account
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
