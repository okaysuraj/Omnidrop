import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors } from '@/constants/theme';
import { styles } from '@/features/merchant/dashboard.styles';
import { useMerchantDashboard } from '@/features/merchant/use-merchant-dashboard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MerchantDashboardScreen() {
  const {
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
  } = useMerchantDashboard();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip
        left={`MERCHANT // ${store?.name?.toUpperCase() || 'HUB CONSOLE'}`}
        right={`QUEUE: ${activeOrdersCount} PENDING`}
      />

      <BrutalHeader
        title={store?.name?.toUpperCase() || 'MERCHANT HUB'}
        subtitle="Shelf & Queue Console"
        showBack={false}
        rightAction={
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.push('/(merchant)/orders')}
              activeOpacity={0.8}
              style={styles.queueBtn}
            >
              <MaterialIcons name="receipt-long" size={18} color={BrutalColors.black} />
              {activeOrdersCount > 0 && (
                <View style={styles.queueBadge}>
                  <Text style={styles.queueBadgeText}>{activeOrdersCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} activeOpacity={0.8} style={styles.logoutBtn}>
              <MaterialIcons name="logout" size={16} color={BrutalColors.urgentRed} />
            </TouchableOpacity>
          </View>
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
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={BrutalColors.black} />
            <Text style={styles.loadingText}>SYNCHRONIZING INVENTORY DATABASE...</Text>
          </View>
        ) : !store ? (
          <BrutalCard bg={BrutalColors.white} style={styles.emptyCard}>
            <MaterialIcons name="store" size={48} color={BrutalColors.black} />
            <Text style={styles.emptyTitle}>NO STORE PROFILE CONFIGURED</Text>
            <Text style={styles.emptySub}>
              Register your retail storefront on the Omnidrop merchant portal to start accepting
              hyperlocal orders.
            </Text>
          </BrutalCard>
        ) : (
          <View style={{ gap: 16 }}>
            {/* Store Badge Banner */}
            <BrutalCard bg={BrutalColors.yellow} style={styles.storeBanner}>
              <View style={styles.storeBannerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.storeNameText} numberOfLines={1}>
                    {store.name}
                  </Text>
                  <Text style={styles.storeAddressText}>📍 {store.address}</Text>
                </View>
                <BrutalBadge label="VERIFIED HUB" variant="black" />
              </View>
              <View style={styles.bannerDivider} />
              <View style={styles.bannerBottomRow}>
                <Text style={styles.bannerMeta}>TAKE-RATE // 6.0% FLAT</Text>
                <Text style={styles.bannerMeta}>SLA // &lt; 15 MIN</Text>
              </View>
            </BrutalCard>

            {/* Quick Metrics Bento Matrix */}
            <View style={styles.metricsRow}>
              <View
                style={[
                  styles.metricCard,
                  {
                    backgroundColor:
                      activeOrdersCount > 0 ? BrutalColors.yellow : BrutalColors.white,
                  },
                ]}
              >
                <Text style={styles.metricLabel}>QUEUE</Text>
                <Text style={styles.metricVal}>{activeOrdersCount}</Text>
                <Text style={styles.metricSub}>NEEDS PACK</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: BrutalColors.white }]}>
                <Text style={styles.metricLabel}>SETTLED</Text>
                <Text style={styles.metricVal}>₹{Math.round(totalRevenue)}</Text>
                <Text style={styles.metricSub}>GROSS GMV</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: BrutalColors.white }]}>
                <Text style={styles.metricLabel}>SKUs</Text>
                <Text style={styles.metricVal}>{inventory.length}</Text>
                <Text style={styles.metricSub}>ON SHELF</Text>
              </View>
            </View>

            {/* Orders Fulfillment Station Shortcut */}
            <BrutalButton
              title={`OPEN FULFILLMENT STATION (${activeOrdersCount} PENDING) →`}
              onPress={() => router.push('/(merchant)/orders')}
              variant="yellow"
              size="lg"
              fullWidth
            />

            {/* Shelf Inventory Management */}
            <View>
              <View style={styles.inventoryHeader}>
                <View>
                  <Text style={styles.inventoryTitle}>SHELF STOCK LEDGER ({inventory.length})</Text>
                  <Text style={styles.inventorySub}>REAL-TIME SHELF COUNTS & TELEMETRY</Text>
                </View>
                <TouchableOpacity
                  onPress={fetchDashboardData}
                  activeOpacity={0.7}
                  style={styles.syncBtn}
                >
                  <Ionicons name="reload" size={13} color={BrutalColors.black} />
                  <Text style={styles.syncBtnText}>SYNC</Text>
                </TouchableOpacity>
              </View>

              {/* Quick SKU Search */}
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color={BrutalColors.black} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="FILTER SHELF SKUs..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                    <Ionicons name="close-circle" size={16} color="#888" />
                  </TouchableOpacity>
                )}
              </View>

              {filteredInventory.length === 0 ? (
                <BrutalCard bg={BrutalColors.white} style={styles.emptyCard}>
                  <MaterialIcons name="inventory" size={36} color={BrutalColors.black} />
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'NO MATCHING SKUs FOUND' : 'ZERO SKUs IN INVENTORY'}
                  </Text>
                  <Text style={styles.emptySub}>
                    {searchQuery
                      ? 'Try searching another product name or clear filter.'
                      : 'Add items from merchant web portal to populate.'}
                  </Text>
                </BrutalCard>
              ) : (
                <View style={{ gap: 10 }}>
                  {filteredInventory.map((item, idx) => {
                    const prod = item.product;
                    const prodId = item.productId || item.product?.id || item.id;
                    const stock = item.stock ?? 0;
                    const price = item.priceOverride ?? prod?.sellingPrice ?? 0;
                    const isLowStock = stock <= 5;

                    return (
                      <BrutalCard
                        key={item.id || idx}
                        bg={BrutalColors.white}
                        style={styles.itemCard}
                      >
                        <View style={styles.itemLeft}>
                          <Image
                            source={{
                              uri:
                                prod?.images?.[0] ||
                                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150',
                            }}
                            style={styles.itemThumb}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={150}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.itemName} numberOfLines={1}>
                              {prod?.name || 'Product'}
                            </Text>
                            <View style={styles.itemMetaRow}>
                              <Text style={styles.itemPrice}>₹{Number(price).toFixed(2)}</Text>
                              <View
                                style={[
                                  styles.stockChip,
                                  isLowStock ? styles.stockChipLow : styles.stockChipOk,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.stockChipText,
                                    {
                                      color: isLowStock
                                        ? BrutalColors.urgentRed
                                        : BrutalColors.black,
                                    },
                                  ]}
                                >
                                  {stock === 0
                                    ? 'OUT OF STOCK'
                                    : isLowStock
                                      ? `⚠️ ONLY ${stock} LEFT`
                                      : 'IN STOCK'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* Stock Adjustment Stepper */}
                        <View
                          style={[
                            styles.stepperContainer,
                            stock === 0 ? { backgroundColor: '#FFEBEA' } : {},
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => handleUpdateStock(item, -1)}
                            disabled={updatingId === prodId || stock === 0}
                            style={styles.stepperBtn}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons
                              name="remove"
                              size={16}
                              color={stock === 0 ? '#999' : BrutalColors.black}
                            />
                          </TouchableOpacity>

                          <View style={styles.stepperValueBox}>
                            {updatingId === prodId ? (
                              <ActivityIndicator size="small" color={BrutalColors.black} />
                            ) : (
                              <Text style={styles.stepperValueText}>{stock}</Text>
                            )}
                          </View>

                          <TouchableOpacity
                            onPress={() => handleUpdateStock(item, 1)}
                            disabled={updatingId === prodId}
                            style={styles.stepperBtn}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="add" size={16} color={BrutalColors.black} />
                          </TouchableOpacity>
                        </View>
                      </BrutalCard>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
