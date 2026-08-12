import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/lib/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const storeData = await api.stores.byId(id as string);
        setStore(storeData);
        const productsData = await api.products.search(''); // Load generic products for now
        setProducts(productsData || []);
      } catch (err) {
        console.error('Failed to load store details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStoreDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#00e554" />
      </View>
    );
  }

  if (!store) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-on-surface">Store not found.</Text>
      </View>
    );
  }

  const seasonalProducts = products.filter(p => p.category === 'Seasonal Harvest');
  const bakeryProducts = products.filter(p => p.category === 'Fresh Bakery');

  return (
    <View className="flex-1 bg-background">
      {/* Top AppBar */}
      <View className="absolute top-0 w-full z-50 bg-surface shadow-sm flex-row justify-between items-center px-5 h-20 pt-8">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <MaterialIcons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text className="text-xl italic font-black text-primary">OmniDrop</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="p-2">
            <MaterialIcons name="bolt" size={24} color="#006e24" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(customer)/cart')} className="p-2 relative">
            <MaterialIcons name="shopping-cart" size={24} color="#006e24" />
            {cartCount > 0 && (
              <View className="absolute top-0 right-0 bg-error w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 mt-20" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="h-64 w-full relative">
          <Image source={{ uri: store?.image }} className="w-full h-full absolute" />
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute bottom-6 left-5 z-20">
            <View className="bg-primary px-2 py-1 rounded-lg self-start mb-2">
              <Text className="text-on-primary text-[10px] font-bold">PREMIUM</Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-1">{store?.name}</Text>
            <Text className="text-white/90 text-sm">Hyper-local • Artisanal • Zero Waste</Text>
          </View>
        </View>

        {/* Store Info Section */}
        <View className="px-5 py-4 bg-surface-container-lowest">
          <View className="flex-row justify-between items-center bg-white p-4 rounded-xl border border-outline-variant/20 shadow-sm">
            <View className="items-center flex-1 border-r border-outline-variant/30">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={16} color="#006e24" />
                <Text className="font-bold ml-1">{store?.rating}</Text>
              </View>
              <Text className="text-[10px] text-on-surface-variant mt-1">{store?.reviews}+ Reviews</Text>
            </View>
            <View className="items-center flex-1 border-r border-outline-variant/30">
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={16} color="#006e24" />
                <Text className="font-bold ml-1">{store?.deliveryTime}</Text>
              </View>
              <Text className="text-[10px] text-on-surface-variant mt-1">Delivery Time</Text>
            </View>
            <View className="items-center flex-1">
              <View className="flex-row items-center">
                <MaterialIcons name="delivery-dining" size={16} color="#006e24" />
                <Text className="font-bold ml-1">FREE</Text>
              </View>
              <Text className="text-[10px] text-on-surface-variant mt-1">On orders over $20</Text>
            </View>
          </View>
        </View>

        {/* Tabbed Navigation */}
        <View className="bg-surface px-5 border-b border-outline-variant/20">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <View className="py-4 border-b-2 border-primary mr-8">
              <Text className="font-bold text-primary">Menu</Text>
            </View>
            <TouchableOpacity className="py-4 mr-8">
              <Text className="font-bold text-on-surface-variant">Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-4 mr-8">
              <Text className="font-bold text-on-surface-variant">Store Info</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-4 mr-8">
              <Text className="font-bold text-on-surface-variant">Offers</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Product List */}
        <View className="px-5 pt-4 pb-32">
          {/* Category: Seasonal Harvest */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <View className="border-l-4 border-primary pl-2">
                <Text className="text-lg font-bold text-on-surface">Seasonal Harvest</Text>
              </View>
              <Text className="text-xs text-on-surface-variant">{seasonalProducts.length} Items</Text>
            </View>
            
            <View className="flex-col space-y-4 gap-y-4">
              {seasonalProducts.map(product => (
                <View key={product.id} className="bg-surface-container-lowest rounded-xl p-4 flex-row shadow-sm border border-outline-variant/10">
                  <Image source={{ uri: product.image }} className="w-24 h-24 rounded-lg bg-surface-container" />
                  <View className="flex-1 ml-4 justify-between">
                    <View>
                      <Text className="font-bold text-on-surface text-base" numberOfLines={1}>{product.name}</Text>
                      <Text className="text-xs text-on-surface-variant mt-1" numberOfLines={2}>{product.desc}</Text>
                    </View>
                    <View className="flex-row justify-between items-end mt-2">
                      <Text className="text-lg font-bold text-primary">${product.price}</Text>
                      <TouchableOpacity onPress={() => setCartCount(c => c + 1)} className="bg-primary-container w-10 h-10 rounded-full items-center justify-center">
                        <MaterialIcons name="add" size={24} color="#005319" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Category: Fresh Bakery */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <View className="border-l-4 border-primary pl-2">
                <Text className="text-lg font-bold text-on-surface">Fresh Bakery</Text>
              </View>
              <Text className="text-xs text-on-surface-variant">{bakeryProducts.length} Items</Text>
            </View>
            
            <View className="flex-col space-y-4 gap-y-4">
              {bakeryProducts.map(product => (
                <View key={product.id} className="bg-surface-container-lowest rounded-xl p-4 flex-row shadow-sm border border-outline-variant/10">
                  <Image source={{ uri: product.image }} className="w-24 h-24 rounded-lg bg-surface-container" />
                  <View className="flex-1 ml-4 justify-between">
                    <View>
                      <Text className="font-bold text-on-surface text-base" numberOfLines={1}>{product.name}</Text>
                      <Text className="text-xs text-on-surface-variant mt-1" numberOfLines={2}>{product.desc}</Text>
                    </View>
                    <View className="flex-row justify-between items-end mt-2">
                      <Text className="text-lg font-bold text-primary">${product.price}</Text>
                      <TouchableOpacity onPress={() => setCartCount(c => c + 1)} className="bg-primary-container w-10 h-10 rounded-full items-center justify-center">
                        <MaterialIcons name="add" size={24} color="#005319" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Cart Bar */}
      {cartCount > 0 && (
        <View className="absolute bottom-5 left-5 right-5 z-[60]">
          <TouchableOpacity onPress={() => router.push('/(customer)/cart')} className="bg-inverse-surface rounded-2xl p-4 flex-row items-center justify-between shadow-lg">
            <View className="flex-row items-center space-x-4 gap-4">
              <View className="bg-primary-container w-10 h-10 rounded-xl items-center justify-center">
                <MaterialIcons name="shopping-bag" size={20} color="#005319" />
              </View>
              <View>
                <Text className="font-bold text-white">{cartCount} Items selected</Text>
                <Text className="text-xs text-white/70">Tap to view cart</Text>
              </View>
            </View>
            <View className="bg-primary px-4 py-2 rounded-xl flex-row items-center">
              <Text className="font-bold text-on-primary mr-1">View Cart</Text>
              <MaterialIcons name="chevron-right" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
