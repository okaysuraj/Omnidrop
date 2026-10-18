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
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<Models.Cart | null>(null);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [validatingPromo, setValidatingPromo] = useState(false);
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

  const subtotal = Number(cart?.subtotal ?? 0);
  const deliveryThreshold = 199;
  const isFreeDelivery = subtotal >= deliveryThreshold;
  const amountToFreeDelivery = Math.max(0, deliveryThreshold - subtotal);
  const deliveryFee = Number(cart?.deliveryFee ?? (isFreeDelivery ? 0 : 25));
  const tax = Number(cart?.tax ?? 0);
  const discount = promoApplied ? promoDiscount : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  const handleApplyPromo = async () => {
    if (!promo.trim()) return;
    setValidatingPromo(true);
    try {
      const res = await api.promotions.validate(promo.trim().toUpperCase(), subtotal);
      if (res && res.valid) {
        setPromoDiscount(Number(res.discount || 0));
        setPromoApplied(true);
        Alert.alert(
          'Voucher Applied',
          `Saved ₹${Number(res.discount || 0).toFixed(0)} on this order!`,
        );
      } else {
        setPromoApplied(false);
        setPromoDiscount(0);
        Alert.alert('Invalid Voucher', 'This promo code is not applicable.');
      }
    } catch (e) {
      setPromoApplied(false);
      setPromoDiscount(0);
      Alert.alert(
        'Invalid Voucher',
        getErrorMessage(e) || getErrorMessage(e) || 'Promo code could not be applied.',
      );
    } finally {
      setValidatingPromo(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ TOTE MANIFEST · VERIFIED SETTLEMENT LEDGER" />
      <BrutalHeader title="Shopping Manifest" subtitle="Active Order Items" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
        ) : !cart?.items || cart.items.length === 0 ? (
          <BrutalCard style={{ padding: 32, alignItems: 'center', marginTop: 24 }}>
            <View
              style={[
                {
                  width: 64,
                  height: 64,
                  backgroundColor: BrutalColors.yellow,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                },
                BrutalShadow.sm,
              ]}
            >
              <MaterialIcons name="shopping-bag" size={32} color={BrutalColors.black} />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              Manifest Is Empty
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#666',
                textAlign: 'center',
                marginTop: 4,
                marginBottom: 18,
                lineHeight: 17,
              }}
            >
              No physical SKUs currently queued in your order tote. Explore our neighborhood
              micro-hubs for instant 12-minute delivery.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(customer)/products')}
              style={[
                {
                  backgroundColor: BrutalColors.yellow,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  paddingHorizontal: 20,
                  paddingVertical: 11,
                },
                BrutalShadow.sm,
              ]}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Browse Catalog →
              </Text>
            </TouchableOpacity>
          </BrutalCard>
        ) : (
          <View style={{ gap: 14 }}>
            {/* Free Delivery SLA Progress Strip */}
            <View
              style={[
                {
                  backgroundColor: isFreeDelivery ? '#E8FBF4' : '#FFFDF0',
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  padding: 12,
                },
                BrutalShadow.sm,
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                >
                  {isFreeDelivery
                    ? '🎉 FREE DISPATCH UNLOCKED!'
                    : `⚡ ADD ₹${amountToFreeDelivery.toFixed(0)} MORE FOR FREE DISPATCH`}
                </Text>
                <BrutalBadge
                  label={isFreeDelivery ? 'QUALIFIED' : 'TARGET ₹199'}
                  variant={isFreeDelivery ? 'green' : 'yellow'}
                />
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: '#E4E4DC',
                  borderWidth: 1,
                  borderColor: BrutalColors.black,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.min(100, Math.round((subtotal / deliveryThreshold) * 100))}%`,
                    height: '100%',
                    backgroundColor: isFreeDelivery ? BrutalColors.green : BrutalColors.yellow,
                  }}
                />
              </View>
            </View>

            {/* Manifest List */}
            <View style={{ gap: 10 }}>
              {cart.items.map((item) => (
                <BrutalCard
                  key={item.id}
                  style={{
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}
                  >
                    <Image
                      source={{
                        uri:
                          item.product?.images?.[0] ||
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
                      }}
                      style={{
                        width: 54,
                        height: 54,
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                        marginRight: 10,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          color: BrutalColors.black,
                        }}
                        numberOfLines={1}
                      >
                        {item.product?.name || 'Product'}
                      </Text>
                      <Text
                        style={{ fontSize: 10, fontWeight: '700', color: '#666', marginTop: 1 }}
                      >
                        Per {item.product?.unit || item.product?.weight || 'pack'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '900',
                          color: BrutalColors.black,
                          marginTop: 2,
                        }}
                      >
                        ₹{Number(item.effectivePrice ?? item.product?.sellingPrice ?? 0).toFixed(0)}
                      </Text>
                    </View>
                  </View>

                  {/* Brutal Stepper */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: BrutalColors.black,
                      backgroundColor: BrutalColors.subtle,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1, item.quantity)}
                      style={{
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons name="remove" size={16} color={BrutalColors.black} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        width: 26,
                        textAlign: 'center',
                        fontWeight: '900',
                        fontSize: 13,
                        color: BrutalColors.black,
                      }}
                    >
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1, item.quantity)}
                      style={{
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons name="add" size={16} color={BrutalColors.black} />
                    </TouchableOpacity>
                  </View>
                </BrutalCard>
              ))}
            </View>

            {/* Add More Items Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(customer)/products')}
              style={[
                {
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: BrutalColors.black,
                  backgroundColor: BrutalColors.white,
                  paddingVertical: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
              ]}
            >
              <MaterialIcons
                name="add"
                size={16}
                color={BrutalColors.black}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Add More Items From Shelves
              </Text>
            </TouchableOpacity>

            {/* Promo Voucher Box */}
            <BrutalCard style={{ padding: 12 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: '#666',
                  marginBottom: 6,
                }}
              >
                Promotional Voucher Code
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  value={promo}
                  onChangeText={setPromo}
                  placeholder="e.g. OMNI50"
                  placeholderTextColor="#888"
                  autoCapitalize="characters"
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    paddingHorizontal: 10,
                    height: 38,
                    fontSize: 12,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleApplyPromo}
                  disabled={validatingPromo}
                  style={[
                    {
                      backgroundColor: BrutalColors.yellow,
                      borderWidth: 1.5,
                      borderColor: BrutalColors.black,
                      paddingHorizontal: 14,
                      justifyContent: 'center',
                    },
                    BrutalShadow.sm,
                  ]}
                >
                  <Text style={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>
                    {validatingPromo ? 'Checking...' : promoApplied ? 'Applied ✓' : 'Apply'}
                  </Text>
                </TouchableOpacity>
              </View>
            </BrutalCard>

            {/* Receipt Summary Ledger */}
            <BrutalCard style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottomWidth: 1.5,
                  borderBottomColor: BrutalColors.black,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                  }}
                >
                  Receipt Breakdown
                </Text>
                <BrutalBadge label="VERIFIED" variant="green" />
              </View>

              <View style={{ gap: 7 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#666' }}>Subtotal</Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: BrutalColors.black }}>
                    ₹{subtotal.toFixed(0)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#666' }}>
                    Delivery Corridor SLA
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

                {promoApplied && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#008855' }}>
                      Voucher Discount
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#008855' }}>
                      -₹{discount.toFixed(0)}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTopWidth: 2,
                    borderTopColor: BrutalColors.black,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    Total Settlement
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: BrutalColors.black }}>
                    ₹{total.toFixed(0)}
                  </Text>
                </View>
              </View>

              <BrutalButton
                title="Proceed To Checkout →"
                onPress={() => {
                  if (promoApplied && promo.trim()) {
                    router.push({
                      pathname: '/(customer)/checkout',
                      params: { promo: promo.trim().toUpperCase() },
                    });
                  } else {
                    router.push('/(customer)/checkout');
                  }
                }}
                variant="yellow"
                size="lg"
                fullWidth
                style={{ marginTop: 16 }}
              />
            </BrutalCard>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
