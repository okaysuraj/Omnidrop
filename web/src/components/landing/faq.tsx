'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const questions = [
  {
    q: 'What can I order on Omnidrop?',
    a: 'Browse groceries, bakery products, pantry staples, and everyday essentials from local stores. The live catalog shows the products offered by stores near you.',
  },
  {
    q: 'How much does delivery cost?',
    a: 'Your delivery fee and order total are shown at checkout before you pay. Check your basket for the fees and any eligible promotions for your order.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. Open your order to see status updates and follow your delivery partner when live location is available.',
  },
  {
    q: 'How can I add my store to Omnidrop?',
    a: 'Create an account as a shopkeeper, then complete your store profile and financial setup. You can manage your products and incoming orders through the merchant portal.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="pb-16 lg:pb-24">
      <div className="site-container grid lg:grid-cols-[.8fr_1.2fr] gap-8 lg:gap-20">
        <div>
          <h2 className="section-heading">A few things you might be wondering.</h2>
          <p className="section-copy text-sm">A little clarity before your first order.</p>
        </div>
        <div className="border-t border-line">
          {questions.map((item, index) => (
            <div key={item.q} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  className="w-full py-6 flex items-center justify-between gap-5 text-left text-sm sm:text-base font-semibold"
                  aria-expanded={open === index}
                  aria-controls={'answer-' + index}
                  id={'question-' + index}
                  onClick={() => setOpen(open === index ? null : index)}
                >
                  {item.q}
                  {open === index ? (
                    <Minus size={18} className="text-brand" />
                  ) : (
                    <Plus size={18} className="text-secondary" />
                  )}
                </button>
              </h3>
              <div
                id={'answer-' + index}
                role="region"
                aria-labelledby={'question-' + index}
                hidden={open !== index}
                className="pb-6 pr-7 text-sm leading-7 text-secondary"
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
