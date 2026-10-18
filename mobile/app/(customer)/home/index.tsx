import {
  BrutalBadge,
  BrutalBottomNav,
  BrutalCard,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerHome() {
  const [stores, setStores] = useState<Models.StoreWithDistance[]>([]);
  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState<Models.Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'FAST' | 'TOP_RATED'>('ALL');
  const { user } = useAuth();
  const router = useRouter();

  const loadHomeData = async () => {
    try {
      const [storesData, catsData, cartData, addressData] = await Promise.all([
        api.stores.nearby(28.6139, 77.209, 25).catch(() => []),
        api.products.categories().catch(() => []),
        api.cart.get().catch(() => null),
        api.users.getAddresses().catch(() => []),
      ]);

      const storeList = storesData;
      setStores(storeList);
      setCategories(catsData);

      if (cartData?.items) {
        const totalItems = cartData.items.reduce(
          (sum: number, item) => sum + (item.quantity || 1),
          0,
        );
        setCartCount(totalItems);
      }

      if (Array.isArray(addressData) && addressData.length > 0) {
        const def = addressData.find((a) => a.isDefault) || addressData[0];
        setDefaultAddress(def);
      }
    } catch (err) {
      console.error('Home load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const filteredStores = stores.filter((store) => {
    if (filter === 'FAST') return (store.radiusKm || 5) <= 5;
    if (filter === 'TOP_RATED') return Number(store.rating || 0) >= 4.5;
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ 12-MIN DISPATCH · 38/38 MICRO-HUBS OPERATIONAL" />

      {/* Top Header */}
      <View
        style={{
          backgroundColor: BrutalColors.white,
          borderBottomWidth: 2,
          borderBottomColor: BrutalColors.black,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(customer)/addresses')}
          style={{ flex: 1, marginRight: 12 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: BrutalColors.yellow,
                borderWidth: 1.5,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
              }}
            >
              <MaterialIcons name="bolt" size={13} color={BrutalColors.black} />
            </View>
            <Text
              style={{
                fontSize: 9,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: '#666',
                letterSpacing: 0.5,
              }}
            >
              {defaultAddress ? `CORRIDOR: ${defaultAddress.label}` : 'SELECT DISPATCH NODE'}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              marginTop: 1,
            }}
            numberOfLines={1}
          >
            {defaultAddress
              ? `${defaultAddress.addressLine1 || defaultAddress.city}`
              : 'Indiranagar 100ft Road ▾'}
          </Text>
        </TouchableOpacity>

        {/* Action Icons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(customer)/search/global')}
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
            <MaterialIcons name="search" size={20} color={BrutalColors.black} />
          </TouchableOpacity>

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
                  borderWidth: 1.5,
                  borderColor: BrutalColors.yellow,
                  minWidth: 17,
                  height: 17,
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
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: cartCount > 0 ? 80 : 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Brutalist Flash Card */}
        <BrutalCard bg={BrutalColors.yellow} style={{ padding: 18, marginBottom: 20 }} shadow="md">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <BrutalBadge label="// HYPERLOCAL SPEED" variant="black" />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              10-20 MIN DROP
            </Text>
          </View>

          <Text
            style={{
              fontSize: 23,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              lineHeight: 27,
              letterSpacing: -0.5,
              marginBottom: 6,
            }}
          >
            Neighborhood Stores Direct to Doorstep
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#1A1A1A',
              marginBottom: 14,
              lineHeight: 17,
            }}
          >
            Zero surge pricing. Real-time physical inventory synced directly with registered
            micro-hubs.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(customer)/products')}
            style={[
              {
                backgroundColor: BrutalColors.black,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                paddingVertical: 10,
                paddingHorizontal: 16,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
              },
              BrutalShadow.sm,
            ]}
          >
            <Text
              style={{
                color: BrutalColors.white,
                fontWeight: '900',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Browse Shelf Catalog →
            </Text>
          </TouchableOpacity>
        </BrutalCard>

        {/* Categories Horizontal Carousel */}
        <View style={{ marginBottom: 22 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                  letterSpacing: 0.5,
                }}
              >
                Categories
              </Text>
              <View
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: BrutalColors.yellow,
                  borderWidth: 1.5,
                  borderColor: BrutalColors.black,
                  marginLeft: 6,
                }}
              />
            </View>

            <TouchableOpacity onPress={() => router.push('/(customer)/category')}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  textDecorationLine: 'underline',
                  color: BrutalColors.black,
                }}
              >
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
          >
            {categories.length > 0
              ? categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/(customer)/products',
                        params: { categoryId: cat.id },
                      })
                    }
                    style={[
                      {
                        width: 88,
                        backgroundColor: BrutalColors.white,
                        borderWidth: 2,
                        borderColor: BrutalColors.black,
                        padding: 9,
                        alignItems: 'center',
                        marginRight: 10,
                      },
                      BrutalShadow.sm,
                    ]}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: BrutalColors.subtle,
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <MaterialIcons name="local-mall" size={22} color={BrutalColors.black} />
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        color: BrutalColors.black,
                      }}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))
              : ['Produce', 'Bakery', 'Dairy', 'Snacks', 'Beverages'].map((name, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(customer)/products')}
                    style={[
                      {
                        width: 88,
                        backgroundColor: BrutalColors.white,
                        borderWidth: 2,
                        borderColor: BrutalColors.black,
                        padding: 9,
                        alignItems: 'center',
                        marginRight: 10,
                      },
                      BrutalShadow.sm,
                    ]}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: BrutalColors.subtle,
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <MaterialIcons name="shopping-bag" size={22} color={BrutalColors.black} />
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        color: BrutalColors.black,
                      }}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>

        {/* Filter Pills for Stores */}
        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                  letterSpacing: 0.5,
                }}
              >
                Nearby Micro-Hubs
              </Text>
              <BrutalBadge label="LIVE RADAR" variant="green" style={{ marginLeft: 8 }} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {[
              { id: 'ALL', label: 'All Hubs' },
              { id: 'FAST', label: '⚡ < 15 Min SLA' },
              { id: 'TOP_RATED', label: '⭐ Top Rated 4.5+' },
            ].map((f) => {
              const isSelected = filter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setFilter(f.id as typeof filter)}
                  activeOpacity={0.8}
                  style={[
                    {
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 1.5,
                      borderColor: BrutalColors.black,
                      backgroundColor: isSelected ? BrutalColors.yellow : BrutalColors.white,
                    },
                    isSelected ? BrutalShadow.sm : {},
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {loading ? (
            <ActivityIndicator
              size="small"
              color={BrutalColors.black}
              style={{ marginVertical: 20 }}
            />
          ) : filteredStores.length > 0 ? (
            <View style={{ gap: 14 }}>
              {filteredStores.map((store) => (
                <BrutalCard key={store.id} style={{ overflow: 'hidden' }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push(`/(customer)/stores/${store.id}`)}
                  >
                    <View
                      style={{
                        height: 130,
                        position: 'relative',
                        borderBottomWidth: 2,
                        borderBottomColor: BrutalColors.black,
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            store.imageUrl ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                      <View style={{ position: 'absolute', top: 8, right: 8 }}>
                        <BrutalBadge label="⚡ 12-18 MIN" variant="yellow" />
                      </View>
                      {store.isVerified && (
                        <View style={{ position: 'absolute', top: 8, left: 8 }}>
                          <BrutalBadge label="VERIFIED HUB" variant="green" />
                        </View>
                      )}
                    </View>

                    <View style={{ padding: 14 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            color: BrutalColors.black,
                            flex: 1,
                            marginRight: 8,
                          }}
                          numberOfLines={1}
                        >
                          {store.name}
                        </Text>
                        <View
                          style={{
                            borderWidth: 1.5,
                            borderColor: BrutalColors.black,
                            backgroundColor: BrutalColors.yellow,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <MaterialIcons name="star" size={12} color={BrutalColors.black} />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '900',
                              color: BrutalColors.black,
                              marginLeft: 2,
                            }}
                          >
                            {store.rating ? Number(store.rating).toFixed(1) : '4.8'}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: '#666',
                          textTransform: 'uppercase',
                          marginBottom: 8,
                        }}
                        numberOfLines={1}
                      >
                        📍 {store.address || 'Hyperlocal Corridor'} · Radius: {store.radiusKm || 5}{' '}
                        km
                      </Text>

                      <View
                        style={{
                          borderTopWidth: 1.5,
                          borderTopColor: '#EEEEEE',
                          paddingTop: 8,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color: '#008855',
                            textTransform: 'uppercase',
                          }}
                        >
                          ₹0 Delivery &gt; ₹199
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            color: BrutalColors.black,
                          }}
                        >
                          Enter Shelf →
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </BrutalCard>
              ))}
            </View>
          ) : (
            <BrutalCard style={{ padding: 22, alignItems: 'center' }}>
              <MaterialIcons name="storefront" size={36} color={BrutalColors.black} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginTop: 8,
                }}
              >
                Corridor Hubs Ready
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: '#666',
                  textAlign: 'center',
                  marginTop: 4,
                  marginBottom: 12,
                }}
              >
                Browse our central product shelf with immediate neighborhood fulfillment.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(customer)/products')}
                style={{
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  backgroundColor: BrutalColors.yellow,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontWeight: '900', fontSize: 11, textTransform: 'uppercase' }}>
                  Explore Catalog →
                </Text>
              </TouchableOpacity>
            </BrutalCard>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Tote Banner */}
      {cartCount > 0 && (
        <View style={{ position: 'absolute', bottom: 58, left: 16, right: 16 }}>
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
                ACTIVE TOTE MANIFEST
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

      {/* Integrated BrutalBottomNav */}
      <BrutalBottomNav currentTab="home" cartCount={cartCount} />
    </SafeAreaView>
  );
}
