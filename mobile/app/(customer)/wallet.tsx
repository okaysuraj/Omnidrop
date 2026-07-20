import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-5 h-16 shadow-sm border-b border-surface-container bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:opacity-70">
            <Ionicons name="menu" size={24} color="#3b4b39" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full overflow-hidden bg-secondary-container shadow-sm">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
              className="w-full h-full"
            />
          </View>
        </View>
        <TouchableOpacity className="p-2 -mr-2 rounded-full active:opacity-70 relative">
          <Ionicons name="notifications" size={24} color="#006e24" />
          <View className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center justify-between mb-8">
          <Text className="font-bold text-2xl text-on-background">Omni Wallet</Text>
        </View>

        {/* Balance Card */}
        <View className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 mb-4 overflow-hidden relative">
          <View className="z-10">
            <Text className="text-base text-on-surface-variant mb-2">Available Balance</Text>
            <Text className="font-extrabold text-4xl text-primary-container tracking-tight" style={{ color: '#006e24' }}>$1,240.50</Text>
            <View className="mt-2 flex-row">
              <View className="px-3 py-1 rounded-full bg-secondary-container">
                <Text className="text-on-secondary-container font-bold text-xs">+$45.00 this week</Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row gap-4 mt-8 z-10">
            <TouchableOpacity className="flex-1 bg-primary-container py-3 px-4 rounded-xl shadow-md active:scale-95 flex-row justify-center items-center gap-2">
              <Ionicons name="add-circle" size={20} color="#002106" />
              <Text className="text-on-primary-fixed font-bold text-sm">Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-surface-container-high py-3 px-4 rounded-xl active:scale-95 flex-row justify-center items-center gap-2 border border-surface-variant">
              <Ionicons name="business" size={20} color="#191c1d" />
              <Text className="text-on-surface font-bold text-sm">To Bank</Text>
            </TouchableOpacity>
          </View>
          
          {/* Decorative Background */}
          <LinearGradient
            colors={['rgba(0,229,84,0.1)', 'transparent']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            className="absolute inset-0 z-0"
          />
        </View>

        {/* Rewards/Secondary Info Tile */}
        <View className="bg-on-background rounded-2xl p-6 shadow-lg mb-8 relative overflow-hidden">
          <View className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-container rounded-full opacity-20" />
          <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="star" size={24} color="#00ff5f" />
          </View>
          <Text className="font-bold text-xl mb-1 text-white">Omni Rewards</Text>
          <Text className="text-sm text-surface-dim mb-6">You have 240 points available to redeem.</Text>
          
          <TouchableOpacity className="w-full py-2 rounded-lg border border-surface-dim/30 flex-row items-center justify-center gap-2 active:bg-surface-dim/10">
            <Text className="font-bold text-xs text-white">Redeem Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View className="mb-8">
          <Text className="font-bold text-xl text-on-background mb-4">Quick Links</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            <TouchableOpacity className="w-[48%] bg-surface-container-lowest rounded-xl p-4 shadow-sm items-center justify-center gap-3 active:scale-95 border border-transparent">
              <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
                <Ionicons name="phone-portrait" size={24} color="#5b617d" />
              </View>
              <Text className="font-medium text-xs text-on-surface">Recharge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="w-[48%] bg-surface-container-lowest rounded-xl p-4 shadow-sm items-center justify-center gap-3 active:scale-95 border border-transparent">
              <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
                <Ionicons name="gift" size={24} color="#5b617d" />
              </View>
              <Text className="font-medium text-xs text-on-surface">Vouchers</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[48%] bg-surface-container-lowest rounded-xl p-4 shadow-sm items-center justify-center gap-3 active:scale-95 border border-transparent">
              <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
                <Ionicons name="receipt" size={24} color="#5b617d" />
              </View>
              <Text className="font-medium text-xs text-on-surface">Pay Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[48%] bg-surface-container-lowest rounded-xl p-4 shadow-sm items-center justify-center gap-3 active:scale-95 border border-transparent">
              <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
                <Ionicons name="time" size={24} color="#5b617d" />
              </View>
              <Text className="font-medium text-xs text-on-surface">History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="flex-1 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-xl text-on-background">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="font-bold text-xs text-primary">View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-surface-variant active:bg-surface-container-low">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-error-container items-center justify-center">
                  <Ionicons name="restaurant" size={20} color="#93000a" />
                </View>
                <View>
                  <Text className="text-base text-on-surface font-medium">Food Delivery</Text>
                  <Text className="text-sm text-on-surface-variant">Today, 1:45 PM</Text>
                </View>
              </View>
              <Text className="text-base text-on-surface font-bold">-$24.50</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-surface-container-low">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-primary-container/30 items-center justify-center">
                  <Ionicons name="business" size={20} color="#006e24" />
                </View>
                <View>
                  <Text className="text-base text-on-surface font-medium">Top Up</Text>
                  <Text className="text-sm text-on-surface-variant">Yesterday, 9:00 AM</Text>
                </View>
              </View>
              <Text className="text-base text-primary font-bold">+$100.00</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
