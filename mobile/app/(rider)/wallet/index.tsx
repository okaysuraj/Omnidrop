import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function RiderWalletScreen() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const data = await api.delivery.getEarnings();
        setEarnings(data);
      } catch (e) {
        console.error('Failed to load wallet', e);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00ff5f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color="#b9ccb5" />
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
          <MaterialIcons name="notifications" size={24} color="#00e554" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Omni Wallet</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            {/* Abstract Background element (simulated with border/color) */}
            <View style={styles.balanceCardInner}>
              <View>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceValue}>${earnings?.totalEarnings?.toFixed(2) || '0.00'}</Text>
                <View style={styles.balanceGrowthPill}>
                  <Text style={styles.balanceGrowthText}>+${earnings?.todayEarnings?.toFixed(2) || '0.00'} today</Text>
                </View>
              </View>
              
              <View style={styles.balanceActionRow}>
                <TouchableOpacity style={styles.addMoneyButton}>
                  <MaterialIcons name="add-circle" size={20} color="#002106" style={{ marginRight: 8 }} />
                  <Text style={styles.addMoneyButtonText}>Add Money</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendBankButton}>
                  <MaterialIcons name="account-balance" size={20} color="#e5e2e1" style={{ marginRight: 8 }} />
                  <Text style={styles.sendBankButtonText}>Send to Bank</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Rewards Tile */}
          <View style={styles.rewardsTile}>
            <View style={styles.rewardsHeader}>
              <View style={styles.rewardsIconWrapper}>
                <MaterialIcons name="star" size={24} color="#00ff5f" />
              </View>
              <View>
                <Text style={styles.rewardsTitle}>Omni Rewards</Text>
                <Text style={styles.rewardsSubtitle}>You have 240 points available to redeem.</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemButtonText}>Redeem Now</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#e5e2e1" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksSection}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinksGrid}>
            
            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={styles.quickLinkIconWrapper}>
                <MaterialIcons name="phone-iphone" size={24} color="#007125" />
              </View>
              <Text style={styles.quickLinkText}>Recharge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={styles.quickLinkIconWrapper}>
                <MaterialIcons name="redeem" size={24} color="#007125" />
              </View>
              <Text style={styles.quickLinkText}>Vouchers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={styles.quickLinkIconWrapper}>
                <MaterialIcons name="receipt-long" size={24} color="#007125" />
              </View>
              <Text style={styles.quickLinkText}>Pay Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickLinkCard} onPress={() => router.push('/(rider)/earnings/history')}>
              <View style={styles.quickLinkIconWrapper}>
                <MaterialIcons name="history" size={24} color="#007125" />
              </View>
              <Text style={styles.quickLinkText}>History</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(rider)/earnings/history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            
            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIconWrapper, { backgroundColor: '#ffdad6' }]}>
                  <MaterialIcons name="restaurant" size={20} color="#93000a" />
                </View>
                <View>
                  <Text style={styles.transactionTitle}>Food Delivery</Text>
                  <Text style={styles.transactionTime}>Today, 1:45 PM</Text>
                </View>
              </View>
              <Text style={[styles.transactionAmount, { color: '#e5e2e1' }]}>-$24.50</Text>
            </View>

            <View style={[styles.transactionItem, { borderBottomWidth: 0 }]}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIconWrapper, { backgroundColor: 'rgba(0, 255, 95, 0.2)' }]}>
                  <MaterialIcons name="account-balance" size={20} color="#00ff5f" />
                </View>
                <View>
                  <Text style={styles.transactionTitle}>Top Up</Text>
                  <Text style={styles.transactionTime}>Yesterday, 9:00 AM</Text>
                </View>
              </View>
              <Text style={[styles.transactionAmount, { color: '#00e554' }]}>+$100.00</Text>
            </View>

          </View>
        </View>

      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(rider)/home')}>
          <MaterialIcons name="home" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="local-offer" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Offers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#007125" />
          <Text style={styles.navTextActive}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="support-agent" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Support</Text>
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
    backgroundColor: '#1c1b1b',
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
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
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffb4ab',
    borderWidth: 1,
    borderColor: '#131313',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  balanceContainer: {
    gap: 16,
    marginBottom: 32,
  },
  balanceCard: {
    backgroundColor: '#ffffff', // Using light mode elements internally as per original design for contrast, but let's adapt to dark mode better
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceCardInner: {
    backgroundColor: '#1c1b1b', // Adapted to dark
    padding: 24,
    minHeight: 200,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3b4b39',
    borderRadius: 16,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 40,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00ff5f',
    letterSpacing: -1,
  },
  balanceGrowthPill: {
    backgroundColor: 'rgba(202, 243, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  balanceGrowthText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#caf300',
  },
  balanceActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  addMoneyButton: {
    flex: 1,
    backgroundColor: '#00ff5f',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoneyButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#002106',
  },
  sendBankButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3b4b39',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBankButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  rewardsTile: {
    backgroundColor: '#191c1d',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 95, 0.1)',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  rewardsIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 95, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginBottom: 4,
  },
  rewardsSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    flexShrink: 1,
  },
  redeemButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  quickLinksSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginBottom: 16,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickLinkCard: {
    width: '47%', // roughly half minus gap
    backgroundColor: '#1c1b1b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickLinkIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#e5e2e1',
  },
  recentSection: {
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  transactionsList: {
    backgroundColor: '#1c1b1b',
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 75, 57, 0.3)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#e5e2e1',
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
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
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
  },
  navItem: {
    alignItems: 'center',
    padding: 4,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: '#00ff5f',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
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
