import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/lib/api';

export default function RiderEarningsScreen() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const data = await api.delivery.getEarnings();
        setEarnings(data);
      } catch (e) {
        console.error('Failed to load earnings', e);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#131313', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff5f" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ backgroundColor: '#131313' }}>
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-background z-50 sticky top-0" style={{ backgroundColor: '#131313' }}>
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: '#00ff5f' }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' }}
              className="w-full h-full"
            />
          </View>
          <Text className="font-extrabold text-xl tracking-tight" style={{ color: '#6dff7f' }}>OmniDrop</Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full active:scale-95" style={{ backgroundColor: '#353534' }}>
          <Ionicons name="notifications" size={24} color="#6dff7f" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} className="z-10" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 flex-1 gap-6">
          
          {/* Hero Earnings Card (Bento Pattern) */}
          <View className="gap-4">
            
            {/* Today's Stats */}
            <View className="rounded-xl p-6 border-l-4 justify-between" style={{ backgroundColor: '#2a2a2a', borderLeftColor: '#00ff5f' }}>
              <View>
                <Text className="font-bold text-xs uppercase tracking-widest mb-1" style={{ color: '#b9ccb5' }}>Today's Earnings</Text>
                <Text className="font-extrabold text-4xl" style={{ color: '#00ff5f' }}>${earnings?.todayEarnings?.toFixed(2) || '0.00'}</Text>
              </View>
              <View className="flex-row items-center gap-4 mt-6">
                <View className="px-4 py-2 rounded-lg flex-row items-center gap-2" style={{ backgroundColor: '#353534' }}>
                  <Ionicons name="car" size={16} color="#6dff7f" />
                  <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>{earnings?.todayDeliveries || 0}</Text>
                  <Text className="font-bold text-xs" style={{ color: '#b9ccb5' }}>Drops</Text>
                </View>
                <View className="px-4 py-2 rounded-lg flex-row items-center gap-2" style={{ backgroundColor: '#353534' }}>
                  <Ionicons name="time" size={16} color="#caf300" />
                  <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>0.0</Text>
                  <Text className="font-bold text-xs" style={{ color: '#b9ccb5' }}>Hrs</Text>
                </View>
              </View>
            </View>

            {/* Current Balance / Withdraw */}
            <View className="rounded-xl p-6 flex-col justify-between shadow-lg" style={{ backgroundColor: '#00ff5f', shadowColor: '#00e554', shadowOpacity: 0.3, shadowRadius: 15 }}>
              <View>
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-xs uppercase opacity-80" style={{ color: '#007125' }}>Available Balance</Text>
                  <Ionicons name="wallet" size={24} color="#007125" />
                </View>
                <Text className="font-extrabold text-4xl mt-1" style={{ color: '#002106' }}>${earnings?.totalEarnings?.toFixed(2) || '0.00'}</Text>
                <Text className="font-bold text-xs mt-1 opacity-90" style={{ color: '#007125' }}>Next payout: Monday, Oct 23</Text>
              </View>
              <TouchableOpacity className="py-4 rounded-lg items-center justify-center mt-6 active:scale-95" style={{ backgroundColor: '#007125' }}>
                <Text className="font-bold text-base uppercase" style={{ color: '#00ff5f' }}>Withdraw Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Chart */}
          <View className="rounded-xl p-6" style={{ backgroundColor: '#1c1b1b' }}>
            <View className="flex-row justify-between items-end mb-8">
              <View>
                <Text className="font-bold text-xl" style={{ color: '#e5e2e1' }}>Weekly Performance</Text>
                <Text className="font-bold text-xs" style={{ color: '#b9ccb5' }}>Oct 16 - Oct 22</Text>
              </View>
              <View className="items-end">
                <Text className="font-bold text-xl" style={{ color: '#e5e2e1' }}>${earnings?.totalEarnings?.toFixed(2) || '0.00'}</Text>
                <Text className="font-bold text-xs" style={{ color: '#6dff7f' }}>+0.0% vs last week</Text>
              </View>
            </View>

            <View className="h-48 flex-row items-end justify-between px-2 relative">
              {/* Grid Lines */}
              <View className="absolute inset-x-0 bottom-0 top-0 flex-col justify-between pointer-events-none opacity-10 py-1">
                <View className="w-full h-[1px]" style={{ backgroundColor: '#b9ccb5' }} />
                <View className="w-full h-[1px]" style={{ backgroundColor: '#b9ccb5' }} />
                <View className="w-full h-[1px]" style={{ backgroundColor: '#b9ccb5' }} />
              </View>

              {/* Bars */}
              {[
                { label: 'M', height: '40%', active: false },
                { label: 'T', height: '65%', active: false },
                { label: 'W', height: '55%', active: false },
                { label: 'T', height: '85%', active: false },
                { label: 'F', height: '100%', active: true },
                { label: 'S', height: '30%', active: false },
                { label: 'S', height: '20%', active: false },
              ].map((day, i) => (
                <View key={i} className="flex-col items-center flex-1 gap-2 z-10 px-1">
                  <View 
                    className="w-full rounded-t-sm" 
                    style={{ height: day.height as any, backgroundColor: day.active ? '#00ff5f' : '#353534' }} 
                  />
                  <Text className="font-bold text-xs" style={{ color: day.active ? '#00ff5f' : '#b9ccb5' }}>{day.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Earnings Breakdown */}
          <View className="gap-3 mb-4">
            <Text className="font-bold text-lg pl-2" style={{ color: '#e5e2e1' }}>Breakdown</Text>
            <View className="rounded-xl overflow-hidden" style={{ backgroundColor: '#201f1f' }}>
              
              {/* Trip Pay */}
              <View className="p-5 flex-row justify-between items-center border-b border-outline-variant/30" style={{ backgroundColor: '#1c1b1b' }}>
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-lg items-center justify-center" style={{ backgroundColor: '#353534' }}>
                    <Ionicons name="map" size={24} color="#6dff7f" />
                  </View>
                  <View>
                    <Text className="font-bold text-base" style={{ color: '#e5e2e1' }}>Trip Pay</Text>
                    <Text className="text-xs" style={{ color: '#b9ccb5' }}>Base fare for 14 trips</Text>
                  </View>
                </View>
                <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>$82.00</Text>
              </View>

              {/* Incentives */}
              <View className="p-5 flex-row justify-between items-center border-b border-outline-variant/30" style={{ backgroundColor: '#1c1b1b' }}>
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-lg items-center justify-center" style={{ backgroundColor: '#353534' }}>
                    <Ionicons name="flash" size={24} color="#caf300" />
                  </View>
                  <View>
                    <Text className="font-bold text-base" style={{ color: '#e5e2e1' }}>Incentives</Text>
                    <Text className="text-xs font-bold" style={{ color: '#caf300' }}>Peak hour surge bonus</Text>
                  </View>
                </View>
                <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>$14.50</Text>
              </View>

              {/* Tips */}
              <View className="p-5 flex-row justify-between items-center" style={{ backgroundColor: '#1c1b1b' }}>
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-lg items-center justify-center" style={{ backgroundColor: '#353534' }}>
                    <Ionicons name="heart" size={24} color="#00e554" />
                  </View>
                  <View>
                    <Text className="font-bold text-base" style={{ color: '#e5e2e1' }}>Tips</Text>
                    <Text className="text-xs" style={{ color: '#b9ccb5' }}>100% of customer tips</Text>
                  </View>
                </View>
                <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>$31.90</Text>
              </View>

            </View>
          </View>

          {/* Transaction History Teaser */}
          <TouchableOpacity 
            onPress={() => router.push('/(rider)/transaction-history')}
            className="rounded-xl p-5 flex-row items-center justify-between border border-outline-variant/20 active:scale-95" 
            style={{ backgroundColor: '#1c1b1b' }}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="time" size={24} color="#b9ccb5" />
              <Text className="font-bold text-base" style={{ color: '#e5e2e1' }}>View Full History</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#b9ccb5" />
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full flex-row justify-around items-center h-20 pb-safe px-5 border-t border-outline-variant/30" style={{ backgroundColor: '#0e0e0e' }}>
        <TouchableOpacity className="flex-col items-center justify-center active:scale-90" onPress={() => router.push('/(rider)/home')}>
          <Ionicons name="car" size={24} color="#b9ccb5" />
          <Text className="font-bold text-xs mt-1" style={{ color: '#b9ccb5' }}>Deliveries</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center rounded-full px-6 py-2 active:scale-90" style={{ backgroundColor: '#00ff5f' }}>
          <Ionicons name="cash" size={24} color="#007125" />
          <Text className="font-bold text-xs mt-1" style={{ color: '#007125' }}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center active:scale-90">
          <Ionicons name="person" size={24} color="#b9ccb5" />
          <Text className="font-bold text-xs mt-1" style={{ color: '#b9ccb5' }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
