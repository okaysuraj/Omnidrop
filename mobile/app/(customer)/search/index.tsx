import { BrutalCard, BrutalTelemetryStrip } from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchIndexScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Models.Product[]>([]);
  const [stores, setStores] = useState<Models.StoreWithDistance[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      const cart = await api.cart.get();
      if (cart?.items) {
        const count = cart.items.reduce((acc: number, i) => acc + (i.quantity || 1), 0);
        setCartCount(count);
      }
    } catch {
      /* ignore */
    }
  };

  const executeSearch = async (query: string) => {
    setLoading(true);
    try {
      const [prodsData, storesData] = await Promise.all([
        query.trim()
          ? api.products.search(query.trim()).catch(() => [])
          : api.products
              .list()
              .then((result) => result.items)
              .catch(() => []),
        api.stores.nearby(28.6139, 77.209, 25).catch(() => []),
      ]);

      const prodsList = prodsData;
      setProducts(prodsList);

      const allStores = storesData;
      if (query.trim()) {
        const q = query.toLowerCase();
        setStores(
          allStores.filter(
            (s) => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q),
          ),
        );
      } else {
        setStores(allStores);
      }
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch('');
    refreshCart();
  }, []);

  const handleAddToCart = async (product: Models.Product) => {
    setAddingId(product.id);
    try {
      const storeId =
        product.inventory?.[0]?.storeId || (stores.length > 0 ? stores[0].id : undefined);
      await api.cart.addItem({ productId: product.id, quantity: 1, storeId: storeId });
      await refreshCart();
    } catch (e) {
      console.error('Failed to add to cart:', e);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ RADAR SEARCH · INSTANT HYPERLOCAL DISCOVERY" />

      {/* Header with Search Bar */}
      <View
        style={{
          backgroundColor: BrutalColors.white,
          borderBottomWidth: 2,
          borderBottomColor: BrutalColors.black,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={[
            {
              width: 36,
              height: 36,
              backgroundColor: BrutalColors.yellow,
              borderWidth: 2,
              borderColor: BrutalColors.black,
              alignItems: 'center',
              justifyContent: 'center',
            },
            BrutalShadow.sm,
          ]}
        >
          <MaterialIcons name="arrow-back" size={20} color={BrutalColors.black} />
        </TouchableOpacity>

        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: BrutalColors.black,
              paddingHorizontal: 10,
              height: 40,
            },
            BrutalShadow.sm,
          ]}
        >
          <MaterialIcons name="search" size={18} color={BrutalColors.black} />
          <TextInput
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              executeSearch(text);
            }}
            placeholder="SEARCH CORRIDOR INVENTORY..."
            placeholderTextColor="#888888"
            autoFocus
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 12,
              fontWeight: '700',
              textTransform: 'uppercase',
              color: BrutalColors.black,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                executeSearch('');
              }}
            >
              <MaterialIcons name="close" size={16} color={BrutalColors.black} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(customer)/cart')}
          activeOpacity={0.8}
          style={[
            {
              width: 36,
              height: 36,
              backgroundColor: BrutalColors.white,
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
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: cartCount > 0 ? 80 : 30 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Matching Stores */}
            {stores.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                    marginBottom: 10,
                  }}
                >
                  Nearby Micro-Hubs ({stores.length})
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
                >
                  {stores.map((store) => (
                    <TouchableOpacity
                      key={store.id}
                      activeOpacity={0.9}
                      onPress={() => router.push(`/(customer)/stores/${store.id}`)}
                      style={[
                        {
                          width: 170,
                          backgroundColor: BrutalColors.white,
                          borderWidth: 2,
                          borderColor: BrutalColors.black,
                          padding: 10,
                          marginRight: 10,
                        },
                        BrutalShadow.sm,
                      ]}
                    >
                      <Image
                        source={{
                          uri:
                            store.imageUrl ||
                            store.imageUrl ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
                        }}
                        style={{
                          width: '100%',
                          height: 80,
                          borderWidth: 1.5,
                          borderColor: BrutalColors.black,
                          marginBottom: 8,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          color: BrutalColors.black,
                        }}
                        numberOfLines={1}
                      >
                        {store.name}
                      </Text>
                      <Text style={{ fontSize: 10, color: '#666', marginTop: 1 }}>
                        12-18 mins · ₹0 Del
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Products Match */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                  marginBottom: 10,
                }}
              >
                Discovered Products ({products.length})
              </Text>

              {products.length === 0 ? (
                <BrutalCard style={{ padding: 24, alignItems: 'center' }}>
                  <MaterialIcons name="search-off" size={40} color={BrutalColors.black} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      marginTop: 8,
                    }}
                  >
                    Zero Matches in Corridor
                  </Text>
                  <Text style={{ fontSize: 11, color: '#666', textAlign: 'center', marginTop: 2 }}>
                    Try searching for groceries, dairy, or fresh produce keywords.
                  </Text>
                </BrutalCard>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  {products.map((product) => (
                    <BrutalCard
                      key={product.id}
                      style={{
                        width: '48%',
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push(`/(customer)/products/${product.id}`)}
                      >
                        <View
                          style={{
                            height: 100,
                            borderBottomWidth: 2,
                            borderBottomColor: BrutalColors.black,
                          }}
                        >
                          <Image
                            source={{
                              uri:
                                product.images?.[0] ||
                                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
                            }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </View>

                        <View style={{ padding: 10 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '900',
                              textTransform: 'uppercase',
                              color: BrutalColors.black,
                            }}
                            numberOfLines={1}
                          >
                            {product.name}
                          </Text>
                          <Text
                            style={{ fontSize: 10, fontWeight: '700', color: '#666', marginTop: 1 }}
                            numberOfLines={1}
                          >
                            Per {product.unit || product.weight || 'pack'}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '900',
                              color: BrutalColors.black,
                              marginTop: 4,
                            }}
                          >
                            ₹{Number(product.sellingPrice || 0).toFixed(0)}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                        <TouchableOpacity
                          onPress={() => handleAddToCart(product)}
                          disabled={addingId === product.id}
                          activeOpacity={0.8}
                          style={[
                            {
                              backgroundColor: BrutalColors.yellow,
                              borderWidth: 2,
                              borderColor: BrutalColors.black,
                              paddingVertical: 7,
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                            },
                            BrutalShadow.sm,
                          ]}
                        >
                          {addingId === product.id ? (
                            <ActivityIndicator size="small" color={BrutalColors.black} />
                          ) : (
                            <>
                              <MaterialIcons name="add" size={14} color={BrutalColors.black} />
                              <Text
                                style={{
                                  fontSize: 10,
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
                      </View>
                    </BrutalCard>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Tote Bar */}
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
                ORDER TOTE
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
