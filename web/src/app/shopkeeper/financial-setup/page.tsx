"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FinancialSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/shopkeeper/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-10 h-16 bg-surface-container-lowest shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>OmniDrop Merchant</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 items-center">
            <span className="text-on-surface-variant font-medium cursor-pointer hover:bg-surface-variant/50 transition-colors px-2 py-1 rounded">Support</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 duration-200">help</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 duration-200">notifications</span>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=200" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col pt-6 gap-2 border-r border-outline-variant/30 h-screen w-64 fixed left-0 top-16 bg-surface-container-lowest z-40">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Onboarding</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-primary transition-all duration-1000"></div>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">60%</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant transition-all rounded-lg cursor-pointer">
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-sm font-bold">Store Info</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant transition-all rounded-lg cursor-pointer">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-sm font-bold">Inventory</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant transition-all rounded-lg cursor-pointer">
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-sm font-bold">Shipping</span>
          </div>
          {/* Active Tab: Payments */}
          <div className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-4 py-3 mx-2 active:translate-x-1 duration-150 shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <span className="text-sm font-bold">Payments</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant transition-all rounded-lg cursor-pointer opacity-50">
            <span className="material-symbols-outlined">rocket_launch</span>
            <span className="text-sm font-bold">Launch</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-24 pb-12 lg:pl-[17rem] pr-5 md:pr-12 px-5 min-h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-on-surface mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Verification & Financial Setup</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>To ensure secure payouts and comply with financial regulations, please upload your business documents and provide your banking information.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Pane: KYC Documents */}
            <section className="lg:col-span-5 space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-lg border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Identity Verification</h3>
                </div>
                
                {/* ID Slot */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-on-surface-variant">Government Issued ID (Passport or Driver's License)</label>
                  <div className="relative group border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-primary/50 hover:bg-surface-container-low cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-2">cloud_upload</span>
                    <p className="text-sm text-on-surface-variant"><span className="text-primary font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs mt-1" style={{ color: '#6b7c68' }}>SVG, PNG, JPG or PDF (max. 5MB)</p>
                    <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(216, 222, 254, 0.5)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#575d78' }}></span>
                      <span className="text-xs font-medium" style={{ color: '#5b617d' }}>Pending</span>
                    </div>
                  </div>
                </div>

                {/* Business License Slot */}
                <div className="space-y-4 mt-8">
                  <label className="block text-sm font-semibold text-on-surface-variant">Business Registration License</label>
                  <div className="relative group border-2 border-dashed border-primary/50 bg-primary-container/5 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer">
                    <div className="absolute top-4 right-4 text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">description</span>
                    <p className="text-sm font-bold text-on-surface">business_license_2024.pdf</p>
                    <p className="text-xs mt-1" style={{ color: '#6b7c68' }}>Successfully uploaded • 1.2 MB</p>
                    <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 255, 95, 0.1)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#006e24' }}></span>
                      <span className="text-xs font-medium" style={{ color: '#007125' }}>Uploaded</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-surface-container rounded-lg">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">info</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Documents are encrypted and stored securely following PCI-DSS compliance standards. Only authorized compliance officers can access these files.</p>
                </div>
              </div>
            </section>

            {/* Right Pane: Payout Information Form */}
            <section className="lg:col-span-7">
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-lg border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-8">
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Payout Information</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-on-surface-variant">Account Holder Name</label>
                      <input required className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:outline-none focus:border-2 focus:border-primary transition-all bg-surface-container-low/30 text-base" placeholder="John Doe" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-on-surface-variant">Bank Name</label>
                      <input required className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:outline-none focus:border-2 focus:border-primary transition-all bg-surface-container-low/30 text-base" placeholder="Global Commerce Bank" type="text" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant">Account Number</label>
                    <div className="relative">
                      <input required className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:outline-none focus:border-2 focus:border-primary transition-all bg-surface-container-low/30 text-base tracking-widest" type="password" placeholder="••••••••••" />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" type="button">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-on-surface-variant">Routing Number / Swift Code</label>
                      <input required className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:outline-none focus:border-2 focus:border-primary transition-all bg-surface-container-low/30 text-base" placeholder="021000021" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-on-surface-variant">Account Type</label>
                      <select className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:outline-none focus:border-2 focus:border-primary transition-all bg-surface-container-low/30 text-base appearance-none">
                        <option>Business Checking</option>
                        <option>Personal Savings</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/50 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Bank-Grade 256-bit Encryption</span>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm text-on-surface-variant border border-outline-variant hover:bg-surface-variant/50 transition-colors active:scale-95 duration-150" type="button">
                        Save Draft
                      </button>
                      <button 
                        disabled={loading}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary shadow-lg hover:shadow-xl transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100" 
                        type="submit"
                      >
                        {loading ? 'Processing...' : 'Complete Setup'} 
                        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                      </button>
                    </div>
                  </div>
                </form>

              </div>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 grayscale opacity-60">
                <div className="flex items-center gap-2 justify-center py-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined">security</span>
                  <span className="text-xs font-bold">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2 justify-center py-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined">payments</span>
                  <span className="text-xs font-bold">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2 justify-center py-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  <span className="text-xs font-bold">GDPR Ready</span>
                </div>
                <div className="flex items-center gap-2 justify-center py-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined">gpp_maybe</span>
                  <span className="text-xs font-bold">Verified</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
