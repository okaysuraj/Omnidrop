'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ProductDiscoveryPage() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.products.search('') as any[];
        // Mock filtering by category for now
        setProducts(res || []);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    };
    loadProducts();
  }, [categoryId]);

  return (
    <div className="bg-background selection:bg-primary-container selection:text-on-primary-container min-h-screen text-on-surface">
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-outline-variant w-full top-0 sticky z-50 shadow-sm flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/explore" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">OmniDrop</h1>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input className="w-full bg-surface-container-low border-none rounded-full py-base pl-12 pr-md focus:ring-2 focus:ring-primary-container font-body-sm text-body-sm outline-none text-on-surface" placeholder="Search for fresh items..." type="text"/>
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        </div>
        
        <div className="flex items-center gap-md">
          <Link href="/cart" className="flex items-center gap-xs px-sm py-xs bg-primary-container text-on-primary-container rounded-full active:scale-95 transition-transform font-label-bold text-label-bold cursor-pointer">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>Cart</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold overflow-hidden border-2 border-primary-container cursor-pointer text-on-secondary-container">
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 mt-8 flex px-margin-mobile md:px-xl py-lg gap-xl max-w-[1440px] mx-auto w-full">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-28 h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">
          <h2 className="font-headline-md text-headline-md mb-md text-on-surface">Filters</h2>
          <div className="space-y-lg">
            {/* Categories */}
            <section>
              <h3 className="font-label-bold text-label-bold text-secondary mb-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-xs">
                {['Organic Produce', 'Dairy & Eggs', 'Bakery', 'Meat & Seafood', 'Pantry Staples'].map((cat, i) => (
                  <label key={i} className="flex items-center gap-xs cursor-pointer group">
                    <input defaultChecked={i===0} className="rounded border-outline text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                    <span className="font-body-sm text-body-sm group-hover:text-primary text-on-surface">{cat}</span>
                  </label>
                ))}
              </div>
            </section>
            {/* Price Range */}
            <section>
              <h3 className="font-label-bold text-label-bold text-secondary mb-sm uppercase tracking-wider">Price Range</h3>
              <input className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" type="range"/>
              <div className="flex justify-between mt-xs font-body-sm text-body-sm text-on-surface-variant">
                <span>$0</span>
                <span>$500+</span>
              </div>
            </section>
            {/* Delivery Speed */}
            <section>
              <h3 className="font-label-bold text-label-bold text-secondary mb-sm uppercase tracking-wider">Delivery</h3>
              <div className="flex flex-wrap gap-xs">
                <button className="px-sm py-base rounded-full bg-primary text-on-primary font-label-bold text-label-bold shadow-sm">Instant</button>
                <button className="px-sm py-base rounded-full border border-outline text-on-surface hover:border-primary font-label-bold text-label-bold transition-colors">Today</button>
              </div>
            </section>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-lg gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Fresh Catalog</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Showing {products.length || 248} products</p>
            </div>
            <div className="flex items-center gap-sm">
              <span className="font-label-bold text-label-bold text-secondary">Sort by:</span>
              <select className="bg-surface border-none font-body-sm text-body-sm focus:ring-0 cursor-pointer text-primary font-bold">
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {(products.length > 0 ? products : [1,2,3,4,5,6]).map((product: any, idx) => (
              <div key={product.id || idx} className={`product-card cursor-pointer group relative bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl overflow-hidden border border-transparent hover:border-primary-container transition-all ${idx === 0 ? 'md:col-span-2 xl:col-span-2' : ''}`}>
                <div className={`flex ${idx === 0 ? 'h-full flex-row' : 'flex-col'}`}>
                  <div className={`${idx === 0 ? 'w-3/5' : 'h-48'} relative overflow-hidden bg-surface-container`}>
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" />
                    {idx === 0 && <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full font-label-bold text-label-bold text-xs uppercase tracking-wider">Bestseller</div>}
                  </div>
                  <div className={`${idx === 0 ? 'w-2/5 p-lg flex flex-col justify-center bg-surface-container-low' : 'p-md bg-surface-container-low flex flex-col gap-2'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{product.name || 'Organic Premium Avocado'}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{idx === 0 ? 'Directly from sun-drenched orchards. Rich, creamy texture perfect for toasts and salads.' : 'Fresh and organic'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="font-headline-md text-headline-md text-primary font-black">${product.sellingPrice || '6.99'}</span>
                        <span className="font-label-md text-label-md text-secondary line-through">${product.mrp || '8.99'}</span>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-fixed-variant active:scale-90 transition-transform shadow-md">
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
