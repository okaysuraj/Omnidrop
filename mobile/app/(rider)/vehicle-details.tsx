import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState('scooter');
  const [plate, setPlate] = useState('');
  const [insurance, setInsurance] = useState('');
  const [color, setColor] = useState('Black');
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/(rider)/live-tracking'); // Going to tracking to test the flow
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ backgroundColor: '#131313' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Top AppBar */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-outline-variant/30 z-50 bg-background" style={{ backgroundColor: '#131313' }}>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="active:scale-95 transition-transform">
              <Ionicons name="arrow-back" size={24} color="#00e554" />
            </TouchableOpacity>
            <Text className="font-bold text-xl" style={{ color: '#00e554' }}>Vehicle Details</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Ionicons name="notifications" size={24} color="#00e554" />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} className="z-10" keyboardShouldPersistTaps="handled">
          <View className="px-5 pt-6 flex-1">
            
            {/* Visual Header */}
            <View className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-outline-variant/30 mb-8">
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1558562805-4bf1e2a724eb?auto=format&fit=crop&q=80&w=800' }}
                className="absolute inset-0"
              />
              <LinearGradient
                colors={['transparent', '#131313']}
                className="absolute inset-0 z-10"
              />
              <View className="absolute bottom-4 left-4 z-20">
                <Text className="font-bold text-xs uppercase tracking-widest mb-1" style={{ color: '#caf300' }}>Active Profile</Text>
                <Text className="font-extrabold text-2xl text-white">Setup Your Ride</Text>
              </View>
            </View>

            {/* Vehicle Type Selection */}
            <View className="mb-8">
              <Text className="font-bold text-lg mb-4 text-on-surface" style={{ color: '#e5e2e1' }}>Vehicle Type</Text>
              <View className="flex-row flex-wrap justify-between gap-y-3">
                
                {/* Bike */}
                <TouchableOpacity 
                  onPress={() => setVehicleType('bike')}
                  className={\`w-[23%] flex-col items-center justify-center py-4 rounded-xl border-2 active:scale-95 \${vehicleType === 'bike' ? 'bg-secondary-fixed border-secondary-fixed' : 'bg-surface-container-low border-outline-variant/30'}\`}
                  style={{ backgroundColor: vehicleType === 'bike' ? '#caf300' : '#1c1b1b' }}
                >
                  <Ionicons name="bicycle" size={28} color={vehicleType === 'bike' ? '#171e00' : '#e5e2e1'} className="mb-2" />
                  <Text className="font-bold text-xs" style={{ color: vehicleType === 'bike' ? '#171e00' : '#e5e2e1' }}>Bike</Text>
                </TouchableOpacity>

                {/* Scooter */}
                <TouchableOpacity 
                  onPress={() => setVehicleType('scooter')}
                  className={\`w-[23%] flex-col items-center justify-center py-4 rounded-xl border-2 active:scale-95 \${vehicleType === 'scooter' ? 'bg-secondary-fixed border-secondary-fixed' : 'bg-surface-container-low border-outline-variant/30'}\`}
                  style={{ backgroundColor: vehicleType === 'scooter' ? '#caf300' : '#1c1b1b' }}
                >
                  <Ionicons name="bicycle" size={28} color={vehicleType === 'scooter' ? '#171e00' : '#e5e2e1'} className="mb-2" />
                  <Text className="font-bold text-xs" style={{ color: vehicleType === 'scooter' ? '#171e00' : '#e5e2e1' }}>Scooter</Text>
                </TouchableOpacity>

                {/* Cycle */}
                <TouchableOpacity 
                  onPress={() => setVehicleType('cycle')}
                  className={\`w-[23%] flex-col items-center justify-center py-4 rounded-xl border-2 active:scale-95 \${vehicleType === 'cycle' ? 'bg-secondary-fixed border-secondary-fixed' : 'bg-surface-container-low border-outline-variant/30'}\`}
                  style={{ backgroundColor: vehicleType === 'cycle' ? '#caf300' : '#1c1b1b' }}
                >
                  <Ionicons name="bicycle-outline" size={28} color={vehicleType === 'cycle' ? '#171e00' : '#e5e2e1'} className="mb-2" />
                  <Text className="font-bold text-xs" style={{ color: vehicleType === 'cycle' ? '#171e00' : '#e5e2e1' }}>Cycle</Text>
                </TouchableOpacity>

                {/* Electric */}
                <TouchableOpacity 
                  onPress={() => setVehicleType('electric')}
                  className={\`w-[23%] flex-col items-center justify-center py-4 rounded-xl border-2 active:scale-95 \${vehicleType === 'electric' ? 'bg-secondary-fixed border-secondary-fixed' : 'bg-surface-container-low border-outline-variant/30'}\`}
                  style={{ backgroundColor: vehicleType === 'electric' ? '#caf300' : '#1c1b1b' }}
                >
                  <Ionicons name="flash" size={28} color={vehicleType === 'electric' ? '#171e00' : '#e5e2e1'} className="mb-2" />
                  <Text className="font-bold text-xs" style={{ color: vehicleType === 'electric' ? '#171e00' : '#e5e2e1' }}>Electric</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Registration Form */}
            <View className="gap-6 mb-8">
              {/* Plate Number */}
              <View className="gap-2">
                <Text className="font-bold text-xs uppercase text-on-surface-variant" style={{ color: '#b9ccb5' }}>Vehicle Plate Number</Text>
                <View className="flex-row items-center border-2 border-outline-variant/50 rounded-xl px-4 h-16" style={{ backgroundColor: '#353534' }}>
                  <Ionicons name="pricetag" size={24} color="#b9ccb5" />
                  <TextInput 
                    value={plate}
                    onChangeText={setPlate}
                    placeholder="e.g. ABC 1234"
                    placeholderTextColor="rgba(185, 204, 181, 0.3)"
                    autoCapitalize="characters"
                    className="flex-1 text-xl font-bold uppercase ml-3"
                    style={{ color: '#00e554' }}
                  />
                </View>
              </View>

              {/* Insurance */}
              <View className="gap-2">
                <Text className="font-bold text-xs uppercase text-on-surface-variant" style={{ color: '#b9ccb5' }}>Insurance Policy Number</Text>
                <View className="flex-row items-center border-2 border-outline-variant/50 rounded-xl px-4 h-16" style={{ backgroundColor: '#353534' }}>
                  <Ionicons name="shield-checkmark" size={24} color="#b9ccb5" />
                  <TextInput 
                    value={insurance}
                    onChangeText={setInsurance}
                    placeholder="POL-9988-XXXX"
                    placeholderTextColor="rgba(185, 204, 181, 0.3)"
                    autoCapitalize="characters"
                    className="flex-1 text-xl font-bold uppercase ml-3"
                    style={{ color: '#00e554' }}
                  />
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1 gap-2">
                  <Text className="font-bold text-xs uppercase text-on-surface-variant" style={{ color: '#b9ccb5' }}>Color</Text>
                  <View className="flex-row items-center border-2 border-outline-variant/50 rounded-xl px-4 h-16" style={{ backgroundColor: '#353534' }}>
                    <TextInput 
                      value={color}
                      onChangeText={setColor}
                      placeholder="Color"
                      placeholderTextColor="rgba(185, 204, 181, 0.3)"
                      className="flex-1 text-base text-on-surface"
                      style={{ color: '#e5e2e1' }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Document Upload Prompt */}
            <TouchableOpacity className="p-6 border-2 border-dashed border-outline-variant/50 rounded-2xl flex-col items-center text-center active:scale-95" style={{ backgroundColor: '#201f1f' }}>
              <Ionicons name="cloud-upload" size={32} color="#b9ccb5" className="mb-2" />
              <Text className="font-bold text-lg mb-1" style={{ color: '#e5e2e1' }}>Vehicle Documents</Text>
              <Text className="text-sm mb-4 text-center" style={{ color: '#b9ccb5' }}>Upload Registration & Insurance PDF</Text>
              <View className="px-6 py-2 border-2 rounded-full" style={{ borderColor: '#caf300' }}>
                <Text className="font-bold text-sm" style={{ color: '#caf300' }}>Browse Files</Text>
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Action Button */}
      <View className="absolute bottom-6 left-0 w-full px-5 z-40">
        <TouchableOpacity 
          onPress={handleUpdate}
          disabled={loading}
          className="w-full h-16 rounded-xl flex-row items-center justify-center gap-3 active:scale-95 shadow-lg shadow-primary-fixed/20"
          style={{ backgroundColor: '#00ff5f' }}
        >
          <Text className="font-bold text-lg" style={{ color: '#007125' }}>{loading ? 'Updating...' : 'Update Vehicle'}</Text>
          {!loading && <Ionicons name="checkmark-circle" size={24} color="#007125" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
