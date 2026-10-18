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
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  image: string;
  packed: boolean;
}

export default function PackingStatusScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const orderId = id as string;

  const [order, setOrder] = useState<Models.Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [items, setItems] = useState<PackingItem[]>([]);

  useEffect(() => {
    if (orderId) {
      api.orders
        .byId(orderId)
        .then((data) => {
          setOrder(data);
          if (data.items) {
            setItems(
              data.items.map((item, idx: number) => ({
                id: item.id || `item-${idx}`,
                name: item.product?.name || item.name || 'Omnidrop SKU',
                quantity: item.quantity || 1,
                location: `BAY-${String.fromCharCode(65 + (idx % 4))} // AISLE ${String((idx % 8) + 1).padStart(2, '0')}`,
                image:
                  item.product?.images?.[0] ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
                packed: false,
              })),
            );
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const toggleItemPacked = (itemId: string) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, packed: !item.packed } : item)));
  };

  const packAllItems = () => {
    setItems(items.map((item) => ({ ...item, packed: true })));
  };

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const allPacked = totalCount > 0 && packedCount === totalCount;
  const progressPercent = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  const handleMarkReady = async () => {
    setActionLoading(true);
    try {
      await api.orders.updateStatus(orderId, 'READY_FOR_PICKUP');
      setIsReady(true);
      Alert.alert('PACKING COMPLETE', 'Tote sealed and ready for autonomous runner pickup.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('PACKING ERROR', 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={BrutalColors.black} />
        <Text style={styles.loadingText}>LOADING ORDER MANIFEST...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip
        left="OMNIDROP // FULFILLMENT STATION"
        right={`PKG #${orderId?.slice(0, 8).toUpperCase()}`}
      />

      <BrutalHeader
        title="PACK MANIFEST"
        onBack={() => router.back()}
        rightAction={
          <BrutalBadge
            label={order?.status || 'PACKING'}
            variant={order?.status === 'READY_FOR_PICKUP' ? 'green' : 'yellow'}
          />
        }
      />

      <ScrollView style={styles.mainContent} contentContainerStyle={styles.mainContentContainer}>
        {/* Order Header Card */}
        <BrutalCard bg={BrutalColors.white} style={{ marginBottom: 16 }}>
          <View style={styles.orderTopRow}>
            <View>
              <Text style={styles.orderLabel}>DISPATCH TARGET</Text>
              <Text style={styles.orderIdText}>#{orderId?.slice(0, 10).toUpperCase()}</Text>
            </View>
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={14} color={BrutalColors.black} />
              <Text style={styles.timerText}>SLA: 15 MIN</Text>
            </View>
          </View>

          {/* Packing Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>PACKING PROGRESS</Text>
              <Text style={styles.progressCount}>
                {packedCount} OF {totalCount} LOADED
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Toggle ready switch */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>SEAL TOTE FOR RUNNER PICKUP</Text>
              <Text style={styles.toggleSubtitle}>
                Alerts courier flight radar that package is staged
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E2DC', true: BrutalColors.terminalGreen }}
              thumbColor={BrutalColors.black}
              ios_backgroundColor="#E2E2DC"
              onValueChange={(val) => {
                if (val && allPacked) handleMarkReady();
              }}
              value={isReady || order?.status === 'READY_FOR_PICKUP'}
              disabled={!allPacked || order?.status === 'READY_FOR_PICKUP' || actionLoading}
            />
          </View>
        </BrutalCard>

        {/* Verification Checklist Card */}
        <BrutalCard bg={BrutalColors.white} style={{ marginBottom: 20 }}>
          <View style={styles.checklistHeader}>
            <View>
              <Text style={styles.sectionHeaderTitle}>VERIFICATION CHECKLIST</Text>
              <Text style={styles.sectionSubtitle}>CONFIRM PHYSICALLY LOADED SKUs</Text>
            </View>
            {!allPacked && totalCount > 0 && (
              <TouchableOpacity
                onPress={packAllItems}
                activeOpacity={0.8}
                style={styles.packAllBtn}
              >
                <Text style={styles.packAllBtnText}>PACK ALL</Text>
              </TouchableOpacity>
            )}
            {allPacked && <BrutalBadge label="VERIFIED 100%" variant="green" />}
          </View>

          <View style={{ gap: 10 }}>
            {items.map((item) => {
              const isItemPacked = item.packed;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, isItemPacked && styles.itemCardPacked]}
                  onPress={() => toggleItemPacked(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.checkboxWrapper}>
                    <Checkbox
                      value={isItemPacked}
                      onValueChange={() => toggleItemPacked(item.id)}
                      color={isItemPacked ? BrutalColors.black : undefined}
                      style={styles.checkbox}
                    />
                  </View>

                  <View style={styles.itemImageContainer}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="cube-outline" size={24} color={BrutalColors.black} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={[styles.itemName, isItemPacked && styles.itemNamePacked]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>×{item.quantity}</Text>
                      </View>
                    </View>
                    <View style={styles.locationChip}>
                      <Ionicons name="scan-outline" size={11} color={BrutalColors.black} />
                      <Text style={styles.locationCode}>{item.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BrutalCard>

        {/* Complete Packing Action */}
        <BrutalButton
          title={
            allPacked
              ? 'CONFIRM PACK & NOTIFY RUNNER ✓'
              : `CHECK ALL SKUs (${packedCount}/${totalCount} PACKED)`
          }
          variant={allPacked ? 'green' : 'black'}
          disabled={!allPacked || order?.status === 'READY_FOR_PICKUP'}
          loading={actionLoading}
          onPress={handleMarkReady}
          size="lg"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BrutalColors.canvas,
    gap: 12,
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: BrutalColors.black,
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  orderIdText: {
    fontSize: 22,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: -0.5,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BrutalColors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.sm,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '900',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  progressContainer: {
    backgroundColor: BrutalColors.canvas,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    padding: 10,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: BrutalColors.black,
  },
  progressCount: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: BrutalColors.black,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: BrutalColors.white,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BrutalColors.terminalGreen,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2EE',
    padding: 12,
    borderWidth: 2,
    borderColor: BrutalColors.black,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: BrutalColors.black,
    paddingBottom: 12,
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  packAllBtn: {
    backgroundColor: BrutalColors.yellow,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...BrutalShadow.sm,
  },
  packAllBtnText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: BrutalColors.black,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    gap: 12,
  },
  itemCardPacked: {
    backgroundColor: '#E8FBF1',
  },
  checkboxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: BrutalColors.black,
  },
  itemImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: BrutalColors.canvas,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '800',
    color: BrutalColors.black,
    flex: 1,
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  qtyBadge: {
    backgroundColor: BrutalColors.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.white,
    fontFamily: 'monospace',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationCode: {
    fontSize: 10,
    fontWeight: '800',
    color: '#666',
    fontFamily: 'monospace',
  },
});
