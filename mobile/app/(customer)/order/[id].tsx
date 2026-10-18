import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Models.Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.orders.byId(id as string);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ MISSION INITIALIZED · DISPATCH LOCKED" />
      <BrutalHeader
        title="Order Confirmed"
        subtitle={`#${order?.id?.substring(0, 8).toUpperCase() || 'MANIFEST'}`}
        showBack={false}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Brutalist Confirmation Card */}
        <BrutalCard
          bg={BrutalColors.yellow}
          style={{ padding: 24, alignItems: 'center', marginBottom: 16 }}
        >
          <View
            style={[
              {
                width: 64,
                height: 64,
                backgroundColor: BrutalColors.black,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="check" size={40} color={BrutalColors.yellow} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              textAlign: 'center',
              letterSpacing: -0.5,
            }}
          >
            Order Dispatched!
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              textTransform: 'uppercase',
              color: '#333',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            Manifest #{order?.id?.substring(0, 8).toUpperCase()} locked in queue
          </Text>
        </BrutalCard>

        {/* Corridor SLA Card */}
        <BrutalCard style={{ padding: 18, marginBottom: 16 }}>
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
                name="timer"
                size={20}
                color={BrutalColors.black}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Target Delivery SLA
              </Text>
            </View>
            <BrutalBadge label="12-18 MINS" variant="green" />
          </View>

          <Text style={{ fontSize: 26, fontWeight: '900', color: BrutalColors.black }}>
            12–18 <Text style={{ fontSize: 14, fontWeight: '700' }}>MINUTES</Text>
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#666', marginTop: 2 }}>
            Expedited courier dispatching from {order?.store?.name || 'Local Store Hub'}.
          </Text>

          <View
            style={{
              height: 10,
              backgroundColor: '#EEEEEE',
              borderWidth: 1.5,
              borderColor: BrutalColors.black,
              marginTop: 14,
              overflow: 'hidden',
            }}
          >
            <View style={{ width: '45%', height: '100%', backgroundColor: BrutalColors.yellow }} />
          </View>
        </BrutalCard>

        {/* Order Items Receipt Manifest */}
        <BrutalCard style={{ padding: 18, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              marginBottom: 10,
            }}
          >
            Physical Items ({order?.items?.length || 0})
          </Text>

          <View
            style={{
              gap: 8,
              borderBottomWidth: 1.5,
              borderBottomColor: BrutalColors.black,
              paddingBottom: 12,
            }}
          >
            {order?.items?.map((item, idx: number) => (
              <View
                key={item.id || idx}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: BrutalColors.black,
                    flex: 1,
                    marginRight: 8,
                  }}
                  numberOfLines={1}
                >
                  {item.quantity}x {item.name || item.product?.name || 'Item'}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: BrutalColors.black }}>
                  ₹{(Number(item.unitPrice || 0) * item.quantity).toFixed(0)}
                </Text>
              </View>
            ))}
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
                fontSize: 13,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              Gross Total
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: BrutalColors.black }}>
              ₹{Number(order?.total || 0).toFixed(0)}
            </Text>
          </View>
        </BrutalCard>

        {/* Actions */}
        <View style={{ gap: 10 }}>
          <BrutalButton
            title="Track Live Radar →"
            onPress={() =>
              router.push({ pathname: '/(customer)/order/track', params: { id: order?.id } })
            }
            variant="yellow"
            size="lg"
            fullWidth
          />

          <BrutalButton
            title="Return To Home"
            onPress={() => router.replace('/(customer)/home')}
            variant="white"
            size="md"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
