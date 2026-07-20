import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function GlobalSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const trendingSearches = [
    'Organic Avocados',
    'AirPods Pro 2',
    'Artisanal Sourdough',
    'Energy Drinks',
    'Summer Skincare'
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push({ pathname: '/(customer)/search/results', params: { q: query } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="bolt" size={28} color="#00e554" />
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#b9ccb5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search Input Section */}
        <View style={styles.searchSection}>
          <View style={[styles.searchInputContainer, isFocused && styles.searchInputFocused]}>
            <MaterialIcons name="search" size={24} color="#00e554" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for groceries, tech, or daily essentials..."
              placeholderTextColor="#849581"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={() => handleSearch(searchQuery)}
              autoFocus={true}
            />
            <TouchableOpacity onPress={() => router.push('/(customer)/search/voice')} style={styles.micButton}>
              <MaterialIcons name="mic" size={24} color="#b9ccb5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="trending-up" size={24} color="#00ff5f" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Trending Searches</Text>
          </View>
          <View style={styles.tagsContainer}>
            {trendingSearches.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tagButton} onPress={() => handleSearch(tag)}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Searched */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderBetween}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="history" size={24} color="#849581" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Recently Searched</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentList}>
            <TouchableOpacity style={styles.recentItem} onPress={() => handleSearch('Cold Brew Coffee Concentrate')}>
              <View style={styles.recentItemLeft}>
                <MaterialIcons name="search" size={20} color="#849581" />
                <Text style={styles.recentItemText}>Cold Brew Coffee Concentrate</Text>
              </View>
              <MaterialIcons name="close" size={16} color="#849581" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recentItem} onPress={() => handleSearch('Wireless Mechanical Keyboard')}>
              <View style={styles.recentItemLeft}>
                <MaterialIcons name="search" size={20} color="#849581" />
                <Text style={styles.recentItemText}>Wireless Mechanical Keyboard</Text>
              </View>
              <MaterialIcons name="close" size={16} color="#849581" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop by Category (Asymmetric Bento Grid) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.bentoGrid}>
            
            {/* Groceries - Large */}
            <TouchableOpacity style={styles.bentoLarge} activeOpacity={0.9} onPress={() => router.push('/(customer)/category/groceries')}>
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }} 
                style={styles.bentoImage}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={[styles.bentoOverlay, { backgroundColor: 'rgba(0, 110, 36, 0.4)' }]} />
                <View style={styles.bentoContentBottom}>
                  <Text style={styles.bentoTitleLarge}>Groceries</Text>
                  <Text style={styles.bentoSubtitle}>15 min delivery</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <View style={styles.bentoRightColumn}>
              {/* Tech */}
              <TouchableOpacity style={styles.bentoMedium} activeOpacity={0.9} onPress={() => router.push('/(customer)/category/tech')}>
                <ImageBackground 
                  source={{ uri: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80&w=500' }} 
                  style={styles.bentoImage}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View style={[styles.bentoOverlay, { backgroundColor: 'rgba(87, 93, 120, 0.5)' }]} />
                  <View style={styles.bentoContentCenterLeft}>
                    <Text style={styles.bentoTitleMedium}>Tech & Gadgets</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              
              <View style={styles.bentoSmallRow}>
                {/* Pharmacy */}
                <TouchableOpacity style={styles.bentoSmall} activeOpacity={0.9} onPress={() => router.push('/(customer)/category/pharmacy')}>
                  <ImageBackground 
                    source={{ uri: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300' }} 
                    style={styles.bentoImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={[styles.bentoOverlay, { backgroundColor: 'rgba(0, 113, 37, 0.4)' }]} />
                    <View style={styles.bentoContentCenter}>
                      <Text style={styles.bentoTitleSmall}>Pharmacy</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

                {/* Home */}
                <TouchableOpacity style={styles.bentoSmall} activeOpacity={0.9} onPress={() => router.push('/(customer)/category/home')}>
                  <ImageBackground 
                    source={{ uri: 'https://images.unsplash.com/photo-1556020685-e631933f1160?auto=format&fit=crop&q=80&w=300' }} 
                    style={styles.bentoImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={[styles.bentoOverlay, { backgroundColor: 'rgba(167, 58, 0, 0.4)' }]} />
                    <View style={styles.bentoContentCenter}>
                      <Text style={styles.bentoTitleSmall}>Home Essentials</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>

        {/* Dynamic Offer Card */}
        <View style={[styles.section, styles.offerSection]}>
          <View style={styles.offerCard}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Free Delivery on all Tech!</Text>
              <Text style={styles.offerDesc}>Use code TECHRUN at checkout. Ends in 2h.</Text>
            </View>
            <View style={styles.offerIconWrapper}>
              <MaterialIcons name="local-shipping" size={80} color="rgba(0, 255, 95, 0.3)" style={styles.offerIcon} />
            </View>
          </View>
        </View>

      </ScrollView>

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
    backgroundColor: '#131313', // Using dark mode for consistency with rider app
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#1c1b1b',
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00e554',
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
  searchSection: {
    marginBottom: 32,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1b1b',
    borderRadius: 16,
    height: 64,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchInputFocused: {
    borderColor: '#00ff5f',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#e5e2e1',
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  micButton: {
    padding: 8,
    marginLeft: 8,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    // optional alignment
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  recentList: {
    gap: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c1b1b',
    padding: 16,
    borderRadius: 12,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recentItemText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#e5e2e1',
  },
  bentoGrid: {
    flexDirection: 'row',
    height: 240,
    gap: 12,
  },
  bentoLarge: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bentoRightColumn: {
    flex: 1,
    gap: 12,
  },
  bentoMedium: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bentoSmallRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  bentoSmall: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bentoImage: {
    width: '100%',
    height: '100%',
  },
  bentoOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bentoContentBottom: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  bentoTitleLarge: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
  },
  bentoSubtitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  bentoContentCenterLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 16,
    justifyContent: 'center',
  },
  bentoTitleMedium: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
  },
  bentoContentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  bentoTitleSmall: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  offerSection: {
    marginTop: 16,
  },
  offerCard: {
    backgroundColor: '#002106',
    borderRadius: 16,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,255,95,0.2)',
  },
  offerContent: {
    flex: 2,
    zIndex: 2,
  },
  offerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
    marginBottom: 8,
  },
  offerDesc: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  offerIconWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    right: -20,
  },
  offerIcon: {
    transform: [{ rotate: '12deg' }],
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1c1b1b',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 95, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 24,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#849581',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00ff5f',
    marginTop: 4,
  },
});
