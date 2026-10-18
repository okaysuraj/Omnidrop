'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import { useSocket } from '@/providers/socket-provider';
import type * as Models from '@/types';
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  MapPin,
  Navigation,
  Package,
  Power,
  Radio,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DeliveryDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { socket, connected } = useSocket();
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<Models.DeliveryTask | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Models.DeliveryTask[]>([]);
  const [earnings, setEarnings] = useState<Models.Earnings | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'earnings'>('active');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'DELIVERY_PARTNER' && user.role !== 'ADMIN'))) {
      router.push('/');
      return;
    }
    const loadData = async () => {
      try {
        const [active, available, earn] = await Promise.all([
          api.delivery.activeTask().catch(() => null),
          api.delivery.available().catch(() => []),
          api.delivery.earnings().catch(() => null),
        ]);
        setActiveTask(active);
        setAvailableTasks(available);
        setEarnings(earn);
        setIsAvailable(user?.isAvailable || false);
      } catch {
        /* ignore */
      }
    };
    if (user) loadData();
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!connected || !socket || !activeTask || activeTask.status !== 'IN_TRANSIT') return;

    const interval = setInterval(() => {
      const jitterLat = (Math.random() - 0.5) * 0.001;
      const jitterLng = (Math.random() - 0.5) * 0.001;

      const newLocation = {
        lat: Number(activeTask.currentLat || activeTask.pickupLat || 12.9716) + jitterLat,
        lng: Number(activeTask.currentLng || activeTask.pickupLng || 77.5946) + jitterLng,
      };

      socket.emit('delivery:location_update', {
        taskId: activeTask.id,
        orderId: activeTask.orderId,
        ...newLocation,
      });

      setActiveTask((prev) =>
        prev
          ? {
              ...prev,
              currentLat: newLocation.lat,
              currentLng: newLocation.lng,
            }
          : null,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [connected, socket, activeTask]);

  const toggleAvailability = async () => {
    try {
      const result = await api.delivery.toggleAvailability();
      setIsAvailable(result.isAvailable);
    } catch {
      /* ignore */
    }
  };

  const acceptTask = async (taskId: string) => {
    setActionLoading(true);
    try {
      const task = await api.delivery.acceptTask(taskId);
      setActiveTask(task);
      setAvailableTasks((prev) => prev.filter((t) => t.id !== taskId));
      setActiveTab('active');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to accept task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!activeTask) return;
    setActionLoading(true);
    try {
      const task = await api.delivery.updateStatus(activeTask.id, status);
      if (status === 'DELIVERED') {
        setActiveTask(null);
        // Refresh available and earnings
        const [available, earn] = await Promise.all([
          api.delivery.available().catch(() => []),
          api.delivery.earnings().catch(() => null),
        ]);
        setAvailableTasks(available);
        setEarnings(earn);
      } else {
        setActiveTask(task);
      }
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to update delivery status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Terminal Header & Status Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// FLEET TELEMETRY · COURIER DISPATCH CONSOLE'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900 flex items-center gap-3">
              <Bike className="w-8 h-8 text-black" />
              Rider Flight Station
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Active pilot:{' '}
              <strong className="text-black">{user?.fullName || 'Verified Courier'}</strong> · Node:
              Indiranagar Hub
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Socket Beacon */}
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-white font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000]">
              <span
                className={`w-2.5 h-2.5 rounded-none border border-black ${connected ? 'bg-[#00E599]' : 'bg-[#FF4800]'}`}
              />
              <span>{connected ? 'GPS MESH LIVE' : 'SYNC PENDING'}</span>
            </div>

            {/* Duty Status Switch */}
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 border-2 border-black font-tech text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isAvailable
                  ? 'bg-[#00E599] text-black shadow-[3px_3px_0px_#000]'
                  : 'bg-neutral-200 text-neutral-700 shadow-[2px_2px_0px_#000]'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isAvailable ? 'STATUS: ON DUTY' : 'STATUS: OFF DUTY'}</span>
            </button>
          </div>
        </div>

        {/* Dispatch Console Tabs */}
        <div className="flex flex-wrap gap-2 font-tech text-xs uppercase font-bold">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 border-2 border-black transition-all ${
              activeTab === 'active'
                ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]'
            }`}
          >
            ⚡ Active Mission {activeTask && '(1)'}
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 border-2 border-black transition-all ${
              activeTab === 'available'
                ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]'
            }`}
          >
            📡 Radar Tasks ({availableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 border-2 border-black transition-all ${
              activeTab === 'earnings'
                ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]'
            }`}
          >
            💰 Rider Earnings Ledger
          </button>
        </div>

        {/* Tab 1: Active Mission Manifest */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeTask ? (
              <div className="card-brutal p-6 md:p-8 bg-white space-y-6 border-2 border-black shadow-[6px_6px_0px_#000]">
                {/* Mission Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-tech text-xs bg-black text-[#FFE600] px-2 py-0.5 font-bold uppercase">
                        ACTIVE RUN #{activeTask.id?.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-tech text-xs bg-[#00E599] text-black px-2 py-0.5 font-bold uppercase border border-black">
                        STATUS: {activeTask.status}
                      </span>
                    </div>
                    <p className="font-display font-black text-2xl uppercase text-neutral-900 mt-2">
                      Order Value: ₹{activeTask.order?.total} · Courier Bounty: ₹
                      {Math.round((activeTask.order?.deliveryFee || 45) * 0.85)}
                    </p>
                  </div>

                  <div className="font-tech text-xs text-neutral-600">
                    <p>
                      Corridor SLA: <strong>12-MIN EXPEDITED</strong>
                    </p>
                  </div>
                </div>

                {/* Waypoints Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Waypoint A: Pickup */}
                  <div className="p-4 border-2 border-black bg-neutral-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-black uppercase text-neutral-500">
                        {'// WAYPOINT 01: HUB PICKUP'}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-none bg-black"></span>
                    </div>
                    <p className="font-sans font-black text-lg text-neutral-900">
                      {activeTask.order?.store?.name || 'Local Omni Store'}
                    </p>
                    <p className="font-sans text-xs text-neutral-600 font-medium">
                      {activeTask.order?.store?.address || 'Indiranagar 100ft Hub, Bengaluru'}
                    </p>
                    <div className="pt-2 text-[11px] font-tech text-neutral-700">
                      Items to collect:{' '}
                      <strong>{activeTask.order?.items?.length || 1} packaged parcel(s)</strong>
                    </div>
                  </div>

                  {/* Waypoint B: Dropoff */}
                  <div className="p-4 border-2 border-black bg-[#FFE600]/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-black uppercase text-neutral-700">
                        {'// WAYPOINT 02: CUSTOMER DOORSTEP'}
                      </span>
                      <MapPin className="w-4 h-4 text-[#FF4800]" />
                    </div>
                    <p className="font-sans font-black text-lg text-neutral-900">
                      Dropoff Destination
                    </p>
                    <p className="font-sans text-xs text-neutral-800 font-medium">
                      {activeTask.order?.deliveryAddress || 'Customer Address Pending'}
                    </p>
                    {activeTask.order?.deliveryInstructions && (
                      <div className="p-2 border border-black bg-white text-[11px] font-tech mt-2">
                        {'Gate instructions: "'}
                        {activeTask.order?.deliveryInstructions}
                        {'"'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-tech text-xs text-neutral-600">
                    Press the button once physical milestone is reached:
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {activeTask.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus('PICKED_UP')}
                        disabled={actionLoading}
                        className="btn-brutal-yellow w-full sm:w-auto !h-12 !px-6 text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
                      >
                        <Package className="w-4 h-4" />
                        <span>Confirm Store Pickup</span>
                      </button>
                    )}

                    {activeTask.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleUpdateStatus('IN_TRANSIT')}
                        disabled={actionLoading}
                        className="btn-brutal-black w-full sm:w-auto !h-12 !px-6 text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#FFE600]"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Begin Flight & GPS Broadcast</span>
                      </button>
                    )}

                    {activeTask.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleUpdateStatus('DELIVERED')}
                        disabled={actionLoading}
                        className="btn-brutal-black !bg-[#00E599] !text-black w-full sm:w-auto !h-12 !px-6 text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Handover Complete (Mark Delivered)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-brutal p-12 text-center bg-white space-y-4">
                <Bike className="w-12 h-12 mx-auto text-neutral-400" />
                <h3 className="font-display font-black text-2xl uppercase text-neutral-900">
                  Ready For Next Mission
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                  You are currently idle. Switch to the <strong>Radar Tasks</strong> tab to accept
                  pending pickup requests from nearby micro-hubs.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="btn-brutal-yellow !h-10 !px-6 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <span>View Radar Queue ({availableTasks.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Available Nearby Tasks */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-tech text-xs font-bold uppercase text-neutral-700 tracking-wider">
                {'// ACTIVE RADAR CORRIDOR QUEUE ('}
                {availableTasks.length} MISSIONS DISCOVERED)
              </h2>
            </div>

            {availableTasks.length === 0 ? (
              <div className="card-brutal p-12 text-center bg-white">
                <Radio className="w-10 h-10 mx-auto mb-3 text-neutral-400 animate-pulse" />
                <h3 className="font-display font-black text-xl uppercase text-neutral-900">
                  Radar Scanning Nearby Stores...
                </h3>
                <p className="font-sans text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                  No instant tasks available right now in your geo-fence. New orders pop up as soon
                  as merchants finish packing!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className="card-brutal p-5 bg-white border-2 border-black space-y-4 shadow-[4px_4px_0px_#000]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-black text-neutral-900">
                        TASK #{task.id?.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-tech text-xs bg-[#00E599] text-black px-2 py-0.5 font-bold uppercase border border-black">
                        Bounty: ₹{Math.round((task.order?.deliveryFee || 45) * 0.85)}
                      </span>
                    </div>

                    <div>
                      <p className="font-sans font-black text-base text-neutral-900">
                        {task.order?.store?.name || 'Local Store Hub'}
                      </p>
                      <p className="font-tech text-xs text-neutral-500 mt-0.5">
                        Order #{task.orderId?.slice(0, 8)} · {task.order?.items?.length || 1} items
                        · Total ₹{task.order?.total}
                      </p>
                    </div>

                    <div className="p-2.5 bg-neutral-100 border border-black font-tech text-xs text-neutral-700 truncate">
                      📍 {task.order?.deliveryAddress || 'Local neighborhood dropoff'}
                    </div>

                    <button
                      onClick={() => acceptTask(task.id)}
                      disabled={actionLoading}
                      className="btn-brutal-yellow w-full !h-10 text-xs font-bold uppercase flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Accept & Lock Mission</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Courier Daily Earnings Ledger */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-brutal p-4 bg-[#FFE600]/20 border-black">
                <p className="font-tech text-xs text-neutral-700 uppercase font-bold">
                  {"Today's Payout"}
                </p>
                <p className="font-display font-black text-3xl text-neutral-900 mt-1">
                  ₹{earnings?.todayEarnings || 0}
                </p>
                <span className="text-[10px] font-tech text-neutral-600">
                  Direct wallet deposit
                </span>
              </div>

              <div className="card-brutal p-4">
                <p className="font-tech text-xs text-neutral-500 uppercase font-bold">
                  {"Today's Drops"}
                </p>
                <p className="font-display font-black text-3xl text-neutral-900 mt-1">
                  {earnings?.todayDeliveries || 0}
                </p>
                <span className="text-[10px] font-tech text-neutral-500">Missions completed</span>
              </div>

              <div className="card-brutal p-4 bg-[#00E599]/20 border-black">
                <p className="font-tech text-xs text-neutral-700 uppercase font-bold">
                  Lifetime Earnings
                </p>
                <p className="font-display font-black text-3xl text-neutral-900 mt-1">
                  ₹{earnings?.totalEarnings || 0}
                </p>
                <span className="text-[10px] font-tech text-emerald-800 font-bold">
                  All-time rider bounty
                </span>
              </div>

              <div className="card-brutal p-4">
                <p className="font-tech text-xs text-neutral-500 uppercase font-bold">
                  Total Deliveries
                </p>
                <p className="font-display font-black text-3xl text-neutral-900 mt-1">
                  {earnings?.totalDeliveries || 0}
                </p>
                <span className="text-[10px] font-tech text-neutral-500">Fleet mission score</span>
              </div>
            </div>

            <div className="card-brutal p-6 bg-white space-y-4">
              <h3 className="font-display font-black text-base uppercase text-neutral-900 pb-2 border-b-2 border-black flex items-center gap-2">
                <Shield className="w-5 h-5 text-black" />
                Rider Compensation Protocol
              </h3>
              <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                Omnidrop operates on guaranteed base payout per drop (₹40 base + ₹12/km surge) with
                zero platform fee deduction for delivery partners. Tips are credited 100% directly
                to your registered UPI handle daily.
              </p>
            </div>
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
