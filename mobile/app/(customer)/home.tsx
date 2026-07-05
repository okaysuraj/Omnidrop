import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/providers/auth-provider';

export default function CustomerHome() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadStores = async () => {
      try {
        // Hardcoded location for demo
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

  const renderStore = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700 flex-row">
      <View className="w-16 h-16 bg-slate-700 rounded-xl items-center justify-center mr-4">
        <Text className="text-2xl">🏪</Text>
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-white font-bold text-lg">{item.name}</Text>
        <Text className="text-slate-400 text-sm mt-1">{item.distance.toFixed(1)} km away • {item.rating} ⭐</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-900 px-4 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-slate-400 text-sm font-semibold">Delivering to</Text>
          <Text className="text-white font-bold text-lg">Current Location 📍</Text>
        </View>
        <TouchableOpacity onPress={logout} className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          <Text className="text-slate-300 font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-white font-extrabold text-2xl mb-4">Nearby Stores</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" className="mt-10" />
      ) : stores.length === 0 ? (
        <View className="items-center justify-center flex-1 pb-20">
          <Text className="text-4xl mb-2">😢</Text>
          <Text className="text-slate-300 font-bold text-lg">No stores nearby</Text>
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          renderItem={renderStore}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
