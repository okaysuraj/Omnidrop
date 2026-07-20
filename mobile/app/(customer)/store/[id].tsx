import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function StoreDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Menu');
  const [showCart, setShowCart] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeData = await api.stores.byId(id as string);
        setStore(storeData);
        // Fetch some generic products for the store
        const productsData = await api.products.search('');
        setProducts(productsData || []);
      } catch (err) {
        console.error('Failed to fetch store details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleCart = () => setShowCart(true);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00e554" />
      </View>
    );
  }

  if (!store) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Montserrat_500Medium', color: '#191c1d' }}>Store not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header since we're using ImageBackground that goes under it */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#00e554" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="bolt" size={24} color="#00e554" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="shopping-cart" size={24} color="#00e554" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.heroImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              {store.isVerified && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>VERIFIED</Text>
                </View>
              )}
              <Text style={styles.heroTitle}>{store.name}</Text>
              <Text style={styles.heroSubtitle}>{store.description || 'Hyper-local • Artisanal • Zero Waste'}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Store Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            
            <View style={styles.infoItem}>
              <View style={styles.infoValue}>
                <MaterialIcons name="star" size={18} color="#006e24" />
                <Text style={styles.infoValueText}>4.8</Text>
              </View>
              <Text style={styles.infoLabel}>500+ Reviews</Text>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoValue}>
                <MaterialIcons name="schedule" size={18} color="#006e24" />
                <Text style={styles.infoValueText}>{store.estimatedDeliveryMinutes || 15} min</Text>
              </View>
              <Text style={styles.infoLabel}>Delivery Time</Text>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoValue}>
                <MaterialIcons name="delivery-dining" size={18} color="#006e24" />
                <Text style={styles.infoValueText}>FREE</Text>
              </View>
              <Text style={styles.infoLabel}>On orders over $20</Text>
            </View>
            
          </View>
        </View>

        {/* Tabbed Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsScrollContent}>
          {['Menu', 'Reviews', 'Store Info', 'Offers'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product List */}
        <View style={styles.productsContainer}>
          
          {/* Category: Store Products */}
          <View style={styles.productCategory}>
            <View style={styles.productCategoryHeader}>
              <View style={styles.categoryTitleWrapper}>
                <View style={styles.categoryTitleIndicator} />
                <Text style={styles.categoryTitle}>Store Products</Text>
              </View>
              <Text style={styles.categoryCount}>{products.length} Items</Text>
            </View>
            
            <View style={styles.productGrid}>
              
              {products.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <ImageBackground 
                    source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=300' }} 
                    style={styles.productImage}
                    imageStyle={{ borderRadius: 8 }}
                  />
                  <View style={styles.productInfo}>
                    <View>
                      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.productDesc} numberOfLines={2}>{product.description || 'Quality product from our store.'}</Text>
                    </View>
                    <View style={styles.productBottomRow}>
                      <Text style={styles.productPrice}>${Number(product.sellingPrice).toFixed(2)}</Text>
                      <TouchableOpacity style={styles.addButton} onPress={toggleCart}>
                        <MaterialIcons name="add" size={20} color="#007125" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Cart Bar */}
      {showCart && (
        <View style={styles.cartBarContainer}>
          <View style={styles.cartBar}>
            <View style={styles.cartBarLeft}>
              <View style={styles.cartBarIconWrapper}>
                <MaterialIcons name="shopping-bag" size={24} color="#007125" />
              </View>
              <View>
                <Text style={styles.cartBarItemsText}>3 Items selected</Text>
                <Text style={styles.cartBarPriceText}>$16.47 + $2.00 Delivery</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cartBarButton} onPress={() => router.push('/(customer)/cart')}>
              <Text style={styles.cartBarButtonText}>View Cart</Text>
              <MaterialIcons name="arrow-forward-ios" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'rgba(28, 27, 27, 0.4)', // Slightly transparent dark
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00e554',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ba1a1a',
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
    paddingBottom: 160,
  },
  heroSection: {
    height: 300,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    padding: 24,
    zIndex: 10,
  },
  premiumBadge: {
    backgroundColor: '#006e24',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  premiumBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.2)',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  infoValueText: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  infoDivider: {
    width: 1,
    backgroundColor: 'rgba(185, 204, 181, 0.3)',
    marginVertical: 4,
  },
  tabsContainer: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(185, 204, 181, 0.2)',
  },
  tabsScrollContent: {
    paddingHorizontal: 20,
    gap: 32,
  },
  tabButton: {
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#006e24',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#3b4b39',
  },
  tabTextActive: {
    color: '#006e24',
  },
  productsContainer: {
    padding: 20,
    gap: 32,
  },
  productCategory: {
    // container
  },
  productCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitleIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#006e24',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  productGrid: {
    gap: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  productImage: {
    width: 96,
    height: 96,
    backgroundColor: '#f3f4f5',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  productBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ff5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7e8e9',
    borderRadius: 20,
    padding: 4,
    gap: 12,
  },
  stepperButtonMinus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonPlus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#006e24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  cartBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 76,
    left: 20,
    right: 20,
    zIndex: 60,
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2e3132', // inverse-surface
    padding: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartBarIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#00ff5f', // primary-container
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBarItemsText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff', // inverse-on-surface
  },
  cartBarPriceText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  cartBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006e24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  cartBarButtonText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
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
