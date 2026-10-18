'use client';

import { Zap as UiZap } from 'lucide-react';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { LiveMap } from '@/components/shared/live-map';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useSocket } from '@/providers/socket-provider';
import type * as Models from '@/types';
import { Bike, ChevronLeft, MapPin, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ORDER_STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', time: 'T-00:00' },
  { key: 'PREPARING', label: 'Shelf Barcode Scan', time: 'T-01:30' },
  { key: 'READY_FOR_PICKUP', label: 'Tote Locked & Sealed', time: 'T-03:45' },
  { key: 'OUT_FOR_DELIVERY', label: 'Courier In-Transit', time: 'T-05:00' },
  { key: 'DELIVERED', label: 'Doorstep Delivered', time: 'T-17:40' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const { socket, connected } = useSocket();
  const router = useRouter();
  const [order, setOrder] = useState<Models.Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    const loadOrder = async () => {
      try {
        const data = await api.orders.getById(id);
        setOrder(data);
      } catch {
        /* ignore */
      }
      setLoading(false);
    };
    if (user && id) loadOrder();
  }, [user, authLoading, id, router]);

  useEffect(() => {
    if (!connected || !socket || !id) return;
    socket.emit('room:join_order', { orderId: id });
    socket.on('order:status_updated', (data) => {
      if (data.orderId === id) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    });
    return () => {
      socket.off('order:status_updated');
      socket.emit('room:leave_order', { orderId: id });
    };
  }, [connected, socket, id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-dvh bg-canvas flex flex-col">
        <BrutalNav />
        <div className="site-container py-20 text-center font-sans text-xs font-bold ">
          Reading satellite telemetry...
        </div>
        <BrutalFooter />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-dvh bg-canvas flex flex-col">
        <BrutalNav />
        <div className="site-container py-20 text-center space-y-4">
          <h2 className="font-display font-bold text-2xl ">Order Node Not Found</h2>
          <Link
            href="/orders"
            className="button-primary inline-flex !h-10 !px-5 text-xs font-bold "
          >
            Return to Orders
          </Link>
        </div>
        <BrutalFooter />
      </div>
    );
  }

  const isDeliveryActive = ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status);
  const isDelivered = order.status === 'DELIVERED';

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : isDelivered ? 4 : 1;

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Top Breadcrumb & Status Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 font-sans text-xs font-bold  underline hover:bg-brand-soft px-1 py-0.5 mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="font-display font-bold text-2xl sm:text-3xl  tracking-tight text-ink">
              Order details #{order.id?.slice(-8)}
            </h1>
            <p className="font-sans text-xs text-secondary mt-1">
              Connected node: {order.store?.name || 'Local Dark Store'} ·{' '}
              {order.store?.address || 'Sector 4 Delhi'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-accent text-xs font-bold">
              {order.status?.replace(/_/g, ' ')}
            </span>
            {isDeliveryActive && (
              <span className="w-3 h-3 rounded-full bg-brand-soft  border border-line"></span>
            )}
          </div>
        </div>

        {/* 1. Step Progress Nodes Visualizer */}
        <div className="surface-card bg-surface p-6 border rounded-xl border-line ">
          <div className="font-sans text-xs font-bold  mb-4 text-secondary">
            Dispatch pipeline execution
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-sans text-xs">
            {ORDER_STEPS.map((step, idx) => {
              const isPassed = idx <= activeStep;
              const isCurrent = idx === activeStep;
              return (
                <div
                  key={step.key}
                  className={`p-3 border rounded-xl border-line transition-all ${
                    isCurrent
                      ? 'bg-brand-soft text-ink  font-bold'
                      : isPassed
                        ? 'bg-muted text-ink font-bold'
                        : 'bg-canvas text-secondary'
                  }`}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stage 0{idx + 1}</span>
                    <span>{step.time}</span>
                  </div>
                  <div className=" tracking-tight truncate">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Map & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Map Telemetry */}
          <div className="lg:col-span-7 space-y-4">
            <div className="surface-card bg-surface p-4 border rounded-xl border-line ">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-3 font-sans text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-danger" />
                  <span>Courier vector satellite radar</span>
                </span>
                <span className="text-brand">● realtime websocket</span>
              </div>

              <div className="h-[380px] w-full border rounded-xl border-line overflow-hidden relative bg-muted">
                {isDeliveryActive ? (
                  <LiveMap
                    orderId={order.id}
                    initialLat={Number(order.store?.lat || 28.6139)}
                    initialLng={Number(order.store?.lng || 77.209)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-canvas font-sans text-xs space-y-2">
                    <MapPin className="w-8 h-8 text-secondary" />
                    <div className="font-bold  text-ink">
                      {isDelivered
                        ? 'Drop Completed At Doorstep'
                        : 'Courier Vector Awaiting Physical Shelf Pack'}
                    </div>
                    <p className="text-secondary max-w-xs">
                      {isDelivered
                        ? 'Package safely received and verified with customer PIN.'
                        : 'Real-time GPS coordinates will stream live once courier accepts tote dispatch.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 bg-canvas border rounded-xl border-line font-sans text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-secondary block text-xs  font-bold">Destination</span>
                  <span className="font-bold text-ink truncate block">
                    {order.deliveryAddress || 'Sector 4, Central Delhi'}
                  </span>
                </div>
                <div>
                  <span className="text-secondary block text-xs  font-bold">Special Note</span>
                  <span className="font-bold text-ink truncate block">
                    {order.deliveryInstructions || 'Standard Doorstep Drop'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Itemization Receipt */}
          <div className="lg:col-span-5">
            <div className="surface-panel bg-surface p-6 border rounded-xl border-line  space-y-4">
              <div className="border-b border-line pb-3 text-center">
                <div className="w-8 h-8 bg-muted text-brand flex items-center justify-center font-display font-bold text-sm border rounded-xl border-line  mx-auto mb-1.5">
                  <UiZap
                    className="inline-block size-4 align-text-bottom mr-1.5"
                    aria-hidden="true"
                  />
                </div>
                <div className="font-sans text-xs font-bold  tracking-normal text-ink">
                  Verified tote receipt
                </div>
                <div className="font-sans text-xs text-secondary font-bold ">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 font-sans text-xs border-b border-line pb-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-secondary">
                      {item.quantity}x {item.name || item.product?.name || 'Item'}
                    </span>
                    <span className="font-bold text-ink">
                      ₹{(Number(item.unitPrice || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 font-sans text-xs border-b border-line pb-4">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">
                    ₹{Number(order.subtotal || order.total || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Transit Fee</span>
                  <span className="font-bold text-brand">
                    {Number(order.deliveryFee) === 0
                      ? 'FREE (₹0.00)'
                      : `₹${Number(order.deliveryFee || 40).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Payment Channel</span>
                  <span className="font-bold  text-ink">{order.paymentMethod || 'ONLINE'}</span>
                </div>
              </div>

              {/* Total Due */}
              <div className="flex justify-between items-baseline font-sans font-bold text-lg text-ink pt-1">
                <span className="">Total charged</span>
                <span className="text-2xl">₹{Number(order.total || 0).toFixed(2)}</span>
              </div>

              {isDelivered && (
                <Link
                  href={`/orders/${order.id}/review`}
                  className="w-full button-primary !h-11 !py-0 font-bold text-xs  tracking-normal flex items-center justify-center gap-2 "
                >
                  <Star className="w-4 h-4 fill-black" />
                  <span>Rate Store & Courier Delivery</span>
                </Link>
              )}

              <div className="p-3 bg-brand-soft border rounded-xl border-line font-sans text-xs text-ink font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ink flex-shrink-0" />
                <span>SHELF GUARANTEE: Zero markups on any item.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BrutalFooter />
    </div>
  );
}
