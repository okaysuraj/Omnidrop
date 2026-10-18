'use client';

import { ArrowRight, Bike, Check, LayoutDashboard, ShoppingBag, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const roles = [
  {
    id: 'customer',
    label: 'Customers',
    icon: ShoppingBag,
    title: 'A whole neighborhood in your pocket.',
    description:
      'The shops you know and the little finds you have not discovered yet. All together, ready when you are.',
    features: [
      'Browse fresh groceries and everyday essentials',
      'Keep addresses and orders in one place',
      'Follow your delivery with live updates',
    ],
    action: 'Find your local favorites',
    href: '/explore',
    image: '/hero_essentials.jpg',
    alt: 'Fresh groceries from a neighborhood shop',
  },
  {
    id: 'merchant',
    label: 'Shopkeepers',
    icon: Store,
    title: 'Your local store. A little more reach.',
    description:
      'Bring your shelves online and keep your focus on what you do best: serving your neighborhood.',
    features: [
      'Manage your catalog and inventory',
      'Receive and prepare incoming orders',
      'Keep track of your store activity',
    ],
    action: 'Open your merchant portal',
    href: '/shopkeeper/login',
    image: '/hub_courier.jpg',
    alt: 'Local grocery fulfillment workspace',
  },
  {
    id: 'fleet',
    label: 'Courier Fleet',
    icon: Bike,
    title: 'Make every delivery a local connection.',
    description:
      'Help good things get where they are going. Manage your delivery tasks with a clear view of what comes next.',
    features: [
      'Find and accept available delivery tasks',
      'Navigate to pickup and drop-off locations',
      'View your delivery history and wallet',
    ],
    action: 'Join as a delivery partner',
    href: '/auth/register',
    image: '/hub_courier.jpg',
    alt: 'Orders prepared for local delivery partners',
  },
  {
    id: 'ops',
    label: 'Platform Ops',
    icon: LayoutDashboard,
    title: 'Keep your marketplace moving.',
    description:
      'Bring stores, orders, and delivery activity into one workspace built for your operations team.',
    features: [
      'Review users and local stores',
      'Monitor marketplace orders',
      'Manage day-to-day platform activity',
    ],
    action: 'Sign in to your workspace',
    href: '/auth/login',
    image: '/hero_essentials.jpg',
    alt: 'A carefully packed grocery order',
  },
];

export function StakeholderTabs() {
  const [selected, setSelected] = useState('customer');
  const role = roles.find((item) => item.id === selected)!;
  return (
    <section id="matrix" className="section-space">
      <div className="site-container">
        <h2 className="section-heading text-center">Better together, right here.</h2>
        <p className="section-copy text-center mx-auto">
          A place for everyone who makes a neighborhood work.
        </p>
        <div
          className="flex gap-2 flex-wrap justify-center mt-7 mb-9"
          aria-label="Explore Omnidrop for your role"
        >
          {roles.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className="filter-pill gap-2"
              aria-pressed={id === selected}
              aria-controls="community-panel"
              onClick={() => setSelected(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        <div
          id="community-panel"
          className="grid md:grid-cols-2 rounded-[28px] overflow-hidden border border-line bg-surface"
        >
          <div className="p-7 sm:p-10 lg:p-12 self-center">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-.04em] leading-tight max-w-sm">
              {role.title}
            </h3>
            <p className="mt-5 text-sm leading-7 text-secondary max-w-md">{role.description}</p>
            <ul className="mt-6 space-y-3">
              {role.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-secondary">
                  <Check size={17} className="text-brand mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={role.href} className="button-primary mt-8 text-xs sm:text-sm px-4 sm:px-5">
              {role.action}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative min-h-64 md:min-h-[420px] bg-muted">
            <Image
              src={role.image}
              alt={role.alt}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
