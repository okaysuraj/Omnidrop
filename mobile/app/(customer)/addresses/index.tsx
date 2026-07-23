import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SavedAddressesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-surface-container bg-background z-40">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="active:scale-95 transition-transform">
            <Ionicons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text className="font-bold text-xl text-primary">Saved Addresses</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/(customer)/profile')}
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:opacity-80"
        >
          <Ionicons name="person" size={20} color="#3b4b39" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6 pb-32" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Section Header */}
        <View className="mb-8">
          <Text className="font-extrabold text-2xl text-on-background mb-2">Saved Addresses</Text>
          <Text className="text-base text-on-surface-variant opacity-80">Quickly select your delivery destination</Text>
        </View>

        {/* Address List */}
        <View className="gap-4">
          {/* Home Address */}
          <TouchableOpacity className="bg-surface-container-lowest rounded-xl p-4 flex-row items-start gap-4 border border-outline-variant/10 shadow-sm active:opacity-80">
            <View className="w-12 h-12 rounded-lg bg-primary-container items-center justify-center flex-shrink-0">
              <Ionicons name="home" size={24} color="#007125" />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-xs text-primary uppercase tracking-wider">Home</Text>
                <TouchableOpacity className="p-1">
                  <Ionicons name="pencil" size={16} color="#3b4b39" />
                </TouchableOpacity>
              </View>
              <Text className="font-bold text-xl text-on-surface mt-1">1248 Oakwood Avenue</Text>
              <Text className="text-sm text-on-surface-variant mt-1">Los Angeles, CA 90024</Text>
            </View>
          </TouchableOpacity>

          {/* Work Address */}
          <TouchableOpacity className="bg-surface-container-lowest rounded-xl p-4 flex-row items-start gap-4 border border-outline-variant/10 shadow-sm active:opacity-80">
            <View className="w-12 h-12 rounded-lg bg-secondary-container items-center justify-center flex-shrink-0">
              <Ionicons name="briefcase" size={24} color="#5b617d" />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-xs text-secondary uppercase tracking-wider">Work</Text>
                <TouchableOpacity className="p-1">
                  <Ionicons name="pencil" size={16} color="#3b4b39" />
                </TouchableOpacity>
              </View>
              <Text className="font-bold text-xl text-on-surface mt-1">Tech Park Plaza, Ste 402</Text>
              <Text className="text-sm text-on-surface-variant mt-1">Santa Monica, CA 90401</Text>
            </View>
          </TouchableOpacity>

          {/* Other Address */}
          <TouchableOpacity className="bg-surface-container-lowest rounded-xl p-4 flex-row items-start gap-4 border border-outline-variant/10 shadow-sm active:opacity-80">
            <View className="w-12 h-12 rounded-lg bg-tertiary-container items-center justify-center flex-shrink-0">
              <Ionicons name="location" size={24} color="#ac3b00" />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-xs text-tertiary uppercase tracking-wider">Other (Gym)</Text>
                <TouchableOpacity className="p-1">
                  <Ionicons name="pencil" size={16} color="#3b4b39" />
                </TouchableOpacity>
              </View>
              <Text className="font-bold text-xl text-on-surface mt-1">77 Sunset Blvd</Text>
              <Text className="text-sm text-on-surface-variant mt-1">West Hollywood, CA 90046</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Decorative Map Section */}
        <View className="mt-8 rounded-2xl overflow-hidden h-48 relative border border-surface-container-high shadow-sm">
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
            className="flex-1"
          >
            <View className="absolute inset-0 bg-background/40" />
            <View className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-full flex-row items-center gap-2 shadow-sm">
              <View className="w-2 h-2 rounded-full bg-primary-fixed-dim" />
              <Text className="font-medium text-xs text-on-surface">3 Locations Saved</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>

      {/* Bottom Navigation Component (Action Shell) */}
      <View className="absolute bottom-0 w-full px-5 py-6 bg-surface shadow-lg border-t border-surface-variant/20">
        <TouchableOpacity className="flex-row items-center justify-center bg-primary rounded-full w-full py-4 gap-4 active:scale-95 shadow-md">
          <Text className="font-bold text-sm uppercase tracking-widest text-on-primary">Add New Address</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
