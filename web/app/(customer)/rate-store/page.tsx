"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RateStorePage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  const currentLabel = labels[(hoverRating || rating) - 1] || 'Tap to rate';

  const tags = ['Great Selection', 'Correct Items', 'Well Packaged', 'Fresh Produce', 'Good Value'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="bg-surface w-full top-0 sticky shadow-sm z-50">
        <div className="flex items-center justify-between px-5 h-16 w-full max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform p-2 -ml-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-container">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <h1 className="font-bold text-xl text-primary">Rate Store</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-lg mx-auto px-5 py-10 flex flex-col pb-32">
        {/* Store Header Info */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-surface mb-4 relative">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200" alt="Store" />
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-on-surface mb-2">GreenMarket Grocers</h2>
          <p className="text-base text-on-surface-variant">Order #GM-84920 • Delivered 2 hours ago</p>
        </div>

        {/* Star Rating */}
        <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/10 p-6 mb-10 flex flex-col items-center">
          <h3 className="font-bold text-xl mb-4 text-on-surface">How was the store?</h3>
          <div className="flex gap-2 justify-center mb-2 w-full">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-2 focus:outline-none focus:ring-2 focus:ring-primary-container rounded-full"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <span 
                  className={\`material-symbols-outlined text-4xl transition-all duration-200 \${(hoverRating || rating) >= star ? 'text-primary-container scale-110' : 'text-surface-variant'}\`} 
                  style={{ fontVariationSettings: \`'FILL' \${(hoverRating || rating) >= star ? 1 : 0}\` }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          <p className={\`font-medium text-xs h-4 \${rating > 0 || hoverRating > 0 ? 'text-primary' : 'text-secondary'}\`}>{currentLabel}</p>
        </div>

        {/* Specific Aspects (Praise) */}
        <div className={\`mb-10 transition-opacity duration-300 \${rating > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}\`}>
          <h4 className="font-bold text-xs uppercase text-on-surface-variant mb-4 tracking-wider">What did they do well?</h4>
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={\`font-medium text-xs px-4 py-2 rounded-full transition-all duration-200 focus:outline-none active:scale-95 \${
                    isSelected 
                      ? 'bg-primary-container text-on-primary-container border-transparent font-bold' 
                      : 'border border-outline-variant text-on-surface bg-surface hover:bg-surface-container-low'
                  }\`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Comments */}
        <div className={\`mb-10 transition-opacity duration-300 \${rating > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}\`}>
          <h4 className="font-bold text-xs uppercase text-on-surface-variant mb-4 tracking-wider">Additional Comments</h4>
          <textarea 
            className="w-full bg-surface border border-outline-variant rounded-lg p-4 text-base text-on-surface placeholder-secondary focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none h-32" 
            placeholder="Tell us more about your experience..."
          ></textarea>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Submit Button */}
        <div className="mt-auto pb-safe">
          <button 
            disabled={rating === 0}
            className={\`w-full font-bold text-xl py-4 rounded-xl shadow-sm transition-all duration-300 \${
              rating > 0 
                ? 'bg-primary-container text-on-primary-container shadow-md hover:opacity-90 active:scale-[0.98]' 
                : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
            }\`}
          >
            Submit Feedback
          </button>
        </div>
      </main>
    </div>
  );
}
