import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function CategoryListScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.products.categories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <MaterialIcons name="bolt" size={28} color="#006e24" />
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(customer)/search/global')}>
            <MaterialIcons name="search" size={24} color="#3b4b39" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(customer)/cart')}>
            <MaterialIcons name="shopping-cart" size={24} color="#006e24" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Screen Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Shop by Category</Text>
          <Text style={styles.subtitle}>Everything you need, delivered in minutes.</Text>
        </View>

        {/* Category Grid */}
        <View style={styles.grid}>
          {loading ? (
            <ActivityIndicator size="large" color="#00e554" style={{ marginTop: 40, width: '100%' }} />
          ) : (
            categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard} 
                activeOpacity={0.8}
                onPress={() => router.push(`/(customer)/category/${category.id}`)}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: category.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300' }} style={styles.categoryImage} />
                  <View style={styles.imageOverlay} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Special Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>LIMITED OFFER</Text>
            </View>
            <Text style={styles.bannerTitle}>Free Delivery on Wellness</Text>
            <Text style={styles.bannerSubtitle}>Use code WELLNESS24 at checkout.</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Claim Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerIconWrapper}>
            <MaterialIcons name="spa" size={120} color="rgba(0, 110, 36, 0.2)" style={styles.bannerIcon} />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/home')}>
          <MaterialIcons name="home" size={24} color="#849581" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive} onPress={() => router.push('/(customer)/search/global')}>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#006e24',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0a1929',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#f3f4f5',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 110, 36, 0.05)',
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    textAlign: 'center',
  },
  banner: {
    width: '100%',
    backgroundColor: 'rgba(0, 255, 95, 0.1)', // primary-container / 20
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 95, 0.3)',
  },
  bannerContent: {
    flex: 1,
    zIndex: 10,
  },
  bannerBadge: {
    backgroundColor: '#006e24',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125', // on-primary-container
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(0, 113, 37, 0.8)',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#006e24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  bannerIconWrapper: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
  },
  bannerIcon: {
    transform: [{ rotate: '0deg' }],
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
