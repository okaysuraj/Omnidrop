import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../../src/lib/api';

export default function RiderLiveTrackingScreen() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  const [speed, setSpeed] = useState(34);
  const [seconds, setSeconds] = useState(765);
  const [task, setTask] = useState<any>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api.delivery.activeTask().then(data => {
      setTask(data);
    }).catch(e => console.error(e));
  }, []);

  useEffect(() => {
    let speedInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;

    if (!isOffline) {
      speedInterval = setInterval(() => {
        setSpeed(Math.floor(Math.random() * (45 - 28) + 28));
      }, 3000);

      timerInterval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    return () => {
      clearInterval(speedInterval);
      clearInterval(timerInterval);
    };
  }, [isOffline]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerString = \`\${mins}:\${secs.toString().padStart(2, '0')}\`;

  const handleComplete = async () => {
    if (!task) return;
    setCompleting(true);
    try {
      await api.delivery.updateStatus(task.id, 'DELIVERED');
      router.push('/(rider)/home');
    } catch (e) {
      Alert.alert('Error', 'Failed to complete delivery');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-dim relative">
      {/* Background Map Simulation */}
      <View className="absolute inset-0 bg-surface-container-lowest">
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
          className="flex-1 opacity-60"
        />
        <LinearGradient
          colors={['rgba(19, 19, 19, 0.8)', 'rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0.9)']}
          locations={[0, 0.2, 0.8, 1]}
          className="absolute inset-0"
        />
        
        {/* Rider Marker */}
        <View className="absolute top-1/2 left-1/2 -translate-x-4 -translate-y-4 z-10 items-center justify-center">
          <View className="w-8 h-8 bg-primary-fixed rounded-full items-center justify-center z-20 shadow-lg shadow-primary-fixed/50 border-2 border-white">
            <Ionicons name="bicycle" size={16} color="#002106" />
          </View>
          <View className="absolute w-24 h-24 border border-primary-fixed rounded-full opacity-20" />
          <View className="absolute w-32 h-32 border border-primary-fixed-dim rounded-full opacity-10" />
        </View>
      </View>

      <SafeAreaView className="flex-1 justify-between">
        {/* Top App Bar */}
        <View className="w-full flex-row justify-between items-center px-5 pt-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
                className="w-full h-full"
              />
            </View>
            <Text className="font-extrabold text-xl text-primary-fixed">Order #{task?.order?.id?.slice(0,8).toUpperCase() || '...'}</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-surface-container/80 backdrop-blur-md active:scale-95">
            <Ionicons name="notifications" size={20} color="#e5e2e1" />
          </TouchableOpacity>
        </View>

        {/* Job Info & Controls */}
        <View className="px-5 w-full flex-row justify-between items-start mt-6 pointer-events-none">
          <View className="bg-surface-container border border-secondary-container rounded-full px-4 py-2 flex-row items-center gap-2 shadow-xl">
            <Ionicons name="cube" size={16} color="#caf300" />
            <Text className="font-bold text-xs text-secondary-container uppercase">Urgent Delivery</Text>
          </View>

          <View className="gap-4 pointer-events-auto">
            <TouchableOpacity className="w-12 h-12 bg-surface-container/90 text-primary-fixed rounded-xl items-center justify-center border border-outline-variant active:scale-95 shadow-lg backdrop-blur-md">
              <Ionicons name="locate" size={24} color="#6dff7f" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 bg-surface-container/90 text-on-surface rounded-xl items-center justify-center border border-outline-variant active:scale-95 shadow-lg backdrop-blur-md">
              <Ionicons name="layers" size={24} color="#e5e2e1" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1" />

        {/* Bottom Rider Dashboard */}
        <View className="w-full bg-surface-container-lowest p-5 pt-3 pb-8 border-t border-outline-variant/30 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {/* Swipe Handle */}
          <View className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-5" />
          
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {/* Large Telemetry Card */}
            <View className="w-full bg-surface-container flex-row items-center justify-between p-5 rounded-2xl border border-outline-variant/30 overflow-hidden relative">
              <View className="flex-col">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-1">Current Speed</Text>
                <View className="flex-row items-baseline gap-1">
                  <Text className="font-extrabold text-4xl text-primary-fixed tracking-tighter">{speed}</Text>
                  <Text className="font-bold text-lg text-primary-fixed-dim">KM/H</Text>
                </View>
              </View>
              {/* Simple Visualizer */}
              <View className="w-16 h-16 rounded-full border-[6px] border-surface-container-highest items-center justify-center relative">
                {/* Simulated speed arc */}
                <View className="absolute inset-0 rounded-full border-[6px] border-primary-fixed border-t-transparent border-l-transparent -rotate-45" />
                <Ionicons name="speedometer" size={24} color="#6dff7f" />
              </View>
            </View>

            {/* Distance Card */}
            <View className="w-[48%] bg-surface-container-high p-4 rounded-2xl border border-outline-variant/30 flex-col gap-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="map" size={16} color="#b9ccb5" />
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-widest">Distance</Text>
              </View>
              <View className="flex-row items-baseline gap-1">
                <Text className="font-bold text-2xl text-on-surface">4.8</Text>
                <Text className="font-bold text-sm text-on-surface-variant">KM</Text>
              </View>
            </View>

            {/* Time Card */}
            <View className="w-[48%] bg-surface-container-high p-4 rounded-2xl border border-outline-variant/30 flex-col gap-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="time" size={16} color="#b9ccb5" />
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-widest">Elapsed</Text>
              </View>
              <View className="flex-row items-baseline gap-1">
                <Text className="font-bold text-2xl text-on-surface">{timerString}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons Section */}
          <View className="mt-5 flex-row gap-4">
            <TouchableOpacity 
              onPress={handleComplete}
              disabled={completing || !task}
              className="flex-1 h-14 bg-primary-container rounded-xl flex-row items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              {completing ? <ActivityIndicator color="#002106" /> : <Ionicons name="checkmark-done" size={20} color="#002106" />}
              <Text className="text-on-primary-container font-bold text-base uppercase">Complete Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-14 h-14 border-2 border-outline-variant/50 rounded-xl items-center justify-center active:scale-95">
              <Ionicons name="call" size={24} color="#e5e2e1" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Offline Overlay */}
      {isOffline && (
        <View className="absolute inset-0 z-[100] bg-background/95 justify-center items-center p-8">
          <View className="w-32 h-32 rounded-full bg-surface-container-high items-center justify-center mb-8 border-4 border-outline-variant/30">
            <Ionicons name="moon" size={48} color="#b9ccb5" />
          </View>
          <Text className="font-bold text-3xl text-on-background mb-4">You're Offline</Text>
          <Text className="text-base text-on-surface-variant text-center mb-10">Your stats have been saved for the day. Ready to get back on the road?</Text>
          <TouchableOpacity 
            onPress={() => setIsOffline(false)}
            className="w-full h-14 bg-primary-container rounded-xl flex-row items-center justify-center active:scale-95 shadow-lg"
          >
            <Text className="text-on-primary-container font-bold text-lg uppercase tracking-wider">Go Online</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
