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
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDiscoveryScreen() {
  const { categoryId: initialCatId } = useLocalSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>((initialCatId as string) || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Models.Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const initData = async () => {
      try {
        const cats = await api.products.categories().catch(() => []);
        setCategories(Array.isArray(cats) ? cats : []);
        await refreshCart();
      } catch {
        /* ignore */
      }
    };
    initData();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.list({
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
      });
      const list = res.items;
      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const handleAddToCart = async (product: Models.Product) => {
    setAddingId(product.id);
    try {
      await api.cart.addItem({ productId: product.id, quantity: 1 });
      await refreshCart();
    } catch (e) {
      console.error('Failed to add to cart:', e);
    } finally {
      setAddingId(null);
    }
  };

  const renderProductItem = useCallback(
    ({ item: product }: { item: Models.Product }) => (
      <BrutalCard
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
              height: 110,
              borderBottomWidth: 2,
              borderBottomColor: BrutalColors.black,
              position: 'relative',
            }}
          >
            <Image
              source={{
                uri:
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
              }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={150}
            />
            <View style={{ position: 'absolute', top: 6, left: 6 }}>
              <BrutalBadge label="IN STOCK" variant="green" />
            </View>
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
              style={{ fontSize: 10, fontWeight: '700', color: '#666', marginTop: 2 }}
              numberOfLines={1}
            >
              Per {product.unit || product.weight || 'pack'}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4, gap: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: BrutalColors.black }}>
                ₹{Number(product.sellingPrice || 0).toFixed(0)}
              </Text>
              {product.mrp && Number(product.mrp) > Number(product.sellingPrice) && (
                <Text style={{ fontSize: 10, color: '#888', textDecorationLine: 'line-through' }}>
                  ₹{Number(product.mrp).toFixed(0)}
                </Text>
              )}
            </View>
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
                  Add To Tote
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </BrutalCard>
    ),
    [addingId, router],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ 12-MIN DISPATCH · REAL-TIME SHELF SYNC" />

      {/* Brutal Header */}
      <BrutalHeader
        title="Shelf Catalog"
        subtitle="Hyperlocal Inventory"
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
                  borderWidth: 1.5,
                  borderColor: BrutalColors.yellow,
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

      {/* Search Input Bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: BrutalColors.white,
          borderBottomWidth: 2,
          borderBottomColor: BrutalColors.black,
        }}
      >
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: BrutalColors.black,
              paddingHorizontal: 10,
              height: 42,
            },
            BrutalShadow.sm,
          ]}
        >
          <MaterialIcons name="search" size={20} color={BrutalColors.black} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={loadProducts}
            placeholder="SEARCH INVENTORY CATALOG..."
            placeholderTextColor="#888888"
            returnKeyType="search"
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
                loadProducts();
              }}
            >
              <MaterialIcons name="close" size={18} color={BrutalColors.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Bar */}
      <View
        style={{
          backgroundColor: BrutalColors.white,
          borderBottomWidth: 2,
          borderBottomColor: BrutalColors.black,
          paddingVertical: 8,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('')}
            style={[
              {
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                backgroundColor: !selectedCategory ? BrutalColors.yellow : BrutalColors.white,
                marginRight: 8,
              },
              !selectedCategory ? BrutalShadow.sm : {},
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
              ALL ITEMS
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(isSelected ? '' : cat.id)}
                style={[
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderWidth: 2,
                    borderColor: BrutalColors.black,
                    backgroundColor: isSelected ? BrutalColors.yellow : BrutalColors.white,
                    marginRight: 8,
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
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products FlatList */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', gap: 12, marginBottom: 12 }}
        contentContainerStyle={{ padding: 16, paddingBottom: cartCount > 0 ? 80 : 30 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderProductItem}
        windowSize={5}
        maxToRenderPerBatch={8}
        removeClippedSubviews={true}
        initialNumToRender={8}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
          ) : (
            <BrutalCard style={{ padding: 30, alignItems: 'center', marginTop: 20 }}>
              <MaterialIcons name="inventory" size={40} color={BrutalColors.black} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginTop: 8,
                }}
              >
                No Shelf SKUs Found
              </Text>
              <Text style={{ fontSize: 11, color: '#666', textAlign: 'center', marginTop: 4 }}>
                Try changing your search terms or category selection.
              </Text>
            </BrutalCard>
          )
        }
      />

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

      {/* Bottom Nav */}
      <BrutalBottomNav currentTab="catalog" cartCount={cartCount} />
    </SafeAreaView>
  );
}
