'use client';

import { Bike, Check, CheckCircle2, Loader2, MapPin, PackageCheck, Store } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const zones = [
  { id: 'downtown', name: 'Downtown Core / Sector 4', distance: 0.6, minutes: 14 },
  { id: 'arts', name: 'Arts & Warehouse Quarter', distance: 1.1, minutes: 17 },
  { id: 'tech', name: 'Innovation Campus / East', distance: 0.9, minutes: 15 },
  { id: 'suburban', name: 'North Heights Residential', distance: 2.1, minutes: 22 },
];
const stages = [
  { label: 'Order received by your local shop', icon: Store },
  { label: 'Groceries packed with care', icon: PackageCheck },
  { label: 'Delivery partner on the way', icon: Bike },
];

export function RouteSimulator() {
  const [zoneId, setZoneId] = useState(zones[0].id);
  const [mode, setMode] = useState('express');
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const zone = zones.find((item) => item.id === zoneId)!;
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function run() {
    timers.current.forEach(clearTimeout);
    setRunning(true);
    setStep(1);
    timers.current = [
      setTimeout(() => setStep(2), 700),
      setTimeout(() => setStep(3), 1400),
      setTimeout(() => {
        setStep(4);
        setRunning(false);
      }, 2100),
    ];
  }
  function reset() {
    timers.current.forEach(clearTimeout);
    setStep(0);
    setRunning(false);
  }
  return (
    <section id="simulator" className="pb-16 lg:pb-24">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 border border-line rounded-[28px] p-6 sm:p-9 lg:p-12 bg-surface">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-.04em]">
              See how a delivery comes together.
            </h2>
            <p className="mt-3 text-sm leading-7 text-secondary">
              Try an example route. This preview uses sample neighborhoods and estimated times, not
              live delivery availability.
            </p>
            <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-3">
              <div>
                <label htmlFor="delivery-zone" className="field-label">
                  Sample neighborhood
                </label>
                <select
                  id="delivery-zone"
                  className="field-input text-xs sm:text-sm"
                  value={zoneId}
                  onChange={(event) => {
                    setZoneId(event.target.value);
                    reset();
                  }}
                >
                  {zones.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="delivery-speed" className="field-label">
                  Delivery option
                </label>
                <select
                  id="delivery-speed"
                  className="field-input"
                  value={mode}
                  onChange={(event) => {
                    setMode(event.target.value);
                    reset();
                  }}
                >
                  <option value="express">Express</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
            </div>
            <button type="button" onClick={run} disabled={running} className="button-primary mt-5">
              {running ? <Loader2 size={17} className="animate-spin" /> : <Bike size={17} />}
              {running ? 'Previewing delivery…' : 'Preview delivery'}
            </button>
          </div>
          <div className="rounded-2xl bg-canvas border border-line p-6 self-center">
            <div className="flex gap-3 items-center pb-5 mb-5 border-b border-line">
              <MapPin size={22} className="text-brand" />
              <div>
                <span className="text-xs text-secondary">Example delivery estimate</span>
                <p className="text-2xl font-bold tracking-tight tabular-nums">
                  {mode === 'express' ? Math.max(12, zone.minutes - 3) : zone.minutes} minutes
                  <span className="text-sm text-secondary font-medium ml-3">
                    {zone.distance} km
                  </span>
                </p>
              </div>
            </div>
            <ol className="space-y-5" aria-label="Sample delivery progress">
              {stages.map(({ label, icon: Icon }, index) => (
                <li key={label} className="flex gap-3 items-center text-sm">
                  <span
                    className={
                      'flex size-8 items-center justify-center rounded-full ' +
                      (step > index + 1 ? 'bg-brand text-on-brand' : 'bg-muted text-secondary')
                    }
                  >
                    {step > index + 1 ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  <span className={step > index ? 'text-ink font-semibold' : 'text-secondary'}>
                    {label}
                  </span>
                </li>
              ))}
            </ol>
            <p
              aria-live="polite"
              className="text-xs text-brand font-semibold mt-5 min-h-5 flex items-center gap-2"
            >
              {step === 4 ? (
                <>
                  <CheckCircle2 size={15} />
                  Preview complete. Your example order has arrived.
                </>
              ) : running ? (
                'Showing a sample delivery journey…'
              ) : (
                'Choose a neighborhood, then start the preview.'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
