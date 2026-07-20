'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const [cats, nearbyStores] = await Promise.all([
          api.products.categories().catch(() => []),
          api.stores.nearby(28.6139, 77.209, 20).catch(() => []),
        ]);
        setCategories(cats as any[] || []);
        setStores(nearbyStores as any[] || []);
      } catch { /* ignore */ }
      setLoading(false);
    };

    if (user) loadData();
  }, [user, authLoading, router]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await api.products.search(searchQuery) as any[];
      setSearchResults(results || []);
    } catch { /* ignore */ }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <span className="material-symbols-outlined text-6xl animate-spin">refresh</span>
      </div>
    );
  }

  return (
    <div className="bg-background selection:bg-primary-container selection:text-on-primary-container text-on-surface">
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-outline-variant w-full top-0 sticky z-50 shadow-sm flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">OmniDrop</h1>
          </div>
          <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-2 text-on-surface-variant gap-2 transition-all hover:ring-2 hover:ring-primary/20 cursor-pointer">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <span className="font-label-bold text-label-bold">Downtown, Manhattan</span>
            <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
          </div>
        </div>
        
        {/* Search Bar - added to header for utility */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
            placeholder="Search stores, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-1 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="text-primary font-bold font-label-bold flex items-center gap-2 hover:bg-surface-container-high transition-colors rounded-lg px-3 py-2">
            <span className="material-symbols-outlined">explore</span> Explore
          </Link>
          <Link href="/orders" className="text-on-surface-variant font-label-bold flex items-center gap-2 hover:bg-surface-container-high transition-colors rounded-lg px-3 py-2">
            <span className="material-symbols-outlined">receipt_long</span> Orders
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-1 right-1 w-3 h-3 bg-error rounded-full border-2 border-surface"></span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold overflow-hidden border-2 border-primary/20 shadow-sm cursor-pointer relative group">
             {user?.fullName?.[0]?.toUpperCase()}
             <div className="absolute top-12 right-0 bg-surface shadow-lg rounded-xl border border-outline-variant p-2 hidden group-hover:block min-w-[150px]">
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-surface-container rounded-lg text-error font-label-bold">Logout</button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter py-md">
        
        {/* Welcome Text */}
        <div className="mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">Hello, {user?.fullName?.split(' ')[0]} 👋</h2>
          <p className="text-on-surface-variant">What are you looking for today?</p>
        </div>

        {/* Hero Banner Section */}
        <section className="relative rounded-[2rem] overflow-hidden mb-xl bg-inverse-surface h-[400px] group shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface via-inverse-surface/60 to-transparent z-10"></div>
          <div className="relative z-20 h-full flex flex-col justify-center px-lg max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container font-label-bold text-label-bold mb-6 animate-pulse w-fit">FLASH SALE • LIVE NOW</span>
            <h2 className="font-headline-xl text-headline-xl text-white mb-4 leading-tight">50% OFF on <br/><span className="text-primary-container">Fresh Grocery</span></h2>
            <p className="text-body-lg text-surface-variant mb-8 opacity-90">Experience lightning-fast delivery for your weekly essentials. Local farms, global standards, delivered in under 20 minutes.</p>
            <div className="flex items-center gap-4">
              <button className="bg-primary hover:bg-primary-fixed-dim text-white font-label-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 group-hover:translate-x-2 duration-300">
                Claim Offer <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          {/* Absolute decorative image */}
          <div className="absolute right-0 top-0 h-full w-1/2 z-0 hidden md:block overflow-hidden">
            <img className="w-full h-full object-cover origin-center scale-110 group-hover:scale-100 transition-transform duration-1000" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" alt="Groceries" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-xl">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-lg text-headline-lg">Explore Categories</h3>
            <a className="text-primary font-label-bold flex items-center gap-1 hover:underline cursor-pointer">See all <span className="material-symbols-outlined text-sm">chevron_right</span></a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
            {categories.length > 0 ? categories.map((cat: any, i: number) => (
              <Link href={`/products?categoryId=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-full aspect-square rounded-[2rem] bg-surface-container-low flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-primary text-5xl group-hover:scale-110 transition-transform">category</span>
                </div>
                <span className="font-label-bold text-on-surface text-center">{cat.name}</span>
              </Link>
            )) : (
              // Mock Categories if API empty
              [
                {name: 'Grocery', icon: 'shopping_basket'},
                {name: 'Pharmacy', icon: 'medical_services'},
                {name: 'Meat & Poultry', icon: 'flatware'},
                {name: 'Fresh Fruits', icon: 'nutrition'},
                {name: 'Bakery', icon: 'bakery_dining'},
                {name: 'Beverages', icon: 'local_drink'},
              ].map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-full aspect-square rounded-[2rem] bg-surface-container-low flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-primary text-4xl md:text-5xl group-hover:scale-110 transition-transform">{c.icon}</span>
                  </div>
                  <span className="font-label-bold text-on-surface text-center text-xs md:text-sm">{c.name}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Nearby Stores / Fastest Delivery */}
        <section className="mb-xl overflow-hidden">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-headline-lg">Nearby Stores</h3>
              <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-bold font-label-bold hidden md:flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">bolt</span> UNDER 15 MIN
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-base">
            {stores.length > 0 ? stores.map(store => (
              <Link href={`/stores/${store.id}`} key={store.id} className="flex flex-col rounded-3xl bg-surface-container-lowest p-2 border border-outline-variant group hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-surface-container">
                   {/* Placeholder image */}
                  <img src="https://images.unsplash.com/photo-1534723452862-4c8765046038?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-label-bold font-label-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">schedule</span> {store.estimatedDeliveryMinutes || '15'} min
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <h4 className="font-headline-md text-on-surface mb-1">{store.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center text-primary text-sm font-bold">
                      <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span> {store.rating?.toFixed(1) || '4.8'}
                    </div>
                    <span className="text-outline text-xs">•</span>
                    <span className="text-on-surface-variant text-label-md">{store.distance?.toFixed(1) || '0.8'} km</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container-low rounded-[2rem] border-2 border-dashed border-outline-variant">
                 <span className="material-symbols-outlined text-6xl mb-4 text-outline">store_off</span>
                 <p className="font-headline-md">No stores found near you</p>
                 <p className="text-sm">Try changing your location or expanding search radius.</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
