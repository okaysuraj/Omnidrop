"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/home'); // Redirect after register
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-on-background">
      <header className="w-full sticky top-0 bg-background z-50 flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="text-primary active:scale-95 transition-transform hover:opacity-80">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-xl text-on-surface">Create Account</h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-1 flex flex-col px-5 py-10 max-w-md mx-auto w-full">
        {/* Hero Section */}
        <div className="mb-16 relative rounded-xl overflow-hidden h-40 shadow-sm animate-[subtle-float_4s_ease-in-out_infinite]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-primary-container text-on-primary-container font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">Fast & Reliable</span>
          </div>
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8ed7c83a56?auto=format&fit=crop&q=80&w=800')" }}></div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs text-on-surface-variant ml-1" htmlFor="full_name">Full Name</label>
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-container/20 transition-all group">
              <span className="material-symbols-outlined text-outline mr-3 group-focus-within:text-primary transition-colors">person</span>
              <input id="full_name" type="text" placeholder="John Doe" className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline-variant" required />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-container/20 transition-all group">
              <span className="material-symbols-outlined text-outline mr-3 group-focus-within:text-primary transition-colors">mail</span>
              <input id="email" type="email" placeholder="email@example.com" className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline-variant" required />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs text-on-surface-variant ml-1" htmlFor="mobile">Mobile Number</label>
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-container/20 transition-all group">
              <span className="material-symbols-outlined text-outline mr-3 group-focus-within:text-primary transition-colors">call</span>
              <input id="mobile" type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline-variant" required />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs text-on-surface-variant ml-1" htmlFor="password">Password</label>
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-container/20 transition-all group">
              <span className="material-symbols-outlined text-outline mr-3 group-focus-within:text-primary transition-colors">lock</span>
              <input id="password" type="password" placeholder="••••••••" className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline-variant" required />
              <button type="button" className="text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 py-4">
            <div className="relative flex items-center pt-0.5">
              <input id="terms" type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-background cursor-pointer" required />
            </div>
            <label htmlFor="terms" className="text-sm text-on-surface-variant leading-tight">
              I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <div className="pt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>

          {/* Bottom Action Area */}
          <div className="fixed bottom-0 left-0 w-full z-50 flex justify-end items-center px-5 py-6 bg-surface shadow-[0_-8px_30px_rgb(0,0,0,0.05)] rounded-t-xl md:static md:shadow-none md:max-w-md md:mx-auto md:bg-transparent md:px-0">
            <button type="submit" disabled={loading} className="flex items-center justify-between bg-primary text-on-primary rounded-full px-10 py-4 w-full font-bold active:scale-95 duration-200 hover:brightness-110 shadow-lg group">
              <span className="uppercase tracking-widest">{loading ? 'Creating...' : 'Create Account'}</span>
              <span className="flex items-center justify-center bg-primary-fixed text-on-primary-fixed rounded-full w-10 h-10 -mr-6 group-hover:translate-x-1 transition-transform">
                {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">arrow_forward</span>}
              </span>
            </button>
          </div>
        </form>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtle-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
}
