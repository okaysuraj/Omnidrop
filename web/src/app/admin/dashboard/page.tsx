'use client';

import {
  ChartNoAxesCombined as UiChartNoAxesCombined,
  MapPin as UiMapPin,
  Package as UiPackage,
  Store as UiStore,
  Users as UiUsers,
} from 'lucide-react';

import { BrutalFooter } from '@/components/shared/brutal-footer';
import { BrutalNav } from '@/components/shared/brutal-nav';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import {
  Activity,
  BadgeCheck,
  CheckCircle2,
  DollarSign,
  Package,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<Models.UserStats | null>(null);
  const [orderStats, setOrderStats] = useState<Models.OrderStats | null>(null);
  const [dashboardStats, setDashboardStats] = useState<Models.DashboardStats | null>(null);
  const [users, setUsers] = useState<Models.User[]>([]);
  const [stores, setStores] = useState<Models.Store[]>([]);
  const [orders, setOrders] = useState<Models.Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stores' | 'orders'>(
    'overview',
  );
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const loadData = useCallback(
    () =>
      Promise.all([
        api.users.stats().catch(() => null),
        api.orders.stats().catch(() => null),
        api.admin.dashboardStats().catch(() => null),
        api.users.all(1).catch(() => ({ items: [] })),
        api.stores.getAll(1).catch(() => ({ items: [] })),
        api.orders.all(1).catch(() => ({ items: [] })),
      ])
        .then(([uStats, oStats, dStats, userList, storeList, orderList]) => {
          setUserStats(uStats);
          setOrderStats(oStats);
          setDashboardStats(dStats);
          setUsers(userList.items);
          setStores(storeList.items);
          setOrders(orderList.items);
        })
        .catch((error) => console.error('Failed to load admin data:', error))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
      return;
    }
    if (user) loadData();
  }, [user, authLoading, router, loadData]);

  const handleToggleUser = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      await api.users.toggleActive(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to update user status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleVerifyStore = async (storeId: string) => {
    setActionLoadingId(storeId);
    try {
      await api.stores.verify(storeId);
      setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, isVerified: true } : s)));
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to verify store');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const filteredStores = stores.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.address || '').toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const totalGMV = dashboardStats?.revenue ?? orderStats?.revenue ?? 0;
  const platformRevenue = Math.round(Number(totalGMV) * 0.06);

  return (
    <div className="min-h-dvh bg-canvas text-ink font-sans selection:bg-brand-soft selection:text-ink flex flex-col">
      <BrutalNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 site-container py-8 sm:py-12 space-y-8"
      >
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted text-ink border rounded-xl border-line font-sans text-xs font-bold   mb-2">
              {'Root control · ops mission radar'}
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl  tracking-tight text-ink">
              Marketplace overview
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary font-medium mt-1">
              Admin operator: <strong className="text-ink">{user?.email}</strong> · Network Status:
              Operational
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="button-secondary !h-10 !py-0 !px-4 text-xs font-sans font-bold  tracking-normal flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
            <span className="font-sans text-xs bg-danger-soft text-ink font-bold  px-3 py-2 border rounded-xl border-line ">
              Admin clearance
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 font-sans text-xs  font-bold">
          <button
            onClick={() => {
              setActiveTab('overview');
              setSearchFilter('');
            }}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'overview'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiChartNoAxesCombined
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('users');
              setSearchFilter('');
            }}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'users'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiUsers className="inline-block size-4 align-text-bottom mr-1.5" aria-hidden="true" />{' '}
            Customers & partners ({users.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('stores');
              setSearchFilter('');
            }}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'stores'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiStore className="inline-block size-4 align-text-bottom mr-1.5" aria-hidden="true" />{' '}
            Store verification ({stores.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              setSearchFilter('');
            }}
            className={`px-4 py-2 border rounded-xl border-line transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-soft text-ink '
                : 'bg-surface hover:bg-muted text-ink '
            }`}
          >
            <UiPackage
              className="inline-block size-4 align-text-bottom mr-1.5"
              aria-hidden="true"
            />{' '}
            All orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Overview Telemetry */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Revenue & Volume Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="surface-card p-4 bg-brand-soft border-line">
                <p className="font-sans text-xs text-ink  font-bold flex items-center justify-between">
                  <span>Gross GMV Volume</span>
                  <TrendingUp className="w-3.5 h-3.5 text-ink" />
                </p>
                <p className="font-display font-bold text-3xl text-ink mt-1">₹{totalGMV}</p>
                <span className="text-xs font-sans text-secondary">Platform merchandise value</span>
              </div>

              <div className="surface-card p-4 bg-brand-soft border-line">
                <p className="font-sans text-xs text-brand  font-bold flex items-center justify-between">
                  <span>Omnidrop Take-Rate (6%)</span>
                  <DollarSign className="w-3.5 h-3.5 text-ink" />
                </p>
                <p className="font-display font-bold text-3xl text-ink mt-1">₹{platformRevenue}</p>
                <span className="text-xs font-sans text-brand font-bold">Net platform revenue</span>
              </div>

              <div className="surface-card p-4">
                <p className="font-sans text-xs text-secondary  font-bold flex items-center justify-between">
                  <span>Total Users</span>
                  <Users className="w-3.5 h-3.5 text-secondary" />
                </p>
                <p className="font-display font-bold text-3xl text-ink mt-1">
                  {dashboardStats?.users?.totalActive || userStats?.total || users.length}
                </p>
                <span className="text-xs font-sans text-secondary">Across all 3 stakeholders</span>
              </div>

              <div className="surface-card p-4">
                <p className="font-sans text-xs text-secondary  font-bold flex items-center justify-between">
                  <span>Total Orders</span>
                  <Package className="w-3.5 h-3.5 text-secondary" />
                </p>
                <p className="font-display font-bold text-3xl text-ink mt-1">
                  {dashboardStats?.orders?.total || orderStats?.total || orders.length}
                </p>
                <span className="text-xs font-sans text-secondary">All-time transactions</span>
              </div>
            </div>

            {/* Stakeholder Breakdown & Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="surface-card p-6 bg-surface space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <h3 className="font-display font-bold text-lg  text-ink">Stakeholder Radar</h3>
                  <Users className="w-5 h-5 text-ink" />
                </div>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between p-2.5 bg-muted border border-line">
                    <span className="text-secondary  font-bold">Customers:</span>
                    <strong className="text-ink text-sm">
                      {dashboardStats?.users?.customers || userStats?.customers || 0}
                    </strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-muted border border-line">
                    <span className="text-secondary  font-bold">Merchants / Stores:</span>
                    <strong className="text-ink text-sm">{stores.length}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-muted border border-line">
                    <span className="text-secondary  font-bold">Active Couriers:</span>
                    <strong className="text-ink text-sm">
                      {dashboardStats?.users?.riders || userStats?.riders || 0}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6 bg-surface space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <h3 className="font-display font-bold text-lg  text-ink">
                    Order Pipeline Health
                  </h3>
                  <Activity className="w-5 h-5 text-ink" />
                </div>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between p-2.5 bg-danger-soft border border-line">
                    <span className="text-danger  font-bold">Pending / In-Prep:</span>
                    <strong className="text-ink text-sm">{orderStats?.pending || 0}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-brand-soft border border-line">
                    <span className="text-ink  font-bold">In-Transit / Air:</span>
                    <strong className="text-ink text-sm">{orderStats?.inTransit || 0}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-brand-soft border border-line">
                    <span className="text-brand  font-bold">Delivered (SLA &lt;15m):</span>
                    <strong className="text-ink text-sm">
                      {orderStats?.delivered || orders.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6 bg-surface space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <h3 className="font-display font-bold text-lg  text-ink">System Parameters</h3>
                  <ShieldAlert className="w-5 h-5 text-ink" />
                </div>
                <div className="space-y-2 font-sans text-xs text-secondary">
                  <p>
                    Database: <strong>Neon Serverless Cloud (Synced)</strong>
                  </p>
                  <p>
                    Auth Identity: <strong>Firebase Authentication</strong>
                  </p>
                  <p>
                    Take-Rate: <strong>6.0% Fixed Platform Cut</strong>
                  </p>
                  <p>
                    Courier Payout: <strong>100% Delivery Fee + Tips</strong>
                  </p>
                  <div className="p-2 bg-brand-soft text-ink font-bold  text-center border border-line mt-3">
                    All microservices online
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customers & partners */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-sans text-xs font-bold  text-secondary tracking-normal">
                {'System stakeholders registry ('}
                {users.length} Nodes)
              </h2>
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="field-input !h-9 text-xs pl-8"
                />
                <Search className="w-4 h-4 text-secondary absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="border rounded-xl border-line overflow-x-auto  bg-surface">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-muted text-ink border-b border-line  text-xs">
                    <th className="p-3">User Entity</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Access State</th>
                    <th className="p-3 text-right">Governance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted transition-colors">
                      <td className="p-3 font-bold font-sans flex items-center gap-2.5">
                        <span className="w-7 h-7 bg-muted border border-line font-sans text-xs font-bold flex items-center justify-center">
                          {u.fullName?.[0]?.toUpperCase() || 'U'}
                        </span>
                        <span>{u.fullName || 'Anonymous Node'}</span>
                      </td>
                      <td className="p-3 text-secondary">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 font-bold  border border-line text-xs ${
                            u.role === 'ADMIN'
                              ? 'bg-danger-soft text-ink'
                              : u.role === 'SHOPKEEPER'
                                ? 'bg-brand-soft text-ink'
                                : u.role === 'DELIVERY_PARTNER'
                                  ? 'bg-brand-soft text-ink'
                                  : 'bg-muted text-ink'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 font-bold  text-xs ${
                            u.isActive
                              ? 'text-brand bg-brand-soft border border-brand'
                              : 'text-danger bg-danger-soft border border-danger'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          disabled={actionLoadingId === u.id || u.role === 'ADMIN'}
                          className={`px-3 py-1 font-sans text-xs font-bold  border border-line transition-all ${
                            u.isActive
                              ? 'bg-muted hover:bg-muted text-danger'
                              : 'bg-brand-soft hover:opacity-90 text-ink'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          {actionLoadingId === u.id
                            ? 'Updating...'
                            : u.isActive
                              ? 'Block Access'
                              : 'Restore Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Store verification Queue */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-sans text-xs font-bold  text-secondary tracking-normal">
                {'Micro-hub store approval pipeline ('}
                {stores.length} Stores registered)
              </h2>
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Filter stores..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="field-input !h-9 text-xs pl-8"
                />
                <Search className="w-4 h-4 text-secondary absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStores.map((s) => (
                <div
                  key={s.id}
                  className="surface-card p-5 bg-surface border rounded-xl border-line space-y-4 "
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-sans font-bold text-lg text-ink leading-tight">
                        {s.name}
                      </h3>
                      <p className="font-sans text-xs text-secondary mt-0.5">
                        Hub ID: #{s.id.slice(0, 8).toUpperCase()} · Radius: {s.radiusKm || 5.0} km
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 font-sans text-xs font-bold  border border-line shrink-0 ${
                        s.isVerified ? 'bg-brand-soft text-ink' : 'bg-brand-soft text-ink'
                      }`}
                    >
                      {s.isVerified ? 'VERIFIED' : 'PENDING APPROVAL'}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-secondary bg-muted p-2.5 border border-line">
                    <UiMapPin
                      className="inline-block size-4 align-text-bottom mr-1.5"
                      aria-hidden="true"
                    />{' '}
                    {s.address || 'Address pending physical verification'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-line">
                    <span className="font-sans text-xs text-secondary">
                      Bank IFSC: {s.bankIfsc || 'Pending'}
                    </span>

                    {!s.isVerified ? (
                      <button
                        onClick={() => handleVerifyStore(s.id)}
                        disabled={actionLoadingId === s.id}
                        className="button-primary !h-8 !px-3 font-sans text-xs font-bold  flex items-center gap-1.5"
                      >
                        <BadgeCheck className="w-4 h-4" />
                        <span>
                          {actionLoadingId === s.id ? 'Approving...' : 'Approve & Verify'}
                        </span>
                      </button>
                    ) : (
                      <span className="font-sans text-xs text-brand font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Certified Merchant
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Master Order Feed */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="font-sans text-xs font-bold  text-secondary tracking-normal">
              {'Recent network orders ('}
              {orders.length} Items streamed)
            </h2>

            <div className="border rounded-xl border-line overflow-x-auto  bg-surface">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-muted text-ink border-b border-line  text-xs">
                    <th className="p-3">Order Code</th>
                    <th className="p-3">Origin Hub</th>
                    <th className="p-3">Gross Total</th>
                    <th className="p-3">Take-Rate (6%)</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted transition-colors">
                      <td className="p-3 font-bold">
                        <Link
                          href={`/orders/${o.id}`}
                          className="hover:underline text-ink font-sans"
                        >
                          #{o.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="p-3 text-ink">{o.store?.name || 'Local Store'}</td>
                      <td className="p-3 font-bold text-ink">₹{o.total}</td>
                      <td className="p-3 text-brand font-bold">
                        ₹{(Number(o.total || 0) * 0.06).toFixed(2)}
                      </td>
                      <td className="p-3 text-secondary">{o.paymentMethod || 'UPI'}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-0.5 font-bold  border border-line text-xs ${
                            o.status === 'DELIVERED'
                              ? 'bg-brand-soft text-ink'
                              : o.status === 'PREPARING'
                                ? 'bg-brand-soft text-ink'
                                : o.status === 'CANCELLED'
                                  ? 'bg-danger-soft text-ink'
                                  : 'bg-muted text-ink'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <BrutalFooter />
    </div>
  );
}
