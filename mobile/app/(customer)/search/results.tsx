import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const initialQuery = Array.isArray(q) ? q[0] : q || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [addedItems, setAddedItems] = useState<{[key: string]: boolean}>({});

  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const res = await api.products.search(query);
      setProducts(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = () => {
    fetchResults(searchQuery);
  };

  const handleAdd = (id: string) => {
    setAddedItems({ ...addedItems, [id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#006e24" style={styles.backIcon} />
          </TouchableOpacity>
          <MaterialIcons name="bolt" size={28} color="#006e24" />
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        
        {/* Search Input (visible in header on larger screens, adapted for mobile here) */}
        <View style={styles.headerSearch}>
          <MaterialIcons name="search" size={20} color="#3b4b39" />
          <TextInput
            style={styles.headerSearchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search..."
            placeholderTextColor="#849581"
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#3b4b39" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search Info & Filters */}
        <View style={styles.infoSection}>
          <View>
            <Text style={styles.resultsTitle}>Results for "{searchQuery}"</Text>
            <Text style={styles.resultsSubtitle}>Found {products.length} products</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterButtonPrimary}>
              <MaterialIcons name="tune" size={18} color="#ffffff" style={styles.filterIcon} />
              <Text style={styles.filterButtonPrimaryText}>Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterButtonSecondary}>
              <Text style={styles.filterButtonSecondaryText}>Delivery Speed</Text>
              <MaterialIcons name="expand-more" size={18} color="#191c1d" style={styles.filterIconRight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButtonSecondary}>
              <Text style={styles.filterButtonSecondaryText}>Price</Text>
              <MaterialIcons name="expand-more" size={18} color="#191c1d" style={styles.filterIconRight} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Top Stores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Stores</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.storesGrid}>
            {/* Store 1 - Large */}
            <TouchableOpacity style={styles.storeCardLarge} activeOpacity={0.9} onPress={() => router.push('/(customer)/store/1')}>
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }} 
                style={styles.storeCardLargeImage}
              >
                <View style={styles.storeBadge}>
                  <MaterialIcons name="bolt" size={14} color="#ffffff" />
                  <Text style={styles.storeBadgeText}>Fastest</Text>
                </View>
              </ImageBackground>
              <View style={styles.storeCardInfo}>
                <View style={styles.storeCardInfoText}>
                  <Text style={styles.storeCardTitle}>Green Earth Market</Text>
                  <Text style={styles.storeCardSubtitle}>Organic • Fresh • 12-18 min</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.storesSmallRow}>
              {/* Store 2 */}
              <TouchableOpacity style={styles.storeCardSmall} activeOpacity={0.9} onPress={() => router.push('/(customer)/store/2')}>
                <ImageBackground 
                  source={{ uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300' }} 
                  style={styles.storeCardSmallImage}
                />
                <View style={styles.storeCardSmallInfo}>
                  <Text style={styles.storeCardSmallTitle} numberOfLines={1}>The Daily Crust</Text>
                  <Text style={styles.storeCardSmallSubtitle}>Bakery • 20-30 min</Text>
                </View>
              </TouchableOpacity>

              {/* Store 3 */}
              <TouchableOpacity style={styles.storeCardSmall} activeOpacity={0.9} onPress={() => router.push('/(customer)/store/3')}>
                <ImageBackground 
                  source={{ uri: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80&w=300' }} 
                  style={styles.storeCardSmallImage}
                />
                <View style={styles.storeCardSmallInfo}>
                  <Text style={styles.storeCardSmallTitle} numberOfLines={1}>Citrus & Vine</Text>
                  <Text style={styles.storeCardSmallSubtitle}>Produce • 15-25 min</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <View style={styles.viewToggles}>
              <MaterialIcons name="grid-view" size={24} color="#006e24" style={{ marginRight: 8 }} />
              <MaterialIcons name="view-list" size={24} color="#b9ccb5" />
            </View>
          </View>

          <View style={styles.productsGrid}>
            
            {loading ? (
              <ActivityIndicator size="large" color="#00e554" style={{ marginTop: 40 }} />
            ) : products.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 40, color: '#849581', fontFamily: 'Montserrat_500Medium' }}>No products found.</Text>
            ) : (
              products.map((product) => (
                <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.9} onPress={() => router.push(`/(customer)/product/${product.id}`)}>
                  <View style={styles.productImageContainer}>
                    <Image 
                      source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=300' }} 
                      style={styles.productImage} 
                    />
                    <TouchableOpacity style={styles.favoriteButton}>
                      <MaterialIcons name="favorite" size={20} color="#006e24" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTag}>{product.category?.name?.toUpperCase() || 'GENERAL'}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.productBottomRow}>
                      <Text style={styles.productPrice}>${Number(product.sellingPrice).toFixed(2)}</Text>
                      <TouchableOpacity 
                        style={[styles.addButton, addedItems[product.id] && styles.addButtonActive]} 
                        onPress={(e) => { e.stopPropagation(); handleAdd(product.id); }}
                      >
                        <MaterialIcons name={addedItems[product.id] ? "check" : "add"} size={20} color={addedItems[product.id] ? "#ffffff" : "#007125"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}

          </View>
        </View>

      </ScrollView>

      {/* Floating Cart Button */}
      <View style={styles.floatingCartContainer}>
        <TouchableOpacity style={styles.floatingCartButton} activeOpacity={0.9} onPress={() => router.push('/(customer)/cart')}>
          <MaterialIcons name="shopping-bag" size={24} color="#ffffff" />
          <Text style={styles.floatingCartText}>View Cart ($36.15)</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/home')}>
          <MaterialIcons name="home" size={24} color="#849581" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="search" size={24} color="#00ff5f" />
          <Text style={styles.navTextActive}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="receipt-long" size={24} color="#849581" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#849581" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light mode bg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(185, 204, 181, 0.3)',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#006e24',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  headerSearch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edeeef',
    borderRadius: 20,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    height: 36,
  },
  headerSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#191c1d',
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#006e24',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140, // space for cart + nav
  },
  infoSection: {
    marginBottom: 32,
    gap: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  filtersScroll: {
    marginTop: 8,
  },
  filtersContainer: {
    gap: 8,
    paddingRight: 20,
  },
  filterButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141a32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonPrimaryText: {
    color: '#ffffff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7e8e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonSecondaryText: {
    color: '#191c1d',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
  },
  filterIconRight: {
    marginLeft: 4,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
  },
  viewToggles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storesGrid: {
    gap: 16,
  },
  storeCardLarge: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.3)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  storeCardLargeImage: {
    height: 160,
    width: '100%',
  },
  storeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#006e24',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  storeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  storeCardInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeCardInfoText: {
    flex: 1,
  },
  storeCardTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 2,
  },
  storeCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  ratingBadge: {
    backgroundColor: '#d8defe',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#5b617d',
  },
  storesSmallRow: {
    flexDirection: 'row',
    gap: 16,
  },
  storeCardSmall: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.3)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  storeCardSmallImage: {
    height: 100,
    width: '100%',
  },
  storeCardSmallInfo: {
    padding: 12,
  },
  storeCardSmallTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 2,
  },
  storeCardSmallSubtitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.3)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 8,
  },
  productImageContainer: {
    aspectRatio: 1,
    backgroundColor: '#f3f4f5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 6,
    borderRadius: 16,
  },
  saleBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#ba1a1a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  saleBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  productInfo: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  productTag: {
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 8,
    height: 40, // Approx 2 lines
  },
  productBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
  },
  productPriceStrikethrough: {
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ff5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonActive: {
    backgroundColor: '#006e24',
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 84, // Above nav bar
    right: 20,
    zIndex: 40,
  },
  floatingCartButton: {
    backgroundColor: '#191c1d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 32,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  floatingCartText: {
    color: '#ffffff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(185, 204, 181, 0.3)',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: '#00ff5f',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 24,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
    marginTop: 4,
  },
});
