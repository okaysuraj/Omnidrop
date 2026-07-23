import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* TopAppBar */}
      <View className="w-full flex-row items-center justify-between px-5 py-4 z-50 bg-background">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="active:scale-95 transition-transform">
            <Ionicons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text className="font-bold text-xl text-on-background">Account</Text>
        </View>
        <TouchableOpacity className="active:opacity-80 transition-opacity">
          <Ionicons name="ellipsis-vertical" size={24} color="#3b4b39" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Profile Section */}
        <View className="py-10 flex-col items-center">
          <View className="relative">
            <View className="w-24 h-24 rounded-full p-1 bg-primary-container">
              <View className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-surface-container-high">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
                  className="w-full h-full"
                />
              </View>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center shadow-lg active:scale-90">
              <Ionicons name="pencil" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View className="mt-4 items-center">
            <Text className="font-bold text-2xl text-on-background">Alex Rivers</Text>
            <Text className="text-sm text-on-surface-variant mt-1">alex.rivers@omnidrop.com</Text>
          </View>
        </View>

        {/* Bento Grid Navigation */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {/* My Orders */}
          <TouchableOpacity 
            onPress={() => router.push('/(customer)/orders')}
            className="w-full bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex-row items-center justify-between active:scale-95"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-lg bg-primary-container items-center justify-center">
                <Ionicons name="cube" size={24} color="#007125" />
              </View>
              <View>
                <Text className="font-bold text-xl text-on-surface">My Orders</Text>
                <Text className="text-xs text-primary font-bold">2 Active Deliveries</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#3b4b39" />
          </TouchableOpacity>

          {/* Saved Addresses */}
          <TouchableOpacity 
            onPress={() => router.push('/(customer)/addresses')}
            className="w-[48%] bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex-col justify-between aspect-square active:scale-95"
          >
            <View className="w-10 h-10 rounded-lg bg-secondary-container items-center justify-center mb-2">
              <Ionicons name="location" size={20} color="#5b617d" />
            </View>
            <View>
              <Text className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1">Addresses</Text>
              <Text className="font-bold text-xl text-on-surface leading-tight">Saved Places</Text>
            </View>
          </TouchableOpacity>

          {/* Payment Methods */}
          <TouchableOpacity 
            onPress={() => router.push('/(customer)/wallet')}
            className="w-[48%] bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex-col justify-between aspect-square active:scale-95"
          >
            <View className="w-10 h-10 rounded-lg bg-tertiary-container items-center justify-center mb-2">
              <Ionicons name="card" size={20} color="#ac3b00" />
            </View>
            <View>
              <Text className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1">Payments</Text>
              <Text className="font-bold text-xl text-on-surface leading-tight">Wallet & Cards</Text>
            </View>
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity className="w-full bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex-row items-center justify-between active:scale-95">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-lg bg-surface-container-high items-center justify-center">
                <Ionicons name="globe-outline" size={20} color="#191c1d" />
              </View>
              <Text className="font-bold text-lg text-on-surface">Language</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-on-surface-variant">English (US)</Text>
              <Ionicons name="chevron-down" size={20} color="#3b4b39" />
            </View>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity className="w-full bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex-row items-center justify-between active:scale-95">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-lg bg-surface-container-high items-center justify-center">
                <Ionicons name="settings-outline" size={20} color="#191c1d" />
              </View>
              <Text className="font-bold text-lg text-on-surface">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#3b4b39" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="mt-10">
          <TouchableOpacity className="w-full py-4 px-4 rounded-xl border-2 border-error/20 flex-row items-center justify-center gap-2 active:bg-error/5">
            <Ionicons name="log-out-outline" size={20} color="#ba1a1a" />
            <Text className="text-error font-bold text-xl">Logout</Text>
          </TouchableOpacity>
          <Text className="mt-6 text-center text-xs text-on-surface-variant opacity-50 font-medium">OmniDrop v2.4.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
