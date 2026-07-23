import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState('scooter');
  const [plateNumber, setPlateNumber] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateVehicle = async () => {
    if (!plateNumber) return;
    setLoading(true);
    try {
      await api.auth.updateProfile({
        vehicleType,
        vehicleNumber: plateNumber
      });
      router.push('/(rider)/earnings');
    } catch (e) {
      console.error('Failed to update vehicle details', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#00e554" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons name="notifications" size={24} color="#00e554" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Visual Header */}
        <View style={styles.visualHeader}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?auto=format&fit=crop&q=80&w=600' }} 
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
          >
            <View style={styles.headerOverlay} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerSubtitle}>ACTIVE PROFILE</Text>
              <Text style={styles.headerMainTitle}>Setup Your Ride</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Vehicle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Vehicle Type</Text>
          <View style={styles.vehicleTypeGrid}>
            {[
              { id: 'bike', icon: 'motorcycle', label: 'Bike' },
              { id: 'scooter', icon: 'moped', label: 'Scooter' },
              { id: 'cycle', icon: 'pedal-bike', label: 'Cycle' },
              { id: 'electric', icon: 'electric-moped', label: 'Electric' },
            ].map(type => (
              <TouchableOpacity 
                key={type.id}
                style={[
                  styles.vehicleCard,
                  vehicleType === type.id && styles.vehicleCardActive
                ]}
                onPress={() => setVehicleType(type.id)}
              >
                <MaterialIcons 
                  name={type.icon as any} 
                  size={32} 
                  color={vehicleType === type.id ? '#171e00' : '#e5e2e1'} 
                  style={styles.vehicleIcon} 
                />
                <Text style={[
                  styles.vehicleLabel,
                  vehicleType === type.id && styles.vehicleLabelActive
                ]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Registration Form */}
        <View style={styles.section}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>VEHICLE PLATE NUMBER</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="pin" size={24} color="#b9ccb5" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputUppercase]}
                placeholder="E.G. ABC 1234"
                placeholderTextColor="#454747"
                value={plateNumber}
                onChangeText={setPlateNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>INSURANCE POLICY NUMBER</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="verified-user" size={24} color="#b9ccb5" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputUppercase]}
                placeholder="POL-9988-XXXX"
                placeholderTextColor="#454747"
                value={insurancePolicy}
                onChangeText={setInsurancePolicy}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>EXPIRY DATE</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputSmall}
                  placeholder="MM/YY"
                  placeholderTextColor="#454747"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>COLOR</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputSmall}
                  placeholder="Black"
                  placeholderTextColor="#454747"
                />
              </View>
            </View>
          </View>

        </View>

        {/* Document Upload Prompt */}
        <View style={styles.uploadPrompt}>
          <MaterialIcons name="cloud-upload" size={40} color="#b9ccb5" style={styles.uploadIcon} />
          <Text style={styles.uploadTitle}>Vehicle Documents</Text>
          <Text style={styles.uploadSubtitle}>Upload Registration & Insurance PDF</Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse Files</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Sticky Action Button */}
      <View style={styles.footerAction}>
        <TouchableOpacity 
          style={[styles.actionButton, loading && { opacity: 0.7 }]}
          onPress={handleUpdateVehicle}
          disabled={loading || !plateNumber}
        >
          {loading ? (
            <ActivityIndicator color="#007125" />
          ) : (
            <>
              <Text style={styles.actionButtonText}>Update Vehicle</Text>
              <MaterialIcons name="check-circle" size={24} color="#007125" />
            </>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#131313',
    borderBottomWidth: 2,
    borderBottomColor: '#3b4b39',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: -8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  visualHeader: {
    marginBottom: 40,
  },
  headerImage: {
    height: 192,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: '#3b4b39',
  },
  headerImageStyle: {
    opacity: 0.8,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerTextContainer: {
    padding: 16,
    zIndex: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#caf300',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerMainTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginBottom: 16,
  },
  vehicleTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1c1b1b',
    borderWidth: 2,
    borderColor: '#3b4b39',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleCardActive: {
    backgroundColor: '#caf300',
    borderColor: '#caf300',
  },
  vehicleIcon: {
    marginBottom: 8,
  },
  vehicleLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#e5e2e1',
  },
  vehicleLabelActive: {
    color: '#171e00',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#353534',
    borderWidth: 2,
    borderColor: '#3b4b39',
    borderRadius: 8,
    height: 64,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#00e554',
    height: '100%',
    paddingRight: 16,
  },
  inputSmall: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18,
    color: '#e5e2e1',
    height: '100%',
    paddingHorizontal: 16,
  },
  inputUppercase: {
    textTransform: 'uppercase',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadPrompt: {
    backgroundColor: '#201f1f',
    borderWidth: 2,
    borderColor: '#3b4b39',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
    color: '#e5e2e1',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    marginBottom: 16,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#caf300',
  },
  browseButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#caf300',
  },
  footerAction: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  actionButton: {
    backgroundColor: '#00ff5f',
    height: 64,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ff5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  actionButtonText: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
    marginRight: 12,
  },
});
