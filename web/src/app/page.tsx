'use client';

import { DeliveryProtocol } from '@/components/landing/delivery-protocol';
import { DemoCatalog } from '@/components/landing/demo-catalog';
import { Faq } from '@/components/landing/faq';
import { GetStarted, Hero, ShopCategories } from '@/components/landing/hero';
import { RouteSimulator } from '@/components/landing/route-simulator';
import { LandingFooter, LandingNav } from '@/components/landing/site-chrome';
import { StakeholderTabs } from '@/components/landing/stakeholder-tabs';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      const destination =
        user.role === 'SHOPKEEPER'
          ? '/shopkeeper/dashboard'
          : user.role === 'DELIVERY_PARTNER'
            ? '/delivery/dashboard'
            : user.role === 'ADMIN'
              ? '/admin/dashboard'
              : '/explore';
      router.replace(destination);
    }
  }, [user, router]);
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <LandingNav />
      <main id="main-content">
        <Hero />
        <ShopCategories />
        <DemoCatalog />
        <DeliveryProtocol />
        <StakeholderTabs />
        <RouteSimulator />
        <Faq />
        <GetStarted />
      </main>
      <LandingFooter />
    </div>
  );
}
