import {
  BrutalBadge,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const storeId = id as string;
  const [store, setStore] = useState<Models.Store | null>(null);
  const [inventory, setInventory] = useState<Models.InventoryItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      const cart = await api.cart.get();
      if (cart?.items) {
        const count = cart.items.reduce((acc: number, item) => acc + (item.quantity || 1), 0);
        setCartCount(count);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const [storeData, invData] = await Promise.all([
          api.stores.byId(storeId).catch(() => null),
          api.inventory.byStore(storeId).catch(() => []),
        ]);
        setStore(storeData);

        setInventory(invData);
        await refreshCart();
      } catch (err) {
        console.error('Failed to load store details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (storeId) fetchStoreDetails();
  }, [storeId]);

  const handleAddToCart = async (item: Models.InventoryItem) => {
    const prodId = item.productId || item.id || item.product?.id;
    if (!prodId) return;
    setAddingId(prodId);
    try {
      await api.cart.addItem({ productId: prodId, quantity: 1, storeId: storeId });
      await refreshCart();
    } catch (e) {
      console.error('Failed to add to cart:', e);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BrutalColors.bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={BrutalColors.black} />
      </View>
    );
  }

  if (!store) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: BrutalColors.bg,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <MaterialIcons name="store" size={48} color={BrutalColors.black} />
        <Text
          style={{ fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginTop: 12 }}
        >
          Store Hub Not Found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            {
              backgroundColor: BrutalColors.yellow,
              borderWidth: 2,
              borderColor: BrutalColors.black,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 16,
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
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text={`⚡ 12-MIN DISPATCH · ${store.name?.toUpperCase()}`} />

      {/* Header */}
      <BrutalHeader
        title={store.name}
        subtitle="Micro-Hub Node"
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(customer)/cart')}
            style={[
              {
                width: 36,
                height: 36,
                backgroundColor: BrutalColors.yellow,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="shopping-bag" size={18} color={BrutalColors.black} />
            {cartCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: BrutalColors.black,
                  minWidth: 16,
                  height: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
              >
                <Text style={{ color: BrutalColors.yellow, fontSize: 9, fontWeight: '900' }}>
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <FlatList
        data={inventory}
        keyExtractor={(item, index) => item.id || item.productId || String(index)}
        contentContainerStyle={{ padding: 16, paddingBottom: cartCount > 0 ? 80 : 30 }}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            {/* Store Profile Card */}
            <BrutalCard style={{ overflow: 'hidden', marginBottom: 16 }}>
              <View
                style={{
                  height: 140,
                  position: 'relative',
                  borderBottomWidth: 2,
                  borderBottomColor: BrutalColors.black,
                }}
              >
                <Image
                  source={{
                    uri:
                      store?.imageUrl ||
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
                <View style={{ position: 'absolute', top: 8, left: 8 }}>
                  <BrutalBadge label="VERIFIED HUB" variant="green" />
                </View>
                <View style={{ position: 'absolute', top: 8, right: 8 }}>
                  <BrutalBadge label="⚡ 12-18 MIN" variant="yellow" />
                </View>
              </View>

              <View style={{ padding: 14 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                >
                  {store.name}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#666', marginTop: 2 }}>
                  📍 {store.address || 'Hyperlocal Corridor'}
                </Text>

                {/* Tri-stat Bar */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 2,
                    borderColor: BrutalColors.black,
                    backgroundColor: BrutalColors.subtle,
                    marginTop: 12,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderRightWidth: 2,
                      borderRightColor: BrutalColors.black,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        color: '#666',
                        textTransform: 'uppercase',
                      }}
                    >
                      Rating
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '900',
                        color: BrutalColors.black,
                        marginTop: 1,
                      }}
                    >
                      ⭐ {store.rating ? Number(store.rating).toFixed(1) : '4.9'}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderRightWidth: 2,
                      borderRightColor: BrutalColors.black,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        color: '#666',
                        textTransform: 'uppercase',
                      }}
                    >
                      Target Sla
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '900',
                        color: BrutalColors.black,
                        marginTop: 1,
                      }}
                    >
                      12-18m
                    </Text>
                  </View>

                  <View style={{ flex: 1, paddingVertical: 8, alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        color: '#666',
                        textTransform: 'uppercase',
                      }}
                    >
                      Delivery
                    </Text>
                    <Text
                      style={{ fontSize: 13, fontWeight: '900', color: '#008855', marginTop: 1 }}
                    >
                      ₹0 &gt; ₹199
                    </Text>
                  </View>
                </View>
              </View>
            </BrutalCard>

            {/* Shelf Inventory Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Available Shelf SKUs ({inventory.length})
              </Text>
              <BrutalBadge label="LIVE INVENTORY" variant="green" />
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const prod = item.product;
          const price = item.priceOverride ?? prod?.sellingPrice ?? 0;
          const prodId = item.productId || item.id;

          return (
            <BrutalCard
              style={{
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/(customer)/products/[id]',
                    params: { id: prodId, storeId },
                  })
                }
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}
              >
                <Image
                  source={{
                    uri:
                      prod?.images?.[0] ||
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
                  }}
                  style={{
                    width: 58,
                    height: 58,
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    marginRight: 10,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                    numberOfLines={1}
                  >
                    {prod?.name}
                  </Text>
                  <Text
                    style={{ fontSize: 10, fontWeight: '700', color: '#666', marginTop: 1 }}
                    numberOfLines={1}
                  >
                    Per {prod?.unit || prod?.weight || 'pack'} · In Stock ({item.stock ?? 50})
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '900',
                      color: BrutalColors.black,
                      marginTop: 3,
                    }}
                  >
                    ₹{Number(price).toFixed(0)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                disabled={addingId === prodId}
                activeOpacity={0.8}
                style={[
                  {
                    backgroundColor: BrutalColors.yellow,
                    borderWidth: 2,
                    borderColor: BrutalColors.black,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                  BrutalShadow.sm,
                ]}
              >
                {addingId === prodId ? (
                  <ActivityIndicator size="small" color={BrutalColors.black} />
                ) : (
                  <>
                    <MaterialIcons name="add" size={16} color={BrutalColors.black} />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                        marginLeft: 2,
                      }}
                    >
                      Add
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </BrutalCard>
          );
        }}
      />

      {/* Floating Bottom Tote Banner */}
      {cartCount > 0 && (
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(customer)/cart')}
            style={[
              {
                backgroundColor: BrutalColors.yellow,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              BrutalShadow.md,
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: BrutalColors.black,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: BrutalColors.yellow, fontWeight: '900', fontSize: 11 }}>
                  {cartCount} ITEMS
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                ORDER MANIFEST
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                  marginRight: 4,
                }}
              >
                Review
              </Text>
              <MaterialIcons name="arrow-forward" size={15} color={BrutalColors.black} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
