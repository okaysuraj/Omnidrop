import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

export default function RiderEarningsDashboardScreen() {
  const router = useRouter();
  
  // Animation state for bars
  const [animatedHeights, setAnimatedHeights] = useState([0, 0, 0, 0, 0, 0, 0]);
  const targetHeights = [40, 65, 55, 85, 100, 30, 20];

  useEffect(() => {
    // Simple mock animation logic
    const timer = setTimeout(() => {
      setAnimatedHeights(targetHeights);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Earnings Card */}
        <View style={styles.gridContainer}>
          
          {/* Today's Stats */}
          <View style={styles.statsCard}>
            <View>
              <Text style={styles.statsLabel}>TODAY'S EARNINGS</Text>
              <Text style={styles.statsValue}>$128.40</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <MaterialIcons name="local-shipping" size={20} color="#6dff7f" />
                <Text style={styles.statPillValue}>14</Text>
                <Text style={styles.statPillLabel}>Drops</Text>
              </View>
              <View style={styles.statPill}>
                <MaterialIcons name="timer" size={20} color="#caf300" />
                <Text style={styles.statPillValue}>6.2</Text>
                <Text style={styles.statPillLabel}>Hrs</Text>
              </View>
            </View>
          </View>

          {/* Current Balance */}
          <View style={styles.balanceCard}>
            <View>
              <View style={styles.balanceHeaderRow}>
                <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                <MaterialIcons name="account-balance-wallet" size={24} color="#007125" />
              </View>
              <Text style={styles.balanceValue}>$452.12</Text>
              <Text style={styles.balanceSubtitle}>Next payout: Monday, Oct 23</Text>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>WITHDRAW NOW</Text>
            </TouchableOpacity>
          </View>
          
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeaderRow}>
            <View>
              <Text style={styles.chartTitle}>Weekly Performance</Text>
              <Text style={styles.chartSubtitle}>Oct 16 - Oct 22</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.chartTotal}>$842.15</Text>
              <Text style={styles.chartComparison}>+12.4% vs last week</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {/* Grid Lines */}
            <View style={styles.gridLinesContainer}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>
            
            {/* Bars */}
            <View style={styles.barsContainer}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <View key={index} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.barFill, 
                        { height: `${animatedHeights[index]}%` },
                        index === 4 && styles.barFillActive
                      ]} 
                    />
                  </View>
                  <Text style={[styles.barLabel, index === 4 && styles.barLabelActive]}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          <View style={styles.breakdownList}>
            
            {/* Trip Pay */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownItemLeft}>
                <View style={styles.breakdownIconWrapper}>
                  <MaterialIcons name="route" size={24} color="#6dff7f" />
                </View>
                <View>
                  <Text style={styles.breakdownItemTitle}>Trip Pay</Text>
                  <Text style={styles.breakdownItemSubtitle}>Base fare for 14 trips</Text>
                </View>
              </View>
              <Text style={styles.breakdownItemValue}>$82.00</Text>
            </View>

            {/* Incentives */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownItemLeft}>
                <View style={styles.breakdownIconWrapperSecondary}>
                  <MaterialIcons name="electric-bolt" size={24} color="#caf300" />
                </View>
                <View>
                  <Text style={styles.breakdownItemTitle}>Incentives</Text>
                  <Text style={styles.breakdownItemSubtitleSecondary}>Peak hour surge bonus</Text>
                </View>
              </View>
              <Text style={styles.breakdownItemValue}>$14.50</Text>
            </View>

            {/* Tips */}
            <View style={[styles.breakdownItem, { borderBottomWidth: 0 }]}>
              <View style={styles.breakdownItemLeft}>
                <View style={styles.breakdownIconWrapperTertiary}>
                  <MaterialIcons name="volunteer-activism" size={24} color="#00e554" />
                </View>
                <View>
                  <Text style={styles.breakdownItemTitle}>Tips</Text>
                  <Text style={styles.breakdownItemSubtitle}>100% of customer tips</Text>
                </View>
              </View>
              <Text style={styles.breakdownItemValue}>$31.90</Text>
            </View>

          </View>
        </View>

        {/* Transaction History Teaser */}
        <Link href="/(rider)/earnings/history" asChild>
          <TouchableOpacity style={styles.historyTeaser}>
            <View style={styles.historyTeaserLeft}>
              <MaterialIcons name="history" size={24} color="#b9ccb5" />
              <Text style={styles.historyTeaserText}>View Full History</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#b9ccb5" />
          </TouchableOpacity>
        </Link>

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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ff5f',
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  gridContainer: {
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff5f',
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    letterSpacing: 2,
  },
  statsValue: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00ff5f',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#353534',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  statPillValue: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  statPillLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
  },
  balanceCard: {
    backgroundColor: '#00ff5f',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#00e554',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
    opacity: 0.8,
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#007125',
    marginTop: 4,
  },
  balanceSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#007125',
    marginTop: 4,
    opacity: 0.9,
  },
  withdrawButton: {
    backgroundColor: '#007125',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  withdrawButtonText: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#00ff5f',
  },
  chartSection: {
    backgroundColor: '#1c1b1b',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  chartSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    marginTop: 4,
  },
  chartTotal: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  chartComparison: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#6dff7f',
    marginTop: 4,
  },
  chartContainer: {
    height: 192,
    flexDirection: 'row',
  },
  gridLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingVertical: 8,
    opacity: 0.1,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#b9ccb5',
    width: '100%',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    zIndex: 10,
  },
  barCol: {
    alignItems: 'center',
    width: '12%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    backgroundColor: '#353534',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  barFillActive: {
    backgroundColor: '#00ff5f',
  },
  barLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
  },
  barLabelActive: {
    color: '#00ff5f',
  },
  breakdownSection: {
    marginBottom: 24,
  },
  breakdownTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginLeft: 8,
    marginBottom: 16,
  },
  breakdownList: {
    backgroundColor: '#201f1f',
    borderRadius: 12,
    overflow: 'hidden',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1b1b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 75, 57, 0.3)',
  },
  breakdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  breakdownIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#353534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownIconWrapperSecondary: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#353534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownIconWrapperTertiary: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#353534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownItemTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
    color: '#e5e2e1',
  },
  breakdownItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#b9ccb5',
    marginTop: 2,
  },
  breakdownItemSubtitleSecondary: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#caf300',
    marginTop: 2,
  },
  breakdownItemValue: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  historyTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.2)',
  },
  historyTeaserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyTeaserText: {
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
    color: '#e5e2e1',
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
