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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const initialQuery = Array.isArray(q) ? q[0] : q || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Models.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

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

  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const res = await api.products.search(query);
      const list = res;
      setProducts(list);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(initialQuery);
    refreshCart();
  }, [initialQuery]);

  const handleSearchSubmit = () => {
    fetchResults(searchQuery);
  };

  const handleAdd = async (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    try {
      await api.cart.addItem({ productId: id, quantity: 1 });
      await refreshCart();
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1200);
  };

  const renderProductItem = useCallback(
    ({ item: product }: { item: Models.Product }) => {
      const isAdded = !!addedItems[product.id];
      return (
        <TouchableOpacity
          style={styles.productCard}
          activeOpacity={0.85}
          onPress={() => router.push(`/(customer)/products/${product.id}`)}
        >
          <View style={styles.productImageFrame}>
            <Image
              source={{
                uri:
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=300',
              }}
              style={styles.productImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={150}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {product.category?.name?.toUpperCase() || 'SKU'}
              </Text>
            </View>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>

            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceUnitLabel}>PRICE</Text>
                <Text style={styles.productPrice}>
                  ₹{Number(product.sellingPrice ?? 0).toFixed(0)}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.addBtn, isAdded && styles.addBtnSuccess]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAdd(product.id);
                }}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={isAdded ? 'check' : 'add'}
                  size={18}
                  color={isAdded ? BrutalColors.black : BrutalColors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [addedItems],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip left={`QUERY // "${searchQuery}"`} right={`HITS: ${products.length}`} />

      <BrutalHeader
        title="Search Radar"
        subtitle="Catalog Hits"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cartBtn}
            onPress={() => router.push('/(customer)/cart')}
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
                <Text style={{ color: BrutalColors.yellow, fontSize: 8, fontWeight: '900' }}>
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Query Bar */}
      <View style={styles.queryBarWrapper}>
        <View style={styles.queryInputBox}>
          <MaterialIcons name="search" size={18} color={BrutalColors.black} />
          <TextInput
            style={styles.queryTextInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            placeholder="FILTER BY SKU OR BRAND..."
            placeholderTextColor="#888"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={16} color={BrutalColors.black} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={handleSearchSubmit} activeOpacity={0.8}>
          <Text style={styles.filterBtnText}>SCAN</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderProductItem}
        windowSize={5}
        maxToRenderPerBatch={8}
        removeClippedSubviews={true}
        initialNumToRender={8}
        ListHeaderComponent={
          <>
            {/* Results Metadata Card */}
            <BrutalCard style={{ marginBottom: 16, padding: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={styles.resultsMetaLabel}>CORRIDOR RADAR REPORT</Text>
                  <Text style={styles.resultsQueryTitle}>
                    "{searchQuery.toUpperCase() || 'ALL CATALOG'}"
                  </Text>
                </View>
                <BrutalBadge label={`${products.length} SKUS FOUND`} variant="yellow" />
              </View>
            </BrutalCard>

            {/* Product Catalog Grid Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>MATCHING INVENTORY</Text>
              <Text style={styles.sectionCount}>{products.length} UNITS</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
          ) : (
            <BrutalCard style={{ alignItems: 'center', paddingVertical: 32 }}>
              <MaterialIcons name="error-outline" size={32} color={BrutalColors.urgentRed} />
              <Text style={styles.emptyTitle}>NO MATCHING SKUS</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting keyword query or scanning another hub corridor.
              </Text>
            </BrutalCard>
          )
        }
      />

      {/* Unified Bottom Nav */}
      <BrutalBottomNav currentTab="catalog" cartCount={cartCount} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  cartBtn: {
    width: 36,
    height: 36,
    backgroundColor: BrutalColors.yellow,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...BrutalShadow.sm,
  },
  queryBarWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: BrutalColors.white,
    borderBottomWidth: 2,
    borderBottomColor: BrutalColors.black,
  },
  queryInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrutalColors.canvas,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    paddingHorizontal: 10,
    gap: 8,
    height: 40,
  },
  queryTextInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: BrutalColors.black,
  },
  filterBtn: {
    backgroundColor: BrutalColors.yellow,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...BrutalShadow.sm,
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  resultsMetaLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 0.8,
  },
  resultsQueryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: BrutalColors.black,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#666',
  },
  productCard: {
    width: '48%',
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.sm,
    overflow: 'hidden',
  },
  productImageFrame: {
    width: '100%',
    height: 110,
    backgroundColor: BrutalColors.canvas,
    borderBottomWidth: 2,
    borderBottomColor: BrutalColors.black,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: BrutalColors.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    color: BrutalColors.white,
    fontSize: 8,
    fontWeight: '900',
  },
  productDetails: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: '800',
    color: BrutalColors.black,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  priceUnitLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  addBtn: {
    width: 32,
    height: 32,
    backgroundColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrutalColors.black,
  },
  addBtnSuccess: {
    backgroundColor: BrutalColors.green,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: BrutalColors.black,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
