import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../src/lib/api';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.byId(id as string);
        setProduct({
          ...data,
          // Map backend fields to UI fields if necessary, or use as is
          rating: 4.5,
          reviews: 124,
          badges: ['Fastest Delivery', 'Organic']
        });
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#00e554" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-on-surface">Product not found.</Text>
      </View>
    );
  }

  const relatedProducts = [
    { id: 2, name: 'Artisan Sourdough', price: 6.50, category: 'Bakery', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Cherry Tomatoes', price: 3.99, category: 'Produce', image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Organic Limes', price: 2.50, category: 'Produce', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* TopAppBar */}
      <View className="w-full bg-surface shadow-sm z-50 flex-row justify-between items-center px-5 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 active:opacity-80">
          <MaterialIcons name="arrow-back" size={24} color="#3b4b39" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <MaterialIcons name="bolt" size={24} color="#006e24" />
          <Text className="font-extrabold text-xl text-primary tracking-tighter">OmniDrop</Text>
        </View>
        <TouchableOpacity className="p-2 -mr-2 active:opacity-80">
          <MaterialIcons name="search" size={24} color="#3b4b39" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-32">
          {/* Hero Section */}
          <View className="flex-col md:flex-row gap-10 mb-16">
            
            {/* Image Area */}
            <View className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden aspect-square items-center justify-center mb-6">
              <Image source={{ uri: product?.image }} className="w-full h-full absolute" />
              {/* Badges */}
              <View className="absolute top-4 left-4 flex-col gap-2">
                {product?.badges?.map((badge: string, idx: number) => (
                  <View key={idx} className={`${idx === 0 ? 'bg-primary' : 'bg-secondary'} px-3 py-1 rounded-full shadow-sm self-start`}>
                    <Text className={`text-[12px] font-bold ${idx === 0 ? 'text-on-primary' : 'text-on-secondary'}`}>{badge}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Product Details Area */}
            <View className="flex-col justify-center">
              <View className="mb-4">
                <Text className="text-secondary font-bold text-xs uppercase tracking-wider mb-2">{product?.category}</Text>
                <Text className="text-2xl font-bold text-on-surface mb-2 leading-8">{product?.name}</Text>
                <View className="flex-row items-center gap-2 mb-6">
                  <View className="flex-row text-primary">
                    <MaterialIcons name="star" size={16} color="#006e24" />
                    <MaterialIcons name="star" size={16} color="#006e24" />
                    <MaterialIcons name="star" size={16} color="#006e24" />
                    <MaterialIcons name="star" size={16} color="#006e24" />
                    <MaterialIcons name="star-half" size={16} color="#006e24" />
                  </View>
                  <Text className="text-on-surface-variant text-sm">({product?.reviews} reviews)</Text>
                </View>
              </View>

              <View className="flex-row items-baseline gap-4 mb-8">
                <Text className="text-4xl font-extrabold text-on-surface">${product?.price}</Text>
                {product.originalPrice && (
                  <Text className="text-sm text-on-surface-variant line-through ml-2">${product.originalPrice}</Text>
                )}
                <Text className="text-on-surface-variant text-sm ml-auto">{product?.unit}</Text>
              </View>

              <Text className="text-base text-on-surface-variant mb-8 leading-relaxed">
                {product?.desc}
              </Text>

              {/* Actions */}
              <View className="flex-row items-center gap-6 mt-auto">
                <View className="flex-row items-center bg-surface-container rounded-full p-1 shadow-sm">
                  <TouchableOpacity 
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-surface-variant"
                  >
                    <MaterialIcons name="remove" size={24} color="#191c1d" />
                  </TouchableOpacity>
                  <Text className="w-8 text-center text-xl font-bold text-on-surface">{quantity}</Text>
                  <TouchableOpacity 
                    onPress={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-surface-variant"
                  >
                    <MaterialIcons name="add" size={24} color="#191c1d" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity className="flex-1 bg-primary py-4 px-6 rounded-xl shadow-lg active:opacity-90 flex-row justify-center items-center gap-2">
                  <Text className="text-on-primary text-xl font-bold">Add to Cart</Text>
                  <MaterialIcons name="shopping-cart" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Info Tabs */}
          <View className="mb-16">
            <View className="flex-row border-b border-surface-variant mb-6 pb-2">
              <TouchableOpacity onPress={() => setActiveTab('Description')} className={`mr-8 pb-2 ${activeTab === 'Description' ? 'border-b-2 border-primary' : ''}`}>
                <Text className={`text-xl font-bold ${activeTab === 'Description' ? 'text-primary' : 'text-on-surface-variant'}`}>Description</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Nutrition')} className={`mr-8 pb-2 ${activeTab === 'Nutrition' ? 'border-b-2 border-primary' : ''}`}>
                <Text className={`text-xl font-bold ${activeTab === 'Nutrition' ? 'text-primary' : 'text-on-surface-variant'}`}>Nutrition</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Sourcing')} className={`mr-8 pb-2 ${activeTab === 'Sourcing' ? 'border-b-2 border-primary' : ''}`}>
                <Text className={`text-xl font-bold ${activeTab === 'Sourcing' ? 'text-primary' : 'text-on-surface-variant'}`}>Sourcing</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
              <View className="flex-col gap-2">
                <View className="flex-row items-center"><View className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-3"/><Text className="text-base text-on-surface-variant">100% Certified Organic</Text></View>
                <View className="flex-row items-center"><View className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-3"/><Text className="text-base text-on-surface-variant">Rich in healthy fats and fiber</Text></View>
                <View className="flex-row items-center"><View className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-3"/><Text className="text-base text-on-surface-variant">Sourced from sustainable farms in California</Text></View>
                <View className="flex-row items-center"><View className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-3"/><Text className="text-base text-on-surface-variant">Store at room temperature until ripe, then refrigerate</Text></View>
              </View>
            </View>
          </View>

          {/* Frequently Bought Together */}
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-on-surface">Frequently Bought</Text>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-4">
              {relatedProducts.map(item => (
                <TouchableOpacity key={item.id} className="w-[48%] bg-surface-container-lowest rounded-xl p-4 shadow-sm">
                  <View className="aspect-square bg-surface-container rounded-lg mb-4 overflow-hidden">
                    <Image source={{ uri: item.image }} className="w-full h-full" />
                  </View>
                  <Text className="text-[12px] font-bold text-primary mb-2">{item.category}</Text>
                  <Text className="text-sm font-bold text-on-surface mb-2" numberOfLines={1}>{item.name}</Text>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-base font-bold text-on-surface">${item.price}</Text>
                    <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center">
                      <MaterialIcons name="add" size={16} color="#005319" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
