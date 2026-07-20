import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await api.users.getAddresses();
        setAddresses(data || []);
      } catch (e) {
        console.error('Failed to load addresses', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <MaterialIcons name="person" size={24} color="#3b4b39" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          <Text style={styles.sectionSubtitle}>Quickly select your delivery destination</Text>
        </View>

        {/* Address List */}
        <View style={styles.addressList}>
          
          {loading ? (
            <ActivityIndicator size="large" color="#00e554" style={{ marginTop: 40 }} />
          ) : addresses.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#849581', fontFamily: 'Montserrat_500Medium' }}>No saved addresses found.</Text>
          ) : (
            addresses.map((address) => (
              <View key={address.id} style={[styles.addressCard, { borderColor: 'transparent' }]}>
                <View style={[styles.iconContainer, { backgroundColor: address.label === 'HOME' ? '#00ff5f' : address.label === 'WORK' ? '#d8defe' : '#ffd4c5' }]}>
                  <MaterialIcons name={address.label === 'HOME' ? 'home' : address.label === 'WORK' ? 'work' : 'location-on'} size={24} color={address.label === 'HOME' ? '#007125' : address.label === 'WORK' ? '#5b617d' : '#ac3b00'} />
                </View>
                <View style={styles.addressInfo}>
                  <View style={styles.addressCardHeader}>
                    <Text style={[styles.addressTag, { color: address.label === 'HOME' ? '#006e24' : address.label === 'WORK' ? '#575d78' : '#a73a00' }]}>
                      {address.label?.toUpperCase() || 'ADDRESS'} {address.isDefault && '(DEFAULT)'}
                    </Text>
                    <TouchableOpacity style={styles.editBtn}>
                      <MaterialIcons name="edit" size={20} color="#3b4b39" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.addressLine1}>{address.streetAddress}</Text>
                  <Text style={styles.addressLine2}>{address.city}, {address.state} {address.zipCode}</Text>
                </View>
              </View>
            ))
          )}

        </View>

        {/* Decorative Map Section */}
        <View style={styles.mapPreview}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.mapImage}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={styles.mapOverlay} />
            <View style={styles.locationCountBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.locationCountText}>{addresses.length} Locations Saved</Text>
            </View>
          </ImageBackground>
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.9} onPress={() => router.push('/(customer)/address/location-select')}>
          <Text style={styles.addBtnText}>ADD NEW ADDRESS</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
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
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#edeeef',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e7e8e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    opacity: 0.8,
  },
  addressList: {
    gap: 16,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressTag: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  editBtn: {
    padding: 4,
  },
  addressLine1: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginTop: 4,
  },
  addressLine2: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    marginTop: 4,
  },
  mapPreview: {
    marginTop: 32,
    height: 192, // 48 * 4
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e7e8e9',
    elevation: 2,
    shadowColor: '#191c1d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 249, 250, 0.4)', // background/40
  },
  locationCountBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e554',
  },
  locationCountText: {
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    color: '#191c1d',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: 'rgba(185, 204, 181, 0.3)',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006e24',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
