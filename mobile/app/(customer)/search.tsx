import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchResultsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('Organic Groceries');

  const topStores = [
    { id: 1, name: 'Green Earth Market', category: 'Organic • Fresh', time: '12-18 min', rating: '4.9', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', isLarge: true },
    { id: 2, name: 'The Daily Crust', category: 'Bakery', time: '20-30 min', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Citrus & Vine', category: 'Produce', time: '15-25 min', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400' }
  ];

  const products = [
    { id: 1, name: 'Fresh Purple Kale (250g)', price: 4.50, badge: 'Organic', image: 'https://images.unsplash.com/photo-1524179091875-9b25f0c4beea?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Cold Pressed Almond Milk', price: 7.20, badge: 'Artisanal', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Heirloom Tomato Mix', price: 5.50, oldPrice: 8.00, badge: 'Organic', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400', sale: true },
    { id: 4, name: 'Organic Extra Virgin Olive Oil', price: 18.90, badge: 'Premium', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Mixed Berry Pack (Local)', price: 6.45, badge: 'Seasonal', image: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* TopAppBar */}
      <View className="w-full bg-surface shadow-sm z-50 flex-row justify-between items-center px-5 h-16 border-b border-surface-variant">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()} className="active:opacity-80">
            <MaterialIcons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text className="font-extrabold text-xl italic text-primary">OmniDrop</Text>
        </View>
        <TouchableOpacity className="relative p-2 rounded-full active:bg-surface-container-high">
          <MaterialIcons name="shopping-cart" size={24} color="#3b4b39" />
          <View className="absolute top-1 right-1 bg-primary w-4 h-4 rounded-full items-center justify-center">
            <Text className="text-white text-[10px] font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-32">
          {/* Search Info & Filters */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-on-surface mb-1">Results for "{searchQuery}"</Text>
            <Text className="text-sm text-on-surface-variant mb-4">Found 4 stores and 28 products near you</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <TouchableOpacity className="flex-row items-center gap-1 bg-[#141a32] px-4 py-2 rounded-full active:opacity-90">
                <MaterialIcons name="tune" size={18} color="#fff" />
                <Text className="text-white font-bold text-xs">Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-1 bg-surface-container-high px-4 py-2 rounded-full ml-2 active:bg-surface-variant">
                <Text className="text-on-surface font-bold text-xs">Delivery Speed</Text>
                <MaterialIcons name="expand-more" size={18} color="#191c1d" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-1 bg-surface-container-high px-4 py-2 rounded-full ml-2 active:bg-surface-variant">
                <Text className="text-on-surface font-bold text-xs">Price</Text>
                <MaterialIcons name="expand-more" size={18} color="#191c1d" />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Top Stores */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-on-surface">Top Stores</Text>
              <Text className="text-primary font-bold text-xs">View All</Text>
            </View>

            <View className="flex-col gap-4">
              {topStores.map((store, index) => (
                <TouchableOpacity key={store.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 active:opacity-90">
                  <View className={store.isLarge ? 'h-48' : 'h-32'}>
                    <Image source={{ uri: store.image }} className="w-full h-full absolute" />
                    {store.isLarge && (
                      <View className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full flex-row items-center gap-1">
                        <MaterialIcons name="bolt" size={14} color="#fff" />
                        <Text className="text-white font-bold text-xs">Fastest</Text>
                      </View>
                    )}
                  </View>
                  <View className="p-4 flex-row justify-between items-center">
                    <View>
                      <Text className="font-bold text-base text-on-surface">{store.name}</Text>
                      <Text className="text-xs text-on-surface-variant">{store.category} • {store.time}</Text>
                    </View>
                    {store.rating && (
                      <View className="bg-secondary-container w-10 h-10 rounded-full items-center justify-center">
                        <Text className="text-on-secondary-container font-bold text-xs">{store.rating}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Products */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-on-surface">Products</Text>
              <View className="flex-row gap-2">
                <MaterialIcons name="grid-view" size={24} color="#006e24" />
                <MaterialIcons name="view-list" size={24} color="#3b4b39" />
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-4">
              {products.map((product) => (
                <TouchableOpacity key={product.id} className="w-[48%] bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 active:opacity-90">
                  <View className="aspect-square bg-surface-container-low overflow-hidden relative">
                    <Image source={{ uri: product.image }} className="w-full h-full absolute" />
                    <TouchableOpacity className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                      <MaterialIcons name="favorite-border" size={20} color="#006e24" />
                    </TouchableOpacity>
                    {product.sale && (
                      <View className="absolute bottom-2 left-2 bg-error px-2 py-0.5 rounded-full">
                        <Text className="text-white font-bold text-[10px]">SALE</Text>
                      </View>
                    )}
                  </View>
                  <View className="p-3 flex-1 justify-between">
                    <View>
                      <Text className="text-[10px] font-bold text-primary uppercase mb-1">{product.badge}</Text>
                      <Text className="font-bold text-sm text-on-surface mb-2" numberOfLines={2}>{product.name}</Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <View>
                        <Text className="font-bold text-base text-primary">${product.price.toFixed(2)}</Text>
                        {product.oldPrice && (
                          <Text className="text-[10px] text-on-surface-variant line-through">${product.oldPrice.toFixed(2)}</Text>
                        )}
                      </View>
                      <View className="bg-primary-container w-8 h-8 rounded-full items-center justify-center">
                        <MaterialIcons name="add" size={20} color="#005319" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <View className="absolute bottom-6 right-5 z-40">
        <TouchableOpacity className="bg-on-background px-6 py-4 rounded-full shadow-lg flex-row items-center gap-3 active:bg-primary">
          <MaterialIcons name="shopping-bag" size={24} color="#fff" />
          <Text className="text-white font-bold text-sm">View Cart ($36.15)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
