import { Link } from "react-router-dom";
import type { Product } from "../types";

function formatPrice(price: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link 
      to={`/products/${product.slug}`}
      className="bg-surface rounded-2xl border border-outline-variant overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full"
    >
      <div className="aspect-square bg-surface-container-lowest overflow-hidden relative p-4 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <span className="material-symbols-outlined text-6xl text-outline-variant">image</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {product.category && (
          <p className="text-label-sm text-primary uppercase tracking-widest mb-1">{product.category.name}</p>
        )}
        <h3 className="font-label-lg text-on-surface line-clamp-2 mb-2 flex-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-headline-sm text-on-surface font-bold">{formatPrice(product.price)}</span>
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
