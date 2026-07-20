import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ImageBackground, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LocationSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
          style={styles.mapImage}
        >
          {/* Draggable Pin UI (Visual representation) */}
          <View style={styles.pinWrapper}>
            <View style={styles.pinIconContainer}>
              <MaterialIcons name="location-on" size={48} color="#006e24" style={styles.pinIcon} />
            </View>
            <View style={styles.pinShadow} />
          </View>
        </ImageBackground>

        {/* Top App Bar & Search */}
        <SafeAreaView style={styles.mapOverlayTop} edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#191c1d" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>OmniDrop</Text>
            <View style={{ width: 40 }} /> 
          </View>

          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#006e24" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search address, building, or city..."
              placeholderTextColor="rgba(59, 75, 57, 0.6)"
            />
            <TouchableOpacity>
              <MaterialIcons name="my-location" size={24} color="#3b4b39" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.dragHandle} />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.deliverHeader}>
            <Text style={styles.deliverTitle}>Deliver here</Text>
            <TouchableOpacity>
              <Text style={styles.editBtnText}>EDIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.currentLocation}>
            <View style={styles.currentLocationIcon}>
              <MaterialIcons name="location-on" size={24} color="#007125" />
            </View>
            <View style={styles.currentLocationTextWrapper}>
              <Text style={styles.currentLocationTitle}>329 Market Street</Text>
              <Text style={styles.currentLocationSubtitle}>San Francisco, CA 94105</Text>
            </View>
          </View>

          {/* Saved Addresses (Bento) */}
          <View style={styles.bentoGrid}>
            <TouchableOpacity style={styles.bentoCard} onPress={() => router.push('/(customer)/address/saved')}>
              <MaterialIcons name="home" size={24} color="#575d78" style={styles.bentoIcon} />
              <Text style={styles.bentoTitle}>Home</Text>
              <Text style={styles.bentoSubtitle} numberOfLines={1}>888 Brannan St...</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bentoCard} onPress={() => router.push('/(customer)/address/saved')}>
              <MaterialIcons name="work" size={24} color="#575d78" style={styles.bentoIcon} />
              <Text style={styles.bentoTitle}>Work</Text>
              <Text style={styles.bentoSubtitle} numberOfLines={1}>123 Industrial Rd...</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Locations */}
          <View style={styles.recentSection}>
            <Text style={styles.recentSectionTitle}>RECENT LOCATIONS</Text>
            
            <TouchableOpacity style={styles.recentItem}>
              <MaterialIcons name="history" size={24} color="#6b7c68" style={styles.recentIcon} />
              <View style={styles.recentTextWrapper}>
                <Text style={styles.recentTitle}>Coffee & Cream</Text>
                <Text style={styles.recentSubtitle}>452 Valencia St, Mission District</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentItem}>
              <MaterialIcons name="history" size={24} color="#6b7c68" style={styles.recentIcon} />
              <View style={styles.recentTextWrapper}>
                <Text style={styles.recentTitle}>City Gym North</Text>
                <Text style={styles.recentSubtitle}>720 Post Street, Lower Nob Hill</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Add New */}
          <TouchableOpacity style={styles.addNewBtn} onPress={() => router.push('/(customer)/address/add')}>
            <MaterialIcons name="add" size={20} color="#006e24" />
            <Text style={styles.addNewText}>ADD NEW SAVED PLACE</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* Sticky Confirm Button */}
      <View style={styles.confirmContainer}>
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.9}>
          <Text style={styles.confirmBtnText}>Confirm Location</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#007125" />
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
  mapContainer: {
    height: '45%',
    minHeight: 350,
    width: '100%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinWrapper: {
    alignItems: 'center',
    marginBottom: 24, // offset for visual center
  },
  pinIconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  pinIcon: {
    //
  },
  pinShadow: {
    width: 12,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 6,
    marginTop: 4,
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    height: 56,
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#006e24',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#191c1d',
    padding: 0,
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 8,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#b9ccb5',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // space for confirm button
  },
  deliverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  deliverTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  currentLocationIcon: {
    backgroundColor: '#00ff5f',
    padding: 12,
    borderRadius: 24,
    marginRight: 16,
  },
  currentLocationTextWrapper: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  currentLocationSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.2)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bentoIcon: {
    marginBottom: 12,
  },
  bentoTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  bentoSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  recentSection: {
    marginBottom: 24,
  },
  recentSectionTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#3b4b39',
    marginBottom: 16,
    letterSpacing: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentIcon: {
    marginRight: 16,
  },
  recentTextWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(185, 204, 181, 0.1)',
    paddingBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#191c1d',
    marginBottom: 4,
  },
  recentSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addNewText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
    marginLeft: 8,
  },
  confirmContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 40,
    backgroundColor: 'rgba(248, 249, 250, 0.9)', // Gradient-like effect
  },
  confirmBtn: {
    backgroundColor: '#00ff5f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  confirmBtnText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
  },
});
