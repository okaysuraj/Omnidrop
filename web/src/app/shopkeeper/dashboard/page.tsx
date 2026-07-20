"use client";

import React from 'react';
import Link from 'next/link';

export default function InventoryCentralDashboard() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant/30 py-6 gap-2 shadow-md z-50">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container">store</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>Global Store</h2>
              <p className="text-xs font-bold text-on-surface-variant opacity-70 uppercase tracking-wider">Verified Merchant</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <Link href="/shopkeeper/dashboard" className="flex items-center gap-3 py-3 px-4 text-on-surface-variant mx-2 hover:bg-surface-container-high rounded-lg transition-all duration-200 font-bold text-sm">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/shopkeeper/dashboard" className="flex items-center gap-3 py-3 px-4 bg-primary-container text-on-primary-container rounded-lg mx-2 transition-all duration-200 active:translate-x-1 font-bold text-sm shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            <span>Inventory</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 py-3 px-4 text-on-surface-variant mx-2 hover:bg-surface-container-high rounded-lg transition-all duration-200 font-bold text-sm">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>Orders</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 py-3 px-4 text-on-surface-variant mx-2 hover:bg-surface-container-high rounded-lg transition-all duration-200 font-bold text-sm">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </Link>
          <Link href="/shopkeeper/profile-setup" className="flex items-center gap-3 py-3 px-4 text-on-surface-variant mx-2 hover:bg-surface-container-high rounded-lg transition-all duration-200 font-bold text-sm">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="px-4 mt-auto">
          <button className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md">
            <span className="material-symbols-outlined">add</span>
            Add Product
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-64 flex flex-col relative min-h-screen">
        
        {/* TopNavBar */}
        <header className="w-full top-0 sticky z-40 bg-surface shadow-sm flex justify-between items-center px-4 py-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-6">
            <span className="text-2xl font-bold text-primary lg:hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>MerchantHub</span>
            <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/50 w-80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-variant mr-2 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" placeholder="Search inventory, SKUs, tags..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="material-symbols-outlined p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-150">notifications</button>
            <button className="material-symbols-outlined p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-150">help</button>
            <div className="h-8 w-px bg-outline-variant/50 mx-2"></div>
            <div className="flex items-center gap-2 pl-2 cursor-pointer">
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" alt="Admin" />
              <div className="hidden lg:block text-right">
                <p className="font-bold text-sm text-on-surface leading-none">Alex Rivera</p>
                <p className="text-xs font-medium text-on-surface-variant mt-1">Store Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Canvas Content */}
        <div className="p-5 md:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
          
          {/* Header Section with Quick Stats */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Inventory Central</h1>
              <p className="text-base text-on-surface-variant">Unified stock management and performance tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-low transition-all">Export CSV</button>
              <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">sync</span>
                Sync POS
              </button>
            </div>
          </section>

          {/* Alerts: Low Stock */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-6 border border-error/20 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-error flex items-center justify-center flex-shrink-0 z-10">
                <span className="material-symbols-outlined text-on-error">priority_high</span>
              </div>
              <div className="flex-1 z-10">
                <h4 className="text-xl font-bold leading-tight mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Critical Low Stock Alert</h4>
                <p className="text-sm">4 SKU items are below their safety threshold and require immediate replenishment to avoid stockouts.</p>
              </div>
              <button className="bg-on-error-container text-error-container px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap hover:opacity-90 transition-all z-10 shadow-sm">Restock Now</button>
            </div>
            
            <div className="bg-secondary-container text-on-secondary-container p-6 rounded-xl flex items-center gap-4 border border-secondary/20 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-secondary">local_shipping</span>
              </div>
              <div>
                <h4 className="text-lg font-bold leading-tight mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Incoming Shipments</h4>
                <p className="text-sm opacity-80">2 purchase orders arriving today from Urban Supply Co.</p>
              </div>
            </div>
          </section>

          {/* Filters & Tools Bar */}
          <section className="bg-surface-container-lowest p-4 rounded-xl flex flex-wrap items-center gap-4 border border-outline-variant/30 shadow-sm">
            <div className="flex-1 min-w-[280px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">filter_list</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" placeholder="Filter by product name, SKU, or category..." type="text" />
            </div>
            <select className="bg-surface-container-low border border-transparent rounded-lg font-bold text-sm px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface-variant outline-none transition-all cursor-pointer">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Lifestyle</option>
              <option>Appliances</option>
            </select>
            <select className="bg-surface-container-low border border-transparent rounded-lg font-bold text-sm px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface-variant outline-none transition-all cursor-pointer">
              <option>Stock Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <div className="h-8 w-px bg-outline-variant/50 mx-2 hidden md:block"></div>
            <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">tune</span>
            </button>
            <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">view_module</span>
            </button>
          </section>

          {/* Inventory Table */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30">
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Product & SKU</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Stock Level</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  
                  {/* Product Row 1 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/20">
                          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=150" alt="Mug" />
                        </div>
                        <div>
                          <p className="text-base text-on-surface font-bold">Artisan Ceramic Mug</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">SKU: ART-CER-001</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary-container/50 text-on-secondary-container rounded-full text-xs font-bold">Kitchenware</span>
                    </td>
                    <td className="px-6 py-4 text-base text-on-surface font-medium">$24.00</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-primary h-full w-[85%]"></div>
                        </div>
                        <span className="text-xs font-bold text-on-primary-container">142 Units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,110,36,0.6)]"></div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1">edit</button>
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-1">more_vert</button>
                    </td>
                  </tr>

                  {/* Product Row 2 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/20">
                          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150" alt="Headphones" />
                        </div>
                        <div>
                          <p className="text-base text-on-surface font-bold">Arctic Wireless Headphones</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">SKU: AUD-ARC-992</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary-container/50 text-on-secondary-container rounded-full text-xs font-bold">Electronics</span>
                    </td>
                    <td className="px-6 py-4 text-base text-on-surface font-medium">$299.99</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-tertiary h-full w-[12%]"></div>
                        </div>
                        <span className="text-xs font-bold text-tertiary">8 Units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                        <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Low Stock</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1">edit</button>
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-1">more_vert</button>
                    </td>
                  </tr>
                  
                  {/* Product Row 3 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/20">
                          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150" alt="Desk Set" />
                        </div>
                        <div>
                          <p className="text-base text-on-surface font-bold">Eco-Bamboo Desk Set</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">SKU: OFF-BAM-441</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary-container/50 text-on-secondary-container rounded-full text-xs font-bold">Office Supply</span>
                    </td>
                    <td className="px-6 py-4 text-base text-on-surface font-medium">$45.50</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-primary h-full w-[45%]"></div>
                        </div>
                        <span className="text-xs font-bold text-on-primary-container">64 Units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,110,36,0.6)]"></div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1">edit</button>
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-1">more_vert</button>
                    </td>
                  </tr>

                  {/* Product Row 4 (Out of Stock) */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group opacity-60 bg-surface-container-lowest">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/20 grayscale">
                          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=150" alt="Watch" />
                        </div>
                        <div>
                          <p className="text-base text-on-surface font-bold text-on-surface-variant">Titanium Smart Watch V2</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">SKU: WTC-TIT-002</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-xs font-bold">Electronics</span>
                    </td>
                    <td className="px-6 py-4 text-base text-on-surface-variant font-medium">$189.00</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-error h-full w-[0%]"></div>
                        </div>
                        <span className="text-xs font-bold text-error">0 Units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-error"></div>
                        <span className="text-xs font-bold text-error uppercase tracking-wider">Out of Stock</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1">edit</button>
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-1">more_vert</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-surface-container-lowest flex justify-between items-center border-t border-outline-variant/30">
              <p className="text-xs text-on-surface-variant font-bold">Showing 1-10 of 1,240 items</p>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-sm shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant font-bold text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant font-bold text-sm">3</button>
                <span className="text-on-surface-variant font-bold text-sm px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant font-bold text-sm">124</button>
                <button className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Bento Grid: Insights */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Inventory Value</p>
                <span className="material-symbols-outlined text-primary">payments</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>$248,500.00</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-bold flex items-center bg-primary/10 px-2 py-0.5 rounded-full"><span className="material-symbols-outlined text-[12px] mr-1">trending_up</span> 12.4%</span>
                <span className="text-xs text-on-surface-variant">vs last month</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Total SKUs</p>
                <span className="material-symbols-outlined text-secondary">inventory</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>1,240</h3>
              <p className="text-xs text-on-surface-variant">across 12 categories</p>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Turnover Rate</p>
                <span className="material-symbols-outlined text-tertiary">autorenew</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>4.2x</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-[12px] mr-1">arrow_upward</span> High</span>
                <span className="text-xs text-on-surface-variant">Excellent health</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">System Status</p>
                <span className="material-symbols-outlined text-primary rounded-full animate-[pulse_2s_infinite]">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-1 relative z-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>Live Sync</h3>
              <p className="text-xs text-on-surface-variant relative z-10">Last updated 2 mins ago</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
