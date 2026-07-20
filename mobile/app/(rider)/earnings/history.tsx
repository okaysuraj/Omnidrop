import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RiderTransactionHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#00e554" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=150' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#6dff7f" />
        </TouchableOpacity>
      </View>

      {/* Earnings Header */}
      <View style={styles.earningsHeader}>
        <Text style={styles.earningsLabel}>TOTAL BALANCE</Text>
        <View style={styles.earningsRow}>
          <Text style={styles.earningsValue}>$2,482.50</Text>
          <Text style={styles.earningsGrowth}>+12% this week</Text>
        </View>
      </View>

      {/* Filters Section */}
      <View style={styles.filtersSection}>
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={styles.filterTab} 
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.filterText, activeTab === 'all' && styles.filterTextActive]}>All</Text>
            {activeTab === 'all' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterTab} 
            onPress={() => setActiveTab('income')}
          >
            <Text style={[styles.filterText, activeTab === 'income' && styles.filterTextActive]}>Income</Text>
            {activeTab === 'income' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterTab} 
            onPress={() => setActiveTab('withdrawals')}
          >
            <Text style={[styles.filterText, activeTab === 'withdrawals' && styles.filterTextActive]}>Withdrawals</Text>
            {activeTab === 'withdrawals' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Transaction Item: Delivery */}
        <TouchableOpacity 
          style={[styles.transactionCard, styles.borderPrimary]} 
          activeOpacity={0.8}
          onPress={() => toggleDetails('job-8821')}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTime}>TODAY, 2:45 PM</Text>
              <Text style={styles.cardTitle}>Delivery #8821-XP</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={[styles.cardAmount, styles.textPrimary]}>+$18.25</Text>
              <View style={[styles.statusBadge, styles.bgPrimaryLight]}>
                <View style={styles.statusDotPrimary} />
                <Text style={[styles.statusText, styles.textPrimary]}>COMPLETED</Text>
              </View>
            </View>
          </View>
          
          {expandedId === 'job-8821' && (
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Base Fare</Text>
                <Text style={styles.detailValue}>$12.00</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance Bonus (4.2mi)</Text>
                <Text style={styles.detailValue}>$3.50</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rider Tip</Text>
                <Text style={[styles.detailValue, { color: '#caf300', fontWeight: 'bold' }]}>$2.75</Text>
              </View>
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackText}>"Fast delivery, food was still steaming. Thanks!"</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Transaction Item: Withdrawal */}
        <TouchableOpacity 
          style={[styles.transactionCard, styles.borderSecondary]} 
          activeOpacity={0.8}
          onPress={() => toggleDetails('wd-992')}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTime}>YESTERDAY, 11:15 AM</Text>
              <Text style={styles.cardTitle}>Instant Payout</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={[styles.cardAmount, styles.textSecondary]}>-$120.00</Text>
              <View style={[styles.statusBadge, styles.bgSecondaryLight]}>
                <MaterialIcons name="check-circle" size={12} color="#caf300" style={{ marginRight: 4 }} />
                <Text style={[styles.statusText, styles.textSecondary]}>SUCCESS</Text>
              </View>
            </View>
          </View>

          {expandedId === 'wd-992' && (
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Method</Text>
                <Text style={styles.detailValue}>Visa Debit ****4291</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference</Text>
                <Text style={[styles.detailValue, { fontFamily: 'monospace' }]}>TXN-00928812</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Transaction Item: Processing */}
        <TouchableOpacity style={[styles.transactionCard, styles.borderOutline]} activeOpacity={1}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTime}>OCT 24, 08:12 PM</Text>
              <Text style={styles.cardTitle}>Delivery #8819-QL</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={[styles.cardAmount, { color: '#b9ccb5' }]}>+$14.50</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#353534' }]}>
                <Text style={[styles.statusText, { color: '#b9ccb5' }]}>PROCESSING</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Transaction Item: Delivery */}
        <TouchableOpacity style={[styles.transactionCard, styles.borderPrimary]} activeOpacity={1}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTime}>OCT 23, 10:30 PM</Text>
              <Text style={styles.cardTitle}>Delivery #8812-TR</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={[styles.cardAmount, styles.textPrimary]}>+$24.00</Text>
              <View style={[styles.statusBadge, styles.bgPrimaryLight]}>
                <Text style={[styles.statusText, styles.textPrimary]}>COMPLETED</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Transaction Item: Delivery */}
        <TouchableOpacity style={[styles.transactionCard, styles.borderPrimary]} activeOpacity={1}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTime}>OCT 23, 07:15 PM</Text>
              <Text style={styles.cardTitle}>Delivery #8801-MK</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={[styles.cardAmount, styles.textPrimary]}>+$9.50</Text>
              <View style={[styles.statusBadge, styles.bgPrimaryLight]}>
                <Text style={[styles.statusText, styles.textPrimary]}>COMPLETED</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Load More Button */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>LOAD HISTORY</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="local-shipping" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Deliveries</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="payments" size={24} color="#007125" />
          <Text style={styles.navTextActive}>Earnings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Profile</Text>
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
    zIndex: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: -10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b4b39',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#6dff7f',
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  earningsHeader: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  earningsLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    letterSpacing: 2,
    marginBottom: 4,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  earningsValue: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#6dff7f',
  },
  earningsGrowth: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#00ff5f',
  },
  filtersSection: {
    backgroundColor: 'rgba(19, 19, 19, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 30,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
    paddingBottom: 8,
  },
  filterTab: {
    position: 'relative',
    paddingBottom: 8,
  },
  filterText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
  },
  filterTextActive: {
    color: '#6dff7f',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -9,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00ff5f',
    borderRadius: 3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
  },
  transactionCard: {
    backgroundColor: '#1c1b1b',
    borderRadius: 12,
    padding: 16,
  },
  borderPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#00ff5f',
  },
  borderSecondary: {
    borderLeftWidth: 4,
    borderLeftColor: '#caf300',
  },
  borderOutline: {
    borderLeftWidth: 4,
    borderLeftColor: '#849581',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTime: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  textPrimary: {
    color: '#6dff7f',
  },
  textSecondary: {
    color: '#caf300',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bgPrimaryLight: {
    backgroundColor: 'rgba(0, 255, 95, 0.1)',
  },
  bgSecondaryLight: {
    backgroundColor: 'rgba(202, 243, 0, 0.1)',
  },
  statusDotPrimary: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ff5f',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  cardDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#e5e2e1',
  },
  feedbackBox: {
    backgroundColor: '#353534',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    fontStyle: 'italic',
  },
  loadMoreButton: {
    borderWidth: 2,
    borderColor: '#00ff5f',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#00ff5f',
    letterSpacing: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0e0e0e',
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: '#00ff5f',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 24,
  },
  navText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#007125',
    marginTop: 4,
  },
});
