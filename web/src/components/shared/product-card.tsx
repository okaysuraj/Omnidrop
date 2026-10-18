'use client';

import type { Product } from '@/types';
import { Check, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export function ProductCard({
  product,
  onAdd,
  adding = false,
  added = false,
}: {
  product: Product;
  onAdd?: (product: Product) => void;
  adding?: boolean;
  added?: boolean;
}) {
  const price = Number(product.sellingPrice);
  const originalPrice = Number(product.mrp);
  return (
    <article className="surface-card p-3 sm:p-4 flex flex-col h-full">
      <Link
        href={'/products/' + product.id}
        className="product-image block aspect-[1.15]"
        aria-label={'View ' + product.name}
      >
        <img
          src={product.images?.[0] || '/hero_essentials.jpg'}
          alt={product.name}
          width={500}
          height={435}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </Link>
      <p className="text-xs text-secondary mt-4">
        {product.unit || product.category?.name || 'Everyday essentials'}
      </p>
      <Link href={'/products/' + product.id} className="mt-1 mb-4 hover:text-brand">
        <h2 className="font-bold text-sm sm:text-base leading-6 line-clamp-2 min-h-12">
          {product.name}
        </h2>
      </Link>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="font-bold text-base sm:text-lg tabular-nums">₹{price.toFixed(2)}</span>
          {originalPrice > price && (
            <span className="block text-xs text-secondary line-through tabular-nums">
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {onAdd ? (
          <button
            type="button"
            disabled={adding}
            onClick={() => onAdd(product)}
            className="inline-flex items-center justify-center min-h-10 gap-1.5 rounded-xl border border-brand text-brand text-xs sm:text-sm font-bold px-3 hover:bg-brand-soft"
            aria-label={adding ? 'Adding ' + product.name : 'Add ' + product.name + ' to cart'}
          >
            {adding ? (
              <Loader2 size={15} className="animate-spin" />
            ) : added ? (
              <Check size={15} />
            ) : (
              <Plus size={15} />
            )}
            {adding ? 'Adding' : added ? 'Added' : 'Add'}
          </button>
        ) : (
          <Link
            href={'/products/' + product.id}
            className="text-xs font-bold text-brand hover:underline"
          >
            View item
          </Link>
        )}
      </div>
    </article>
  );
}
