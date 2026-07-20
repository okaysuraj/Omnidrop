import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await api.cart.get();
      setCart(data);
    } catch (e) {
      console.error('Failed to load cart', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, delta: number, currentQty: number) => {
    const newQty = Math.max(0, currentQty + delta);
    try {
      if (newQty === 0) {
        await api.cart.removeItem(itemId);
      } else {
        await api.cart.updateQuantity(itemId, newQty);
      }
      fetchCart();
    } catch (e) {
      console.error('Failed to update cart', e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* TopAppBar */}
      <View className="w-full bg-surface shadow-sm z-40 flex-row justify-between items-center px-5 h-16">
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="bolt" size={24} color="#006e24" />
          <Text className="font-extrabold text-xl text-primary tracking-tighter">OmniDrop</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden items-center justify-center">
          <MaterialIcons name="close" size={20} color="#191c1d" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6 pb-24" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-on-surface mb-6">Your Cart</Text>

        {/* Cart Items List */}
        <View className="flex-col gap-4 mb-6">
          {loading ? (
            <ActivityIndicator size="large" color="#00e554" style={{ marginTop: 20 }} />
          ) : !cart?.items || cart.items.length === 0 ? (
            <Text className="text-center mt-5 text-on-surface-variant font-medium">Your cart is empty.</Text>
          ) : (
            cart.items.map((item: any) => (
              <View key={item.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex-row items-center gap-4">
                <View className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
                  <Image source={{ uri: item.product?.imageUrl || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400' }} className="w-full h-full" />
                </View>
                <View className="flex-1 justify-between h-full">
                  <View>
                    <Text className="font-bold text-on-surface" numberOfLines={1}>{item.product?.name}</Text>
                    <Text className="text-sm text-on-surface-variant mt-1">{item.product?.weight || 'Item'}</Text>
                  </View>
                  <Text className="text-lg font-bold text-primary mt-1">${item.price}</Text>
                </View>
                <View className="flex-row items-center bg-surface-container rounded-full p-1 border border-outline-variant">
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1, item.quantity)} className="w-8 h-8 items-center justify-center rounded-full active:bg-surface-variant">
                    <MaterialIcons name="remove" size={20} color="#191c1d" />
                  </TouchableOpacity>
                  <Text className="w-6 text-center font-bold text-on-surface">{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1, item.quantity)} className="w-8 h-8 items-center justify-center rounded-full active:bg-surface-variant">
                    <MaterialIcons name="add" size={20} color="#191c1d" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add More Items Shortcut */}
        <TouchableOpacity onPress={() => router.push('/(customer)/home')} className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl flex-row items-center justify-center gap-2 mb-8 active:bg-surface-container-low">
          <MaterialIcons name="add-circle" size={20} color="#006e24" />
          <Text className="text-primary font-bold">Add more items</Text>
        </TouchableOpacity>

        {/* Promo Code */}
        <View className="bg-surface-container-lowest p-5 rounded-xl shadow-sm mb-6">
          <Text className="font-bold text-on-surface mb-2">Promo Code</Text>
          <View className="flex-row gap-2">
            <TextInput 
              value={promo}
              onChangeText={setPromo}
              placeholder="Enter code" 
              className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface"
            />
            <TouchableOpacity className="bg-inverse-surface px-6 py-3 rounded-lg justify-center active:opacity-90">
              <Text className="text-surface-container-lowest font-bold">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bill Details */}
        <View className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex-col gap-3 mb-6">
          <Text className="text-xl font-bold text-on-surface mb-2">Bill Details</Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-on-surface-variant">Item Total</Text>
            <Text className="text-sm text-on-surface-variant">${cart?.subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Text className="text-sm text-on-surface-variant mr-2">Delivery Fee</Text>
              <View className="bg-primary-container px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-on-primary-fixed">FASTEST</Text>
              </View>
            </View>
            <Text className="text-sm text-on-surface-variant">${cart?.deliveryFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-on-surface-variant">Taxes</Text>
            <Text className="text-sm text-on-surface-variant">${cart?.tax.toFixed(2)}</Text>
          </View>
          <View className="h-[1px] bg-outline-variant w-full my-2" />
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-on-surface">Total to Pay</Text>
            <Text className="text-xl font-bold text-on-surface">${cart?.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        {cart?.items?.length > 0 && (
          <TouchableOpacity onPress={() => router.push('/(customer)/checkout')} className="w-full bg-primary-container py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:opacity-90">
            <Text className="text-on-primary-fixed text-lg font-bold">Proceed to Checkout</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#002106" />
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
