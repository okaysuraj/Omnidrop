'use client';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { Minus, Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function InventoryCentralDashboard() {
  const { user } = useAuth();
  const [store, setStore] = useState<Models.Store | null>(null);
  const [inventory, setInventory] = useState<Models.InventoryItem[]>([]);
  const [orders, setOrders] = useState<Models.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const loadShopkeeperData = async () => {
      try {
        const myStores = await api.stores.myStores().catch(() => []);
        if (myStores && myStores.length > 0) {
          const currentStore = myStores[0];
          setStore(currentStore);

          const [inv, storeOrders] = await Promise.all([
            api.inventory
              .manage(currentStore.id)
              .then((result) => result.items)
              .catch(() => []),
            api.orders
              .byStore(currentStore.id)
              .then((result) => result.items)
              .catch(() => []),
          ]);
          setInventory(inv);
          setOrders(storeOrders);
        }
      } catch (err) {
        console.error('Failed to load store data', err);
      } finally {
        setLoading(false);
      }
    };
    loadShopkeeperData();
  }, [user]);

  const handleUpdateStock = async (productId: string, newStock: number) => {
    if (!store) return;
    try {
      await api.inventory.updateStock(store.id, productId, Math.max(0, newStock));
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, stock: Math.max(0, newStock) } : item,
        ),
      );
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to update stock');
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const product = item.product;
    const name = product?.name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'LOW') return item.stock > 0 && item.stock <= 5;
    if (statusFilter === 'OUT') return item.stock === 0;
    if (statusFilter === 'IN') return item.stock > 5;
    return true;
  });

  const lowStockItems = inventory.filter((item) => item.stock > 0 && item.stock <= 5);
  const outOfStockItems = inventory.filter((item) => item.stock === 0);
  const totalValue = inventory.reduce((sum, item) => {
    const price = item.priceOverride || item.product?.sellingPrice || 0;
    return sum + price * (item.stock || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B] font-sans selection:bg-[#FFE600] selection:text-black flex flex-col justify-between">
      <BrutalNav />

      <main className="container-brutal py-8 sm:py-12 space-y-8">
        {/* Header Title & Subnavigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white border-2 border-black font-tech text-xs font-bold uppercase shadow-[2px_2px_0px_#000] mb-2">
              {'// MERCHANT CONSOLE ·'}
              {store?.name || 'OMNI MICRO-HUB'}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900">
              Inventory & Shelf Logistics
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Real-time physical stock counts. Changes sync immediately to nearby customer shelves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/shopkeeper/products/new"
              className="btn-brutal-yellow !h-10 !py-0 !px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New SKU</span>
            </Link>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-tech text-xs uppercase font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border-2 border-black bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]"
          >
            📦 Shelf Inventory ({inventory.length})
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-[2px_2px_0px_#000]"
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

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
              Total Inventory Value
            </div>
            <div className="font-tech font-black text-2xl text-neutral-900 mt-1">
              ₹{totalValue.toFixed(2)}
            </div>
            <div className="font-tech text-[10px] text-neutral-500 font-bold mt-1">
              94% MERCHANT RETAIN
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
              Active Catalog SKUs
            </div>
            <div className="font-tech font-black text-2xl text-neutral-900 mt-1">
              {inventory.length}
            </div>
            <div className="font-tech text-[10px] text-[#059669] font-bold mt-1">
              ALL BARCODES SYNCED
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
              Low Stock Alerts
            </div>
            <div className="font-tech font-black text-2xl text-[#FF4800] mt-1">
              {lowStockItems.length}
            </div>
            <div className="font-tech text-[10px] text-neutral-500 font-bold mt-1">
              &le; 5 UNITS REMAINING
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="font-tech text-[10px] text-neutral-500 font-bold uppercase">
              Out of Stock
            </div>
            <div className="font-tech font-black text-2xl text-neutral-900 mt-1">
              {outOfStockItems.length}
            </div>
            <div className="font-tech text-[10px] text-neutral-500 font-bold mt-1">
              HIDDEN FROM BUYERS
            </div>
          </div>
        </div>

        {/* Inventory Control Table */}
        <div className="card-brutal bg-white p-5 border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg uppercase text-neutral-900">
                Shelf Barcode Ledger
              </span>
              <span className="badge-brutal-black text-[10px] font-bold">
                {filteredInventory.length} SKUs
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                className="input-brutal !py-1.5 !px-3 font-tech text-xs w-48"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="flex border-2 border-black bg-[#FAFAF8] font-tech text-xs font-bold">
                {['ALL', 'IN', 'LOW', 'OUT'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 transition-colors ${
                      statusFilter === filter
                        ? 'bg-[#FFE600] text-black'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center font-tech text-xs font-bold uppercase">
              SCANNING INVENTORY REGISTRY...
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="py-12 text-center font-tech text-xs text-neutral-500 space-y-2">
              <Package className="w-8 h-8 mx-auto text-neutral-400" />
              <div>NO PRODUCTS IN THIS SHELF VIEW</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-tech text-xs border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b-2 border-black bg-neutral-950 text-white">
                    <th className="py-3 px-4 font-bold uppercase w-[40%]">Product / SKU</th>
                    <th className="py-3 px-4 font-bold uppercase w-[20%]">Price</th>
                    <th className="py-3 px-4 font-bold uppercase w-[25%]">Physical Stock</th>
                    <th className="py-3 px-4 font-bold uppercase w-[15%] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 border-black/10">
                  {filteredInventory.map((item) => {
                    const prod = item.product;
                    const price = item.priceOverride || prod?.sellingPrice || 0;
                    const stock = item.stock || 0;
                    return (
                      <tr key={item.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-display font-black text-sm text-neutral-900 uppercase">
                            {prod?.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-bold uppercase">
                            {prod?.unit || 'unit'} · SKU #{prod?.id?.slice(0, 8)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-sm text-neutral-900">
                          ₹{Number(price).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(item.productId, stock - 1)}
                              className="w-7 h-7 flex items-center justify-center border-2 border-black bg-white hover:bg-[#FFE600] font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-black text-sm min-w-[32px] text-center">
                              {stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(item.productId, stock + 1)}
                              className="w-7 h-7 flex items-center justify-center border-2 border-black bg-white hover:bg-[#FFE600] font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {stock === 0 ? (
                            <span className="badge-brutal-black text-[9px]">OUT OF STOCK</span>
                          ) : stock <= 5 ? (
                            <span className="badge-brutal-orange text-[9px]">LOW ({stock})</span>
                          ) : (
                            <span className="badge-brutal-green text-[9px]">
                              AVAILABLE ({stock})
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <BrutalFooter />
    </div>
  );
}
