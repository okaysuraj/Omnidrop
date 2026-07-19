import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/providers/auth-provider';
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME } from '../../src/lib/location-task';
import MapView, { Marker } from 'react-native-maps';

export default function DeliveryDashboard() {
  const [activeTask, setActiveTask] = useState<any>(null);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [active, available] = await Promise.all([
          api.delivery.activeTask().catch(() => null),
          api.delivery.available().catch(() => []),
        ]);
        setActiveTask(active);
        setAvailableTasks(available as any[] || []);
        setIsAvailable(user?.isAvailable || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
      }
    })();
  }, []);

  // Handle location task based on activeTask status
  useEffect(() => {
    const handleLocationTracking = async () => {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      
      if (activeTask?.status === 'IN_TRANSIT') {
        if (!hasStarted) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
            showsBackgroundLocationIndicator: true,
          });
        }
      } else {
        if (hasStarted) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }
    };
    handleLocationTracking();
  }, [activeTask]);

  const toggleAvailability = async () => {
    try {
      const result = await api.delivery.toggleAvailability() as any;
      setIsAvailable(result.isAvailable);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptTask = async (taskId: string) => {
    try {
      const task = await api.delivery.acceptTask(taskId);
      setActiveTask(task);
      setAvailableTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      const task = await api.delivery.updateStatus(taskId, status);
      setActiveTask(task.status === 'DELIVERED' ? null : task);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="flex-1 bg-slate-900 px-4 pt-4">
      {/* Header controls */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity 
          onPress={toggleAvailability} 
          className={`px-4 py-2 rounded-full border ${isAvailable ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}
        >
          <Text className={`font-bold ${isAvailable ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isAvailable ? '● Online' : '○ Offline'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          <Text className="text-slate-300 font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" className="mt-10" />
      ) : activeTask ? (
        <View className="flex-1">
          <Text className="text-white font-extrabold text-2xl mb-4">Active Delivery</Text>
          <View className="bg-slate-800 p-6 rounded-3xl border border-indigo-500/50">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white font-bold text-xl">Order #{activeTask.orderId?.slice(-6)}</Text>
              <View className="bg-indigo-500/20 px-3 py-1 rounded-full">
                <Text className="text-indigo-400 font-bold text-xs">{activeTask.status}</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-slate-400 text-sm mb-1">Pickup From</Text>
              <Text className="text-white font-semibold">{activeTask.order?.store?.name}</Text>
            </View>

            <View className="mb-6">
              <Text className="text-slate-400 text-sm mb-1">Deliver To</Text>
              <Text className="text-white font-semibold">{activeTask.order?.deliveryAddress}</Text>
            </View>

            {/* Live Map Tracking */}
            <View className="h-48 mb-4 rounded-xl overflow-hidden border border-indigo-500/30">
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 28.7041,
                  longitude: 77.1025,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker coordinate={{ latitude: 28.7041, longitude: 77.1025 }} title="Pickup" />
              </MapView>
            </View>

            <View className="flex-row gap-2 mt-4">
              {activeTask.status === 'ACCEPTED' && (
                <TouchableOpacity className="flex-1 bg-indigo-500 py-4 rounded-xl items-center" onPress={() => updateStatus(activeTask.id, 'PICKED_UP')}>
                  <Text className="text-white font-bold">Mark Picked Up</Text>
                </TouchableOpacity>
              )}
              {activeTask.status === 'PICKED_UP' && (
                <TouchableOpacity className="flex-1 bg-indigo-500 py-4 rounded-xl items-center" onPress={() => updateStatus(activeTask.id, 'IN_TRANSIT')}>
                  <Text className="text-white font-bold">Start Delivery</Text>
                </TouchableOpacity>
              )}
              {activeTask.status === 'IN_TRANSIT' && (
                <TouchableOpacity className="flex-1 bg-emerald-500 py-4 rounded-xl items-center" onPress={() => updateStatus(activeTask.id, 'DELIVERED')}>
                  <Text className="text-white font-bold">Mark Delivered ✓</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <Text className="text-white font-extrabold text-2xl mb-4">Available Tasks</Text>
          {availableTasks.length === 0 ? (
            <View className="items-center justify-center flex-1 pb-20">
              <Text className="text-4xl mb-2">📍</Text>
              <Text className="text-slate-300 font-bold text-lg">No available deliveries</Text>
            </View>
          ) : (
            availableTasks.map(task => (
              <View key={task.id} className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700 flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold">{task.order?.store?.name}</Text>
                  <Text className="text-slate-400 text-sm mt-1">₹{task.order?.total}</Text>
                </View>
                <TouchableOpacity className="bg-indigo-500 px-4 py-2 rounded-xl" onPress={() => acceptTask(task.id)}>
                  <Text className="text-white font-bold">Accept</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}
