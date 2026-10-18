import {
  BrutalBadge,
  BrutalBottomNav,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerOrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Models.Order[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.myOrders();
      setOrders(data.items);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeVariant = (
    status: string,
  ): 'yellow' | 'green' | 'red' | 'black' | 'white' => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
      case 'PREPARING':
        return 'yellow';
      case 'READY_FOR_PICKUP':
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
        return 'green';
      case 'DELIVERED':
        return 'black';
      case 'CANCELLED':
        return 'red';
      default:
        return 'white';
    }
  };

  const isActiveOrder = (status: string) =>
    [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'PICKED_UP',
      'OUT_FOR_DELIVERY',
    ].includes(status);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ACTIVE') return isActiveOrder(o.status);
    if (activeTab === 'COMPLETED') return o.status === 'DELIVERED' || o.status === 'CANCELLED';
    return true;
  });

  const renderOrderItem = useCallback(
    ({ item: order }: { item: Models.Order }) => {
      const isLive = isActiveOrder(order.status);
      const itemCount =
        order.items?.reduce((acc: number, i) => acc + (i.quantity || 1), 0) ||
        order.items?.length ||
        1;

      return (
        <BrutalCard style={{ padding: 14, marginBottom: 12 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/(customer)/order/${order.id}`)}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                  numberOfLines={1}
                >
                  {order.store?.name || 'Local Store Hub'}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#666', marginTop: 2 }}>
                  MANIFEST #{order.id.slice(0, 8).toUpperCase()} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <BrutalBadge label={order.status} variant={getStatusBadgeVariant(order.status)} />
            </View>

            <View
              style={{
                borderTopWidth: 1.5,
                borderTopColor: '#EEEEEE',
                paddingTop: 8,
                marginTop: 4,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#666' }}>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: BrutalColors.black,
                    marginTop: 1,
                  }}
                >
                  ₹{Number(order.total).toFixed(0)}
                </Text>
              </View>

              <View
                style={[
                  {
                    backgroundColor: isLive ? BrutalColors.yellow : BrutalColors.white,
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                  isLive ? BrutalShadow.sm : {},
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                    marginRight: 4,
                  }}
                >
                  {isLive ? 'Live Track' : 'View Receipt'}
                </Text>
                <MaterialIcons name="arrow-forward" size={14} color={BrutalColors.black} />
              </View>
            </View>
          </TouchableOpacity>
        </BrutalCard>
      );
    },
    [router],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ FLIGHT HISTORY · ACTIVE & COMPLETED MISSIONS" />
      <BrutalHeader
        title="Order History"
        subtitle="Network Transactions"
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={fetchOrders}
            style={[
              {
                width: 36,
                height: 36,
                backgroundColor: BrutalColors.white,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="refresh" size={20} color={BrutalColors.black} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={8}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchOrders}
            tintColor={BrutalColors.black}
          />
        }
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                  style={[
                    {
                      flex: 1,
                      borderWidth: 2,
                      borderColor: BrutalColors.black,
                      backgroundColor: isSelected ? BrutalColors.yellow : BrutalColors.white,
                      paddingVertical: 8,
                      alignItems: 'center',
                    },
                    isSelected ? BrutalShadow.sm : {},
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
          ) : (
            <BrutalCard style={{ padding: 30, alignItems: 'center', marginTop: 20 }}>
              <MaterialIcons name="receipt-long" size={48} color={BrutalColors.black} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginTop: 12,
                }}
              >
                No Orders Discovered
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: '#666',
                  textAlign: 'center',
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                When you place an order, live dispatch logs will stream here.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(customer)/products')}
                style={[
                  {
                    backgroundColor: BrutalColors.yellow,
                    borderWidth: 2,
                    borderColor: BrutalColors.black,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  },
                  BrutalShadow.sm,
                ]}
              >
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                >
                  Shop Essentials →
                </Text>
              </TouchableOpacity>
            </BrutalCard>
          )
        }
      />

      {/* Unified Bottom Nav */}
      <BrutalBottomNav currentTab="orders" />
    </SafeAreaView>
  );
}
