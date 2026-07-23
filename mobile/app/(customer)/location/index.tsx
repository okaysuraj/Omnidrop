import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationSelectionScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Map Section */}
      <View className="h-[45%] min-h-[350px] relative w-full overflow-hidden">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800' }} 
          className="w-full h-full absolute"
        />
        
        {/* Top Nav */}
        <View className="absolute top-4 w-full flex-row justify-between items-center px-5 z-50">
          <TouchableOpacity onPress={() => router.back()} className="bg-surface-container-lowest/80 p-2 rounded-full shadow-sm active:opacity-80">
            <MaterialIcons name="arrow-back" size={24} color="#191c1d" />
          </TouchableOpacity>
          <Text className="font-extrabold text-xl italic text-primary drop-shadow-md">OmniDrop</Text>
          <View className="w-10" />
        </View>

        {/* Pin */}
        <View className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <View className="items-center">
            <MaterialIcons name="location-on" size={48} color="#006e24" style={{ textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 6 }} />
            <View className="w-2 h-1 bg-black/30 rounded-full mt-1" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="absolute top-20 w-full px-5">
          <View className="bg-white/85 flex-row items-center px-4 py-3 rounded-xl shadow-lg border border-outline-variant/30">
            <MaterialIcons name="search" size={24} color="#006e24" />
            <TextInput 
              value={search}
              onChangeText={setSearch}
              placeholder="Search address, building..."
              className="flex-1 ml-3 text-sm text-on-surface"
              placeholderTextColor="rgba(59, 75, 57, 0.6)"
            />
            <TouchableOpacity>
              <MaterialIcons name="my-location" size={24} color="#3b4b39" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 bg-surface -mt-6 rounded-t-[32px] px-5 pt-4">
        <View className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-8" />
        
        <ScrollView className="flex-1 mb-24" showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-on-surface">Deliver here</Text>
            <Text className="text-primary font-bold uppercase tracking-wider">EDIT</Text>
          </View>

          <View className="flex-row items-start mb-10">
            <View className="bg-primary-container p-3 rounded-full mr-4">
              <MaterialIcons name="location-on" size={24} color="#005319" />
            </View>
            <View>
              <Text className="text-lg font-bold text-on-surface">329 Market Street</Text>
              <Text className="text-sm text-on-surface-variant">San Francisco, CA 94105</Text>
            </View>
          </View>

          {/* Saved Addresses */}
          <View className="flex-row justify-between mb-8 gap-4">
            <TouchableOpacity className="flex-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm active:bg-surface-container-low">
              <MaterialIcons name="home" size={24} color="#575d78" className="mb-3" />
              <Text className="font-bold text-on-surface mt-2 mb-1">Home</Text>
              <Text className="text-xs text-on-surface-variant" numberOfLines={1}>888 Brannan St...</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm active:bg-surface-container-low">
              <MaterialIcons name="work" size={24} color="#575d78" className="mb-3" />
              <Text className="font-bold text-on-surface mt-2 mb-1">Work</Text>
              <Text className="text-xs text-on-surface-variant" numberOfLines={1}>123 Industrial Rd...</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Locations */}
          <View className="mb-6">
            <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-4">Recent Locations</Text>
            
            <View className="flex-col gap-2">
              <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-surface-container-high">
                <MaterialIcons name="history" size={24} color="#6b7c68" className="mr-4" />
                <View className="flex-1 border-b border-outline-variant/10 pb-2">
                  <Text className="text-base text-on-surface font-medium">Coffee & Cream</Text>
                  <Text className="text-sm text-on-surface-variant">452 Valencia St, Mission District</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-surface-container-high">
                <MaterialIcons name="history" size={24} color="#6b7c68" className="mr-4" />
                <View className="flex-1 border-b border-outline-variant/10 pb-2">
                  <Text className="text-base text-on-surface font-medium">City Gym North</Text>
                  <Text className="text-sm text-on-surface-variant">720 Post Street, Lower Nob Hill</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add New Section */}
          <TouchableOpacity className="flex-row items-center mt-4 p-2 active:opacity-70">
            <MaterialIcons name="add" size={24} color="#006e24" className="mr-2" />
            <Text className="text-primary font-bold text-xs">ADD NEW SAVED PLACE</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Sticky Confirm Button */}
      <View className="absolute bottom-0 w-full px-5 pb-8 pt-10 z-50">
        <TouchableOpacity onPress={() => router.back()} className="w-full bg-primary-container py-4 rounded-xl shadow-lg flex-row items-center justify-center gap-3 active:opacity-90">
          <Text className="text-on-primary-container text-lg font-bold">Confirm Location</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#002106" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
