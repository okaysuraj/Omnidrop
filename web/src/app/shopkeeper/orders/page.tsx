"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function OrderOperationsScreen() {
  const [showRiderModal, setShowRiderModal] = useState(false);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* Top Navigation */}
      <header className="h-16 flex justify-between items-center px-6 bg-[#131313] border-b border-[#3b4b39] z-40 sticky top-0">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/shopkeeper/dashboard" className="mr-4">
            <h1 className="text-xl font-bold text-[#6dff7f]">OmniDrop</h1>
            <p className="text-[#c8c6c5] uppercase tracking-widest text-[10px]">Merchant Portal</p>
          </Link>
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#b9ccb5] text-sm">search</span>
            <input className="w-full bg-[#0e0e0e] border border-[#3b4b39] rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-[#00e554] outline-none text-[#e5e2e1]" placeholder="Search orders, riders, or tracking IDs..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-[#b9ccb5]">
            <button className="hover:text-[#00e554] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <button className="hover:text-[#00e554] transition-colors"><span className="material-symbols-outlined">help</span></button>
          </div>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-[#3b4b39]">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Admin" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-16 md:w-64 bg-[#1b1b1c] shadow-md flex flex-col py-6 border-r border-[#3b4b39] z-30 shrink-0">
          <nav className="flex-1 space-y-1">
            <Link href="/shopkeeper/dashboard" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-[#c8c6c5] hover:text-[#00e554] mx-2 hover:bg-[#474746] rounded-lg transition-colors">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium hidden md:block">Dashboard</span>
            </Link>
            <Link href="/shopkeeper/dashboard" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-[#c8c6c5] hover:text-[#00e554] mx-2 hover:bg-[#474746] rounded-lg transition-colors">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-sm font-medium hidden md:block">Inventory</span>
            </Link>
            <Link href="#" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-[#00e554] bg-[#474746] rounded-lg mx-2 border-l-2 border-[#00e554]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              <span className="text-sm font-medium hidden md:block">Orders</span>
            </Link>
            <Link href="#" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-[#c8c6c5] hover:text-[#00e554] mx-2 hover:bg-[#474746] rounded-lg transition-colors">
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-sm font-medium hidden md:block">Analytics</span>
            </Link>
            <Link href="/shopkeeper/profile-setup" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-[#c8c6c5] hover:text-[#00e554] mx-2 hover:bg-[#474746] rounded-lg transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium hidden md:block">Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Dashboard Three-Pane Body */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          {/* Pane 1: Live Order Feed */}
          <section className="w-full md:w-80 lg:w-96 flex flex-col bg-[#1c1b1b] border-r border-[#3b4b39] shrink-0 h-64 md:h-auto">
            <div className="p-4 border-b border-[#3b4b39] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#edffe7]">Live Orders</h2>
              <div className="flex gap-1">
                <span className="bg-[#00ff5f]/10 text-[#00e554] px-2 py-0.5 rounded text-[10px] font-bold border border-[#00ff5f]/20 tracking-wider">42 ACTIVE</span>
              </div>
            </div>
            
            {/* Filters */}
            <div className="p-2 flex gap-2 overflow-x-auto no-scrollbar">
              <button className="px-3 py-1 bg-[#00e554] text-[#00390f] font-bold rounded-full text-[11px] whitespace-nowrap">All</button>
              <button className="px-3 py-1 border border-[#3b4b39] text-[#b9ccb5] hover:bg-[#2a2a2a] rounded-full text-[11px] whitespace-nowrap">Pending</button>
              <button className="px-3 py-1 border border-[#3b4b39] text-[#b9ccb5] hover:bg-[#2a2a2a] rounded-full text-[11px] whitespace-nowrap">Delayed</button>
              <button className="px-3 py-1 border border-[#3b4b39] text-[#b9ccb5] hover:bg-[#2a2a2a] rounded-full text-[11px] whitespace-nowrap">Refunds</button>
            </div>
            
            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-px bg-[#3b4b39]">
              
              {/* Order Item: Delayed */}
              <div className="bg-[#131313] p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors border-l-2 border-[#00e554]">
                <div className="flex justify-between mb-2">
                  <span className="text-[#00e554] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>#OD-8821</span>
                  <span className="text-[#ffb4ab] text-[10px] font-bold flex items-center gap-1 tracking-wider">
                    <span className="w-1.5 h-1.5 bg-[#ffb4ab] rounded-full"></span>
                    DELAYED (12m)
                  </span>
                </div>
                <h3 className="text-[#e5e2e1] font-bold text-sm">Industrial Power Cell x2</h3>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#b9ccb5]">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#353534] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs">person</span>
                    </div>
                    <span>Rider: Marcus V.</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>ETA: 14:22</span>
                </div>
              </div>
              
              {/* Order Item: Out for Delivery */}
              <div className="bg-[#131313] p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors border-l-2 border-transparent">
                <div className="flex justify-between mb-2">
                  <span className="text-[#b9ccb5] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>#OD-8822</span>
                  <span className="text-[#00e554] text-[10px] font-bold flex items-center gap-1 tracking-wider">
                    <span className="w-1.5 h-1.5 bg-[#00e554] rounded-full animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(0,229,84,0.6)]"></span>
                    IN TRANSIT
                  </span>
                </div>
                <h3 className="text-[#e5e2e1] font-bold text-sm">Diagnostic Toolkit V3</h3>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#b9ccb5]">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#353534] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs">person</span>
                    </div>
                    <span>Rider: Sarah L.</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>ETA: 08:45</span>
                </div>
              </div>

              {/* Order Item: Refund Request */}
              <div className="bg-[#353534]/30 p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors border-l-2 border-transparent">
                <div className="flex justify-between mb-2">
                  <span className="text-[#b9ccb5] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>#OD-8819</span>
                  <span className="text-[#c8c6c5] text-[10px] font-bold flex items-center gap-1 px-1.5 py-0.5 border border-[#3b4b39] bg-[#201f1f] tracking-wider">
                    REFUND CLAIM
                  </span>
                </div>
                <h3 className="text-[#e5e2e1] font-bold text-sm">Cryo-Coolant Gel (5L)</h3>
                <div className="mt-1">
                  <span className="text-[#ffb4ab] text-[10px] italic">"Damaged packaging upon arrival"</span>
                </div>
              </div>

            </div>
          </section>

          {/* Pane 2: Action Workspace (Details) */}
          <section className="flex-1 overflow-y-auto bg-[#201f1f] flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-[#3b4b39] bg-[#131313] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-[#e5e2e1]">Order #OD-8821</h2>
                  <span className="px-2 py-1 bg-[#93000a] text-[#ffb4ab] text-[10px] font-bold rounded tracking-wider">DELAYED</span>
                </div>
                <p className="text-[#b9ccb5] text-sm">Created 24 Oct 2023 at 13:45 • Customer: Nova Corp Industrial</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowRiderModal(true)}
                  className="px-4 py-2 border border-[#3b4b39] hover:bg-[#2a2a2a] transition-colors text-[#e5e2e1] font-bold text-sm rounded flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">rebase_edit</span>
                  Reassign Rider
                </button>
                <button className="px-4 py-2 bg-[#ffb4ab] text-[#690005] font-bold text-sm rounded hover:opacity-90 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Force Cancel
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Tracking & Map Section */}
              <div className="xl:col-span-7 space-y-6">
                <div className="bg-[#0e0e0e] border border-[#2d2d2d] rounded-lg overflow-hidden h-64 md:h-96 relative">
                  {/* Map Mockup */}
                  <div className="absolute inset-0 z-0 bg-[#2a2a2a] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')", filter: 'grayscale(100%) brightness(40%) contrast(120%)' }}></div>
                  <div className="absolute inset-0 bg-[#00e554]/5 mix-blend-color"></div>
                  
                  {/* Floating Telemetry Box */}
                  <div className="absolute bottom-4 right-4 z-10 bg-[#1e1e1e]/80 backdrop-blur-md p-3 border border-[#3b4b39] rounded-lg space-y-2 w-48">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#b9ccb5]">Speed</span>
                      <span className="text-[#00e554]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>42 km/h</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#b9ccb5]">Battery</span>
                      <span className="text-[#00e554]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>82%</span>
                    </div>
                    <div className="h-1 bg-[#3b4b39] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00e554] w-4/5"></div>
                    </div>
                  </div>
                </div>

                {/* Payload Manifest */}
                <div className="bg-[#131313] border border-[#3b4b39] rounded-lg p-5">
                  <h3 className="font-bold text-[#00e554] mb-4 uppercase tracking-widest text-xs">Payload Manifest</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-[#3b4b39]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#201f1f] flex items-center justify-center rounded border border-[#3b4b39]/30">
                          <span className="material-symbols-outlined text-[#b9ccb5]">battery_charging_full</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#e5e2e1] text-sm">Industrial Power Cell</p>
                          <p className="text-[11px] text-[#b9ccb5]">SKU: IPC-9000-X</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#e5e2e1]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>x2</p>
                        <p className="text-[#00e554] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>$4,200.00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#201f1f] flex items-center justify-center rounded border border-[#3b4b39]/30">
                          <span className="material-symbols-outlined text-[#b9ccb5]">precision_manufacturing</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#e5e2e1] text-sm">Diagnostic Toolkit V3</p>
                          <p className="text-[11px] text-[#b9ccb5]">SKU: DTK-V3-MOD</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#e5e2e1]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>x1</p>
                        <p className="text-[#00e554] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>$850.00</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#3b4b39] flex justify-between items-end">
                    <span className="text-[#b9ccb5] text-sm">Total Weight: 12.4kg</span>
                    <div className="text-right">
                      <span className="text-[#b9ccb5] text-[11px] uppercase tracking-wider block mb-1">Subtotal</span>
                      <span className="text-xl font-bold text-[#00e554]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>$5,050.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Logs */}
              <div className="xl:col-span-5 space-y-6">
                
                {/* Event Timeline */}
                <div className="bg-[#131313] border border-[#3b4b39] rounded-lg p-5">
                  <h3 className="font-bold text-[#00e554] mb-6 uppercase tracking-widest text-xs">Event Timeline</h3>
                  <div className="relative space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#3b4b39]">
                    
                    {/* Event 1 */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#201f1f] rounded-full flex items-center justify-center ring-4 ring-[#131313]">
                        <span className="material-symbols-outlined text-sm text-[#00e554]">check</span>
                      </div>
                      <p className="text-sm font-bold text-[#e5e2e1]">Order Confirmed</p>
                      <p className="text-[11px] text-[#b9ccb5] mt-0.5">13:45 • Automated System</p>
                    </div>
                    
                    {/* Event 2 */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#201f1f] rounded-full flex items-center justify-center ring-4 ring-[#131313]">
                        <span className="material-symbols-outlined text-sm text-[#00e554]">inventory_2</span>
                      </div>
                      <p className="text-sm font-bold text-[#e5e2e1]">Package Picked Up</p>
                      <p className="text-[11px] text-[#b9ccb5] mt-0.5">14:02 • Hub Alpha-7</p>
                    </div>
                    
                    {/* Event 3 (The Alert) */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#93000a] rounded-full flex items-center justify-center ring-4 ring-[#131313]">
                        <span className="material-symbols-outlined text-sm text-[#ffb4ab]">warning</span>
                      </div>
                      <p className="text-sm font-bold text-[#ffb4ab]">Delivery Delay Detected</p>
                      <p className="text-[11px] text-[#b9ccb5] mt-0.5">14:15 • Heavy traffic in Zone 4</p>
                      <div className="mt-3 p-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded">
                        <p className="text-[11px] text-[#ffb4ab]">System suggested route recalculation. ETA updated to +12 minutes.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispute & Refund */}
                <div className="bg-[#131313] border border-[#3b4b39] rounded-lg p-5">
                  <h3 className="font-bold text-[#00e554] mb-4 uppercase tracking-widest text-xs">Dispute & Refund</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-[#2a2a2a] rounded border border-[#3b4b39]">
                      <p className="text-[11px] text-[#b9ccb5] mb-2">No active refund claims for this order.</p>
                      <button className="w-full py-2 bg-[#474746] hover:bg-[#1b1b1c] text-[#e5e2e1] font-bold text-xs rounded transition-colors border border-[#3b4b39]">
                        Initiate Courtesy Refund
                      </button>
                    </div>
                    <div className="space-y-2">
                      <textarea className="w-full bg-[#0e0e0e] border border-[#3b4b39] rounded p-3 text-sm text-[#e5e2e1] outline-none focus:ring-1 focus:ring-[#00e554] min-h-[100px] resize-none" placeholder="Internal admin notes..."></textarea>
                      <button className="w-full py-2 bg-[#00e554] text-[#00390f] font-bold text-xs rounded hover:opacity-90 transition-opacity">Save Internal Note</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Manual Rider Assignment Modal */}
      {showRiderModal && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#131313]/80 backdrop-blur-sm" onClick={() => setShowRiderModal(false)}></div>
          <div className="relative h-full w-full max-w-md bg-[#0e0e0e] shadow-2xl border-l border-[#3b4b39] animate-in slide-in-from-right duration-300 flex flex-col">
            
            <div className="p-6 border-b border-[#3b4b39] flex justify-between items-center bg-[#131313]">
              <div>
                <h2 className="text-xl font-bold text-[#e5e2e1]">Rider Management</h2>
                <p className="text-[11px] text-[#b9ccb5] mt-1">Manual reassignment for #OD-8821</p>
              </div>
              <button className="text-[#b9ccb5] hover:text-[#e5e2e1] transition-colors" onClick={() => setShowRiderModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Availability Heatmap Mock */}
              <div>
                <h3 className="font-bold text-[#00e554] mb-3 uppercase tracking-widest text-xs">Nearby Availability</h3>
                <div className="aspect-video bg-[#201f1f] rounded-lg relative overflow-hidden border border-[#3b4b39]">
                  <div className="absolute inset-0 bg-[#2a2a2a] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')", filter: 'grayscale(100%) brightness(30%) contrast(150%)' }}></div>
                  <div className="absolute inset-0 bg-radial from-[#00e554]/30 to-transparent"></div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[#131313]/80 backdrop-blur text-[10px] text-[#00e554] rounded border border-[#00e554]/30 font-bold tracking-wider">
                    12 RIDERS WITHIN 2KM
                  </div>
                </div>
              </div>
              
              {/* Rider List */}
              <div className="space-y-3">
                <h3 className="font-bold text-[#00e554] mb-3 uppercase tracking-widest text-xs">Top Candidates</h3>
                
                {/* Rider Card 1 */}
                <div className="p-4 bg-[#131313] border border-[#2d2d2d] rounded-lg flex items-center justify-between hover:border-[#00e554]/50 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#201f1f] flex items-center justify-center border border-[#3b4b39]/50">
                      <span className="material-symbols-outlined text-[#00e554] text-sm">moped</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#e5e2e1] text-sm">Alex Chen</p>
                      <p className="text-[11px] text-[#b9ccb5] mt-0.5">320m away • Level 4 Courier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#00e554] text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>02m ETA</span>
                    <button className="block mt-1.5 text-[10px] text-[#00390f] bg-[#00e554] font-bold px-3 py-1 rounded w-full hover:opacity-90">ASSIGN</button>
                  </div>
                </div>
                
                {/* Rider Card 2 */}
                <div className="p-4 bg-[#131313] border border-[#2d2d2d] rounded-lg flex items-center justify-between hover:border-[#00e554]/50 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#201f1f] flex items-center justify-center border border-[#3b4b39]/50">
                      <span className="material-symbols-outlined text-[#b9ccb5] text-sm">moped</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#e5e2e1] text-sm">Elena Rodriguez</p>
                      <p className="text-[11px] text-[#b9ccb5] mt-0.5">850m away • Level 5 Courier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#b9ccb5] text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>06m ETA</span>
                    <button className="block mt-1.5 text-[10px] text-[#00390f] bg-[#00e554] font-bold px-3 py-1 rounded w-full hover:opacity-90">ASSIGN</button>
                  </div>
                </div>
                
                {/* Rider Card 3 (In-Progress) */}
                <div className="p-4 bg-[#131313]/50 border border-[#2d2d2d] rounded-lg flex items-center justify-between opacity-60 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#201f1f] flex items-center justify-center border border-[#3b4b39]/50">
                      <span className="material-symbols-outlined text-[#b9ccb5] text-sm">moped</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#e5e2e1] text-sm">Marcus V. (Active)</p>
                      <p className="text-[11px] text-[#b9ccb5] mt-0.5">Currently assigned</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="bg-[#93000a]/20 text-[#ffb4ab] px-2 py-1 text-[9px] font-bold rounded tracking-widest border border-[#ffb4ab]/20">DELAYED</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-[#3b4b39] bg-[#2a2a2a]">
              <button 
                onClick={() => setShowRiderModal(false)}
                className="w-full py-3 bg-[#474746] text-[#e5e2e1] font-bold text-sm rounded hover:bg-[#1b1b1c] transition-colors border border-[#3b4b39]"
              >
                Cancel Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
