import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type { InventoryItem, Order, Store } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useMerchantDashboard() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchDashboardData = async () => {
    try {
      const stores = await api.stores.myStores();
      if (Array.isArray(stores) && stores.length > 0) {
        const activeStore = stores[0];
        setStore(activeStore);

        const [invData, ordersData] = await Promise.all([
          api.inventory
            .manage(activeStore.id)
            .then((result) => result.items)
            .catch(() => []),
          api.orders
            .storeOrders(activeStore.id)
            .then((result) => result.items)
            .catch(() => []),
        ]);

        setInventory(invData);
        setOrders(ordersData);
      }
    } catch (e) {
      console.error('Failed to load merchant dashboard', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const handleUpdateStock = async (item: InventoryItem, delta: number) => {
    if (!store?.id) return;
    const prodId = item.productId || item.product?.id || item.id;
    const newStock = Math.max(0, (item.stock || 0) + delta);
    setUpdatingId(prodId);
    try {
      await api.inventory.updateStock(store.id, prodId, newStock);
      setInventory((prev) =>
        prev.map((inv) => {
          const pId = inv.productId || inv.product?.id || inv.id;
          return pId === prodId ? { ...inv, stock: newStock } : inv;
        }),
      );
    } catch {
      Alert.alert('Error', 'Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };
  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Sign out of Merchant Hub?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };
  const activeOrdersCount = orders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status),
  ).length;
  const totalRevenue = orders.reduce(
    (sum, o) => (o.status === 'DELIVERED' ? sum + Number(o.total || 0) : sum),
    0,
  );
  const filteredInventory = inventory.filter((item) => {
    if (!searchQuery.trim()) return true;
    const name = (item.product?.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query);
  });
  return {
    router,
    store,
    inventory,
    loading,
    refreshing,
    updatingId,
    searchQuery,
    setSearchQuery,
    fetchDashboardData,
    handleRefresh,
    handleUpdateStock,
    handleLogout,
    activeOrdersCount,
    totalRevenue,
    filteredInventory,
  };
}
