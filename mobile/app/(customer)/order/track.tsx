import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import { useSocket } from '@/providers/socket-provider';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderTrackScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { socket, connected } = useSocket();
  const [order, setOrder] = useState<Models.Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchTracking = async () => {
    try {
      if (id) {
        const data = await api.orders.byId(id as string);
        setOrder(data);
      } else {
        const myOrders = await api.orders.myOrders();
        if (myOrders.items.length > 0) {
          setOrder(myOrders.items[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load track order:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  useEffect(() => {
    if (!socket || !connected) return;
    const activeOrderId = (id as string) || order?.id;
    if (!activeOrderId) return;

    socket.emit('room:join_order', { orderId: activeOrderId });

    const handleStatusUpdate = (data: Models.OrderStatusPayload) => {
      if (data.orderId === activeOrderId) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    };

    const handleLocationUpdate = (data: Models.DeliveryLocationPayload) => {
      if (data.orderId === activeOrderId && data.lat && data.lng) {
        setRiderLocation({ lat: data.lat, lng: data.lng });
      }
    };

    socket.on('order:status_updated', handleStatusUpdate);
    socket.on('delivery:location_updated', handleLocationUpdate);

    return () => {
      socket.off('order:status_updated', handleStatusUpdate);
      socket.off('delivery:location_updated', handleLocationUpdate);
      socket.emit('room:leave_order', { orderId: activeOrderId });
    };
  }, [socket, connected, id, order?.id]);

  const stages = [
    { key: 'PENDING', title: '1. Order Registered', desc: 'Captured in network ledger' },
    { key: 'PREPARING', title: '2. Store Packing', desc: 'SKUs inspected & bagged' },
    { key: 'READY_FOR_PICKUP', title: '3. Courier Docked', desc: 'Awaiting pilot handoff' },
    {
      key: 'OUT_FOR_DELIVERY',
      title: '4. Flight In-Transit',
      desc: 'Rider in neighborhood corridor',
    },
    { key: 'DELIVERED', title: '5. Doorstep Delivered', desc: 'Securely handed over' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'PREPARING':
        return 1;
      case 'READY_FOR_PICKUP':
        return 2;
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isDelivered = order?.status === 'DELIVERED';

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

  if (!order) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: BrutalColors.bg,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons name="gps-off" size={48} color={BrutalColors.black} />
        <Text
          style={{ fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginTop: 12 }}
        >
          No Active Radar Signal
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(customer)/home')}
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
            Back to Home
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ LIVE RADAR BROADCAST · 5-STAGE SATELLITE PIPELINE" />
      <BrutalHeader
        title="Live Dispatch Radar"
        subtitle={`Manifest #${order.id.slice(0, 8).toUpperCase()}`}
        rightAction={<BrutalBadge label={order.status} variant={isDelivered ? 'black' : 'green'} />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Pipeline Visualizer */}
        <BrutalCard style={{ padding: 18, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
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
              Dispatch Pipeline
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#666' }}>
              STEP {currentStep + 1} OF 5
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {stages.map((stage, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;

              return (
                <View
                  key={stage.key}
                  style={[
                    {
                      borderWidth: 2,
                      borderColor: BrutalColors.black,
                      padding: 12,
                      backgroundColor: isCurrent
                        ? BrutalColors.yellow
                        : isDone
                          ? '#E8FBF4'
                          : BrutalColors.white,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    isCurrent ? BrutalShadow.sm : {},
                  ]}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        backgroundColor: isCurrent
                          ? BrutalColors.black
                          : isDone
                            ? BrutalColors.green
                            : '#DDD',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                      }}
                    >
                      {isDone ? (
                        <MaterialIcons name="check" size={16} color={BrutalColors.black} />
                      ) : (
                        <Text
                          style={{
                            color: isCurrent ? BrutalColors.yellow : '#333',
                            fontSize: 11,
                            fontWeight: '900',
                          }}
                        >
                          {idx + 1}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          color: BrutalColors.black,
                        }}
                      >
                        {stage.title}
                      </Text>
                      <Text
                        style={{ fontSize: 10, fontWeight: '600', color: '#555', marginTop: 1 }}
                      >
                        {stage.desc}
                      </Text>
                    </View>
                  </View>

                  {isCurrent && <BrutalBadge label="ACTIVE" variant="black" />}
                </View>
              );
            })}
          </View>
        </BrutalCard>

        {/* Origin & Destination Waypoints */}
        <View style={{ gap: 12, marginBottom: 16 }}>
          {/* Live Courier Signal if in transit */}
          {(riderLocation || ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status)) && (
            <BrutalCard bg={BrutalColors.yellow} style={{ padding: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons
                    name="two-wheeler"
                    size={18}
                    color={BrutalColors.black}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    // SATELLITE RADAR: COURIER PILOT
                  </Text>
                </View>
                <BrutalBadge label="LIVE SIGNAL" variant="black" />
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Courier In Neighborhood Corridor
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#222', marginTop: 2 }}>
                {riderLocation
                  ? `Telemetry GPS: [${riderLocation.lat.toFixed(4)}, ${riderLocation.lng.toFixed(4)}] · Doppler: Nominal`
                  : 'Active courier dispatched from node. Real-time telemetry locked.'}
              </Text>
            </BrutalCard>
          )}

          {/* Waypoint 1: Store */}
          <BrutalCard style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <MaterialIcons
                name="store"
                size={16}
                color={BrutalColors.black}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: '#666',
                }}
              >
                // WAYPOINT 01: ORIGIN MICRO-HUB
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              {order.store?.name || 'Local Fulfillment Center'}
            </Text>
            <Text style={{ fontSize: 11, color: '#555', marginTop: 1 }}>
              {order.store?.address || 'Indiranagar 100ft Hub, Bengaluru'}
            </Text>
          </BrutalCard>

          {/* Waypoint 2: Destination */}
          <BrutalCard style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <MaterialIcons
                name="navigation"
                size={16}
                color={BrutalColors.black}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: '#666',
                }}
              >
                // WAYPOINT 02: CUSTOMER DOORSTEP
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              Delivery Destination
            </Text>
            <Text style={{ fontSize: 11, color: '#555', marginTop: 1 }}>
              {order.deliveryAddress || 'Doorstep corridor address'}
            </Text>
          </BrutalCard>
        </View>

        {/* If delivered, show rate button */}
        {isDelivered && (
          <View style={{ marginBottom: 12 }}>
            <BrutalButton
              title="Rate Mission & Delivery Pilot →"
              onPress={() =>
                router.push({
                  pathname: '/(customer)/order/rate',
                  params: { orderId: order?.id },
                })
              }
              variant="green"
              size="lg"
              fullWidth
            />
          </View>
        )}

        {/* Action Button */}
        <BrutalButton
          title="Return To Dashboard"
          onPress={() => router.push('/(customer)/home')}
          variant="yellow"
          size="md"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}
