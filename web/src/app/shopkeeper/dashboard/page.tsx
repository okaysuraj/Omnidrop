'use client';

import {
  ClipboardList as UiClipboardList,
  CreditCard as UiCreditCard,
  Package as UiPackage,
  Settings as UiSettings,
} from 'lucide-react';

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
              {'Merchant console ·'}
              {store?.name || 'OMNI MICRO-HUB'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Your store inventory
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Real-time physical stock counts. Changes sync immediately to nearby customer shelves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/shopkeeper/products/new"
              className="button-primary !h-10 !py-0 !px-4 text-xs font-bold  tracking-normal flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New SKU</span>
            </Link>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap gap-2 font-sans text-xs  font-bold">
          <Link
            href="/shopkeeper/dashboard"
            className="px-4 py-2 border rounded-xl border-line bg-brand-soft text-ink "
          >
            <UiPackage
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Inventory ({inventory.length})
          </Link>
          <Link
            href="/shopkeeper/orders"
            className="px-4 py-2 border rounded-xl border-line bg-surface hover:bg-muted text-ink "
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

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-surface border rounded-xl border-line ">
            <div className="font-sans text-xs text-secondary font-bold ">Total Inventory Value</div>
            <div className="font-sans font-bold text-2xl text-ink mt-1">
              ₹{totalValue.toFixed(2)}
            </div>
            <div className="font-sans text-xs text-secondary font-bold mt-1">
              94% merchant retain
            </div>
          </div>

          <div className="p-4 bg-surface border rounded-xl border-line ">
            <div className="font-sans text-xs text-secondary font-bold ">Active Catalog SKUs</div>
            <div className="font-sans font-bold text-2xl text-ink mt-1">{inventory.length}</div>
            <div className="font-sans text-xs text-brand font-bold mt-1">All barcodes synced</div>
          </div>

          <div className="p-4 bg-surface border rounded-xl border-line ">
            <div className="font-sans text-xs text-secondary font-bold ">Low Stock Alerts</div>
            <div className="font-sans font-bold text-2xl text-danger mt-1">
              {lowStockItems.length}
            </div>
            <div className="font-sans text-xs text-secondary font-bold mt-1">
              &le; 5 UNITS REMAINING
            </div>
          </div>

          <div className="p-4 bg-surface border rounded-xl border-line ">
            <div className="font-sans text-xs text-secondary font-bold ">Out of Stock</div>
            <div className="font-sans font-bold text-2xl text-ink mt-1">
              {outOfStockItems.length}
            </div>
            <div className="font-sans text-xs text-secondary font-bold mt-1">
              Hidden from buyers
            </div>
          </div>
        </div>

        {/* Inventory Control Table */}
        <div className="surface-card bg-surface p-5 border rounded-xl border-line  space-y-4">
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg  text-ink">Shelf Barcode Ledger</span>
              <span className="status-badge-black text-xs font-bold">
                {filteredInventory.length} SKUs
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                className="field-input !py-1.5 !px-3 font-sans text-xs w-48"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="flex border rounded-xl border-line bg-canvas font-sans text-xs font-bold">
                {['ALL', 'IN', 'LOW', 'OUT'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 transition-colors ${
                      statusFilter === filter
                        ? 'bg-brand-soft text-ink'
                        : 'text-secondary hover:text-ink'
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
            <div className="py-12 text-center font-sans text-xs font-bold ">
              Scanning inventory registry...
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="py-12 text-center font-sans text-xs text-secondary space-y-2">
              <Package className="w-8 h-8 mx-auto text-secondary" />
              <div>No products in this shelf view</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-line bg-muted text-ink">
                    <th className="py-3 px-4 font-bold  w-[40%]">Product / SKU</th>
                    <th className="py-3 px-4 font-bold  w-[20%]">Price</th>
                    <th className="py-3 px-4 font-bold  w-[25%]">Physical Stock</th>
                    <th className="py-3 px-4 font-bold  w-[15%] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-line">
                  {filteredInventory.map((item) => {
                    const prod = item.product;
                    const price = item.priceOverride || prod?.sellingPrice || 0;
                    const stock = item.stock || 0;
                    return (
                      <tr key={item.id} className="hover:bg-canvas transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-display font-bold text-sm text-ink ">
                            {prod?.name}
                          </div>
                          <div className="text-xs text-secondary font-bold ">
                            {prod?.unit || 'unit'} · sku #{prod?.id?.slice(0, 8)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-sm text-ink">
                          ₹{Number(price).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={'Decrease stock for ' + item.product?.name}
                              onClick={() => handleUpdateStock(item.productId, stock - 1)}
                              className="w-9 h-9 flex items-center justify-center border rounded-xl border-line bg-surface hover:bg-brand-soft font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm min-w-[32px] text-center">
                              {stock}
                            </span>
                            <button
                              type="button"
                              aria-label={'Increase stock for ' + item.product?.name}
                              onClick={() => handleUpdateStock(item.productId, stock + 1)}
                              className="w-9 h-9 flex items-center justify-center border rounded-xl border-line bg-surface hover:bg-brand-soft font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {stock === 0 ? (
                            <span className="status-badge-black text-xs">Out of stock</span>
                          ) : stock <= 5 ? (
                            <span className="status-badge-orange text-xs">Low ({stock})</span>
                          ) : (
                            <span className="badge-success text-xs">Available ({stock})</span>
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
