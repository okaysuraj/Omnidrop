'use client';

import {
  MapPin as UiMapPin,
  Radio as UiRadio,
  Wallet as UiWallet,
  Zap as UiZap,
} from 'lucide-react';

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
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Terminal Header & Status Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Fleet telemetry · courier dispatch console'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink flex items-center gap-3">
              <Bike className="w-8 h-8 text-ink" />
              Your delivery dashboard
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Active pilot:{' '}
              <strong className="text-ink">{user?.fullName || 'Verified Courier'}</strong> · Node:
              Indiranagar Hub
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Socket Beacon */}
            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-xl border-line bg-surface font-sans text-xs font-bold  ">
              <span
                className={`w-2.5 h-2.5 rounded-none border border-line ${connected ? 'bg-brand-soft' : 'bg-danger-soft'}`}
              />
              <span>{connected ? 'Live updates connected' : 'Connecting to live updates'}</span>
            </div>

            {/* Duty Status Switch */}
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 border rounded-xl border-line font-sans text-xs font-bold  tracking-normal flex items-center gap-2 transition-all ${
                isAvailable ? 'bg-brand-soft text-ink ' : 'bg-muted text-secondary '
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isAvailable ? 'Available for deliveries' : 'Not taking deliveries'}</span>
            </button>
          </div>
        </div>

        {/* Dispatch Console Tabs */}
        <div className="flex flex-wrap gap-2 font-sans text-xs  font-bold">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'active'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiZap className="inline-block size-4 align-text-bottom mr-1.5" aria-hidden="true" />{' '}
            Active delivery {activeTask && '(1)'}
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'available'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiRadio className="inline-block size-4 align-text-bottom mr-1.5" aria-hidden="true" />{' '}
            Available deliveries ({availableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'earnings'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiWallet className="inline-block size-4 align-text-bottom mr-1.5" aria-hidden="true" />{' '}
            Your earnings
          </button>
        </div>

        {/* Tab 1: Active delivery Manifest */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeTask ? (
              <div className="surface-card p-6 md:p-8 bg-surface space-y-6 border rounded-xl border-line ">
                {/* Mission Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs bg-muted text-brand px-2 py-0.5 font-bold ">
                        Active run #{activeTask.id?.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-sans text-xs bg-brand-soft text-ink px-2 py-0.5 font-bold  border border-line">
                        Status: {activeTask.status}
                      </span>
                    </div>
                    <p className="font-display font-bold text-2xl  text-ink mt-2">
                      Order Value: ₹{activeTask.order?.total} · Courier Bounty: ₹
                      {Math.round((activeTask.order?.deliveryFee || 45) * 0.85)}
                    </p>
                  </div>

                  <div className="font-sans text-xs text-secondary">
                    <p>
                      Corridor SLA: <strong>12-min expedited</strong>
                    </p>
                  </div>
                </div>

                {/* Waypoints Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Waypoint A: Pickup */}
                  <div className="p-4 border rounded-xl border-line bg-muted space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold  text-secondary">
                        {'Waypoint 01: hub pickup'}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-none bg-muted"></span>
                    </div>
                    <p className="font-sans font-bold text-lg text-ink">
                      {activeTask.order?.store?.name || 'Local Omni Store'}
                    </p>
                    <p className="font-sans text-xs text-secondary font-medium">
                      {activeTask.order?.store?.address || 'Indiranagar 100ft Hub, Bengaluru'}
                    </p>
                    <div className="pt-2 text-xs font-sans text-secondary">
                      Items to collect:{' '}
                      <strong>{activeTask.order?.items?.length || 1} packaged parcel(s)</strong>
                    </div>
                  </div>

                  {/* Waypoint B: Dropoff */}
                  <div className="p-4 border rounded-xl border-line bg-brand-soft space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold  text-secondary">
                        {'Waypoint 02: customer doorstep'}
                      </span>
                      <MapPin className="w-4 h-4 text-danger" />
                    </div>
                    <p className="font-sans font-bold text-lg text-ink">Dropoff Destination</p>
                    <p className="font-sans text-xs text-ink font-medium">
                      {activeTask.order?.deliveryAddress || 'Customer Address Pending'}
                    </p>
                    {activeTask.order?.deliveryInstructions && (
                      <div className="p-2 border border-line bg-surface text-xs font-sans mt-2">
                        {'Gate instructions: "'}
                        {activeTask.order?.deliveryInstructions}
                        {'"'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-sans text-xs text-secondary">
                    Press the button once physical milestone is reached:
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {activeTask.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus('PICKED_UP')}
                        disabled={actionLoading}
                        className="button-primary w-full sm:w-auto !h-12 !px-6 text-sm font-bold  flex items-center justify-center gap-2 "
                      >
                        <Package className="w-4 h-4" />
                        <span>Confirm Store Pickup</span>
                      </button>
                    )}

                    {activeTask.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleUpdateStatus('IN_TRANSIT')}
                        disabled={actionLoading}
                        className="button-dark w-full sm:w-auto !h-12 !px-6 text-sm font-bold  flex items-center justify-center gap-2 "
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Begin Flight & GPS Broadcast</span>
                      </button>
                    )}

                    {activeTask.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleUpdateStatus('DELIVERED')}
                        disabled={actionLoading}
                        className="button-dark !bg-brand-soft !text-ink w-full sm:w-auto !h-12 !px-6 text-sm font-bold  flex items-center justify-center gap-2 "
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Handover Complete (Mark Delivered)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="surface-card p-12 text-center bg-surface space-y-4">
                <Bike className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="font-display font-bold text-2xl  text-ink">
                  Ready For Next Mission
                </h3>
                <p className="font-sans text-xs sm:text-sm text-secondary max-w-md mx-auto">
                  You are currently idle. Switch to the <strong>Available deliveries</strong> tab to
                  accept pending pickup requests from nearby micro-hubs.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="button-primary !h-10 !px-6 text-xs font-bold  tracking-normal inline-flex items-center gap-2"
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
              <h2 className="font-sans text-xs font-bold  text-secondary tracking-normal">
                {'Active radar corridor queue ('}
                {availableTasks.length} Missions discovered)
              </h2>
            </div>

            {availableTasks.length === 0 ? (
              <div className="surface-card p-12 text-center bg-surface">
                <Radio className="w-10 h-10 mx-auto mb-3 text-secondary " />
                <h3 className="font-display font-bold text-xl  text-ink">
                  Radar Scanning Nearby Stores...
                </h3>
                <p className="font-sans text-xs text-secondary mt-1 max-w-sm mx-auto">
                  No instant tasks available right now in your geo-fence. New orders pop up as soon
                  as merchants finish packing!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className="surface-card p-5 bg-surface border rounded-xl border-line space-y-4 "
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold text-ink">
                        Task #{task.id?.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-sans text-xs bg-brand-soft text-ink px-2 py-0.5 font-bold  border border-line">
                        Bounty: ₹{Math.round((task.order?.deliveryFee || 45) * 0.85)}
                      </span>
                    </div>

                    <div>
                      <p className="font-sans font-bold text-base text-ink">
                        {task.order?.store?.name || 'Local Store Hub'}
                      </p>
                      <p className="font-sans text-xs text-secondary mt-0.5">
                        Order #{task.orderId?.slice(0, 8)} · {task.order?.items?.length || 1} items
                        · Total ₹{task.order?.total}
                      </p>
                    </div>

                    <div className="p-2.5 bg-muted border border-line font-sans text-xs text-secondary truncate">
                      <UiMapPin
                        className="inline-block size-4 align-text-bottom mr-1.5"
                        aria-hidden="true"
                      />{' '}
                      {task.order?.deliveryAddress || 'Local neighborhood dropoff'}
                    </div>

                    <button
                      onClick={() => acceptTask(task.id)}
                      disabled={actionLoading}
                      className="button-primary w-full !h-10 text-xs font-bold  flex items-center justify-center gap-2"
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
              <div className="surface-card p-4 bg-brand-soft border-line">
                <p className="font-sans text-xs text-secondary  font-bold">{"Today's Payout"}</p>
                <p className="font-display font-bold text-3xl text-ink mt-1">
                  ₹{earnings?.todayEarnings || 0}
                </p>
                <span className="text-xs font-sans text-secondary">Direct wallet deposit</span>
              </div>

              <div className="surface-card p-4">
                <p className="font-sans text-xs text-secondary  font-bold">{"Today's Drops"}</p>
                <p className="font-display font-bold text-3xl text-ink mt-1">
                  {earnings?.todayDeliveries || 0}
                </p>
                <span className="text-xs font-sans text-secondary">Missions completed</span>
              </div>

              <div className="surface-card p-4 bg-brand-soft border-line">
                <p className="font-sans text-xs text-secondary  font-bold">Lifetime Earnings</p>
                <p className="font-display font-bold text-3xl text-ink mt-1">
                  ₹{earnings?.totalEarnings || 0}
                </p>
                <span className="text-xs font-sans text-brand font-bold">
                  All-time rider bounty
                </span>
              </div>

              <div className="surface-card p-4">
                <p className="font-sans text-xs text-secondary  font-bold">Total Deliveries</p>
                <p className="font-display font-bold text-3xl text-ink mt-1">
                  {earnings?.totalDeliveries || 0}
                </p>
                <span className="text-xs font-sans text-secondary">Fleet mission score</span>
              </div>
            </div>

            <div className="surface-card p-6 bg-surface space-y-4">
              <h3 className="font-display font-bold text-base  text-ink pb-2 border-b border-line flex items-center gap-2">
                <Shield className="w-5 h-5 text-ink" />
                Rider Compensation Protocol
              </h3>
              <p className="font-sans text-xs text-secondary leading-relaxed">
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
