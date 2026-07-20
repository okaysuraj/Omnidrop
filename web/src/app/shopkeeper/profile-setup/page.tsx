"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessProfileSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/shopkeeper/financial-setup');
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-10 h-16 bg-surface-container-lowest shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>OmniDrop Merchant</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-variant/50 transition-colors cursor-pointer">help</button>
          <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-variant/50 transition-colors cursor-pointer">notifications</button>
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=200" alt="Profile" />
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col pt-6 gap-2 border-r border-outline-variant/30 h-[calc(100vh-64px)] w-64 fixed left-0 top-16 bg-surface-container-low">
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Onboarding</h2>
          <div className="mt-2 w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[40%] transition-all duration-1000"></div>
          </div>
          <p className="text-xs font-medium text-on-surface-variant mt-1">40% Complete</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {/* Active Tab: Store Info */}
          <div className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-4 py-3 mx-2 active:translate-x-1 duration-150 cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            <span className="text-sm font-bold">Store Info</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant rounded-lg transition-all cursor-pointer">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-sm font-bold">Inventory</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant rounded-lg transition-all cursor-pointer">
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-sm font-bold">Shipping</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant rounded-lg transition-all cursor-pointer">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-sm font-bold">Payments</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant rounded-lg transition-all cursor-pointer opacity-50">
            <span className="material-symbols-outlined">rocket_launch</span>
            <span className="text-sm font-bold">Launch</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 w-full min-h-screen px-5 md:px-12 py-10 pt-24">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-on-surface mb-2" style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>Business Profile & Operations</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>Set up your digital storefront presence and delivery boundaries to start accepting instant orders.</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Details & Hours */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Store Details */}
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-lg border border-outline-variant/30">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="material-symbols-outlined text-primary">info</span> Store Identity
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-sm font-bold block mb-1 text-on-surface-variant group-focus-within:text-primary transition-colors">Store Name</label>
                      <input required className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 transition-all outline-none text-base" placeholder="e.g. Velocity Fresh Market" type="text" />
                    </div>
                    <div className="group">
                      <label className="text-sm font-bold block mb-1 text-on-surface-variant group-focus-within:text-primary transition-colors">Business Category</label>
                      <select required className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 transition-all outline-none text-base appearance-none">
                        <option>Grocery & Fresh Produce</option>
                        <option>Bakery & Cafe</option>
                        <option>Pharmacy</option>
                        <option>Convenience Store</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="text-sm font-bold block mb-1 text-on-surface-variant group-focus-within:text-primary transition-colors">Store Description</label>
                      <textarea required className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 transition-all outline-none text-base resize-none" placeholder="Tell customers about your fresh offerings..." rows={3}></textarea>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-lg border border-outline-variant/30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span className="material-symbols-outlined text-primary">schedule</span> Operating Hours
                    </h3>
                    <button type="button" className="text-primary text-xs font-bold hover:underline">Apply to All</button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-surface-variant last:border-0">
                      <span className="text-base w-24">Mon - Fri</span>
                      <div className="flex items-center gap-2">
                        <input className="bg-surface-container-low border-none rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary/20" type="time" defaultValue="08:00" />
                        <span className="text-on-surface-variant">to</span>
                        <input className="bg-surface-container-low border-none rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary/20" type="time" defaultValue="20:00" />
                      </div>
                      <div className="flex items-center">
                        <input defaultChecked className="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-surface-variant last:border-0">
                      <span className="text-base w-24">Saturday</span>
                      <div className="flex items-center gap-2">
                        <input className="bg-surface-container-low border-none rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary/20" type="time" defaultValue="09:00" />
                        <span className="text-on-surface-variant">to</span>
                        <input className="bg-surface-container-low border-none rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary/20" type="time" defaultValue="18:00" />
                      </div>
                      <div className="flex items-center">
                        <input defaultChecked className="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-surface-variant last:border-0">
                      <span className="text-base w-24 text-on-surface-variant">Sunday</span>
                      <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                        <input className="bg-surface-container-low border-none rounded-md px-2 py-1 text-sm" disabled type="time" />
                        <span className="text-on-surface-variant">to</span>
                        <input className="bg-surface-container-low border-none rounded-md px-2 py-1 text-sm" disabled type="time" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-error mr-2">Closed</span>
                        <input className="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Map */}
              <div className="lg:col-span-7 h-full">
                <div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 overflow-hidden flex flex-col h-full min-h-[600px]">
                  
                  {/* Map Header Controls */}
                  <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest z-10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span className="material-symbols-outlined text-primary">distance</span> Delivery Radius
                    </h3>
                    <p className="text-sm text-on-surface-variant">Define the geographical area where you'll offer instant delivery services.</p>
                  </div>
                  
                  {/* Interactive Map Area */}
                  <div className="relative flex-1 bg-surface-variant overflow-hidden group">
                    <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')", filter: 'grayscale(100%) opacity(0.3)' }}></div>
                    
                    {/* Delivery Radius Visualization */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary bg-primary/20 transition-all duration-300 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{ width: 300 + (radius - 5) * 50, height: 300 + (radius - 5) * 50 }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full ring-4 ring-white shadow-lg"></div>
                    </div>
                    
                    {/* Floating Reach Indicator */}
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg z-20 w-48 border border-white/30">
                      <p className="text-xs font-bold text-primary mb-1 uppercase">Est. Reach</p>
                      <p className="text-2xl font-bold text-on-surface">{(14.2 * (radius/5) * 1.05).toFixed(1)}k</p>
                      <p className="text-sm text-on-surface-variant">Active Customers</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary scale-75">bolt</span>
                        <span className="text-[10px] font-bold text-primary">OPTIMAL ZONE</span>
                      </div>
                    </div>
                  </div>

                  {/* Map Footer Controls */}
                  <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-on-surface-variant uppercase">Coverage Distance</span>
                      <span className="text-xl font-bold text-primary">{radius.toFixed(1)} km</span>
                    </div>
                    
                    <input 
                      type="range" 
                      min="1" max="15" step="0.5" 
                      value={radius} 
                      onChange={(e) => setRadius(parseFloat(e.target.value))}
                      className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary mb-6" 
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
                        <p className="text-xs text-on-surface-variant mb-1 font-medium">Base Delivery Fee</p>
                        <p className="text-xl font-bold text-primary">$2.99</p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
                        <p className="text-xs text-on-surface-variant mb-1 font-medium">Avg. Delivery Time</p>
                        <p className="text-xl font-bold text-primary">12-18 min</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-t border-outline-variant/30">
              <button type="button" className="flex items-center gap-2 text-on-surface-variant text-sm font-bold hover:text-primary transition-colors py-3 px-6">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Basic Info
              </button>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button type="button" className="flex-1 md:flex-none border border-outline-variant text-on-surface-variant text-sm font-bold px-8 py-3 rounded-xl hover:bg-surface-variant transition-all active:scale-95">
                  Save Draft
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 md:flex-none bg-primary text-on-primary text-lg font-bold px-10 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                >
                  {loading ? 'Processing...' : 'Next Step'}
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
