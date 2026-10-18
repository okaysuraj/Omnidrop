import { Check, CreditCard, MapPin, PackageCheck } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    title: 'Find your local favorites',
    body: 'Browse nearby shops and choose the groceries and essentials you need.',
    icon: MapPin,
  },
  {
    title: 'Make it yours',
    body: 'Add your address, review your basket, and check out securely.',
    icon: CreditCard,
  },
  {
    title: 'Follow it to your door',
    body: 'See order updates and track your delivery from the store to your doorstep.',
    icon: PackageCheck,
  },
];

export function DeliveryProtocol() {
  return (
    <section id="protocol" className="section-space bg-surface border-y border-line">
      <div className="site-container grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <div className="relative aspect-[1.1] rounded-[28px] overflow-hidden bg-muted">
          <Image
            src="/hub_courier.jpg"
            alt="Grocery orders carefully prepared for neighborhood delivery"
            fill
            sizes="(max-width: 1024px) 100vw, 550px"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="section-heading max-w-md">From a local shelf to your everyday.</h2>
          <p className="section-copy text-sm">
            Less time running errands. More time for everything else.
          </p>
          <ol className="mt-8 space-y-7">
            {steps.map(({ title, body, icon: Icon }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon size={21} />
                </span>
                <div>
                  <h3 className="font-bold text-sm">{title}</h3>
                  <p className="text-sm text-secondary mt-1 leading-7 max-w-sm">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 inline-flex items-center gap-2 text-xs text-brand font-semibold">
            <Check size={16} />
            Your order details, always in one place.
          </p>
        </div>
      </div>
    </section>
  );
}
