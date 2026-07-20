import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PickupNavigationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleArrive = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/(rider)/handover');
    }, 1500);
  };

  return (
    <View className="flex-1 bg-surface-dim relative">
      {/* Background Map Simulation */}
      <View className="absolute inset-0 z-0">
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
          className="flex-1 opacity-60 grayscale"
        />
        <LinearGradient
          colors={['rgba(19, 19, 19, 0.8)', 'rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0.9)']}
          locations={[0, 0.2, 0.7, 1]}
          className="absolute inset-0"
        />
        
        {/* Animated Vehicle Marker */}
        <View className="absolute top-1/2 left-1/2 -translate-x-4 -translate-y-4 z-10 items-center justify-center">
          <View className="absolute w-12 h-12 bg-primary-container rounded-full opacity-20" />
          <View className="relative w-8 h-8 bg-primary-container rounded-full border-4 shadow-lg items-center justify-center" style={{ borderColor: '#002106', backgroundColor: '#00ff5f' }}>
            <Ionicons name="navigate" size={16} color="#002106" />
          </View>
        </View>
      </View>

      <SafeAreaView className="flex-1 justify-between pointer-events-box-none">
        {/* Top Navigation Header */}
        <View className="px-5 pt-4 z-50">
          <View className="rounded-xl p-4 shadow-2xl flex-row items-center gap-4" style={{ backgroundColor: '#2a2a2a', borderLeftWidth: 8, borderLeftColor: '#00ff5f' }}>
            <View className="w-16 h-16 rounded-lg items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00ff5f' }}>
              <Ionicons name="arrow-undo" size={32} color="#002106" style={{ transform: [{ scaleX: -1 }] }} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-xs uppercase tracking-widest" style={{ color: '#b9ccb5' }}>Next Turn</Text>
              <Text className="font-bold text-2xl leading-tight" style={{ color: '#6dff7f' }}>Turn Left in 200m</Text>
              <Text className="text-base" style={{ color: '#e5e2e1' }}>onto Main Street</Text>
            </View>
          </View>
        </View>

        {/* Side Action Buttons */}
        <View className="absolute right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
          <TouchableOpacity className="w-14 h-14 rounded-full border-2 border-outline-variant/30 items-center justify-center shadow-lg active:scale-90" style={{ backgroundColor: '#2a2a2a' }}>
            <Ionicons name="call" size={24} color="#caf300" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 rounded-full border-2 border-outline-variant/30 items-center justify-center shadow-lg active:scale-90" style={{ backgroundColor: '#2a2a2a' }}>
            <Ionicons name="warning" size={24} color="#ffb4ab" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 rounded-full border-2 border-outline-variant/30 items-center justify-center shadow-lg active:scale-90" style={{ backgroundColor: '#2a2a2a' }}>
            <Ionicons name="locate" size={24} color="#e5e2e1" />
          </TouchableOpacity>
        </View>

        {/* Overlay HUD Elements */}
        <View className="absolute top-36 right-5 z-40 rounded-lg p-3 border border-outline-variant/50" style={{ backgroundColor: 'rgba(14, 14, 14, 0.8)' }}>
          <View className="items-center">
            <Text className="font-bold text-xs mb-1" style={{ color: '#b9ccb5' }}>MPH</Text>
            <Text className="font-bold text-2xl leading-none" style={{ color: '#e5e2e1' }}>24</Text>
          </View>
        </View>

        {/* Bottom Store Info & Action Card */}
        <View className="w-full pb-8 z-50">
          <View className="rounded-t-3xl p-6 shadow-2xl border-t border-outline-variant/30 relative" style={{ backgroundColor: '#1c1b1b' }}>
            {/* Progress Bar Simulation */}
            <View className="absolute top-0 left-0 h-1" style={{ width: '40%', backgroundColor: '#00ff5f' }} />
            
            {/* Handle bar */}
            <View className="w-12 h-1.5 rounded-full mx-auto mb-6" style={{ backgroundColor: '#3b4b39' }} />
            
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-bold text-2xl mb-1" style={{ color: '#e5e2e1' }}>Burger Theory HQ</Text>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="star" size={14} color="#6dff7f" />
                  <Text className="text-sm font-bold" style={{ color: '#b9ccb5' }}>4.9 • 800m away</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="font-extrabold text-3xl leading-none" style={{ color: '#00ff5f' }}>4 min</Text>
                <Text className="font-bold text-xs uppercase tracking-tighter" style={{ color: '#b9ccb5' }}>ETA 12:44 PM</Text>
              </View>
            </View>

            {/* Delivery Specs Chips */}
            <View className="flex-row gap-2 mb-8 flex-wrap">
              <View className="px-4 py-2 border rounded-full flex-row items-center gap-2" style={{ backgroundColor: '#2a2a2a', borderColor: '#3b4b39' }}>
                <Ionicons name="bag-handle" size={16} color="#e5e2e1" />
                <Text className="font-bold text-xs" style={{ color: '#e5e2e1' }}>2 Items</Text>
              </View>
              <View className="px-4 py-2 border rounded-full flex-row items-center gap-2" style={{ backgroundColor: '#2a2a2a', borderColor: '#caf300' }}>
                <Ionicons name="alert-circle" size={16} color="#caf300" />
                <Text className="font-bold text-xs" style={{ color: '#caf300' }}>Fragile</Text>
              </View>
              <View className="px-4 py-2 border rounded-full flex-row items-center gap-2" style={{ backgroundColor: '#2a2a2a', borderColor: '#3b4b39' }}>
                <Ionicons name="card" size={16} color="#e5e2e1" />
                <Text className="font-bold text-xs" style={{ color: '#e5e2e1' }}>Paid</Text>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity 
              onPress={handleArrive}
              disabled={loading}
              className="w-full h-16 rounded-xl flex-row items-center justify-center gap-3 shadow-xl active:scale-95"
              style={{ backgroundColor: '#00ff5f' }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#002106" />
              <Text className="font-bold text-lg" style={{ color: '#002106' }}>{loading ? 'Processing...' : 'ARRIVED AT STORE'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
