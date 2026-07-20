import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RiderKycScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#00e554" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>OmniDrop Rider</Text>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons name="notifications" size={24} color="#b9ccb5" />
          <MaterialIcons name="signal-cellular-4-bar" size={24} color="#00e554" style={{ marginLeft: 16 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Verification Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Identity Verification</Text>
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>80% COMPLETE</Text>
            </View>
          </View>
          <Text style={styles.pageSubtitle}>
            Please upload clear photos of your official documents to activate your rider account. All data is encrypted.
          </Text>
        </View>

        {/* Document Cards */}
        <View style={styles.grid}>
          
          {/* ID Proof Section (Verified) */}
          <View style={[styles.docCard, styles.verifiedBorder]}>
            <View style={styles.docCardBody}>
              <View style={styles.docCardHeader}>
                <View style={styles.iconWrapperVerified}>
                  <MaterialIcons name="badge" size={24} color="#00e554" />
                </View>
                <View style={styles.statusBadgeVerified}>
                  <MaterialIcons name="verified" size={14} color="#00e554" style={{ marginRight: 4 }} />
                  <Text style={styles.statusTextVerified}>VERIFIED</Text>
                </View>
              </View>
              <Text style={styles.docTitle}>National ID Proof</Text>
              <Text style={styles.docSubtitle}>Front & back of your government ID</Text>
            </View>
            <View style={styles.docCardFooter}>
              <Text style={styles.footerDate}>Uploaded 12 Oct, 2023</Text>
              <TouchableOpacity>
                <Text style={styles.viewDocLink}>View Document</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Driving License Section (Pending) */}
          <View style={[styles.docCard, styles.pendingBorder]}>
            <View style={styles.docCardBody}>
              <View style={styles.docCardHeader}>
                <View style={styles.iconWrapperPending}>
                  <MaterialIcons name="directions-car" size={24} color="#caf300" />
                </View>
                <View style={styles.statusBadgePending}>
                  <MaterialIcons name="pending" size={14} color="#caf300" style={{ marginRight: 4 }} />
                  <Text style={styles.statusTextPending}>PENDING</Text>
                </View>
              </View>
              <Text style={styles.docTitle}>Driving License</Text>
              <Text style={styles.docSubtitle}>Commercial or Private vehicle permit</Text>
            </View>
            <View style={styles.docCardFooter}>
              <Text style={styles.footerDate}>Under review (est. 24h)</Text>
              <MaterialIcons name="sync" size={16} color="#caf300" />
            </View>
          </View>

          {/* Upload Section (Interactive) */}
          <TouchableOpacity style={styles.uploadSection} activeOpacity={0.8}>
            <View style={styles.uploadIconWrapper}>
              <MaterialIcons name="add-a-photo" size={32} color="#00e554" />
            </View>
            <View style={styles.uploadTextWrapper}>
              <Text style={styles.uploadTitle}>TAP TO UPLOAD NEW DOCUMENT</Text>
              <Text style={styles.uploadSubtitle}>Supports JPG, PNG or PDF (Max 10MB)</Text>
            </View>
            <View style={styles.tagsContainer}>
              <View style={styles.tag}><Text style={styles.tagText}>AADHAAR</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>PAN CARD</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>VEHICLE RC</Text></View>
            </View>
          </TouchableOpacity>

        </View>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <MaterialIcons name="lock" size={32} color="#00e554" />
          <View style={styles.securityTextWrapper}>
            <Text style={styles.securityTitle}>End-to-End Encrypted</Text>
            <Text style={styles.securitySubtitle}>
              Your documents are processed through a PCI-DSS compliant secure vault and are never shared with third parties.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Footer Action */}
      <View style={styles.footerAction}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(rider)/vehicle')}
        >
          <Text style={styles.actionButtonText}>COMPLETE APPLICATION</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#007125" />
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
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // space for sticky button
  },
  sectionHeader: {
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  completionBadge: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b4b39',
  },
  completionText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#caf300',
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    lineHeight: 20,
  },
  grid: {
    gap: 16,
  },
  docCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  verifiedBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#00e554',
  },
  pendingBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#caf300',
  },
  docCardBody: {
    padding: 20,
  },
  docCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconWrapperVerified: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 95, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperPending: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(202, 243, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 95, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusTextVerified: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  statusBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(202, 243, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusTextPending: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#caf300',
  },
  docTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginBottom: 4,
  },
  docSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
  },
  docCardFooter: {
    backgroundColor: '#353534',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDate: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
  },
  viewDocLink: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  uploadSection: {
    backgroundColor: '#1c1b1b',
    borderWidth: 2,
    borderColor: '#3b4b39',
    borderStyle: 'dashed',
    borderRadius: 12,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 8,
  },
  uploadIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#00e554',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  uploadTextWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
    letterSpacing: 1,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#353534',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#201f1f',
    borderWidth: 1,
    borderColor: '#3b4b39',
    borderRadius: 12,
    padding: 20,
    marginTop: 32,
    gap: 16,
  },
  securityTextWrapper: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    lineHeight: 16,
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
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
    marginRight: 8,
  },
});
