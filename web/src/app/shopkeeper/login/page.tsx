"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShopkeeperLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/shopkeeper/dashboard');
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowOtp(true);
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-10 h-16 bg-surface-container-lowest shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          <span className="text-xl md:text-2xl font-extrabold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>OmniDrop Merchant</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-variant/50 rounded-full transition-colors cursor-pointer active:scale-95">help</button>
        </div>
      </header>

      <main className="min-h-screen pt-16 flex flex-col md:flex-row">
        {/* Left Side: Brand Imagery & Value Props */}
        <section className="hidden md:flex md:w-1/2 bg-inverse-surface relative overflow-hidden p-16 flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Decorative lines simulated via tailwind */}
             <div className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#00e554] to-transparent w-64 top-1/4 left-10 animate-[pulse_3s_infinite]" />
             <div className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#00e554] to-transparent w-48 top-2/4 right-20 animate-[pulse_3s_infinite_1.5s]" />
             <div className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#00e554] to-transparent w-80 bottom-1/4 left-32 animate-[pulse_3s_infinite_0.7s]" />
          </div>
          
          <div className="relative z-10 max-w-lg">
            <span className="inline-block bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold mb-6 tracking-wider">MERCHANT HUB 2.0</span>
            <h1 className="text-4xl md:text-5xl text-on-primary mb-6 font-extrabold leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>Accelerate Your Local Business Velocity.</h1>
            <p className="text-lg text-inverse-on-surface/80 mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>Join thousands of merchants using OmniDrop to deliver locally in minutes. Manage inventory, track orders, and grow your brand with instant efficiency.</p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary p-3 rounded-xl">
                  <span className="material-symbols-outlined text-on-primary">speed</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Instant Setup</h3>
                  <p className="text-sm text-inverse-on-surface/60 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Launch your store in under 10 minutes with our automated onboarding flow.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary p-3 rounded-xl">
                  <span className="material-symbols-outlined text-on-primary">monitoring</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Real-time Insights</h3>
                  <p className="text-sm text-inverse-on-surface/60 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Watch your sales velocity in real-time with our merchant dashboard.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Anchor Image */}
          <div className="absolute -bottom-24 -right-12 w-96 h-96 opacity-40 pointer-events-none">
            <div className="w-full h-full rounded-full border-[32px] border-primary-container/20 animate-pulse"></div>
          </div>
        </section>

        {/* Right Side: Dynamic Authentication Card */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-surface">
          <div className="w-full max-w-md transition-all duration-300">
            <div className="bg-surface-container-lowest rounded-[32px] shadow-xl p-8 md:p-10 border border-outline-variant/30">
              
              {!showOtp ? (
                <>
                  {/* Form Header */}
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-on-surface mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {isLogin ? 'Welcome Back' : 'Join OmniDrop'}
                    </h2>
                    <p className="text-base text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {isLogin ? 'Enter your credentials to manage your store.' : 'Create an account to start selling locally.'}
                    </p>
                  </div>

                  <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
                    {!isLogin && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="absolute -top-2.5 left-4 bg-surface-container-lowest px-1 text-xs font-medium text-on-surface-variant">First Name</label>
                          <input required className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base" placeholder="John" type="text"/>
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2.5 left-4 bg-surface-container-lowest px-1 text-xs font-medium text-on-surface-variant">Last Name</label>
                          <input required className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base" placeholder="Doe" type="text"/>
                        </div>
                        <div className="relative col-span-2">
                          <label className="absolute -top-2.5 left-4 bg-surface-container-lowest px-1 text-xs font-medium text-on-surface-variant">Store Name</label>
                          <input required className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base" placeholder="The Local Artisan" type="text"/>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="relative">
                        <label className="absolute -top-2.5 left-4 bg-surface-container-lowest px-1 text-xs font-medium text-primary">Email Address</label>
                        <input required className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base" placeholder="name@store.com" type="email"/>
                      </div>
                      <div className="relative">
                        <label className="absolute -top-2.5 left-4 bg-surface-container-lowest px-1 text-xs font-medium text-on-surface-variant">Password</label>
                        <input required className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base" placeholder="••••••••" type="password"/>
                      </div>
                    </div>

                    {isLogin && (
                      <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                          <span className="text-on-surface-variant">Remember me</span>
                        </label>
                        <button type="button" className="text-primary font-bold hover:underline">Forgot Password?</button>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 bg-primary-container text-on-primary-container text-xl font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex items-center justify-center disabled:opacity-70 disabled:scale-100"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (isLogin ? 'Log In' : 'Create Account')}
                    </button>
                  </form>
                  
                  {/* Footer Switch */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-on-surface-variant">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                      <button type="button" className="text-primary font-bold hover:underline ml-1" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Log In'}
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                /* OTP / Verification State */
                <div className="space-y-8 py-4 animate-in fade-in zoom-in duration-300">
                  <div className="text-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">mark_email_read</span>
                    <h2 className="text-2xl font-bold text-on-surface mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Verify Email</h2>
                    <p className="text-sm text-on-surface-variant text-center" style={{ fontFamily: 'Inter, sans-serif' }}>We've sent a 6-digit code to <span className="font-bold text-on-surface">your email</span></p>
                  </div>
                  
                  <div className="flex justify-between gap-2">
                    {[1,2,3,4,5,6].map((i) => (
                      <input key={i} className="w-10 sm:w-12 h-14 text-center text-2xl font-bold border-b-2 border-outline-variant focus:border-primary outline-none bg-transparent" maxLength={1} type="text"/>
                    ))}
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => router.push('/shopkeeper/dashboard')}
                    className="w-full h-14 bg-primary text-on-primary text-xl font-bold rounded-2xl shadow-lg hover:bg-primary/90 transition-all"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Verify & Launch
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-on-surface-variant">Didn't receive code? <button className="text-primary font-bold hover:underline">Resend in 0:59</button></p>
                  </div>
                </div>
              )}

            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-1 font-bold text-[10px] tracking-widest text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="material-symbols-outlined text-sm">lock</span> SECURE ENCRYPTION
              </div>
              <div className="flex items-center gap-1 font-bold text-[10px] tracking-widest text-on-surface-variant" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="material-symbols-outlined text-sm">verified_user</span> GDPR COMPLIANT
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
