'use client';

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
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
        <BrutalNav />
        <div className="container-brutal py-20 text-center font-tech text-xs font-bold uppercase">
          READING SATELLITE TELEMETRY...
        </div>
        <BrutalFooter />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
        <BrutalNav />
        <div className="container-brutal py-20 text-center space-y-4">
          <h2 className="font-display font-black text-2xl uppercase">Order Node Not Found</h2>
          <Link
            href="/orders"
            className="btn-brutal-yellow inline-flex !h-10 !px-5 text-xs font-bold uppercase"
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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Top Breadcrumb & Status Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 font-tech text-xs font-bold uppercase underline hover:bg-[#FFE600] px-1 py-0.5 mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
              Live Dispatch Manifest #{order.id?.slice(-8)}
            </h1>
            <p className="font-tech text-xs text-neutral-600 mt-1">
              CONNECTED NODE: {order.store?.name || 'Local Dark Store'} ·{' '}
              {order.store?.address || 'Sector 4 Delhi'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-brutal-yellow text-xs font-black">
              {order.status?.replace(/_/g, ' ')}
            </span>
            {isDeliveryActive && (
              <span className="w-3 h-3 rounded-full bg-[#00E599] animate-pulse border border-black"></span>
            )}
          </div>
        </div>

        {/* 1. Step Progress Nodes Visualizer */}
        <div className="card-brutal bg-white p-6 border-2 border-black shadow-[4px_4px_0px_#000]">
          <div className="font-tech text-xs font-bold uppercase mb-4 text-neutral-500">
            DISPATCH PIPELINE EXECUTION
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-tech text-xs">
            {ORDER_STEPS.map((step, idx) => {
              const isPassed = idx <= activeStep;
              const isCurrent = idx === activeStep;
              return (
                <div
                  key={step.key}
                  className={`p-3 border-2 border-black transition-all ${
                    isCurrent
                      ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000] font-black'
                      : isPassed
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-[#FAFAF8] text-neutral-400'
                  }`}
                >
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>STAGE 0{idx + 1}</span>
                    <span>{step.time}</span>
                  </div>
                  <div className="uppercase tracking-tight truncate">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Map & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Map Telemetry */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card-brutal bg-white p-4 border-2 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3 font-tech text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-[#FF4800]" />
                  <span>COURIER VECTOR SATELLITE RADAR</span>
                </span>
                <span className="text-[#059669]">● REALTIME WEBSOCKET</span>
              </div>

              <div className="h-[380px] w-full border-2 border-black overflow-hidden relative bg-neutral-100">
                {isDeliveryActive ? (
                  <LiveMap
                    orderId={order.id}
                    initialLat={Number(order.store?.lat || 28.6139)}
                    initialLng={Number(order.store?.lng || 77.209)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAFAF8] font-tech text-xs space-y-2">
                    <MapPin className="w-8 h-8 text-neutral-400" />
                    <div className="font-bold uppercase text-neutral-900">
                      {isDelivered
                        ? 'Drop Completed At Doorstep'
                        : 'Courier Vector Awaiting Physical Shelf Pack'}
                    </div>
                    <p className="text-neutral-500 max-w-xs">
                      {isDelivered
                        ? 'Package safely received and verified with customer PIN.'
                        : 'Real-time GPS coordinates will stream live once courier accepts tote dispatch.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 bg-[#FAFAF8] border-2 border-black font-tech text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                    Destination
                  </span>
                  <span className="font-bold text-neutral-900 truncate block">
                    {order.deliveryAddress || 'Sector 4, Central Delhi'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase font-bold">
                    Special Note
                  </span>
                  <span className="font-bold text-neutral-900 truncate block">
                    {order.deliveryInstructions || 'Standard Doorstep Drop'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Itemization Receipt */}
          <div className="lg:col-span-5">
            <div className="receipt-brutal bg-white p-6 border-2 border-black shadow-[6px_6px_0px_#000] space-y-4">
              <div className="border-b-2 border-black pb-3 text-center">
                <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-display font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000] mx-auto mb-1.5">
                  ⚡
                </div>
                <div className="font-tech text-xs font-bold uppercase tracking-wider text-neutral-900">
                  VERIFIED TOTE RECEIPT
                </div>
                <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 font-tech text-xs border-b-2 border-black pb-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-neutral-700">
                      {item.quantity}x {item.name || item.product?.name || 'Item'}
                    </span>
                    <span className="font-bold text-neutral-900">
                      ₹{(Number(item.unitPrice || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 font-tech text-xs border-b-2 border-black pb-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">
                    ₹{Number(order.subtotal || order.total || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Transit Fee</span>
                  <span className="font-bold text-[#059669]">
                    {Number(order.deliveryFee) === 0
                      ? 'FREE (₹0.00)'
                      : `₹${Number(order.deliveryFee || 40).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Payment Channel</span>
                  <span className="font-bold uppercase text-neutral-900">
                    {order.paymentMethod || 'ONLINE'}
                  </span>
                </div>
              </div>

              {/* Total Due */}
              <div className="flex justify-between items-baseline font-tech font-black text-lg text-neutral-900 pt-1">
                <span className="uppercase">TOTAL CHARGED</span>
                <span className="text-2xl">₹{Number(order.total || 0).toFixed(2)}</span>
              </div>

              {isDelivered && (
                <Link
                  href={`/orders/${order.id}/review`}
                  className="w-full btn-brutal-yellow !h-11 !py-0 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000]"
                >
                  <Star className="w-4 h-4 fill-black" />
                  <span>Rate Store & Courier Delivery</span>
                </Link>
              )}

              <div className="p-3 bg-[#00E599]/20 border-2 border-black font-tech text-[11px] text-neutral-900 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
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
