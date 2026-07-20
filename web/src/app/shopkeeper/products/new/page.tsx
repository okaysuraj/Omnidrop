"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductManagementScreen() {
  const router = useRouter();
  const [productName, setProductName] = useState('Velocity Apex Running Shoes');
  const [productPrice, setProductPrice] = useState('129.99');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/shopkeeper/dashboard');
    }, 1000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Top Navigation */}
      <header className="w-full top-0 sticky z-50 bg-surface shadow-sm flex justify-between items-center px-4 py-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>MerchantHub</span>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-on-surface-variant font-medium">Inventory</span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
            <span className="text-primary font-bold border-b-2 border-primary">Product Management</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="material-symbols-outlined text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
          <button className="material-symbols-outlined text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors">help</button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" alt="Admin" />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)] pb-20">
        
        {/* SideNavBar */}
        <nav className="hidden lg:flex flex-col h-[calc(100vh-64px)] w-64 sticky left-0 top-16 bg-surface-container border-r border-outline-variant/30 py-6 gap-2 z-40">
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">store</span>
              </div>
              <div>
                <p className="text-lg font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Global Store</p>
                <p className="text-xs font-medium text-on-surface-variant">Verified Merchant</p>
              </div>
            </div>
          </div>
          
          <Link href="/shopkeeper/dashboard" className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all mx-2 rounded-lg text-sm font-bold">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/shopkeeper/dashboard" className="flex items-center gap-3 px-6 py-3 text-on-primary-container bg-primary-container rounded-lg mx-2 transition-all text-sm font-bold">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            <span>Inventory</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all mx-2 rounded-lg text-sm font-bold">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>Orders</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all mx-2 rounded-lg text-sm font-bold">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all mx-2 rounded-lg text-sm font-bold">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
          
          <div className="mt-auto px-4">
            <button className="w-full bg-primary text-white font-bold text-sm py-3 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:opacity-90">
              <span className="material-symbols-outlined">add</span>
              Add Product
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden flex-col xl:flex-row">
          
          {/* Form Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-on-surface" style={{ fontFamily: 'Montserrat, sans-serif' }}>Edit Product</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Update your product details and preview them in real-time.</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold text-[10px] tracking-wider">ACTIVE LISTING</span>
                  <span className="text-xs text-on-surface-variant font-medium">Last saved 2m ago</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Basic Info & Pricing */}
                <div className="space-y-6">
                  {/* Basic Info Card */}
                  <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
                    <h2 className="text-xl font-bold text-primary mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Basic Info</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Product Name</label>
                        <input 
                          className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" 
                          type="text" 
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Description</label>
                        <textarea className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none" rows={4} defaultValue="Engineered for pure speed and hyperlocal agility. The Apex features our responsive Flux-Core foam for maximum energy return on urban surfaces."></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Category</label>
                          <select className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary outline-none text-sm appearance-none cursor-pointer">
                            <option>Footwear</option>
                            <option>Apparel</option>
                            <option>Accessories</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">SKU</label>
                          <input className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary outline-none text-sm" type="text" defaultValue="VEL-APX-001" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Pricing Card */}
                  <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
                    <h2 className="text-xl font-bold text-primary mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pricing & Inventory</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Base Price ($)</label>
                        <input 
                          className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary outline-none text-sm" 
                          type="number" 
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Sale Price ($)</label>
                        <input className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary outline-none text-sm" type="number" defaultValue="109.99" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Stock Quantity</label>
                        <input className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary outline-none text-sm" type="number" defaultValue="45" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Tax Category</label>
                        <select className="w-full bg-surface-container-low p-3 rounded-lg border border-transparent focus:border-primary outline-none text-sm appearance-none cursor-pointer">
                          <option>Standard (15%)</option>
                          <option>Reduced (5%)</option>
                          <option>Zero (0%)</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Images & Specs */}
                <div className="space-y-6">
                  {/* Product Images Card */}
                  <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Product Images</h2>
                      <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                        <span className="material-symbols-outlined text-sm">upload</span>
                        Add Media
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="aspect-square rounded-lg border-2 border-primary border-dashed overflow-hidden relative group cursor-pointer">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300" alt="Shoe" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="material-symbols-outlined text-white">edit</span>
                        </div>
                        <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider">MAIN</div>
                      </div>
                      <div className="aspect-square rounded-lg border border-outline-variant/30 overflow-hidden bg-surface flex items-center justify-center group cursor-pointer hover:border-primary transition-colors">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=300" alt="Shoe Detail" />
                      </div>
                      <div className="aspect-square rounded-lg border border-outline-variant/30 overflow-hidden bg-surface flex items-center justify-center group cursor-pointer hover:border-primary transition-colors">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=300" alt="Lifestyle" />
                      </div>
                      <div className="aspect-square rounded-lg border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-primary hover:border-primary/50 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                        <span className="text-[10px] font-bold mt-2 tracking-wider">UPLOAD</span>
                      </div>
                    </div>
                  </section>

                  {/* Specifications Card */}
                  <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
                    <h2 className="text-xl font-bold text-primary mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Specifications</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Attribute</label>
                          <input className="w-full bg-surface-container-low p-2.5 rounded-lg border border-transparent outline-none text-sm" type="text" defaultValue="Material" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold mb-1.5 text-on-surface-variant">Value</label>
                          <input className="w-full bg-surface-container-low p-2.5 rounded-lg border border-transparent outline-none text-sm" type="text" defaultValue="Recycled Flux-Mesh" />
                        </div>
                        <button className="mt-6 material-symbols-outlined text-error hover:bg-error-container p-2 rounded-full transition-colors cursor-pointer">delete</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input className="w-full bg-surface-container-low p-2.5 rounded-lg border border-transparent outline-none text-sm" type="text" defaultValue="Weight" />
                        </div>
                        <div className="flex-1">
                          <input className="w-full bg-surface-container-low p-2.5 rounded-lg border border-transparent outline-none text-sm" type="text" defaultValue="180g (Size 9)" />
                        </div>
                        <button className="material-symbols-outlined text-error hover:bg-error-container p-2 rounded-full transition-colors cursor-pointer">delete</button>
                      </div>
                      <button className="w-full py-3 border-2 border-dashed border-outline-variant/50 rounded-lg text-on-surface-variant text-sm font-bold hover:bg-surface-container-low hover:text-primary transition-all">
                        + Add New Attribute
                      </button>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          </div>

          {/* Live Preview Split-Pane */}
          <aside className="hidden xl:flex w-[420px] bg-surface-container-low border-l border-outline-variant/30 flex-col items-center justify-center p-8 relative">
            <div className="absolute top-8 left-8">
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface-variant tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                LIVE PREVIEW
              </span>
            </div>
            
            {/* Phone Mockup */}
            <div className="bg-white w-full max-w-[320px] aspect-[9/19.5] overflow-hidden flex flex-col shadow-2xl rounded-[40px] border-[12px] border-[#191c1d] scale-95 origin-center">
              {/* App Status Bar */}
              <div className="h-8 flex justify-between items-center px-4 pt-2">
                <span className="text-[10px] font-bold">9:41</span>
                <div className="flex gap-1">
                  <span className="material-symbols-outlined text-[10px]">signal_cellular_4_bar</span>
                  <span className="material-symbols-outlined text-[10px]">wifi</span>
                  <span className="material-symbols-outlined text-[10px]">battery_full</span>
                </div>
              </div>
              
              {/* App Content */}
              <div className="flex-1 overflow-y-auto pb-4">
                <div className="h-64 w-full relative">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" alt="Preview" />
                  <button className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-on-surface leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{productName || 'Product Name'}</h3>
                    <span className="material-symbols-outlined text-primary">favorite</span>
                  </div>
                  <p className="text-xl font-bold text-primary mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>${productPrice || '0.00'}</p>
                  
                  <div className="flex gap-2 mb-4">
                    <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">FASTEST DELIVERY</span>
                    <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">TOP RATED</span>
                  </div>
                  
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                    Engineered for pure speed and hyperlocal agility. The Apex features our responsive Flux-Core foam for maximum energy return.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold tracking-wider text-on-surface-variant">SELECT SIZE</p>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 border-2 border-primary rounded-lg flex items-center justify-center text-xs font-bold bg-primary-container text-on-primary-container cursor-pointer">9</div>
                      <div className="w-10 h-10 border border-outline-variant/50 rounded-lg flex items-center justify-center text-xs text-on-surface-variant cursor-pointer hover:border-primary/50">10</div>
                      <div className="w-10 h-10 border border-outline-variant/50 rounded-lg flex items-center justify-center text-xs text-on-surface-variant cursor-pointer hover:border-primary/50">11</div>
                      <div className="w-10 h-10 border border-outline-variant/50 rounded-lg flex items-center justify-center text-xs text-on-surface-variant cursor-pointer hover:border-primary/50">12</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="p-4 border-t border-surface-container-high bg-white">
                <button className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-xs text-on-surface-variant italic text-center opacity-70">Preview updates automatically as you type</p>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary cursor-pointer transition-colors">phone_iphone</span>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">tablet_mac</span>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">desktop_windows</span>
              </div>
            </div>
          </aside>

        </main>
      </div>

      {/* Sticky Footer Actions */}
      <footer className="fixed bottom-0 lg:left-64 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-outline-variant/30 py-4 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between z-50 gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
            <span className="font-medium">All changes synced</span>
          </div>
          <button className="hidden md:flex text-on-surface-variant hover:text-primary transition-colors items-center gap-2 text-sm font-bold">
            <span className="material-symbols-outlined text-lg">visibility</span>
            View in Store
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="hidden sm:block px-6 py-2.5 rounded-xl text-on-surface-variant text-sm font-bold hover:bg-surface-container-high transition-all">Discard Changes</button>
          <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-surface border-2 border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-all">Draft Save</button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? 'Saving...' : 'Save & Publish'}
            {!loading && <span className="material-symbols-outlined text-lg">rocket_launch</span>}
          </button>
        </div>
      </footer>

    </div>
  );
}
