'use client';

import { useState } from 'react';
import { SectionTag } from './section-tag';

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <section id="faq" className="border-b-2 border-black bg-white py-16 lg:py-20">
      <div className="container-brutal">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <SectionTag variant="yellow">{'// 05 ARCHITECTURAL SPECS'}</SectionTag>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
              Frequently Queried Specifications
            </h2>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: 'How does Omnidrop ensure exact in-store shelf pricing without markups?',
                a: 'Traditional food aggregators impose an extortionate 25-35% commission on merchants, which forces shopkeepers to inflate product prices. Omnidrop charges a flat 6% platform fee, allowing our verified neighborhood merchants to offer identical shelf pricing with zero markup.',
              },
              {
                q: 'What happens if a specific grocery item or bakery item is sold out in real life?',
                a: 'When an item sells out in the physical store, the merchant scanner immediately triggers a live substitution prompt to the customer via WebSocket. You can accept a recommended alternative with 1 tap or receive an instantaneous automatic wallet refund with zero friction.',
              },
              {
                q: 'How do neighborhood merchants join the Omnidrop dark-store network?',
                a: 'Any local licensed store can register through the Merchant Portal. Our onboarding process requires catalog barcode synchronization, location verification, and testing of our handheld packing terminal. Most stores go live in under 48 hours.',
              },
              {
                q: 'What are the delivery fees and minimum order requirements?',
                a: 'Standard hyperlocal drops carry a flat delivery fee of $1.49. For orders exceeding $25.00, delivery is completely free. We do not impose hidden service charges, small-cart penalties, or deceptive payment processing add-ons.',
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 ${isOpen ? 'bg-white' : 'bg-[#FAFAF8]'}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-display font-bold text-sm sm:text-base flex items-center justify-between gap-4 uppercase tracking-tight cursor-pointer text-[#0A0A0A]"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-7 h-7 border-2 border-black flex items-center justify-center flex-shrink-0 font-tech font-bold text-xs shadow-[2px_2px_0px_#000] transition-all duration-150 ${isOpen ? 'bg-[#FFE600]' : 'bg-white'}`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 border-t-2 border-black/10 font-sans text-[13px] sm:text-sm text-neutral-500 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
