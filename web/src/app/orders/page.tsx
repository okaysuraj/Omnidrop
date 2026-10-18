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
  PENDING: { bg: 'var(--warning-soft)', text: 'var(--ink)' },
  CONFIRMED: { bg: 'var(--brand-soft)', text: 'var(--ink)' },
  PREPARING: { bg: 'var(--warning-soft)', text: 'var(--ink)' },
  READY_FOR_PICKUP: { bg: 'var(--brand-soft)', text: 'var(--ink)' },
  PICKED_UP: { bg: 'var(--brand-soft)', text: 'var(--ink)' },
  OUT_FOR_DELIVERY: { bg: 'var(--brand-soft)', text: 'var(--ink)' },
  DELIVERED: { bg: 'var(--brand-soft)', text: 'var(--ink)' },
  CANCELLED: { bg: 'var(--danger-soft)', text: 'var(--ink)' },
  REFUNDED: { bg: 'var(--muted)', text: 'var(--ink)' },
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
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Dispatch telemetry'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Your orders
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Live status, courier route telemetry, and itemized receipts.
            </p>
          </div>

          <Link
            href="/explore"
            className="button-primary !h-10 !py-0 !px-5 text-xs font-bold  tracking-normal flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Start New Order</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-sans text-xs font-bold ">
            Syncing dispatch logs...
          </div>
        ) : orders.length === 0 ? (
          <div className="surface-card p-12 text-center bg-surface max-w-lg mx-auto">
            <Package className="w-12 h-12 text-secondary mx-auto mb-3" />
            <h2 className="font-display font-bold text-2xl  tracking-tight text-ink">
              No Orders Dispatched Yet
            </h2>
            <p className="font-sans text-xs sm:text-sm text-secondary mt-1 mb-6">
              When you place an order, live courier tracking nodes and receipts will log here.
            </p>
            <Link
              href="/explore"
              className="button-primary inline-flex !h-11 !px-6 text-xs font-bold  tracking-normal items-center gap-2"
            >
              <span>Explore Nearby Stores</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badgeStyle = STATUS_BADGES[order.status] || {
                bg: 'var(--canvas)',
                text: 'var(--ink)',
              };
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
                  className="surface-card bg-surface p-5 border rounded-xl border-line    transition-all block group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: ID & Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs font-bold text-ink ">
                          Manifest #{order.id?.slice(-8)}
                        </span>
                        {isLive && <span className="w-2 h-2 rounded-full bg-brand-soft "></span>}
                      </div>
                      <div className="font-display font-bold text-lg  text-ink group-hover:text-ink">
                        {order.store?.name || 'Local Micro-Hub'}
                      </div>
                      <div className="font-sans text-xs text-secondary font-bold">
                        {order.items?.length || 1} Items scheduled ·{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {/* Right: Status & Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
                      <div className="text-right">
                        <div className="font-sans text-xs text-secondary font-bold ">
                          Total Value
                        </div>
                        <div className="font-sans font-bold text-xl text-ink">
                          ₹{Number(order.total || 0).toFixed(2)}
                        </div>
                      </div>

                      <span
                        className="status-badge text-xs font-bold"
                        style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                      >
                        {order.status?.replace(/_/g, ' ')}
                      </span>

                      <div className="w-8 h-8 bg-muted text-brand flex items-center justify-center font-bold border rounded-xl border-line group-hover:bg-brand-soft group-hover:text-ink transition-colors">
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
