import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/lib/api';

export default function HandoverToRiderScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    api.delivery.activeTask().then(data => {
      setTask(data);
    }).catch(e => console.error(e));
  }, []);

  const handleConfirm = async () => {
    if (!task) return;
    setLoading(true);
    try {
      await api.delivery.updateStatus(task.id, 'PICKED_UP');
      router.push('/(rider)/live-tracking');
    } catch (e) {
      Alert.alert('Error', 'Failed to confirm pickup');
    } finally {
      setLoading(false);
    }
  };

  if (!task && !loading) {
    return <ActivityIndicator size="large" color="#00ff5f" style={{ marginTop: 100 }} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" style={{ backgroundColor: '#f8f9fa' }}>
      
      {/* Top AppBar */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-surface z-50 border-b border-surface-container-highest" style={{ backgroundColor: '#f8f9fa', borderBottomColor: '#e1e3e4' }}>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:scale-95">
            <Ionicons name="arrow-back" size={24} color="#006e24" />
          </TouchableOpacity>
          <Text className="font-extrabold text-xl tracking-tight" style={{ color: '#006e24' }}>Order Handover</Text>
        </View>
        <View className="bg-surface-container-high px-3 py-1 rounded-full" style={{ backgroundColor: '#e7e8e9' }}>
          <Text className="font-bold text-xs" style={{ color: '#3b4b39' }}>#{task?.order?.id?.slice(0,8).toUpperCase()}</Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-5 relative">
        
        {/* Status Indicator */}
        <View className="items-center mb-8 w-full max-w-sm">
          <View className="w-16 h-16 rounded-full items-center justify-center mb-4 shadow-lg" style={{ backgroundColor: '#00ff5f', shadowColor: '#00ff5f', shadowOpacity: 0.4, shadowRadius: 15 }}>
            <Ionicons name="bicycle" size={32} color="#007125" />
          </View>
          <Text className="font-bold text-2xl mb-2 text-center" style={{ color: '#191c1d' }}>Rider has arrived</Text>
          <Text className="text-base text-center" style={{ color: '#3b4b39' }}>Please verify the code before handing over the package.</Text>
        </View>

        {/* Verification Card */}
        <View className="w-full max-w-sm rounded-2xl p-6 shadow-xl flex-col items-center gap-6 border" style={{ backgroundColor: '#ffffff', borderColor: '#e1e3e4', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 30 }}>
          
          {/* Rider Profile */}
          <View className="items-center w-full">
            <View className="relative w-24 h-24 rounded-full border-4 mb-3" style={{ borderColor: '#f8f9fa' }}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' }}
                className="w-full h-full rounded-full"
              />
              <View className="absolute bottom-0 right-0 rounded-full w-6 h-6 items-center justify-center border-2" style={{ backgroundColor: '#00ff5f', borderColor: '#f8f9fa' }}>
                <Ionicons name="checkmark-circle" size={14} color="#007125" />
              </View>
            </View>
            <View className="items-center">
              <Text className="font-bold text-xl mb-1" style={{ color: '#191c1d' }}>{task?.order?.store?.name}</Text>
              <View className="flex-row items-center justify-center gap-1">
                <Ionicons name="location" size={16} color="#f59e0b" />
                <Text className="font-bold text-xs" style={{ color: '#3b4b39' }}>Pickup Point</Text>
              </View>
            </View>
          </View>

          <View className="w-full h-[1px]" style={{ backgroundColor: '#e1e3e4' }} />

          {/* PIN Code Display */}
          <View className="w-full items-center gap-4">
            <Text className="font-bold text-xs uppercase tracking-widest" style={{ color: '#3b4b39' }}>Show this Code to Store</Text>
            <View className="flex-row justify-center gap-3 w-full">
              {task?.order?.id?.slice(0, 4).split('').map((char: string, i: number) => (
                <View key={i} className="w-14 h-16 items-center justify-center rounded-xl border" style={{ backgroundColor: '#f3f4f5', borderColor: '#b9ccb5' }}>
                  <Text className="font-bold text-4xl uppercase" style={{ color: '#006e24' }}>{char}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Area */}
          <View className="w-full mt-4 items-center">
            <TouchableOpacity 
              onPress={handleConfirm}
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl flex-row justify-center items-center gap-2 active:scale-95 shadow-lg"
              style={{ backgroundColor: '#006e24', shadowColor: '#006e24', shadowOpacity: 0.4, shadowRadius: 14 }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
              <Text className="font-bold text-lg" style={{ color: '#ffffff' }}>{loading ? 'Confirming...' : 'Confirm Handover'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="py-4 mt-2 flex-row items-center gap-1 active:scale-95">
              <Ionicons name="help-circle-outline" size={16} color="#3b4b39" />
              <Text className="font-bold text-xs" style={{ color: '#3b4b39' }}>Report an issue</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
}
