'use client';

import { ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SectionTag } from './section-tag';

// Sample products demonstrate the storefront; live inventory is loaded in Explore.
interface DropItem {
  id: string;
  name: string;
  category: 'bakery' | 'produce' | 'pantry' | 'pharma';
  price: number;
  unit: string;
  store: string;
  distance: string;
  stock: number;
  prepMinutes: number;
}

const CATALOG_ITEMS: DropItem[] = [
  {
    id: 'prod-1',
    name: 'Artisanal Sourdough Batard',
    category: 'bakery',
    price: 6.5,
    unit: '800g loaf',
    store: 'Ferment & Flour',
    distance: '0.4 km',
    stock: 7,
    prepMinutes: 2,
  },
  {
    id: 'prod-2',
    name: 'Single-Origin Cold Brew Can',
    category: 'pantry',
    price: 4.8,
    unit: '330ml nitro',
    store: 'Monolith Roasters',
    distance: '0.6 km',
    stock: 14,
    prepMinutes: 1,
  },
  {
    id: 'prod-3',
    name: 'Organic Hass Avocados',
    category: 'produce',
    price: 5.2,
    unit: '4 pack ripe',
    store: 'Verdant Green Grocer',
    distance: '0.8 km',
    stock: 9,
    prepMinutes: 2,
  },
  {
    id: 'prod-4',
    name: 'Electrolyte Hydration Packets',
    category: 'pharma',
    price: 8.9,
    unit: '6 stick box',
    store: 'Apothecary 24/7',
    distance: '0.3 km',
    stock: 18,
    prepMinutes: 1,
  },
  {
    id: 'prod-5',
    name: 'Farmhouse Free-Range Eggs',
    category: 'produce',
    price: 4.95,
    unit: '12 brown eggs',
    store: 'Verdant Green Grocer',
    distance: '0.8 km',
    stock: 5,
    prepMinutes: 1,
  },
  {
    id: 'prod-6',
    name: 'Organic Rosemary & Sea Salt Butter',
    category: 'pantry',
    price: 5.75,
    unit: '200g slab',
    store: 'Ferment & Flour',
    distance: '0.4 km',
    stock: 8,
    prepMinutes: 2,
  },
];

export function DemoCatalog() {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'bakery' | 'produce' | 'pantry' | 'pharma'
  >('all');
  const [cart, setCart] = useState<{ [id: string]: number }>({ 'prod-1': 1, 'prod-2': 1 });
  const toggleCartItem = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };
  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartValue = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = CATALOG_ITEMS.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const filteredCatalog =
    activeCategory === 'all'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter((item) => item.category === activeCategory);
  return (
    <>
      <section id="catalog" className="border-b-2 border-black bg-white py-16 lg:py-20">
        <div className="container-brutal">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5 pb-4 border-b-2 border-black">
            <div>
              <SectionTag variant="yellow">{'// 03 LIVE SHELVES'}</SectionTag>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
                Fresh Inventory Ready For Dispatch
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 font-tech text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'bakery', label: 'Bakery' },
                { id: 'produce', label: 'Produce' },
                { id: 'pantry', label: 'Pantry' },
                { id: 'pharma', label: 'Pharma' },
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                    className={`h-9 px-3.5 border-2 border-black font-bold uppercase tracking-wider transition-all duration-100 flex items-center justify-center text-[11px] ${
                      isActive
                        ? 'bg-[#0A0A0A] text-white shadow-[2px_2px_0px_#FFE600]'
                        : 'bg-white hover:bg-[#FFE600] text-[#0A0A0A]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalog.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="card-brutal p-5 sm:p-6 flex flex-col justify-between h-full bg-white"
                >
                  <div>
                    {/* Store Row */}
                    <div className="flex items-center justify-between font-tech text-[11px] mb-3 text-neutral-400 pb-2.5 border-b-2 border-black/10">
                      <span className="font-bold text-[#0A0A0A]">{item.store}</span>
                      <span>{item.distance} away</span>
                    </div>

                    {/* Name & Unit */}
                    <h3 className="font-display font-black text-lg leading-snug text-[#0A0A0A]">
                      {item.name}
                    </h3>
                    <p className="font-tech text-xs text-neutral-400 mt-1">{item.unit}</p>

                    {/* Stock Badge */}
                    <div className="mt-3 flex items-center gap-2.5 font-tech text-[10px]">
                      <span className="bg-[#E5F9E0] text-[#0A0A0A] px-2.5 py-0.5 border-2 border-black font-bold uppercase">
                        {item.stock} IN STOCK
                      </span>
                      <span className="text-neutral-400">Prep: ~{item.prepMinutes}m</span>
                    </div>
                  </div>

                  {/* Price & Cart Action */}
                  <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-tech text-neutral-400 uppercase block leading-none">
                        Price
                      </span>
                      <span className="font-display font-black text-xl leading-none mt-1.5 inline-block text-[#0A0A0A]">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleCartItem(item.id, 1)}
                        className="btn-brutal-yellow !h-9 !py-0 !px-4 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add To Drop</span>
                      </button>
                    ) : (
                      <div className="flex items-center h-9 border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                        <button
                          type="button"
                          onClick={() => toggleCartItem(item.id, -1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-neutral-100 transition-colors duration-100 font-bold text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-tech font-bold text-xs border-x-2 border-black">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCartItem(item.id, 1)}
                          className="w-8 h-full flex items-center justify-center bg-[#FFE600] hover:bg-yellow-400 transition-colors duration-100 font-bold text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {totalCartCount > 0 && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
          <div className="bg-[#0A0A0A] text-white border-2 border-black p-4 shadow-[4px_4px_0px_#FFE600] flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-[#FFE600] inline-block animate-pulse" />
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                {totalCartCount} ITEM{totalCartCount > 1 ? 'S' : ''}
              </span>
            </div>

            <div className="font-display font-black text-lg text-white">
              ${totalCartValue.toFixed(2)}
            </div>

            <Link
              href="/explore"
              className="btn-brutal-yellow !h-9 !py-0 !px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Complete In Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
