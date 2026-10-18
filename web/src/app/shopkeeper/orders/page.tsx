'use client';

import {
  ClipboardList as UiClipboardList,
  CreditCard as UiCreditCard,
  MapPin as UiMapPin,
  Package as UiPackage,
  Settings as UiSettings,
} from 'lucide-react';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Printer,
  Receipt,
  RefreshCw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

async function fetchStoreOrders() {
  const stores = await api.stores.myStores();
  const store = stores[0] || null;
  const orders = store ? (await api.orders.byStore(store.id)).items : [];
  return { store, orders };
}

export default function OrderOperationsScreen() {
  const { user } = useAuth();
  const [store, setStore] = useState<Models.Store | null>(null);
  const [orders, setOrders] = useState<Models.Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Models.Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadOrders = useCallback(
    () =>
      fetchStoreOrders()
        .then(({ store, orders }) => {
          setStore(store);
          setOrders(orders);
          setSelectedOrder((previous) => previous || orders[0] || null);
        })
        .catch((error) => console.error('Failed to load store orders:', error))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    if (user) void loadOrders();
  }, [user, loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    setFeedbackMsg(null);
    try {
      const updatedOrder = await api.orders.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updatedOrder.status } : o)),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: updatedOrder.status } : null));
      }
      setFeedbackMsg(`Order #${orderId.slice(0, 8)} status marked as ${newStatus}`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const preparingCount = orders.filter(
    (o) => o.status === 'PREPARING' || o.status === 'READY_FOR_PICKUP',
  ).length;
  const completedCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Header Title & Subnavigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Merchant operations ·'}
              {store?.name || 'ORDER QUEUE'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Your store orders
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Live customer orders queued for pack-and-dispatch. Average target prep time: &lt;4.5
              mins.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="button-secondary !h-10 !py-0 !px-4 text-xs font-sans font-bold  tracking-normal flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Queue</span>
          </button>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-sans text-xs  font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiPackage
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Inventory
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border rounded-xl border-line bg-brand-soft text-ink "
          >
            <UiClipboardList
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Orders ({orders.length})
          </Link>
          <Link
            href="/shopkeeper/profile-setup"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiSettings
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Store profile
          </Link>
          <Link
            href="/shopkeeper/financial-setup"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
          >
            <UiCreditCard
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Banking & payouts
          </Link>
        </div>

        {/* Status Alert Toast */}
        {feedbackMsg && (
          <div className="p-3 bg-brand-soft border rounded-xl border-line font-sans text-xs font-bold text-ink  flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ink shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface-card p-4">
            <p className="font-sans text-xs text-secondary  font-bold">Total Orders</p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-ink mt-1">
              {orders.length}
            </p>
            <span className="text-xs font-sans text-secondary">All-time store volume</span>
          </div>

          <div className="surface-card p-4 bg-danger-soft border-line">
            <p className="font-sans text-xs text-danger  font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Accept
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-danger mt-1">
              {pendingCount}
            </p>
            <span className="text-xs font-sans text-danger font-bold">Requires instant action</span>
          </div>

          <div className="surface-card p-4 bg-brand-soft border-line">
            <p className="font-sans text-xs text-ink  font-bold flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> In Pack / Pickup
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-ink mt-1">
              {preparingCount}
            </p>
            <span className="text-xs font-sans text-secondary">Awaiting courier dock</span>
          </div>

          <div className="surface-card p-4 bg-brand-soft border-line">
            <p className="font-sans text-xs text-brand  font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched / Done
            </p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-brand mt-1">
              {completedCount}
            </p>
            <span className="text-xs font-sans text-brand font-bold">Successfully handed</span>
          </div>
        </div>

        {/* Master Workspace: Split Feed & Detail Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Queue List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'PENDING', label: 'Pending' },
                { id: 'PREPARING', label: 'Packing' },
                { id: 'READY_FOR_PICKUP', label: 'Ready' },
                { id: 'DELIVERED', label: 'Done' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-sans font-bold  border rounded-xl border-line transition-all ${
                    statusFilter === tab.id
                      ? 'bg-muted text-ink '
                      : 'bg-surface text-secondary hover:bg-muted '
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Feed */}
            <div className="space-y-3">
              {loading ? (
                <div className="surface-card p-8 text-center font-sans text-xs text-secondary">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-ink" />
                  Loading store orders...
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const firstItem = order.items?.[0];

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`surface-card p-4 cursor-pointer transition-all border rounded-xl ${
                        isSelected
                          ? 'border-line bg-brand-soft  -'
                          : 'border-line bg-surface hover:bg-muted '
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-xs font-bold text-ink">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-sans font-bold  border border-line ${
                            order.status === 'PENDING'
                              ? 'bg-danger-soft text-ink'
                              : order.status === 'PREPARING'
                                ? 'bg-brand-soft text-ink'
                                : order.status === 'READY_FOR_PICKUP'
                                  ? 'bg-brand-soft text-ink'
                                  : 'bg-muted text-ink'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="font-sans font-bold text-sm text-ink truncate">
                        {firstItem?.name || 'Order Item'}{' '}
                        {(order.items?.length ?? 0) > 1
                          ? `+${(order.items?.length ?? 0) - 1} more`
                          : ''}
                      </p>

                      <div className="mt-2 pt-2 border-t border-line flex items-center justify-between text-xs font-sans text-secondary">
                        <span className="truncate max-w-[180px]">
                          <UiMapPin
                            className="inline-block size-4 align-text-bottom mr-1.5"
                            aria-hidden="true"
                          />{' '}
                          {order.deliveryAddress || 'Hyperlocal Corridor'}
                        </span>
                        <span className="font-bold text-ink text-sm">₹{order.total}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="surface-card p-8 text-center bg-surface">
                  <Package className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <p className="font-sans font-bold text-xs  text-secondary">
                    No orders in this state
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Order Detail Terminal */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="surface-card bg-surface p-6 space-y-6">
                {/* Header Strip & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-bold text-2xl  text-ink">
                        Manifest #{selectedOrder.id.slice(0, 8).toUpperCase()}
                      </h2>
                      <span className="px-2 py-0.5 bg-muted text-ink text-xs font-sans font-bold ">
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-secondary mt-1">
                      Received: {new Date(selectedOrder.createdAt).toLocaleString()} · Method:{' '}
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>

                  {/* Immediate Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'PREPARING')}
                        disabled={isUpdating}
                        className="button-primary !h-10 !px-4 text-xs font-bold  flex items-center gap-1.5"
                      >
                        <Package className="w-4 h-4" />
                        <span>Accept & Start Pack</span>
                      </button>
                    )}

                    {selectedOrder.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'READY_FOR_PICKUP')}
                        disabled={isUpdating}
                        className="button-dark !h-10 !px-4 text-xs font-bold  flex items-center gap-1.5 !bg-brand-soft !text-ink"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ready For Courier</span>
                      </button>
                    )}

                    {selectedOrder.status === 'READY_FOR_PICKUP' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'PICKED_UP')}
                        disabled={isUpdating}
                        className="button-dark !h-10 !px-4 text-xs font-bold  flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Handed to Courier</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items Manifest Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-sans font-bold text-xs  text-secondary tracking-normal">
                      {'Physical items to bag ('}
                      {selectedOrder.items?.length || 0})
                    </h3>
                    <span className="font-sans text-xs text-secondary ">
                      Inspect expiry & seal before dispatch
                    </span>
                  </div>

                  <div className="border rounded-xl border-line divide-y divide-line">
                    {selectedOrder.items?.map((item, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="p-3 bg-muted flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-none bg-muted text-ink font-sans text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-sans font-bold text-sm text-ink leading-snug">
                              {item.name}
                            </p>
                            <p className="font-sans text-xs text-secondary">
                              Unit Price: ₹{item.unitPrice} · sku:{' '}
                              {item.productId?.slice(0, 8) || 'GEN-SKU'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-surface border border-line font-sans font-bold text-xs text-ink">
                            Qty: {item.quantity}
                          </span>
                          <p className="font-sans font-bold text-xs text-ink mt-1">
                            ₹{(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Coordinates & Customer Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl border-line bg-muted space-y-2">
                    <p className="font-sans text-xs font-bold  text-secondary flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-danger" />
                      Delivery Coordinates
                    </p>
                    <p className="font-sans text-xs font-bold text-ink leading-relaxed">
                      {selectedOrder.deliveryAddress || 'No detailed address provided'}
                    </p>
                    {selectedOrder.deliveryInstructions && (
                      <div className="mt-2 pt-2 border-t border-line">
                        <p className="font-sans text-xs text-secondary  font-bold">
                          Rider Gate Note:
                        </p>
                        <p className="font-sans text-xs text-secondary mt-0.5 italic">
                          {'"'}
                          {selectedOrder.deliveryInstructions}
                          {'"'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border rounded-xl border-line bg-muted space-y-2">
                    <p className="font-sans text-xs font-bold  text-secondary flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-ink" />
                      Financial Ledger
                    </p>
                    <div className="space-y-1 font-sans text-xs text-secondary">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-ink">₹{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹{selectedOrder.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-secondary">
                        <span>Platform Take-rate (6%):</span>
                        <span>- ₹{((selectedOrder.subtotal || 0) * 0.06).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-line flex justify-between font-bold text-sm text-ink">
                        <span>Merchant Net Payout:</span>
                        <span className="text-brand bg-muted px-1.5 py-0.5">
                          ₹{((selectedOrder.subtotal || 0) * 0.94).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print & Action Footer */}
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="button-secondary !h-9 !py-0 !px-3 font-sans text-xs font-bold  flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Slip</span>
                  </button>

                  <span className="font-sans text-xs text-secondary ">
                    Status: <strong className="text-ink">{selectedOrder.status}</strong> ·
                    Auto-notifies buyer
                  </span>
                </div>
              </div>
            ) : (
              <div className="surface-card p-12 text-center bg-surface">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-secondary" />
                <h3 className="font-display font-bold text-xl  text-ink">No Order Selected</h3>
                <p className="font-sans text-xs text-secondary mt-1 max-w-sm mx-auto">
                  Click any order from the queue on the left to inspect packing checklist and
                  trigger courier dispatch.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BrutalFooter />
    </div>
  );
}
