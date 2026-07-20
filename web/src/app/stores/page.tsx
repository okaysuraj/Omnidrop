'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function StoresDiscoveryPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data
    const loadData = async () => {
      try {
        const [cats, nearbyStores] = await Promise.all([
          api.products.categories().catch(() => []),
          api.stores.nearby(28.6139, 77.209, 20).catch(() => []),
        ]);
        setCategories(cats as any[] || []);
        setStores(nearbyStores as any[] || []);
      } catch { /* ignore */ }
    };
    loadData();
  }, []);

  const handleStoreClick = async (store: any) => {
    setSelectedStore(store);
    try {
      const res = await api.stores.getById(store.id);
      setStoreProducts((res as any)?.inventory || []);
    } catch {
      setStoreProducts([]);
    }
  };

  return (
    <div className="bg-background selection:bg-primary-container selection:text-on-primary-container text-on-surface h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-outline-variant w-full sticky z-50 shadow-sm flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 flex-shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/explore" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">OmniDrop</h1>
          </Link>
          <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-2 text-on-surface-variant gap-2 transition-all hover:ring-2 hover:ring-primary/20 cursor-pointer">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <span className="font-label-bold text-label-bold">Downtown, Manhattan</span>
            <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            <Link href="/explore" className="text-on-surface-variant hover:bg-surface-container-high px-2 rounded transition-colors font-label-bold text-label-bold">Explore</Link>
            <Link href="/stores" className="text-primary font-bold transition-colors font-label-bold text-label-bold">Stores</Link>
            <Link href="/orders" className="text-on-surface-variant hover:bg-surface-container-high px-2 rounded transition-colors font-label-bold text-label-bold">Orders</Link>
          </nav>
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-primary cursor-pointer">
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Categories */}
        <aside className="hidden md:flex flex-col w-72 bg-surface border-r border-outline-variant p-md gap-md overflow-y-auto hide-scrollbar">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Categories</h2>
          <div className="flex flex-col gap-2">
            {categories.length > 0 ? categories.map((cat, i) => (
               <button key={cat.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${i === 0 ? 'bg-primary-container text-on-primary-container font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'}`}>
                 <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined">category</span>
                   <span className="font-label-bold text-label-bold">{cat.name}</span>
                 </div>
                 {i === 0 && <span className="material-symbols-outlined text-sm">chevron_right</span>}
               </button>
            )) : (
              // Mock categories
              ['Grocery', 'Pet Care', 'Wellness', 'Bakery', 'Beverages'].map((name, i) => (
                <button key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${i === 0 ? 'bg-primary-container text-on-primary-container font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'}`}>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">{['local_mall', 'pets', 'spa', 'bakery_dining', 'liquor'][i]}</span>
                    <span className="font-label-bold text-label-bold">{name}</span>
                  </div>
                  {i === 0 && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                </button>
              ))
            )}
          </div>
          
          <div className="mt-xl p-4 rounded-2xl bg-secondary-container/30 border border-secondary-container">
            <p className="font-label-bold text-label-bold text-secondary mb-2">PROMO</p>
            <h3 className="font-headline-md text-headline-md text-on-secondary-container leading-tight">Free Delivery for Wellness items</h3>
            <button className="mt-4 w-full py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity">Explore Now</button>
          </div>
        </aside>

        {/* Center Pane: Stores */}
        <section className="flex-1 flex flex-col bg-background p-md overflow-y-auto hide-scrollbar relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Available Stores</h2>
              <p className="text-on-surface-variant font-body-sm">{stores.length || 42} merchants delivering to your area</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline text-on-surface hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">sort</span>
                <span className="font-label-bold text-label-bold">Sort by</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container border border-secondary">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="font-label-bold text-label-bold">Rating 4.5+</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline text-on-surface hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="font-label-bold text-label-bold">Under 20 min</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {stores.length > 0 ? stores.map(store => (
              <div key={store.id} onClick={() => handleStoreClick(store)} className={`group relative overflow-hidden rounded-3xl bg-surface shadow-md hover:shadow-xl transition-all border cursor-pointer ${selectedStore?.id === store.id ? 'border-2 border-primary' : 'border-outline-variant'}`}>
                <div className="h-48 relative overflow-hidden bg-surface-container-high">
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {store.rating > 4.5 && <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-on-primary font-label-bold text-label-bold rounded-full">Top Rated</div>}
                </div>
                <div className="p-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{store.name}</h3>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="font-label-bold text-label-bold">{store.rating?.toFixed(1) || '4.8'}</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-body-sm mb-4">Organic, Local, Farm-to-Table</p>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">distance</span>
                      <span className="font-label-bold text-label-bold">{store.distance?.toFixed(1) || '1.2'} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">delivery_dining</span>
                      <span className="font-label-bold text-label-bold">$0.00 Delivery</span>
                    </div>
                  </div>
                </div>
                {selectedStore?.id === store.id && <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>}
              </div>
            )) : (
              // Mock Stores
              [1, 2, 3].map(i => (
                <div key={i} onClick={() => setSelectedStore({id: i, name: 'Artisan Bloom Bakery'})} className="group relative overflow-hidden rounded-3xl bg-surface shadow-md hover:shadow-xl transition-all border border-outline-variant cursor-pointer">
                  <div className="h-48 relative overflow-hidden bg-surface-container-high">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-headline-md text-on-surface">Store Name {i}</h3>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        <span className="font-label-bold text-label-bold">4.7</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant font-body-sm mb-4">Pastries, Breads, Coffee</p>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">distance</span>
                        <span className="font-label-bold text-label-bold">0.8 km</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Pane: Store Details */}
        {selectedStore && (
          <aside className="hidden xl:flex flex-col w-[450px] bg-surface border-l border-outline-variant overflow-y-auto hide-scrollbar">
            <div className="h-64 relative">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
              <button onClick={() => setSelectedStore(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="px-md -mt-16 relative z-10 pb-xl">
              <div className="bg-surface rounded-2xl p-md shadow-lg border border-outline-variant mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">{selectedStore.name}</h2>
                    <p className="text-on-surface-variant font-label-md">Certified B-Corp Merchant</p>
                  </div>
                </div>
                <div className="flex border-b border-outline-variant">
                  <button className="px-4 py-2 text-primary font-bold border-b-2 border-primary">Menu</button>
                  <button className="px-4 py-2 text-on-surface-variant hover:text-on-surface">Reviews</button>
                  <button className="px-4 py-2 text-on-surface-variant hover:text-on-surface">Offers</button>
                </div>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Seasonal Harvest</h3>
              <div className="grid grid-cols-2 gap-4">
                {(storeProducts.length > 0 ? storeProducts : [1,2,3,4]).map((p: any, i) => (
                  <div key={p.id || i} className="flex flex-col gap-2 group cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden bg-surface-container relative">
                      <img src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <button className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-90 transition-transform hover:bg-primary-fixed-variant">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <p className="font-label-bold text-label-bold text-on-surface">{p.name || 'Organic Product'}</p>
                    <p className="text-primary font-bold">${p.sellingPrice || '4.50'}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
