'use client';

import { ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const items = [
  {
    id: 'avocados',
    name: 'Fresh avocados',
    unit: '2 pieces',
    category: 'Produce',
    price: 149,
    image: '/images/avocados.jpg',
  },
  {
    id: 'bread',
    name: 'Artisan sourdough',
    unit: '1 loaf',
    category: 'Bakery',
    price: 180,
    image: '/images/bread.jpg',
  },
  {
    id: 'oranges',
    name: 'Sweet oranges',
    unit: '500 g',
    category: 'Produce',
    price: 79,
    image: '/images/oranges.jpg',
  },
  {
    id: 'milk',
    name: 'Fresh dairy milk',
    unit: '1 litre',
    category: 'Dairy',
    price: 68,
    image: '/images/milk.jpg',
  },
  {
    id: 'eggs',
    name: 'Farm fresh eggs',
    unit: '6 pieces',
    category: 'Dairy',
    price: 89,
    image: '/images/eggs.jpg',
  },
  {
    id: 'vegetables',
    name: 'Fresh salad vegetables',
    unit: 'Mixed selection',
    category: 'Produce',
    price: 129,
    image: '/images/vegetables.jpg',
  },
];
const filters = ['Everything', 'Produce', 'Bakery', 'Dairy'];

export function DemoCatalog() {
  const [category, setCategory] = useState('Everything');
  const [basket, setBasket] = useState<Record<string, number>>({});
  const count = Object.values(basket).reduce((sum, quantity) => sum + quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * (basket[item.id] || 0), 0);
  const change = (id: string, delta: number) =>
    setBasket((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(12, (current[id] || 0) + delta)),
    }));

  return (
    <section id="catalog" className="section-space">
      <div className="site-container">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="section-heading">Everyday favorites, freshly found.</h2>
            <p className="section-copy text-sm">
              A sample of what&apos;s nearby. Shop the live catalog for local prices and
              availability.
            </p>
          </div>
          <Link href="/products" className="button-secondary hidden md:inline-flex shrink-0 mt-1">
            Shop the live catalog
            <ArrowRight size={16} />
          </Link>
        </div>
        <div
          className="flex gap-2 overflow-x-auto py-1 mt-7 mb-7"
          aria-label="Filter sample products"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="filter-pill"
              aria-pressed={category === filter}
              onClick={() => setCategory(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items
            .filter((item) => category === 'Everything' || category === item.category)
            .map((item) => {
              const quantity = basket[item.id] || 0;
              return (
                <article key={item.id} className="surface-card p-3 flex flex-col">
                  <div className="product-image">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 180px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-[11px] text-secondary">{item.unit}</p>
                  <h3 className="text-sm font-bold leading-6 mt-1 mb-4 min-h-12">{item.name}</h3>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                    <span className="font-bold text-base tabular-nums">₹{item.price}</span>
                    {quantity ? (
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => change(item.id, -1)}
                          aria-label={'Remove one ' + item.name + ' from preview'}
                        >
                          <Minus size={14} />
                        </button>
                        <output aria-label={item.name + ' preview quantity'}>{quantity}</output>
                        <button
                          type="button"
                          onClick={() => change(item.id, 1)}
                          disabled={quantity >= 12}
                          aria-label={'Add one ' + item.name + ' to preview'}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => change(item.id, 1)}
                        className="flex gap-1 items-center rounded-lg border border-line text-brand py-2 px-3 text-xs font-bold hover:bg-brand-soft"
                        aria-label={'Add ' + item.name + ' to preview'}
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
        <div aria-live="polite" className="mt-5 text-xs text-secondary min-h-6">
          {count > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <ShoppingBag size={16} className="text-brand" />
              <span>
                Preview basket: {count} {count === 1 ? 'item' : 'items'}, ₹{total}. Sample only.
              </span>
              <Link href="/products" className="text-brand font-bold underline underline-offset-4">
                Shop live inventory
              </Link>
            </div>
          ) : (
            <p>
              Illustrative products and prices. Preview items won&apos;t be added to your real cart.
            </p>
          )}
        </div>
        <Link href="/products" className="button-secondary mt-5 md:hidden">
          Shop the live catalog
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
