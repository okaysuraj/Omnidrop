'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { ArrowRight, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const STATUS_BADGES: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: '#FFE600', text: '#000000' },
  CONFIRMED: { bg: '#00E599', text: '#000000' },
  PREPARING: { bg: '#FFE600', text: '#000000' },
  READY_FOR_PICKUP: { bg: '#00E599', text: '#000000' },
  PICKED_UP: { bg: '#FF4800', text: '#FFFFFF' },
  OUT_FOR_DELIVERY: { bg: '#FF4800', text: '#FFFFFF' },
  DELIVERED: { bg: '#00E599', text: '#000000' },
  CANCELLED: { bg: '#18181B', text: '#FFFFFF' },
  REFUNDED: { bg: '#71717A', text: '#FFFFFF' },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Models.Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    const loadOrders = async () => {
      try {
        const data = await api.orders.myOrders();
        setOrders(data.items);
      } catch {
        /* ignore */
      }
      setLoading(false);
    };
    if (user) loadOrders();
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// DISPATCH TELEMETRY'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Orders History & Tracking
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Live status, courier route telemetry, and itemized receipts.
            </p>
          </div>

          <Link
            href="/explore"
            className="btn-brutal-yellow !h-10 !py-0 !px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Start New Order</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-tech text-xs font-bold uppercase">
            SYNCING DISPATCH LOGS...
          </div>
        ) : orders.length === 0 ? (
          <div className="card-brutal p-12 text-center bg-white max-w-lg mx-auto">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900">
              No Orders Dispatched Yet
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 mt-1 mb-6">
              When you place an order, live courier tracking nodes and receipts will log here.
            </p>
            <Link
              href="/explore"
              className="btn-brutal-yellow inline-flex !h-11 !px-6 text-xs font-bold uppercase tracking-wider items-center gap-2"
            >
              <span>Explore Nearby Stores</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badgeStyle = STATUS_BADGES[order.status] || { bg: '#FAFAF8', text: '#000000' };
              const isLive = [
                'PREPARING',
                'READY_FOR_PICKUP',
                'PICKED_UP',
                'OUT_FOR_DELIVERY',
              ].includes(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="card-brutal bg-white p-5 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all block group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: ID & Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-tech text-xs font-black text-neutral-900 uppercase">
                          MANIFEST #{order.id?.slice(-8)}
                        </span>
                        {isLive && (
                          <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
                        )}
                      </div>
                      <div className="font-display font-black text-lg uppercase text-neutral-900 group-hover:text-black">
                        {order.store?.name || 'Local Micro-Hub'}
                      </div>
                      <div className="font-tech text-xs text-neutral-500 font-bold">
                        {order.items?.length || 1} ITEMS SCHEDULED ·{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {/* Right: Status & Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t-2 sm:border-t-0 border-black/10">
                      <div className="text-right">
                        <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
                          Total Value
                        </div>
                        <div className="font-tech font-black text-xl text-neutral-900">
                          ₹{Number(order.total || 0).toFixed(2)}
                        </div>
                      </div>

                      <span
                        className="badge-brutal text-xs font-bold"
                        style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                      >
                        {order.status?.replace(/_/g, ' ')}
                      </span>

                      <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-bold border-2 border-black group-hover:bg-[#FFE600] group-hover:text-black transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
