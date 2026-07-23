import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ backgroundColor: '#131313' }}>
      
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-background z-50 sticky top-0" style={{ backgroundColor: '#131313' }}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:scale-95" style={{ backgroundColor: '#2a2a2a' }}>
            <Ionicons name="arrow-back" size={24} color="#6dff7f" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' }}
              className="w-full h-full"
            />
          </View>
          <Text className="font-extrabold text-xl tracking-tight" style={{ color: '#6dff7f' }}>OmniDrop</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full active:scale-95" style={{ backgroundColor: '#353534' }}>
          <Ionicons name="notifications" size={24} color="#6dff7f" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} className="z-10" showsVerticalScrollIndicator={false}>
        
        {/* Earnings Header */}
        <View className="px-5 pt-6 pb-4">
          <Text className="font-bold text-xs uppercase tracking-widest mb-1" style={{ color: '#b9ccb5' }}>Total Balance</Text>
          <View className="flex-row items-end gap-2">
            <Text className="font-extrabold text-3xl" style={{ color: '#6dff7f' }}>$2,482.50</Text>
            <Text className="font-bold mb-1" style={{ color: '#00ff5f' }}>+12% this week</Text>
          </View>
        </View>

        {/* Filters Section */}
        <View className="px-5 mb-2 border-b border-outline-variant/30" style={{ borderColor: '#3b4b39' }}>
          <View className="flex-row gap-6 pb-2">
            <TouchableOpacity onPress={() => setActiveTab('all')} className="relative">
              <Text className="font-bold text-lg" style={{ color: activeTab === 'all' ? '#6dff7f' : '#b9ccb5' }}>All</Text>
              {activeTab === 'all' && <View className="absolute -bottom-2 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: '#00ff5f' }} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('income')} className="relative">
              <Text className="font-bold text-lg" style={{ color: activeTab === 'income' ? '#6dff7f' : '#b9ccb5' }}>Income</Text>
              {activeTab === 'income' && <View className="absolute -bottom-2 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: '#00ff5f' }} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('withdrawals')} className="relative">
              <Text className="font-bold text-lg" style={{ color: activeTab === 'withdrawals' ? '#6dff7f' : '#b9ccb5' }}>Withdrawals</Text>
              {activeTab === 'withdrawals' && <View className="absolute -bottom-2 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: '#00ff5f' }} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction List */}
        <View className="px-5 mt-4 gap-4">
          
          {/* Transaction Item: Delivery */}
          {(activeTab === 'all' || activeTab === 'income') && (
            <TouchableOpacity onPress={() => toggleDetails('job-8821')} className="rounded-lg p-4 border-l-4 active:scale-95" style={{ backgroundColor: '#1c1b1b', borderLeftColor: '#00ff5f' }}>
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="font-bold text-xs uppercase mb-1" style={{ color: '#b9ccb5' }}>Today, 2:45 PM</Text>
                  <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>Delivery #8821-XP</Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-lg" style={{ color: '#6dff7f' }}>+$18.25</Text>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded mt-1" style={{ backgroundColor: 'rgba(0, 255, 95, 0.1)' }}>
                    <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00ff5f' }} />
                    <Text className="font-bold text-[10px] uppercase" style={{ color: '#00ff5f' }}>Completed</Text>
                  </View>
                </View>
              </View>

              {expandedId === 'job-8821' && (
                <View className="mt-4 pt-4 border-t border-outline-variant/30 gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm" style={{ color: '#b9ccb5' }}>Base Fare</Text>
                    <Text className="text-sm" style={{ color: '#e5e2e1' }}>$12.00</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm" style={{ color: '#b9ccb5' }}>Distance Bonus (4.2mi)</Text>
                    <Text className="text-sm" style={{ color: '#e5e2e1' }}>$3.50</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm" style={{ color: '#b9ccb5' }}>Rider Tip</Text>
                    <Text className="text-sm font-bold" style={{ color: '#caf300' }}>$2.75</Text>
                  </View>
                  <View className="p-3 rounded mt-2" style={{ backgroundColor: '#353534' }}>
                    <Text className="text-xs italic" style={{ color: '#b9ccb5' }}>"Fast delivery, food was still steaming. Thanks!"</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Transaction Item: Withdrawal */}
          {(activeTab === 'all' || activeTab === 'withdrawals') && (
            <TouchableOpacity onPress={() => toggleDetails('wd-992')} className="rounded-lg p-4 border-l-4 active:scale-95" style={{ backgroundColor: '#1c1b1b', borderLeftColor: '#caf300' }}>
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-bold text-xs uppercase mb-1" style={{ color: '#b9ccb5' }}>Yesterday, 11:15 AM</Text>
                  <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>Instant Payout</Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-lg" style={{ color: '#caf300' }}>-$120.00</Text>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded mt-1" style={{ backgroundColor: 'rgba(202, 243, 0, 0.1)' }}>
                    <Ionicons name="checkmark-circle" size={12} color="#caf300" />
                    <Text className="font-bold text-[10px] uppercase" style={{ color: '#caf300' }}>Success</Text>
                  </View>
                </View>
              </View>

              {expandedId === 'wd-992' && (
                <View className="mt-4 pt-4 border-t border-outline-variant/30 gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm" style={{ color: '#b9ccb5' }}>Method</Text>
                    <Text className="text-sm" style={{ color: '#e5e2e1' }}>Visa Debit ****4291</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm" style={{ color: '#b9ccb5' }}>Reference</Text>
                    <Text className="text-sm font-bold" style={{ color: '#e5e2e1' }}>TXN-00928812</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Transaction Item: Processing */}
          {(activeTab === 'all' || activeTab === 'income') && (
            <View className="rounded-lg p-4 border-l-4" style={{ backgroundColor: '#1c1b1b', borderLeftColor: '#849581' }}>
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-bold text-xs uppercase mb-1" style={{ color: '#b9ccb5' }}>Oct 24, 08:12 PM</Text>
                  <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>Delivery #8819-QL</Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-lg" style={{ color: '#b9ccb5' }}>+$14.50</Text>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded mt-1" style={{ backgroundColor: '#353534' }}>
                    <Text className="font-bold text-[10px] uppercase" style={{ color: '#b9ccb5' }}>Processing</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Transaction Item: Delivery */}
          {(activeTab === 'all' || activeTab === 'income') && (
            <View className="rounded-lg p-4 border-l-4" style={{ backgroundColor: '#1c1b1b', borderLeftColor: '#00ff5f' }}>
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-bold text-xs uppercase mb-1" style={{ color: '#b9ccb5' }}>Oct 23, 10:30 PM</Text>
                  <Text className="font-bold text-lg" style={{ color: '#e5e2e1' }}>Delivery #8812-TR</Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-lg" style={{ color: '#6dff7f' }}>+$24.00</Text>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded mt-1" style={{ backgroundColor: 'rgba(0, 255, 95, 0.1)' }}>
                    <Text className="font-bold text-[10px] uppercase" style={{ color: '#00ff5f' }}>Completed</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

        </View>

        {/* Load More Simulation */}
        <View className="px-5 mt-8">
          <TouchableOpacity className="w-full py-4 border-2 rounded-lg items-center active:scale-95" style={{ borderColor: '#00ff5f' }}>
            <Text className="font-bold text-base uppercase tracking-widest" style={{ color: '#00ff5f' }}>Load History</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full flex-row justify-around items-center h-20 pb-safe px-5 border-t border-outline-variant/30" style={{ backgroundColor: '#0e0e0e' }}>
        <TouchableOpacity className="flex-col items-center justify-center active:scale-90">
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
