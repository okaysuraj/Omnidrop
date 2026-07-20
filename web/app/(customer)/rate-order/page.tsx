"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RateOrderPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent!'];
  const currentLabel = labels[(hoverRating || rating) - 1] || '';

  const tags = ['Freshness', 'Packaging', 'Speed', 'Portion Size', 'Temperature', 'Taste'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Transactional Header */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-surface-variant px-5 h-16 flex items-center justify-between shadow-sm">
        <button onClick={() => router.back()} aria-label="Go back" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-xl text-on-surface">Rate Your Order</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10 flex flex-col gap-10 pb-32">
        {/* Order Context Card */}
        <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-variant/50 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200" alt="Food" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base text-on-surface line-clamp-1">Spicy Salmon Poke Bowl</h2>
            <p className="text-sm text-on-surface-variant mt-1">Delivered today at 1:45 PM</p>
          </div>
        </section>

        {/* Rating Section */}
        <section className="flex flex-col items-center gap-6">
          <h2 className="font-bold text-2xl md:text-3xl text-center">How was your order?</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={\`transition-transform focus:outline-none \${(hoverRating || rating) >= star ? 'text-primary-container scale-110' : 'text-surface-variant hover:scale-110'}\`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <span className="material-symbols-outlined text-5xl md:text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </button>
            ))}
          </div>
          <p className={\`font-bold text-xs text-primary transition-opacity uppercase tracking-widest h-4 \${(hoverRating || rating) > 0 ? 'opacity-100' : 'opacity-0'}\`}>
            {currentLabel}
          </p>
        </section>

        {/* Tags Section */}
        <section className={\`flex flex-col gap-4 transition-opacity duration-500 \${rating > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}>
          <label className="font-medium text-base text-on-surface">What stood out to you?</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={\`border px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 \${
                    isSelected 
                      ? 'bg-primary-container text-on-primary-container border-transparent font-bold' 
                      : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  }\`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* Comments Section */}
        <section className="flex flex-col gap-4">
          <label className="font-medium text-base text-on-surface" htmlFor="comments">Additional comments</label>
          <textarea 
            id="comments" 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none" 
            placeholder="Tell us more about your experience..." 
            rows={4}
          ></textarea>
        </section>
      </main>

      {/* Sticky Bottom Action */}
      <footer className="sticky bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-variant/30 p-5 pb-safe flex justify-center shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-40">
        <button className="w-full max-w-md bg-primary-container text-on-primary-container font-bold text-base rounded-xl py-4 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,255,95,0.2)]">
          <span>Submit Review</span>
          <span className="material-symbols-outlined">send</span>
        </button>
      </footer>
    </div>
  );
}
