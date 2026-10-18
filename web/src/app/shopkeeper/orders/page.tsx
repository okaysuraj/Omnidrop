'use client';

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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Title & Subnavigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// MERCHANT OPERATIONS ·'}
              {store?.name || 'ORDER QUEUE'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Fulfillment & Packing Station
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Live customer orders queued for pack-and-dispatch. Average target prep time: &lt;4.5
              mins.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="btn-brutal-white !h-10 !py-0 !px-4 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Queue</span>
          </button>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-tech text-xs uppercase font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            📦 Shelf Inventory
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border-2 border-black bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]"
          >
            📋 Fulfill Orders ({orders.length})
          </Link>
          <Link
            href="/shopkeeper/profile-setup"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            ⚙️ Hub Profile
          </Link>
          <Link
            href="/shopkeeper/financial-setup"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
          >
            💳 Banking & Payouts
          </Link>
        </div>

        {/* Status Alert Toast */}
        {feedbackMsg && (
          <div className="p-3 bg-[#00E599] border-2 border-black font-tech text-xs font-bold text-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-brutal p-4">
            <p className="font-tech text-xs text-neutral-500 uppercase font-bold">Total Orders</p>
            <p className="font-display font-black text-2xl sm:text-3xl text-neutral-900 mt-1">
              {orders.length}
            </p>
            <span className="text-[10px] font-tech text-neutral-500">All-time store volume</span>
          </div>

          <div className="card-brutal p-4 bg-[#FF4800]/10 border-black">
            <p className="font-tech text-xs text-[#FF4800] uppercase font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Accept
            </p>
            <p className="font-display font-black text-2xl sm:text-3xl text-[#FF4800] mt-1">
              {pendingCount}
            </p>
            <span className="text-[10px] font-tech text-[#FF4800] font-bold">
              Requires instant action
            </span>
          </div>

          <div className="card-brutal p-4 bg-[#FFE600]/20 border-black">
            <p className="font-tech text-xs text-neutral-800 uppercase font-bold flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> In Pack / Pickup
            </p>
            <p className="font-display font-black text-2xl sm:text-3xl text-neutral-900 mt-1">
              {preparingCount}
            </p>
            <span className="text-[10px] font-tech text-neutral-700">Awaiting courier dock</span>
          </div>

          <div className="card-brutal p-4 bg-[#00E599]/15 border-black">
            <p className="font-tech text-xs text-emerald-800 uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched / Done
            </p>
            <p className="font-display font-black text-2xl sm:text-3xl text-emerald-900 mt-1">
              {completedCount}
            </p>
            <span className="text-[10px] font-tech text-emerald-700 font-bold">
              Successfully handed
            </span>
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
                  className={`px-3 py-1 text-xs font-tech font-bold uppercase border-2 border-black transition-all ${
                    statusFilter === tab.id
                      ? 'bg-black text-white shadow-[2px_2px_0px_#FFE600]'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Feed */}
            <div className="space-y-3">
              {loading ? (
                <div className="card-brutal p-8 text-center font-tech text-xs text-neutral-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-black" />
                  LOADING STORE ORDERS...
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const firstItem = order.items?.[0];

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`card-brutal p-4 cursor-pointer transition-all border-2 ${
                        isSelected
                          ? 'border-black bg-[#FFE600]/15 shadow-[4px_4px_0px_#000] -translate-y-0.5'
                          : 'border-black bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-tech text-xs font-black text-neutral-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-tech font-bold uppercase border border-black ${
                            order.status === 'PENDING'
                              ? 'bg-[#FF4800] text-white'
                              : order.status === 'PREPARING'
                                ? 'bg-[#FFE600] text-black'
                                : order.status === 'READY_FOR_PICKUP'
                                  ? 'bg-[#00E599] text-black'
                                  : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="font-sans font-bold text-sm text-neutral-900 truncate">
                        {firstItem?.name || 'Order Item'}{' '}
                        {(order.items?.length ?? 0) > 1
                          ? `+${(order.items?.length ?? 0) - 1} more`
                          : ''}
                      </p>

                      <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-tech text-neutral-600">
                        <span className="truncate max-w-[180px]">
                          📍 {order.deliveryAddress || 'Hyperlocal Corridor'}
                        </span>
                        <span className="font-black text-neutral-900 text-sm">₹{order.total}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="card-brutal p-8 text-center bg-white">
                  <Package className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                  <p className="font-tech font-bold text-xs uppercase text-neutral-600">
                    No orders in this state
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Order Detail Terminal */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="card-brutal bg-white p-6 space-y-6">
                {/* Header Strip & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-black text-2xl uppercase text-neutral-900">
                        MANIFEST #{selectedOrder.id.slice(0, 8).toUpperCase()}
                      </h2>
                      <span className="px-2 py-0.5 bg-black text-white text-xs font-tech font-bold uppercase">
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="font-tech text-xs text-neutral-500 mt-1">
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
                        className="btn-brutal-yellow !h-10 !px-4 text-xs font-bold uppercase flex items-center gap-1.5"
                      >
                        <Package className="w-4 h-4" />
                        <span>Accept & Start Pack</span>
                      </button>
                    )}

                    {selectedOrder.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'READY_FOR_PICKUP')}
                        disabled={isUpdating}
                        className="btn-brutal-black !h-10 !px-4 text-xs font-bold uppercase flex items-center gap-1.5 !bg-[#00E599] !text-black"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ready For Courier</span>
                      </button>
                    )}

                    {selectedOrder.status === 'READY_FOR_PICKUP' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'PICKED_UP')}
                        disabled={isUpdating}
                        className="btn-brutal-black !h-10 !px-4 text-xs font-bold uppercase flex items-center gap-1.5"
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
                    <h3 className="font-tech font-bold text-xs uppercase text-neutral-700 tracking-wider">
                      {'// PHYSICAL ITEMS TO BAG ('}
                      {selectedOrder.items?.length || 0})
                    </h3>
                    <span className="font-tech text-[10px] text-neutral-500 uppercase">
                      Inspect expiry & seal before dispatch
                    </span>
                  </div>

                  <div className="border-2 border-black divide-y-2 divide-black">
                    {selectedOrder.items?.map((item, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="p-3 bg-neutral-50 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-none bg-black text-white font-tech text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-sans font-bold text-sm text-neutral-900 leading-snug">
                              {item.name}
                            </p>
                            <p className="font-tech text-xs text-neutral-500">
                              Unit Price: ₹{item.unitPrice} · SKU:{' '}
                              {item.productId?.slice(0, 8) || 'GEN-SKU'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-white border border-black font-tech font-bold text-xs text-neutral-900">
                            QTY: {item.quantity}
                          </span>
                          <p className="font-tech font-bold text-xs text-neutral-800 mt-1">
                            ₹{(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Coordinates & Customer Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-black bg-neutral-50 space-y-2">
                    <p className="font-tech text-xs font-bold uppercase text-neutral-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#FF4800]" />
                      Delivery Coordinates
                    </p>
                    <p className="font-sans text-xs font-bold text-neutral-900 leading-relaxed">
                      {selectedOrder.deliveryAddress || 'No detailed address provided'}
                    </p>
                    {selectedOrder.deliveryInstructions && (
                      <div className="mt-2 pt-2 border-t border-neutral-300">
                        <p className="font-tech text-[10px] text-neutral-500 uppercase font-bold">
                          Rider Gate Note:
                        </p>
                        <p className="font-sans text-xs text-neutral-700 mt-0.5 italic">
                          {'"'}
                          {selectedOrder.deliveryInstructions}
                          {'"'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-2 border-black bg-neutral-50 space-y-2">
                    <p className="font-tech text-xs font-bold uppercase text-neutral-700 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-black" />
                      Financial Ledger
                    </p>
                    <div className="space-y-1 font-tech text-xs text-neutral-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-neutral-900">
                          ₹{selectedOrder.subtotal}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹{selectedOrder.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Platform Take-rate (6%):</span>
                        <span>- ₹{((selectedOrder.subtotal || 0) * 0.06).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-black flex justify-between font-bold text-sm text-neutral-900">
                        <span>Merchant Net Payout:</span>
                        <span className="text-[#00E599] bg-black px-1.5 py-0.5">
                          ₹{((selectedOrder.subtotal || 0) * 0.94).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print & Action Footer */}
                <div className="pt-4 border-t-2 border-black flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="btn-brutal-white !h-9 !py-0 !px-3 font-tech text-xs font-bold uppercase flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Slip</span>
                  </button>

                  <span className="font-tech text-[10px] text-neutral-500 uppercase">
                    Status: <strong className="text-black">{selectedOrder.status}</strong> ·
                    Auto-notifies buyer
                  </span>
                </div>
              </div>
            ) : (
              <div className="card-brutal p-12 text-center bg-white">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                <h3 className="font-display font-black text-xl uppercase text-neutral-900">
                  No Order Selected
                </h3>
                <p className="font-sans text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
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
