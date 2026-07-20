import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const router = useRouter();
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [instructions, setInstructions] = useState('');
  const [cart, setCart] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartData, addressData] = await Promise.all([
          api.cart.get(),
          api.users.getAddresses()
        ]);
        setCart(cartData);
        setAddresses(addressData || []);
      } catch (e) {
        console.error('Failed to load checkout data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlaceOrder = async () => {
    if (!cart?.storeId || addresses.length === 0) return;
    setSubmitting(true);
    try {
      const selectedAddress = addresses.find(a => a.isDefault) || addresses[0];
      
      const order = await api.orders.create({
        storeId: cart.storeId,
        deliveryAddressId: selectedAddress.id,
        items: cart.items.map((i: any) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        tax: cart.tax,
        total: cart.total,
        deliveryInstructions: instructions,
        paymentMethod: 'card'
      });
      
      await api.cart.clear();
      router.push(`/(customer)/order/${order.id}`);
    } catch (e) {
      console.error('Failed to place order', e);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00e554" />
      </View>
    );
  }

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* TopAppBar */}
      <View className="w-full bg-surface shadow-sm z-40 flex-row justify-between items-center px-5 h-16">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 active:bg-surface-variant">
          <MaterialIcons name="arrow-back" size={24} color="#3b4b39" />
        </TouchableOpacity>
        <Text className="font-extrabold text-xl text-primary tracking-tighter">OmniDrop</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6 pb-[120px]" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-on-surface">Secure Checkout</Text>
          <Text className="text-sm text-on-surface-variant mt-1">Almost there! Review your details.</Text>
        </View>

        <View className="flex-col gap-6">
          {/* Delivery Address */}
          <View className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-surface-variant">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="location-on" size={20} color="#006e24" />
                <Text className="text-xl font-bold text-on-surface">Delivery Address</Text>
              </View>
              <Text className="text-sm font-bold text-primary uppercase tracking-wider">Edit</Text>
            </View>
            <View className="flex-row bg-surface-container-low p-4 rounded-lg border border-surface-variant/50 relative overflow-hidden">
              <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <View className="pl-2 flex-1">
                <Text className="text-base font-bold text-on-surface">{defaultAddress ? defaultAddress.label : 'Add Address'}</Text>
                <Text className="text-sm text-on-surface-variant mt-1">
                  {defaultAddress ? `${defaultAddress.streetAddress}\n${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}` : 'No address selected'}
                </Text>
              </View>
            </View>
            <TextInput 
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Add delivery instructions (e.g. Leave at door)"
              className="mt-4 w-full bg-surface border border-surface-variant rounded-lg px-4 py-3 text-sm"
            />
          </View>

          {/* Delivery Time */}
          <View className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-surface-variant">
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="schedule" size={20} color="#006e24" />
              <Text className="text-xl font-bold text-on-surface">Delivery Time</Text>
            </View>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => setDeliveryTime('asap')} className={`flex-1 border-2 rounded-lg p-4 items-center justify-center h-24 ${deliveryTime === 'asap' ? 'border-primary bg-primary-container/10' : 'border-surface-variant hover:bg-surface-container-low'}`}>
                <View className="bg-primary-container px-2 py-0.5 rounded-full mb-2">
                  <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">Fastest</Text>
                </View>
                <Text className="font-bold text-on-surface">15 - 25 Min</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setDeliveryTime('schedule')} className={`flex-1 border-2 rounded-lg p-4 items-center justify-center h-24 ${deliveryTime === 'schedule' ? 'border-primary bg-primary-container/10' : 'border-surface-variant hover:bg-surface-container-low'}`}>
                <MaterialIcons name="event" size={24} color="#3b4b39" />
                <Text className="text-sm text-on-surface-variant mt-2">Schedule for Later</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method */}
          <View className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-surface-variant">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="credit-card" size={20} color="#006e24" />
                <Text className="text-xl font-bold text-on-surface">Payment</Text>
              </View>
              <Text className="text-sm font-bold text-primary uppercase tracking-wider">Change</Text>
            </View>
            <View className="flex-row items-center gap-4 p-4 rounded-lg border border-surface-variant bg-surface">
              <View className="w-12 h-8 bg-[#141a32] rounded items-center justify-center">
                <Text className="text-white font-bold text-xs">VISA</Text>
              </View>
              <Text className="flex-1 font-bold text-on-surface">•••• •••• •••• 4242</Text>
              <MaterialIcons name="check-circle" size={24} color="#006e24" />
            </View>
          </View>

          {/* Order Summary */}
          <View className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-surface-variant mb-6">
            <Text className="text-xl font-bold text-on-surface mb-4 border-b border-surface-variant pb-2">Order Summary</Text>
            
            <View className="flex-col gap-2 mb-4">
              {cart?.items.map((item: any) => (
                <View key={item.id} className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <View className="bg-surface-container-high px-2 py-1 rounded"><Text className="font-bold text-xs">{item.quantity}x</Text></View>
                    <Text className="text-sm text-on-surface" numberOfLines={1}>{item.product?.name}</Text>
                  </View>
                  <Text className="text-sm font-bold text-on-surface">${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <View className="border-t border-surface-variant border-dashed pt-4 flex-col gap-2 mb-4">
              <View className="flex-row justify-between"><Text className="text-sm text-on-surface-variant">Subtotal</Text><Text className="text-sm text-on-surface-variant">${cart?.subtotal.toFixed(2)}</Text></View>
              <View className="flex-row justify-between"><Text className="text-sm text-on-surface-variant">Delivery Fee</Text><Text className="text-sm text-on-surface-variant">${cart?.deliveryFee.toFixed(2)}</Text></View>
              <View className="flex-row justify-between"><Text className="text-sm text-on-surface-variant">Taxes</Text><Text className="text-sm text-on-surface-variant">${cart?.tax.toFixed(2)}</Text></View>
            </View>

            <View className="border-t border-surface-variant pt-4 flex-row justify-between items-center">
              <Text className="text-xl font-bold text-on-surface">Total</Text>
              <Text className="text-2xl font-extrabold text-primary">${cart?.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 w-full z-50 bg-surface-container-lowest border-t border-surface-variant shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-5 py-4 pb-8">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-on-surface-variant">Total</Text>
          <Text className="text-xl font-bold text-primary">${cart?.total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity onPress={handlePlaceOrder} disabled={submitting || !cart || addresses.length === 0} className={`w-full bg-primary-container py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${(submitting || !cart || addresses.length === 0) ? 'opacity-70' : 'active:opacity-90'}`}>
          {submitting ? (
            <ActivityIndicator color="#002106" />
          ) : (
            <>
              <Text className="text-on-primary-container text-lg font-bold">Place Order</Text>
              <MaterialIcons name="bolt" size={24} color="#002106" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
