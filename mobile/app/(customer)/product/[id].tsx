import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.byId(id as string);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00e554" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Montserrat_500Medium', color: '#191c1d' }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#3b4b39" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <MaterialIcons name="bolt" size={28} color="#00e554" />
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(customer)/search/global')}>
            <MaterialIcons name="search" size={24} color="#3b4b39" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=800' }} 
              style={styles.productImage}
            />
            {/* Badges */}
            <View style={styles.badgesContainer}>
              <View style={styles.badgePrimary}>
                <Text style={styles.badgePrimaryText}>Fastest Delivery</Text>
              </View>
              {product.category?.name && (
                <View style={styles.badgeSecondary}>
                  <Text style={styles.badgeSecondaryText}>{product.category.name}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.productInfoTop}>
            <Text style={styles.categoryTag}>{product.category?.name?.toUpperCase() || 'GENERAL'}</Text>
            <Text style={styles.productTitle}>{product.name}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                <MaterialIcons name="star" size={16} color="#006e24" />
                <MaterialIcons name="star" size={16} color="#006e24" />
                <MaterialIcons name="star" size={16} color="#006e24" />
                <MaterialIcons name="star" size={16} color="#006e24" />
                <MaterialIcons name="star-half" size={16} color="#006e24" />
              </View>
              <Text style={styles.reviewCount}>(124 reviews)</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>${Number(product.sellingPrice).toFixed(2)}</Text>
            {product.mrp && Number(product.mrp) > Number(product.sellingPrice) && (
              <Text style={styles.oldPrice}>${Number(product.mrp).toFixed(2)}</Text>
            )}
            {product.weight && (
              <Text style={styles.unitText}>{product.weight}</Text>
            )}
          </View>

          <Text style={styles.descriptionText}>
            {product.description || 'Quality product sourced carefully for you. Delivered ripe and ready within minutes.'}
          </Text>

          {/* Actions */}
          <View style={styles.actionsRow}>
            {/* Quantity */}
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <MaterialIcons name="remove" size={20} color="#191c1d" />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityBtn} onPress={() => setQuantity(quantity + 1)}>
                <MaterialIcons name="add" size={20} color="#191c1d" />
              </TouchableOpacity>
            </View>
            
            {/* Add to Cart */}
            <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8} onPress={() => router.push('/(customer)/cart')}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
              <MaterialIcons name="shopping-cart" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

        </View>

        {/* Info Tabs */}
        <View style={styles.tabsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContainer}>
            {['Description', 'Nutrition', 'Sourcing'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tabContent}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>100% Certified Organic</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>Rich in healthy fats and fiber</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>Sourced from sustainable farms in California</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>Store at room temperature until ripe, then refrigerate</Text>
            </View>
          </View>
        </View>

        {/* Frequently Bought Together */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Frequently Bought Together</Text>
          
          <View style={styles.relatedGrid}>
            
            {/* Item 1 */}
            <View style={styles.relatedCard}>
              <View style={styles.relatedImageContainer}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=300' }} style={styles.relatedImage} />
              </View>
              <Text style={styles.relatedTag}>BAKERY</Text>
              <Text style={styles.relatedName} numberOfLines={1}>Artisan Sourdough</Text>
              <View style={styles.relatedBottom}>
                <Text style={styles.relatedPrice}>$6.50</Text>
                <TouchableOpacity style={styles.relatedAddBtn}>
                  <MaterialIcons name="add" size={16} color="#007125" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 2 */}
            <View style={styles.relatedCard}>
              <View style={styles.relatedImageContainer}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300' }} style={styles.relatedImage} />
              </View>
              <Text style={styles.relatedTag}>PRODUCE</Text>
              <Text style={styles.relatedName} numberOfLines={1}>Cherry Tomatoes</Text>
              <View style={styles.relatedBottom}>
                <Text style={styles.relatedPrice}>$3.99</Text>
                <TouchableOpacity style={styles.relatedAddBtn}>
                  <MaterialIcons name="add" size={16} color="#007125" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 3 */}
            <View style={styles.relatedCard}>
              <View style={styles.relatedImageContainer}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1590005024862-6b67679a29fb?auto=format&fit=crop&q=80&w=300' }} style={styles.relatedImage} />
              </View>
              <Text style={styles.relatedTag}>PRODUCE</Text>
              <Text style={styles.relatedName} numberOfLines={1}>Organic Limes</Text>
              <View style={styles.relatedBottom}>
                <Text style={styles.relatedPrice}>$2.50</Text>
                <TouchableOpacity style={styles.relatedAddBtn}>
                  <MaterialIcons name="add" size={16} color="#007125" />
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00e554',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 40,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgesContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    gap: 8,
  },
  badgePrimary: {
    backgroundColor: '#006e24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgePrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  badgeSecondary: {
    backgroundColor: '#575d78',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeSecondaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  productInfoTop: {
    marginBottom: 16,
  },
  categoryTag: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#575d78',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 24,
  },
  currentPrice: {
    fontSize: 40,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#191c1d',
  },
  oldPrice: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    textDecorationLine: 'line-through',
  },
  unitText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    marginLeft: 'auto',
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    lineHeight: 24,
    marginBottom: 32,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edeeef',
    borderRadius: 24,
    padding: 4,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  quantityValue: {
    width: 32,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006e24',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: '#006e24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  addToCartText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
  },
  tabsSection: {
    marginBottom: 40,
  },
  tabsScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e3e4',
    marginBottom: 16,
  },
  tabsContainer: {
    gap: 24,
    paddingBottom: 8,
  },
  tabButton: {
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#006e24',
  },
  tabText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#3b4b39',
  },
  tabTextActive: {
    color: '#006e24',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: '#3b4b39',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  relatedSection: {
    //
  },
  relatedTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 16,
  },
  relatedGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  relatedCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  relatedImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#edeeef',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  relatedTag: {
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
    marginBottom: 4,
  },
  relatedName: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 12,
  },
  relatedBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  relatedPrice: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  relatedAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ff5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
