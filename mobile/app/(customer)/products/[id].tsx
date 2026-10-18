import {
  BrutalBadge,
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
  const { id, storeId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Models.Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Models.Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const refreshCart = async () => {
    try {
      const cart = await api.cart.get();
      if (cart?.items) {
        const count = cart.items.reduce((acc: number, i) => acc + (i.quantity || 1), 0);
        setCartCount(count);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [prodData, allProds] = await Promise.all([
          api.products.byId(id as string),
          api.products
            .list()
            .then((result) => result.items)
            .catch(() => []),
        ]);
        setProduct(prodData);

        const list = allProds;
        setRelatedProducts(list.filter((p) => p.id !== id).slice(0, 4));
        await refreshCart();
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      let targetStoreId = (storeId as string) || product?.inventory?.[0]?.storeId;
      if (!targetStoreId) {
        const nearby = await api.stores.nearby(28.6139, 77.209, 25).catch(() => []);
        targetStoreId = Array.isArray(nearby) && nearby.length > 0 ? nearby[0].id : undefined;
      }
      if (!targetStoreId) {
        Alert.alert('Store Unavailable', 'No active fulfillment hub currently carries this SKU.');
        return;
      }
      await api.cart.addItem({ productId: product.id, quantity: quantity, storeId: targetStoreId });
      await refreshCart();
      Alert.alert('Manifest Updated', `${quantity}x ${product.name} queued in your tote.`);
    } catch (e) {
      Alert.alert(
        'Error',
        getErrorMessage(e) || getErrorMessage(e) || 'Failed to add item to tote.',
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BrutalColors.bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={BrutalColors.black} />
      </View>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: BrutalColors.bg,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <MaterialIcons name="inventory" size={48} color={BrutalColors.black} />
        <Text
          style={{ fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginTop: 12 }}
        >
          SKU Not Discovered
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            {
              backgroundColor: BrutalColors.yellow,
              borderWidth: 2,
              borderColor: BrutalColors.black,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 16,
            },
            BrutalShadow.sm,
          ]}
        >
          <Text style={{ fontWeight: '900', fontSize: 12, textTransform: 'uppercase' }}>
            Return to Catalog
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const numPrice = Number(product.sellingPrice || 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ 12-MIN DISPATCH · AUTHENTICATED PHYSICAL SKU" />
      <BrutalHeader
        title="Product Manifest"
        subtitle={product.category?.name || 'Hyperlocal SKU'}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(customer)/cart')}
            style={[
              {
                width: 36,
                height: 36,
                backgroundColor: BrutalColors.yellow,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="shopping-bag" size={18} color={BrutalColors.black} />
            {cartCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: BrutalColors.black,
                  minWidth: 16,
                  height: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
              >
                <Text style={{ color: BrutalColors.yellow, fontSize: 9, fontWeight: '900' }}>
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image Card */}
        <BrutalCard style={{ overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ height: 260, position: 'relative' }}>
            <Image
              source={{
                uri:
                  product?.images?.[0] ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
              }}
              style={{ width: '100%', height: '100%' }}
            />
            <View style={{ position: 'absolute', top: 10, left: 10 }}>
              <BrutalBadge label={product.category?.name || 'FRESH SKU'} variant="yellow" />
            </View>
            <View style={{ position: 'absolute', top: 10, right: 10 }}>
              <BrutalBadge label="⚡ 12-MIN DISPATCH" variant="green" />
            </View>
          </View>
        </BrutalCard>

        {/* Product Details Card */}
        <BrutalCard style={{ padding: 18, marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              letterSpacing: -0.3,
            }}
          >
            {product.name}
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#666',
              marginTop: 4,
              textTransform: 'uppercase',
            }}
          >
            Per {product.unit || product.weight || 'pack'} · Verified Shelf Inventory
          </Text>

          {/* Pricing Row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              marginTop: 12,
              marginBottom: 14,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: '900', color: BrutalColors.black }}>
              ₹{numPrice.toFixed(0)}
            </Text>
            {product.mrp && Number(product.mrp) > numPrice && (
              <Text
                style={{
                  fontSize: 14,
                  color: '#888',
                  textDecorationLine: 'line-through',
                  fontWeight: '700',
                }}
              >
                ₹{Number(product.mrp).toFixed(0)}
              </Text>
            )}
            <BrutalBadge label="IN STOCK" variant="green" size="xs" />
          </View>

          {/* Description */}
          <View
            style={{
              backgroundColor: BrutalColors.subtle,
              borderWidth: 1.5,
              borderColor: BrutalColors.black,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 12, color: '#222', lineHeight: 18, fontWeight: '500' }}>
              {product.description ||
                'Locally sourced and packed at neighborhood micro-hub. 100% physical inventory verified with guaranteed 12-minute doorstep drop.'}
            </Text>
          </View>

          {/* Guarantee Highlights */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: BrutalColors.black,
                padding: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '900',
                  color: BrutalColors.black,
                  textTransform: 'uppercase',
                }}
              >
                ⚡ 12-MIN SLA
              </Text>
              <Text style={{ fontSize: 9, color: '#666', marginTop: 1 }}>
                Express corridor drop
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: BrutalColors.black,
                padding: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '900',
                  color: BrutalColors.black,
                  textTransform: 'uppercase',
                }}
              >
                🛡️ QUALITY CHECK
              </Text>
              <Text style={{ fontSize: 9, color: '#666', marginTop: 1 }}>
                Hub-verified shelf fresh
              </Text>
            </View>
          </View>

          {/* Quantity Controls & Add to Cart */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Stepper */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: BrutalColors.black,
                backgroundColor: BrutalColors.white,
              }}
            >
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: 38, height: 44, alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="remove" size={18} color={BrutalColors.black} />
              </TouchableOpacity>
              <Text
                style={{
                  width: 32,
                  textAlign: 'center',
                  fontWeight: '900',
                  fontSize: 15,
                  color: BrutalColors.black,
                }}
              >
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={{ width: 38, height: 44, alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="add" size={18} color={BrutalColors.black} />
              </TouchableOpacity>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={adding}
              activeOpacity={0.8}
              style={[
                {
                  flex: 1,
                  backgroundColor: BrutalColors.yellow,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 44,
                  flexDirection: 'row',
                },
                BrutalShadow.sm,
              ]}
            >
              {adding ? (
                <ActivityIndicator size="small" color={BrutalColors.black} />
              ) : (
                <>
                  <MaterialIcons
                    name="shopping-bag"
                    size={18}
                    color={BrutalColors.black}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    Add • ₹{(numPrice * quantity).toFixed(0)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </BrutalCard>

        {/* Similar Shelf Items */}
        {relatedProducts.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
                marginBottom: 10,
              }}
            >
              Similar Shelf Items
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {relatedProducts.map((item) => (
                <BrutalCard key={item.id} style={{ width: '48%', padding: 8, overflow: 'hidden' }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push(`/(customer)/products/${item.id}`)}
                  >
                    <View
                      style={{
                        height: 90,
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                        marginBottom: 6,
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            item.images?.[0] ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '900',
                        color: BrutalColors.black,
                        marginTop: 2,
                      }}
                    >
                      ₹{Number(item.sellingPrice || 0).toFixed(0)}
                    </Text>
                  </TouchableOpacity>
                </BrutalCard>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
