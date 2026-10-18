import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const router = useRouter();
  const { promo } = useLocalSearchParams();
  const [instructions, setInstructions] = useState('');
  const [cart, setCart] = useState<Models.Cart | null>(null);
  const [addresses, setAddresses] = useState<Models.Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'WALLET' | 'COD'>('ONLINE');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState<string>(typeof promo === 'string' ? promo : '');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartData, addressData, walletData] = await Promise.all([
          api.cart.get().catch(() => null),
          api.users.getAddresses().catch(() => []),
          api.wallet.get().catch(() => null),
        ]);
        setCart(cartData);
        const addrList = Array.isArray(addressData) ? addressData : [];
        setAddresses(addrList);
        if (addrList.length > 0) {
          const def = addrList.find((a) => a.isDefault) || addrList[0];
          setSelectedAddressId(def.id);
        }
        if (walletData?.balance !== undefined) {
          setWalletBalance(Number(walletData.balance));
        }

        if (promo && cartData?.subtotal) {
          try {
            const promoRes = await api.promotions.validate(
              promo.toString(),
              Number(cartData.subtotal),
            );
            if (promoRes?.valid) {
              setPromoDiscount(Number(promoRes.discount || 0));
            }
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        console.error('Failed to load checkout data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [promo]);

  const handlePlaceOrder = async () => {
    if (!cart?.items || cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Your manifest has no items.');
      return;
    }
    if (!selectedAddressId) {
      Alert.alert('Coordinates Required', 'Please select or add a delivery address to proceed.');
      return;
    }

    const orderTotal = Math.max(0, Number(cart.total ?? 0) - promoDiscount);
    if (paymentMethod === 'WALLET' && walletBalance < orderTotal) {
      Alert.alert(
        'Insufficient Balance',
        `Omni Wallet has ₹${walletBalance.toFixed(0)}, but order total is ₹${orderTotal.toFixed(0)}. Select Online or Cash on Delivery.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const order = await api.orders.create({
        deliveryAddressId: selectedAddressId,
        deliveryInstructions: instructions,
        paymentMethod: paymentMethod,
        promotionCode: promoCode || undefined,
      });

      const orderId = order.id;
      if (orderId) {
        router.replace(`/(customer)/order/${orderId}`);
      } else {
        router.replace('/(customer)/orders');
      }
    } catch (e) {
      console.error('Failed to place order', e);
      Alert.alert('Order Failed', getErrorMessage(e) || 'Could not place order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: BrutalColors.bg,
        }}
      >
        <ActivityIndicator size="large" color={BrutalColors.black} />
      </View>
    );
  }

  const selectedAddr = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const subtotal = Number(cart?.subtotal ?? 0);
  const deliveryFee = Number(cart?.deliveryFee ?? (subtotal >= 199 ? 0 : 25));
  const tax = Number(cart?.tax ?? 0);
  const total = Number(cart?.total ?? subtotal + deliveryFee + tax);
  const finalTotal = Math.max(0, total - promoDiscount);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ DIRECT DISPATCH ROUTING · 12-MIN SLA" />
      <BrutalHeader title="Order Checkout" subtitle="Delivery & Settlement" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Destination Coordinates Card */}
        <BrutalCard style={{ padding: 16, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="location-on"
                size={18}
                color={BrutalColors.black}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                1. Delivery Coordinates
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(customer)/addresses')}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  textDecorationLine: 'underline',
                  color: BrutalColors.black,
                }}
              >
                Change →
              </Text>
            </TouchableOpacity>
          </View>

          {selectedAddr ? (
            <View
              style={{
                backgroundColor: BrutalColors.subtle,
                borderWidth: 1.5,
                borderColor: BrutalColors.black,
                padding: 12,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                >
                  {selectedAddr.label || 'Home'}
                </Text>
                <BrutalBadge label="PRIMARY" variant="green" />
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#222' }}>
                {selectedAddr.addressLine1}
              </Text>
              <Text style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                {selectedAddr.city}, {selectedAddr.pincode || 'Bengaluru'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(customer)/addresses')}
              style={{
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: BrutalColors.black,
                padding: 14,
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                + Add Delivery Coordinates
              </Text>
            </TouchableOpacity>
          )}

          {/* Delivery Note */}
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: '#666',
                marginBottom: 4,
              }}
            >
              Rider Gate Note (Optional):
            </Text>
            <TextInput
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Leave package with front desk / dial intercom 402"
              placeholderTextColor="#888"
              style={{
                borderWidth: 1.5,
                borderColor: BrutalColors.black,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 10,
                paddingVertical: 8,
                fontSize: 12,
                color: BrutalColors.black,
              }}
            />
          </View>
        </BrutalCard>

        {/* 2. Payment Protocol Card */}
        <BrutalCard style={{ padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialIcons
              name="payment"
              size={18}
              color={BrutalColors.black}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              2. Settlement Method
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            {[
              {
                id: 'ONLINE',
                title: '⚡ Instant Online',
                desc: 'UPI, Debit/Credit Card, NetBanking (Encrypted)',
              },
              {
                id: 'WALLET',
                title: `💳 Omni Wallet (₹${walletBalance.toFixed(0)})`,
                desc: 'One-tap instant deduction with zero bank redirect',
              },
              {
                id: 'COD',
                title: '💵 Cash On Delivery',
                desc: 'Doorstep cash or UPI QR scan on arrival',
              },
            ].map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setPaymentMethod(method.id as typeof paymentMethod)}
                  activeOpacity={0.8}
                  style={[
                    {
                      borderWidth: 2,
                      borderColor: BrutalColors.black,
                      backgroundColor: isSelected ? BrutalColors.yellow : BrutalColors.white,
                      padding: 12,
                    },
                    isSelected ? BrutalShadow.sm : {},
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                      }}
                    >
                      {method.title}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check-circle" size={18} color={BrutalColors.black} />
                    )}
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: '#444', marginTop: 2 }}>
                    {method.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BrutalCard>

        {/* 3. Order Final Ledger */}
        <BrutalCard style={{ padding: 16, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              marginBottom: 10,
            }}
          >
            3. Final Order Ledger
          </Text>

          <View
            style={{
              gap: 6,
              borderBottomWidth: 2,
              borderBottomColor: BrutalColors.black,
              paddingBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#666' }}>
                Manifest Items ({cart?.items?.length || 0})
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '900', color: BrutalColors.black }}>
                ₹{subtotal.toFixed(0)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#666' }}>
                Expedited Delivery Corridor
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '900',
                  color: deliveryFee === 0 ? '#008855' : BrutalColors.black,
                }}
              >
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}
              </Text>
            </View>

            {tax > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#666' }}>
                  Taxes & Regulatory Fee
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: BrutalColors.black }}>
                  ₹{tax.toFixed(0)}
                </Text>
              </View>
            )}

            {promoDiscount > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#008855' }}>
                  Voucher Discount ({promoCode})
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#008855' }}>
                  -₹{promoDiscount.toFixed(0)}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              Gross Authorization
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: BrutalColors.black }}>
              ₹{finalTotal.toFixed(0)}
            </Text>
          </View>

          <BrutalButton
            title={
              submitting
                ? 'AUTHORIZING DISPATCH...'
                : `AUTHORIZE ₹${finalTotal.toFixed(0)} DISPATCH →`
            }
            onPress={handlePlaceOrder}
            loading={submitting}
            variant="yellow"
            size="lg"
            fullWidth
            style={{ marginTop: 16 }}
          />
        </BrutalCard>
      </ScrollView>
    </SafeAreaView>
  );
}
