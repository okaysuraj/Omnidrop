import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { api } from '../../src/lib/api';

export default function RiderSignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!fullName || !phone || !city) return;
    setLoading(true);
    try {
      await api.auth.updateProfile({
        fullName,
        phone,
      });
      router.push('/(rider)/kyc');
    } catch (e) {
      console.error('Failed to update rider profile', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top AppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#00e554" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OmniDrop Rider</Text>
        <View style={styles.spacer} />
      </View>

      {/* Background Decor */}
      <View style={styles.bgDecor1} />
      <View style={styles.bgDecor2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.preTitle}>Fleet Application</Text>
          <Text style={styles.title}>Join the Fleet</Text>
          <Text style={styles.subtitle}>Start earning on your own schedule with the world's most efficient delivery network.</Text>
        </View>

        {/* Bento Layout for Form */}
        <View style={styles.formCard}>
          
          {/* Progress Tracker */}
          <View style={styles.progressTracker}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>

          {/* Input Group: Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Legal Full Name</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person" size={24} color="#b9ccb5" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="rgba(185, 204, 181, 0.3)"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Input Group: Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="call" size={24} color="#b9ccb5" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="rgba(185, 204, 181, 0.3)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Input Group: City Selection (simplified for native) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Operational City</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="location-on" size={24} color="#b9ccb5" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. New York City"
                placeholderTextColor="rgba(185, 204, 181, 0.3)"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

        </View>

        {/* Trust Indicator Card */}
        <View style={styles.trustCard}>
          <View style={styles.trustIconWrapper}>
            <MaterialIcons name="shield" size={24} color="#00e554" />
          </View>
          <View style={styles.trustTextWrapper}>
            <Text style={styles.trustTitle}>Secure Onboarding</Text>
            <Text style={styles.trustSubtitle}>Your data is encrypted and used solely for identity verification and account setup.</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.continueButton, loading && { opacity: 0.7 }]} 
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#007125" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Continue</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#007125" />
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms and Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>

        {/* Aesthetic Footer Image */}
        <View style={styles.footerImageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?auto=format&fit=crop&q=80&w=600' }} 
            style={styles.footerImage} 
          />
          <View style={styles.footerImageOverlay} />
          <View style={styles.footerImageTextContainer}>
            <Text style={styles.footerImageText}>THE FUTURE OF{'\n'}LOGISTICS IS HERE.</Text>
          </View>
        </View>

        {/* Footer Identity (Mini) */}
        <View style={styles.footerMini}>
          <MaterialIcons name="verified-user" size={14} color="#b9ccb5" />
          <Text style={styles.footerMiniText}>CERTIFIED RIDER NETWORK 2024</Text>
        </View>

      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
    backgroundColor: '#131313',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  spacer: {
    width: 40,
  },
  bgDecor1: {
    position: 'absolute',
    top: '25%',
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 255, 95, 0.05)',
  },
  bgDecor2: {
    position: 'absolute',
    bottom: '25%',
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(202, 243, 0, 0.05)',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 40,
  },
  preTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#caf300',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    color: '#e5e2e1',
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#b9ccb5',
    marginTop: 8,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(132, 149, 129, 0.2)',
    marginBottom: 24,
  },
  progressTracker: {
    flexDirection: 'row',
    height: 4,
    gap: 8,
    marginBottom: 24,
  },
  progressStep: {
    flex: 1,
    backgroundColor: '#353534',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#00e554',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#b9ccb5',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: '#3b4b39',
    borderRadius: 12,
    height: 56,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18,
    color: '#e5e2e1',
    height: '100%',
    paddingRight: 16,
  },
  trustCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1b1b',
    borderWidth: 1,
    borderColor: 'rgba(59, 75, 57, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  trustIconWrapper: {
    backgroundColor: 'rgba(0, 255, 95, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  trustTextWrapper: {
    flex: 1,
  },
  trustTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#e5e2e1',
    marginBottom: 4,
  },
  trustSubtitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#b9ccb5',
    lineHeight: 16,
  },
  actionSection: {
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#00ff5f',
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#00ff5f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  continueButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#007125',
    marginRight: 8,
  },
  termsText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#b9ccb5',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  termsLink: {
    color: '#00e554',
    textDecorationLine: 'underline',
  },
  footerImageContainer: {
    height: 192,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
    marginBottom: 24,
  },
  footerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  footerImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  footerImageTextContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  footerImageText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#00e554',
    lineHeight: 28,
  },
  footerMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 75, 57, 0.1)',
    gap: 8,
    opacity: 0.5,
  },
  footerMiniText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: '#b9ccb5',
    letterSpacing: 1,
  },
});
