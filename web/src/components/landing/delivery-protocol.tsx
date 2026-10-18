import { SectionTag } from './section-tag';

export function DeliveryProtocol() {
  return (
    <section id="protocol" className="border-b-2 border-black bg-[#FAFAF8] py-16 lg:py-20">
      <div className="container-brutal">
        <div className="max-w-xl mb-12">
          <SectionTag variant="black">{'// 04 THE DISPATCH PROTOCOL'}</SectionTag>
          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
            How Omnidrop Beats Legacy Apps By 25+ Minutes
          </h2>
          <p className="font-sans text-neutral-500 text-[15px] font-medium mt-2.5 leading-relaxed">
            Decentralized micro-hub routing instead of congested city-wide travel or slow suburban
            warehouses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Step 1 */}
          <div className="card-brutal p-6 sm:p-7 bg-white flex flex-col justify-between h-full">
            <div>
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-tech font-black text-sm border-2 border-black mb-4 shadow-[3px_3px_0px_#FFE600]">
                01
              </div>
              <div className="font-tech text-[10px] font-bold text-[#FF4800] uppercase mb-1.5 tracking-wider">
                {'STAGE 1 // T-00:45s'}
              </div>
              <h3 className="font-display font-black text-lg uppercase mb-2.5 text-[#0A0A0A]">
                Geodesic Proximity Match
              </h3>
              <p className="text-neutral-500 text-[13px] leading-relaxed">
                Orders are locked to the closest verified merchant node within 1.2km. Automated
                barcode validation checks shelf stock before debiting funds.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card-brutal p-6 sm:p-7 bg-white flex flex-col justify-between h-full">
            <div>
              <div className="w-10 h-10 bg-[#FFE600] text-black flex items-center justify-center font-tech font-black text-sm border-2 border-black mb-4 shadow-[3px_3px_0px_#000]">
                02
              </div>
              <div className="font-tech text-[10px] font-bold text-[#0A0A0A] uppercase mb-1.5 tracking-wider">
                {'STAGE 2 // T-02:15m'}
              </div>
              <h3 className="font-display font-black text-lg uppercase mb-2.5 text-[#0A0A0A]">
                Dual-Scan Pack & Tamper Seal
              </h3>
              <p className="text-neutral-500 text-[13px] leading-relaxed">
                The local storekeeper scans barcodes directly into the terminal. Items are packed in
                crush-proof totes sealed with a serialized security band.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card-brutal p-6 sm:p-7 bg-white flex flex-col justify-between h-full">
            <div>
              <div className="w-10 h-10 bg-[#00E599] text-black flex items-center justify-center font-tech font-black text-sm border-2 border-black mb-4 shadow-[3px_3px_0px_#000]">
                03
              </div>
              <div className="font-tech text-[10px] font-bold text-[#059669] uppercase mb-1.5 tracking-wider">
                {'STAGE 3 // T-17:30m'}
              </div>
              <h3 className="font-display font-black text-lg uppercase mb-2.5 text-[#0A0A0A]">
                Direct-Path Courier Drop
              </h3>
              <p className="text-neutral-500 text-[13px] leading-relaxed">
                A nearby cargo bike or light EV courier receives direct telemetry instructions,
                bypassing car traffic gridlocks via cycleway corridors.
              </p>
            </div>
          </div>
        </div>

        {/* SLA Comparison Table */}
        <div className="mt-12 border-2 border-black bg-white shadow-[6px_6px_0px_#000] overflow-x-auto">
          <table className="w-full text-left font-tech text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b-2 border-black bg-[#0A0A0A] text-white">
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider w-[28%]">
                  OPERATIONAL VECTOR
                </th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider bg-[#FFE600] text-black border-x-2 border-black w-[24%]">
                  OMNIDROP ENGINE
                </th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider w-[24%]">
                  LEGACY FOOD APPS
                </th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider w-[24%]">
                  1-DAY WAREHOUSE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10">
              <tr className="hover:bg-[#FAFAF8] transition-colors duration-100">
                <td className="py-3.5 px-5 font-bold text-[#0A0A0A]">Delivery Radius</td>
                <td className="py-3.5 px-5 font-bold bg-[#FFE600]/15 border-x-2 border-black text-[#0A0A0A]">
                  0.5 — 2.0 km (Hyperlocal)
                </td>
                <td className="py-3.5 px-5 text-neutral-500">5.0 — 15.0 km (City-wide)</td>
                <td className="py-3.5 px-5 text-neutral-500">30+ km (Suburban)</td>
              </tr>
              <tr className="hover:bg-[#FAFAF8] transition-colors duration-100">
                <td className="py-3.5 px-5 font-bold text-[#0A0A0A]">Median Doorstep Time</td>
                <td className="py-3.5 px-5 font-bold bg-[#FFE600]/15 border-x-2 border-black text-[#FF4800]">
                  17.4 Minutes
                </td>
                <td className="py-3.5 px-5 text-neutral-500">45 — 65 Minutes</td>
                <td className="py-3.5 px-5 text-neutral-500">12 — 24 Hours</td>
              </tr>
              <tr className="hover:bg-[#FAFAF8] transition-colors duration-100">
                <td className="py-3.5 px-5 font-bold text-[#0A0A0A]">Price Markups on Shelves</td>
                <td className="py-3.5 px-5 font-bold bg-[#FFE600]/15 border-x-2 border-black text-[#059669]">
                  $0.00 (Zero Markup)
                </td>
                <td className="py-3.5 px-5 text-neutral-500">+15% to +35% Markup</td>
                <td className="py-3.5 px-5 text-neutral-500">Fluctuating Dynamic</td>
              </tr>
              <tr className="hover:bg-[#FAFAF8] transition-colors duration-100">
                <td className="py-3.5 px-5 font-bold text-[#0A0A0A]">Merchant Take Rate</td>
                <td className="py-3.5 px-5 font-bold bg-[#FFE600]/15 border-x-2 border-black text-[#0A0A0A]">
                  6% Flat (Keep 94%)
                </td>
                <td className="py-3.5 px-5 text-neutral-500">25% — 35% Commission</td>
                <td className="py-3.5 px-5 text-neutral-500">Supplier Wholesale Margin</td>
              </tr>
              <tr className="hover:bg-[#FAFAF8] transition-colors duration-100">
                <td className="py-3.5 px-5 font-bold text-[#0A0A0A]">Fleet Vehicles</td>
                <td className="py-3.5 px-5 font-bold bg-[#FFE600]/15 border-x-2 border-black text-[#0A0A0A]">
                  Cargo Bikes & Light EVs
                </td>
                <td className="py-3.5 px-5 text-neutral-500">Gridlocked Automobiles</td>
                <td className="py-3.5 px-5 text-neutral-500">Heavy Diesel Vans</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
