import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalInput,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Models.Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [label, setLabel] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await api.users.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load addresses:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    if (!streetAddress || !city || !pincode) {
      Alert.alert('Required Fields', 'Please fill in Street Address, City, and Pincode.');
      return;
    }
    setSaving(true);
    try {
      await api.users.addAddress({
        label,
        addressLine1: streetAddress,
        city,
        state,
        pincode,
        lat: 12.9716,
        lng: 77.5946,
        isDefault: addresses.length === 0,
      });
      setModalVisible(false);
      setStreetAddress('');
      fetchAddresses();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e) || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    Alert.alert('Delete Coordinates', 'Remove this delivery waypoint?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.users.deleteAddress(id);
            fetchAddresses();
          } catch {
            Alert.alert('Error', 'Failed to delete address.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ DISPATCH COORDINATES · VERIFIED RESIDENTIAL NODES" />
      <BrutalHeader
        title="Saved Coordinates"
        subtitle="Delivery Gateways"
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            style={[
              {
                backgroundColor: BrutalColors.yellow,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                paddingHorizontal: 10,
                paddingVertical: 6,
                flexDirection: 'row',
                alignItems: 'center',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="add" size={16} color={BrutalColors.black} />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                textTransform: 'uppercase',
                marginLeft: 2,
                color: BrutalColors.black,
              }}
            >
              Add Node
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={BrutalColors.black} style={{ marginTop: 40 }} />
        ) : addresses.length === 0 ? (
          <BrutalCard style={{ padding: 30, alignItems: 'center', marginTop: 20 }}>
            <MaterialIcons name="location-off" size={48} color={BrutalColors.black} />
            <Text
              style={{ fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginTop: 12 }}
            >
              No Coordinates Recorded
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#666',
                textAlign: 'center',
                marginTop: 4,
                marginBottom: 16,
                lineHeight: 16,
              }}
            >
              Register your apartment, office or residence to enable instant 12-minute courier
              drops.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[
                {
                  backgroundColor: BrutalColors.yellow,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
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
                + Add First Node
              </Text>
            </TouchableOpacity>
          </BrutalCard>
        ) : (
          <View style={{ gap: 12 }}>
            {addresses.map((addr) => (
              <BrutalCard key={addr.id} style={{ padding: 14 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                      name={addr.label?.toLowerCase().includes('work') ? 'business' : 'home'}
                      size={18}
                      color={BrutalColors.black}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                      }}
                    >
                      {addr.label || 'Home'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    {addr.isDefault && <BrutalBadge label="PRIMARY" variant="green" />}
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(addr.id)}
                      style={{
                        padding: 5,
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                        backgroundColor: '#FFEBEA',
                      }}
                    >
                      <MaterialIcons name="delete-outline" size={16} color={BrutalColors.red} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={{ fontSize: 12, fontWeight: '600', color: '#222', marginTop: 2 }}>
                  {addr.addressLine1}
                </Text>
                <Text style={{ fontSize: 11, color: '#666', marginTop: 1 }}>
                  {addr.city}, {addr.state || 'Karnataka'} - {addr.pincode}
                </Text>
              </BrutalCard>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Coordinates Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: BrutalColors.bg,
              borderTopWidth: 3,
              borderTopColor: BrutalColors.black,
              padding: 20,
              maxHeight: '85%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Add Delivery Coordinates
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  backgroundColor: BrutalColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="close" size={18} color={BrutalColors.black} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Label Chips */}
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  color: BrutalColors.black,
                }}
              >
                Waypoint Label:
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                {['Home', 'Work', 'Other'].map((l) => (
                  <TouchableOpacity
                    key={l}
                    onPress={() => setLabel(l)}
                    activeOpacity={0.8}
                    style={{
                      borderWidth: 2,
                      borderColor: BrutalColors.black,
                      backgroundColor: label === l ? BrutalColors.yellow : BrutalColors.white,
                      paddingHorizontal: 16,
                      paddingVertical: 7,
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
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <BrutalInput
                label="Street Address / Gate / Floor"
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder="e.g. Flat 302, Palm Heights, 12th Main"
                leftIcon="location-on"
              />

              <BrutalInput
                label="City / Hyperlocal Cluster"
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Bengaluru"
                leftIcon="location-city"
              />

              <BrutalInput
                label="Pincode / Postal Code"
                value={pincode}
                onChangeText={setPincode}
                placeholder="560038"
                keyboardType="numeric"
                leftIcon="pin"
              />

              <BrutalButton
                title={saving ? 'SAVING COORDINATES...' : 'CONFIRM WAYPOINT →'}
                onPress={handleAddAddress}
                loading={saving}
                variant="yellow"
                size="lg"
                fullWidth
                style={{ marginTop: 10 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
