import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import type * as Models from '@/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MerchantOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'New' | 'Preparing' | 'Ready' | 'History'>('New');
  const [orders, setOrders] = useState<Models.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const stores = await api.stores.myStores();
      if (stores.length > 0) {
        const storeId = stores[0].id;
        const fetchedOrders = await api.orders.storeOrders(storeId);
        setOrders(fetchedOrders.items);
      }
    } catch (e) {
      console.error('Failed to load merchant orders', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setActionLoadingId(orderId);
    try {
      await api.orders.updateStatus(orderId, status);
      fetchOrders();
    } catch {
      Alert.alert('Status Error', 'Failed to update order status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'New') return order.status === 'PENDING' || order.status === 'CONFIRMED';
    if (activeTab === 'Preparing') return order.status === 'PREPARING';
    if (activeTab === 'Ready') return order.status === 'READY_FOR_PICKUP';
    if (activeTab === 'History')
      return ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status);
    return false;
  });

  const getTabCount = (tab: 'New' | 'Preparing' | 'Ready' | 'History') => {
    return orders.filter((order) => {
      if (tab === 'New') return order.status === 'PENDING' || order.status === 'CONFIRMED';
      if (tab === 'Preparing') return order.status === 'PREPARING';
      if (tab === 'Ready') return order.status === 'READY_FOR_PICKUP';
      if (tab === 'History')
        return ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status);
      return false;
    }).length;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip
        left="FULFILLMENT HUB // DISPATCH QUEUE"
        right={`ACTIVE: ${orders.filter((o) => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)).length}`}
      />

      <BrutalHeader
        title="FULFILLMENT STATION"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={fetchOrders} style={styles.refreshIconBtn} activeOpacity={0.8}>
            <MaterialIcons name="refresh" size={18} color={BrutalColors.black} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={BrutalColors.black}
          />
        }
      >
        {/* Status Filter Tab Matrix */}
        <View style={styles.tabMatrix}>
          {(['New', 'Preparing', 'Ready', 'History'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const count = getTabCount(tab);
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  isSelected ? styles.tabButtonActive : styles.tabButtonInactive,
                ]}
              >
                <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
                <View
                  style={[
                    styles.tabCounter,
                    { backgroundColor: isSelected ? BrutalColors.black : BrutalColors.yellow },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabCounterText,
                      { color: isSelected ? BrutalColors.yellow : BrutalColors.black },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={BrutalColors.black} />
            <Text style={styles.loadingText}>SYNCHRONIZING ORDER QUEUE...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <BrutalCard bg={BrutalColors.white} style={styles.emptyCard}>
            <MaterialIcons name="receipt-long" size={44} color={BrutalColors.black} />
            <Text style={styles.emptyTitle}>NO {activeTab.toUpperCase()} ORDERS IN PIPELINE</Text>
            <Text style={styles.emptySub}>
              New incoming customer orders will appear automatically with sound alerts.
            </Text>
          </BrutalCard>
        ) : (
          <View style={{ gap: 14 }}>
            {filteredOrders.map((order) => {
              const isActioning = actionLoadingId === order.id;
              const itemCount = order.items?.length || 1;

              return (
                <BrutalCard key={order.id} bg={BrutalColors.white} style={styles.orderCard}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push(`/(merchant)/orders/${order.id}`)}
                  >
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.orderTargetLabel}>DISPATCH TARGET</Text>
                        <Text style={styles.orderIdText}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Text>
                      </View>
                      <BrutalBadge
                        label={order.status}
                        variant={
                          order.status === 'PENDING'
                            ? 'yellow'
                            : order.status === 'PREPARING'
                              ? 'yellow'
                              : 'green'
                        }
                      />
                    </View>

                    <View style={styles.orderSpecsRow}>
                      <View style={styles.orderSpecBox}>
                        <Text style={styles.orderSpecLabel}>ITEMS TO PACK</Text>
                        <Text style={styles.orderSpecVal}>{itemCount} SKUs</Text>
                      </View>
                      <View style={styles.orderSpecBox}>
                        <Text style={styles.orderSpecLabel}>GROSS VALUE</Text>
                        <Text style={styles.orderSpecVal}>₹{order.total}</Text>
                      </View>
                      <View style={styles.orderSpecBox}>
                        <Text style={styles.orderSpecLabel}>EST. SLA</Text>
                        <Text style={styles.orderSpecVal}>15 MIN</Text>
                      </View>
                    </View>

                    <View style={styles.addressStrip}>
                      <Ionicons name="location-outline" size={14} color={BrutalColors.black} />
                      <Text style={styles.addressText} numberOfLines={1}>
                        {order.deliveryAddress || 'Indiranagar Local Delivery Corridor'}
                      </Text>
                    </View>

                    {/* Tap hint */}
                    <View style={styles.checklistHint}>
                      <Ionicons name="checkbox-outline" size={14} color="#666" />
                      <Text style={styles.checklistHintText}>
                        TAP CARD TO OPEN PACKING VERIFICATION CHECKLIST →
                      </Text>
                    </View>

                    {/* Immediate Status Progression Buttons */}
                    <View style={{ marginTop: 12 }}>
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <BrutalButton
                          title="ACCEPT & START PACKING →"
                          onPress={() => handleUpdateStatus(order.id, 'PREPARING')}
                          loading={isActioning}
                          variant="yellow"
                          size="md"
                          fullWidth
                        />
                      )}

                      {order.status === 'PREPARING' && (
                        <BrutalButton
                          title="MARK READY FOR RUNNER PICKUP ✓"
                          onPress={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                          loading={isActioning}
                          variant="green"
                          size="md"
                          fullWidth
                        />
                      )}

                      {order.status === 'READY_FOR_PICKUP' && (
                        <BrutalButton
                          title="CONFIRM HANDOVER TO COURIER ✓"
                          onPress={() => handleUpdateStatus(order.id, 'PICKED_UP')}
                          loading={isActioning}
                          variant="black"
                          size="md"
                          fullWidth
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </BrutalCard>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  refreshIconBtn: {
    width: 36,
    height: 36,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...BrutalShadow.sm,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabMatrix: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: BrutalColors.yellow,
    ...BrutalShadow.sm,
  },
  tabButtonInactive: {
    backgroundColor: BrutalColors.white,
  },
  tabText: {
    fontSize: 9,
    fontWeight: '900',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  tabCounter: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: BrutalColors.black,
  },
  tabCounterText: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  centerLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: BrutalColors.black,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  orderCard: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderTargetLabel: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: '#777',
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: '900',
    color: BrutalColors.black,
    marginTop: 1,
  },
  orderSpecsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  orderSpecBox: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    padding: 8,
  },
  orderSpecLabel: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: '#666',
  },
  orderSpecVal: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
    marginTop: 2,
  },
  addressStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F8F6',
    padding: 8,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
  },
  addressText: {
    fontSize: 10,
    fontWeight: '700',
    color: BrutalColors.black,
    flex: 1,
  },
  checklistHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 2,
  },
  checklistHintText: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: '#666',
  },
});
