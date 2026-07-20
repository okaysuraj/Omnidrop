import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ImageBackground, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function AddAddressScreen() {
  const router = useRouter();
  const [addressType, setAddressType] = useState('Home');
  const [houseNo, setHouseNo] = useState('');
  const [building, setBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!houseNo || !building) return;
    setLoading(true);
    try {
      await api.users.addAddress({
        streetAddress: `${houseNo}, ${building}`,
        city: 'Local City',
        state: 'LC',
        zipCode: '00000',
        label: addressType.toUpperCase(),
        isDefault: true,
      });
      router.back();
    } catch (e) {
      console.error('Failed to save address', e);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Map Preview Section */}
          <View style={styles.mapContainer}>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
              style={styles.mapImage}
            >
              {/* Pin Overlay */}
              <View style={styles.pinWrapper}>
                <View style={styles.pinIconContainer}>
                  <MaterialIcons name="location-on" size={32} color="#ffffff" />
                </View>
                <View style={styles.pinShadow} />
              </View>

              {/* Map Controls */}
              <TouchableOpacity style={styles.mapControlBtn}>
                <MaterialIcons name="my-location" size={24} color="#191c1d" />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          {/* Form Content */}
          <View style={styles.formSection}>
            
            {/* Address Header */}
            <View style={styles.addressHeader}>
              <MaterialIcons name="location-searching" size={24} color="#006e24" style={styles.addressHeaderIcon} />
              <View>
                <Text style={styles.addressHeaderTitle}>Confirm Location</Text>
                <Text style={styles.addressHeaderSubtitle}>221B Baker Street, London, Marylebone</Text>
              </View>
            </View>

            {/* Input Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Flat / House No.</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Apt 4B"
                placeholderTextColor="#6b7c68"
                value={houseNo}
                onChangeText={setHouseNo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Building / Apartment Name</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Skyline Towers"
                placeholderTextColor="#6b7c68"
                value={building}
                onChangeText={setBuilding}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Landmark (Optional)</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Near Central Park Gate"
                placeholderTextColor="#6b7c68"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            {/* Address Type Chips */}
            <View style={styles.typeSection}>
              <Text style={styles.typeLabel}>Save address as</Text>
              <View style={styles.typeChipsRow}>
                
                <TouchableOpacity 
                  style={[styles.typeChip, addressType === 'Home' && styles.typeChipActive]}
                  onPress={() => setAddressType('Home')}
                >
                  <MaterialIcons name="home" size={18} color={addressType === 'Home' ? '#ffffff' : '#191c1d'} />
                  <Text style={[styles.typeChipText, addressType === 'Home' && styles.typeChipTextActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.typeChip, addressType === 'Work' && styles.typeChipActive]}
                  onPress={() => setAddressType('Work')}
                >
                  <MaterialIcons name="work" size={18} color={addressType === 'Work' ? '#ffffff' : '#191c1d'} />
                  <Text style={[styles.typeChipText, addressType === 'Work' && styles.typeChipTextActive]}>Work</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.typeChip, addressType === 'Other' && styles.typeChipActive]}
                  onPress={() => setAddressType('Other')}
                >
                  <MaterialIcons name="favorite" size={18} color={addressType === 'Other' ? '#ffffff' : '#191c1d'} />
                  <Text style={[styles.typeChipText, addressType === 'Other' && styles.typeChipTextActive]}>Other</Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]} activeOpacity={0.9} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.saveBtnText}>Save Address</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#f8f9fa',
  },
  iconButton: {
    padding: 8,
    marginRight: 16,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
  },
  scrollContent: {
    paddingBottom: 100, // space for bottom bar
  },
  mapContainer: {
    width: '100%',
    height: 300,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinWrapper: {
    alignItems: 'center',
    marginBottom: 32, // offset for visual center
  },
  pinIconContainer: {
    backgroundColor: '#006e24',
    padding: 8,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{ scale: 1.1 }],
  },
  pinShadow: {
    width: 16,
    height: 4,
    backgroundColor: 'rgba(25, 28, 29, 0.2)',
    borderRadius: 8,
    marginTop: 8,
  },
  mapControlBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  addressHeaderIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  addressHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 2,
  },
  addressHeaderSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#575d78',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#575d78',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#b9ccb5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#191c1d',
  },
  typeSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#575d78',
    marginBottom: 8,
  },
  typeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#b9ccb5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 8,
  },
  typeChipActive: {
    backgroundColor: '#006e24',
    borderColor: '#006e24',
  },
  typeChipText: {
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    color: '#191c1d',
  },
  typeChipTextActive: {
    color: '#ffffff',
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
    shadowRadius: 20,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006e24',
    paddingVertical: 16,
    borderRadius: 24,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  saveBtnText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
  },
});
