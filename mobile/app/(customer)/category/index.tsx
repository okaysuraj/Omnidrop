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
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryListScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Models.Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [data, cartData] = await Promise.all([
          api.products.categories(),
          api.cart.get().catch(() => null),
        ]);
        setCategories(data || []);
        if (cartData?.items) {
          const totalItems = cartData.items.reduce(
            (sum: number, item) => sum + (item.quantity || 1),
            0,
          );
          setCartCount(totalItems);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const renderCategoryItem = useCallback(
    ({ item: category }: { item: Models.Category }) => (
      <TouchableOpacity
        style={styles.categoryCard}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: '/(customer)/products',
            params: { categoryId: category.id },
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                category.imageUrl ||
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
            }}
            style={styles.categoryImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>HUB AISLE</Text>
          </View>
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {category.name.toUpperCase()}
          </Text>
          <Text style={styles.exploreLabel}>EXPLORE AISLE →</Text>
        </View>
      </TouchableOpacity>
    ),
    [router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip left="TAXONOMY // CATEGORY GRID" right="CORRIDORS: ACTIVE" />

      <BrutalHeader
        title="Categories"
        subtitle="Hyperlocal Aisles"
        onBack={() => router.back()}
        rightAction={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerBtn}
              onPress={() => router.push('/(customer)/search/global')}
            >
              <MaterialIcons name="search" size={18} color={BrutalColors.black} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.headerBtn,
                { backgroundColor: BrutalColors.yellow, position: 'relative' },
              ]}
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
          </View>
        }
      />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderCategoryItem}
        windowSize={5}
        maxToRenderPerBatch={8}
        removeClippedSubviews={true}
        initialNumToRender={8}
        ListHeaderComponent={
          <>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.screenTitle}>PRODUCT TAXONOMY</Text>
              <Text style={styles.screenSubtitle}>BROWSE BY LOCAL HUB INVENTORY CORRIDORS</Text>
            </View>

            {/* Promo Notice */}
            <BrutalCard bg={BrutalColors.yellow} style={{ marginBottom: 20, padding: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <BrutalBadge label="FREE DISPATCH" variant="black" />
                <Text style={styles.noticeCode}>SLA &lt; 15 MIN</Text>
              </View>
              <Text style={styles.bannerTitle}>HYPERLOCAL CORRIDORS ACTIVE</Text>
              <Text style={styles.bannerSubtitle}>
                Zero fulfillment surcharge on orders exceeding ₹199 from registered shelf partners.
              </Text>
            </BrutalCard>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
          ) : (
            <BrutalCard style={{ alignItems: 'center', paddingVertical: 32 }}>
              <MaterialIcons name="inventory" size={32} color={BrutalColors.black} />
              <Text style={{ fontSize: 13, fontWeight: '900', marginTop: 8 }}>NO AISLES FOUND</Text>
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
  headerBtn: {
    width: 36,
    height: 36,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...BrutalShadow.sm,
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
  titleSection: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    marginTop: 2,
  },
  noticeCode: {
    fontSize: 11,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: BrutalColors.black,
    lineHeight: 16,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.sm,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: BrutalColors.canvas,
    borderBottomWidth: 2,
    borderBottomColor: BrutalColors.black,
    position: 'relative',
  },
  categoryImage: {
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
  categoryInfo: {
    padding: 10,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  exploreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#666',
    marginTop: 4,
  },
});
