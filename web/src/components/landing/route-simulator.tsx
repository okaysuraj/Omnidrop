'use client';

import { Activity, Compass, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SectionTag } from './section-tag';

const DROP_ZONES = [
  {
    id: 'downtown',
    name: 'Downtown Core / Sector 4',
    hub: 'Hub #04 Central',
    dist: 0.6,
    baseMin: 14,
  },
  { id: 'arts', name: 'Arts & Warehouse Quarter', hub: 'Hub #11 Westside', dist: 1.1, baseMin: 17 },
  {
    id: 'tech',
    name: 'Innovation Campus / East',
    hub: 'Hub #09 Tech Corridor',
    dist: 0.9,
    baseMin: 15,
  },
  {
    id: 'suburban',
    name: 'North Heights Residential',
    hub: 'Hub #18 Ridge Road',
    dist: 2.1,
    baseMin: 22,
  },
];

export function RouteSimulator() {
  const [selectedZone, setSelectedZone] = useState(DROP_ZONES[0]);
  const [urgencyMode, setUrgencyMode] = useState<'standard' | 'express'>('express');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );
  const handleRunSimulation = () => {
    timers.current.forEach(clearTimeout);
    setIsSimulating(true);
    setSimStep(1);
    timers.current = [
      setTimeout(() => setSimStep(2), 700),
      setTimeout(() => setSimStep(3), 1500),
      setTimeout(() => {
        setSimStep(4);
        setIsSimulating(false);
      }, 2400),
    ];
  };
  const calculatedEta =
    urgencyMode === 'express' ? Math.max(12, selectedZone.baseMin - 3) : selectedZone.baseMin;
  return (
    <section id="simulator" className="border-b-2 border-black bg-white py-16 lg:py-20">
      <div className="container-brutal">
        <div className="max-w-xl mb-12">
          <SectionTag variant="yellow">{'// 01 ROUTE SIMULATOR'}</SectionTag>
          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] uppercase tracking-tight text-[#0A0A0A] leading-[1.1]">
            Simulate A Live Drop In Your Zone
          </h2>
          <p className="font-sans text-neutral-500 text-[15px] font-medium mt-2.5 leading-relaxed">
            Calculate exact physical transit times, assigned micro-hub dark stores, and courier
            dispatch telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Control Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {/* Zone Picker */}
            <div className="border-2 border-black p-5 bg-[#FAFAF8] shadow-[4px_4px_0px_#000]">
              <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-4 flex items-center justify-between">
                <span>1. Select Delivery Quadrant</span>
                <MapPin className="w-3.5 h-3.5" />
              </label>
              <div className="space-y-2.5">
                {DROP_ZONES.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`w-full text-left p-3.5 border-2 border-black font-tech text-xs flex items-center justify-between transition-all duration-100 ${
                        isSelected
                          ? 'bg-[#0A0A0A] text-white shadow-[2px_2px_0px_#FFE600]'
                          : 'bg-white hover:bg-[#FFE600] text-[#0A0A0A]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{zone.name}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}
                        >
                          {zone.hub} · {zone.dist} km
                        </div>
                      </div>
                      <div className="font-bold text-sm">~{zone.baseMin} MIN</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speed Mode */}
            <div className="border-2 border-black p-5 bg-[#FAFAF8] shadow-[4px_4px_0px_#000]">
              <label className="block font-tech text-xs uppercase tracking-wider font-bold mb-4 flex items-center justify-between">
                <span>2. Dispatch Velocity Protocol</span>
                <Zap className="w-3.5 h-3.5" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgencyMode('express')}
                  className={`p-3.5 border-2 border-black font-tech text-xs text-center font-bold transition-all duration-100 ${
                    urgencyMode === 'express'
                      ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-neutral-50 text-[#0A0A0A]'
                  }`}
                >
                  <div className="font-black text-xs">RAPID DROP</div>
                  <div className="text-[10px] text-neutral-600 mt-1">Priority Bike</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgencyMode('standard')}
                  className={`p-3.5 border-2 border-black font-tech text-xs text-center font-bold transition-all duration-100 ${
                    urgencyMode === 'standard'
                      ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-neutral-50 text-[#0A0A0A]'
                  }`}
                >
                  <div className="font-black text-xs">STANDARD</div>
                  <div className="text-[10px] text-neutral-600 mt-1">Batch Routed</div>
                </button>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full btn-brutal-yellow !h-12 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>CALCULATING TELEMETRY NODES...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>EXECUTE LIVE ROUTE PROFILER</span>
                </>
              )}
            </button>
          </div>

          {/* Right Terminal Output */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border-2 border-black bg-[#0A0A0A] text-white p-6 sm:p-7 shadow-[6px_6px_0px_#FFE600] font-tech text-xs h-full flex flex-col justify-between">
              {/* Window Header */}
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#FF4800] inline-block" />
                    <span className="w-2.5 h-2.5 bg-[#FFE600] inline-block" />
                    <span className="w-2.5 h-2.5 bg-[#00E599] inline-block" />
                    <span className="ml-2 font-bold tracking-widest uppercase text-neutral-300">
                      ROUTING_KERNEL_v2.log
                    </span>
                  </div>
                  <span className="text-[#00E599] font-bold">● LATENCY: 14MS</span>
                </div>

                {/* Metrics Banner */}
                <div className="grid grid-cols-4 gap-3 bg-neutral-900 border border-neutral-800 p-3.5 mb-6 text-center">
                  <div>
                    <span className="text-neutral-500 block text-[9px]">TOTAL ETA</span>
                    <span className="text-[#FFE600] font-black text-lg">{calculatedEta} MIN</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px]">CORRIDOR</span>
                    <span className="text-white font-bold text-lg">{selectedZone.dist} KM</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px]">PACK TIME</span>
                    <span className="text-white font-bold text-lg">1m 30s</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px]">SURGE FEE</span>
                    <span className="text-[#00E599] font-bold text-lg">$0.00</span>
                  </div>
                </div>

                {/* Telemetry Steps */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#FFE600] font-bold">[01]</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase">
                          NEAREST MICRO-HUB ASSIGNED
                        </span>
                        <span className="text-[#00E599] text-[10px] font-bold">RESOLVED</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                        {selectedZone.hub} selected with 100% SKU availability. Physical shelf
                        barcode verified.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-[#FFE600] font-bold">[02]</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase">
                          PICK & TAMPER TOTE SEAL
                        </span>
                        <span className="text-[#FFE600] text-[10px] font-bold">90 SEC SLA</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                        Dual-scan verification. Insulated crush-proof tote locked with serialized
                        tamper tag.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-[#FFE600] font-bold">[03]</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase">
                          DIRECT-PATH COURIER DISPATCH
                        </span>
                        <span className="text-[#00E599] text-[10px] font-bold">PATH OPTIMIZED</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                        Turn-by-turn bypass of car-traffic gridlocks via dedicated urban cycleway
                        corridors.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulation Progress */}
                {isSimulating && (
                  <div className="mt-6 p-3.5 bg-neutral-900 border-2 border-[#FFE600] text-[#FFE600]">
                    <div className="font-bold mb-2 text-[11px]">
                      {simStep === 1 && '>> PINGING MICRO-HUBS IN QUADRANT...'}
                      {simStep === 2 && '>> CHECKING RFID SHELF INVENTORY...'}
                      {simStep === 3 && '>> DISPATCHING HIGH-SPEED COURIER VECTOR...'}
                      {simStep === 4 && '>> ROUTING PROFILE READY.'}
                    </div>
                    <div className="w-full bg-black h-2.5 border border-neutral-700">
                      <div
                        className="bg-[#FFE600] h-full transition-all duration-300"
                        style={{ width: `${(simStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="pt-5 mt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-neutral-400">
                  Ready to drop real groceries from {selectedZone.hub}?
                </div>
                <Link
                  href="/explore"
                  className="px-4 py-2 bg-[#FFE600] text-black font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-white transition-all duration-100 shadow-[2px_2px_0px_#FFF]"
                >
                  Open Catalog →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
