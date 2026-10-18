import type { StoreWithDistance } from '@/types';
import { ArrowRight, BadgeCheck, Clock3, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export function StoreCard({ store }: { store: StoreWithDistance }) {
  return (
    <article className="surface-card overflow-hidden flex flex-col">
      <Link href={'/stores/' + store.id} className="relative block aspect-[1.8] bg-muted">
        <img
          src={store.imageUrl || '/hero_essentials.jpg'}
          alt={store.name}
          width={600}
          height={334}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </Link>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 text-xs mb-3">
          <span
            className={
              'status-badge ' +
              (store.isOpen ? 'bg-brand-soft text-brand' : 'bg-muted text-secondary')
            }
          >
            {store.isOpen ? 'Open now' : 'Currently closed'}
          </span>
          {Number(store.rating) > 0 && (
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Star size={14} className="text-brand" />
              {Number(store.rating).toFixed(1)}
              <span className="font-normal text-secondary">({store.totalRatings || 0})</span>
            </span>
          )}
        </div>
        <Link href={'/stores/' + store.id} className="hover:text-brand flex gap-2 items-center">
          <h2 className="text-lg font-bold tracking-tight">{store.name}</h2>
          {store.isVerified && (
            <BadgeCheck size={18} className="text-brand" aria-label="Verified store" />
          )}
        </Link>
        {store.description && (
          <p className="mt-2 text-sm text-secondary leading-6 line-clamp-2">{store.description}</p>
        )}
        <p className="mt-3 flex items-start gap-1.5 text-xs text-secondary">
          <MapPin size={14} className="mt-0.5" />
          <span className="line-clamp-1">{store.address || 'Address unavailable'}</span>
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-secondary mt-4 mb-5">
          {Number.isFinite(Number(store.distance)) && (
            <span>{Number(store.distance).toFixed(1)} km away</span>
          )}
          {Number(store.estimatedDeliveryMinutes) > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock3 size={14} />
              {store.estimatedDeliveryMinutes} min estimated
            </span>
          )}
        </div>
        <Link
          href={'/products?storeId=' + encodeURIComponent(store.id)}
          className="button-secondary text-xs min-h-10 px-4 py-2 mt-auto w-full"
        >
          Shop this store
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
