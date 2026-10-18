'use client';
import { DeliveryProtocol } from '@/components/landing/delivery-protocol';
import { DemoCatalog } from '@/components/landing/demo-catalog';
import { Faq } from '@/components/landing/faq';
import { GetStarted, Hero } from '@/components/landing/hero';
import { RouteSimulator } from '@/components/landing/route-simulator';
import { LandingFooter, LandingNav, SystemStatus } from '@/components/landing/site-chrome';
import { StakeholderTabs } from '@/components/landing/stakeholder-tabs';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'SHOPKEEPER':
          router.push('/shopkeeper/dashboard');
          break;
        case 'DELIVERY_PARTNER':
          router.push('/delivery/dashboard');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/explore');
      }
    }
  }, [user, router]);
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0A0A0A] font-sans selection:bg-[#FFE600] selection:text-black">
      <SystemStatus />
      <LandingNav />
      <Hero />
      <RouteSimulator />
      <StakeholderTabs />
      <DemoCatalog />
      <DeliveryProtocol />
      <Faq />
      <GetStarted />
      <LandingFooter />
    </div>
  );
}
