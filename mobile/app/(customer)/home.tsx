import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/providers/auth-provider';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerHome() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await api.stores.nearby(28.7041, 77.1025);
        setStores(data?.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStores();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Top Navigation Bar */}
      <View className="flex-row items-center justify-between px-5 h-16 bg-surface shadow-sm border-b border-surface-variant">
        <View className="flex-row items-center flex-1 mr-4">
          <MaterialIcons name="bolt" size={24} color="#006e24" />
          <View className="ml-2 flex-1">
            <Text className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Deliver to Home</Text>
            <Text className="text-[14px] text-on-surface" numberOfLines={1}>1248 Oakwood Avenue, Downtown Core</Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => router.push('/(customer)/search')} className="p-2 rounded-full active:bg-surface-container-high">
            <MaterialIcons name="search" size={24} color="#3b4b39" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(customer)/cart')} className="p-2 rounded-full active:bg-surface-container-high relative">
            <MaterialIcons name="shopping-cart" size={24} color="#006e24" />
            <View className="absolute top-1 right-1 bg-primary h-4 w-4 rounded-full items-center justify-center border border-surface">
              <Text className="text-white text-[10px] font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Promo Slider */}
        <TouchableOpacity className="w-full h-48 rounded-xl overflow-hidden mb-8 relative active:opacity-95">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }} 
            className="w-full h-full absolute"
          />
          <View className="absolute inset-0 bg-black/40 p-6 justify-center">
            <View className="bg-primary-container px-3 py-1 rounded-full self-start mb-2">
              <Text className="text-on-primary-container text-xs font-bold">LIMITED OFFER</Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-3 w-2/3">50% OFF on Fresh Grocery</Text>
            <View className="bg-primary-container py-2 px-4 rounded-xl self-start">
              <Text className="text-on-primary-container font-bold">Order Now</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Explore Categories */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-on-surface">Explore Categories</Text>
            <Text className="text-primary font-bold">View All</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between gap-y-3">
            <TouchableOpacity onPress={() => router.push('/(customer)/products')} className="w-[48%] h-32 bg-primary-container/20 rounded-xl p-4 border border-primary/10 justify-between">
              <View>
                <Text className="text-on-primary-container text-lg font-bold">Grocery</Text>
                <Text className="text-on-surface-variant text-xs">Daily Essentials</Text>
              </View>
              <View className="items-end">
                <MaterialIcons name="local-grocery-store" size={32} color="#006e24" />
              </View>
            </TouchableOpacity>

            <View className="w-[48%] flex-col justify-between h-32">
              <TouchableOpacity className="h-[48%] w-full bg-secondary-container/20 rounded-xl flex-row items-center justify-center border border-secondary/10">
                <MaterialIcons name="medical-services" size={20} color="#575d78" />
                <Text className="text-on-secondary-container font-bold ml-2">Pharmacy</Text>
              </TouchableOpacity>
              <TouchableOpacity className="h-[48%] w-full bg-tertiary-container/20 rounded-xl flex-row items-center justify-center border border-tertiary/10">
                <MaterialIcons name="restaurant" size={20} color="#a73a00" />
                <Text className="text-on-tertiary-container font-bold ml-2">Meat</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full h-16 bg-surface-container-high rounded-xl p-4 border border-surface-container flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons name="eco" size={28} color="#006e24" />
                <View className="ml-3">
                  <Text className="font-bold text-on-surface">Fresh Fruits</Text>
                  <Text className="text-xs text-on-surface-variant">Seasonal picks</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#3b4b39" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Fastest Delivery */}
        <View className="mb-10 -mx-5">
          <View className="px-5 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-on-surface mr-2">Fastest Delivery</Text>
              <View className="w-2 h-2 rounded-full bg-primary-container" />
            </View>
            <Text className="text-primary font-bold">See More</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5 pb-2">
            {[1, 2, 3].map((item, idx) => (
              <TouchableOpacity key={idx} onPress={() => router.push('/(customer)/stores/1')} className="w-64 bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/50 mr-4">
                <View className="h-32 relative">
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400' }} className="w-full h-full" />
                  <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg flex-row items-center">
                    <MaterialIcons name="timer" size={14} color="#006e24" />
                    <Text className="text-[11px] font-bold ml-1">12 MIN</Text>
                  </View>
                </View>
                <View className="p-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-bold text-on-surface">Artisan Gourmet Deli</Text>
                    <View className="flex-row items-center">
                      <MaterialIcons name="star" size={12} color="#a73a00" />
                      <Text className="font-bold text-on-surface-variant ml-1 text-xs">4.8</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-on-surface-variant">Sandwiches • Salads • $2.99 Del</Text>
                </View>
              </TouchableOpacity>
            ))}
            <View className="w-5" />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
