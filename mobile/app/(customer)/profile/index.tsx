import {
  BrutalBadge,
  BrutalBottomNav,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Terminate Session', 'Are you sure you want to sign out of the Omnidrop mesh?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Terminate Session',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(auth)/login');
          } catch (e) {
            console.error('Logout error:', e);
          }
        },
      },
    ]);
  };

  const displayName = user?.fullName || 'Verified Operator';
  const displayEmail = user?.email || 'operator@omnidrop.network';
  const roleLabel = user?.role || 'CUSTOMER';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ OPERATOR CONSOLE · AUTHENTICATED MESH SESSION" />
      <BrutalHeader
        title="Account Profile"
        subtitle="Operator Control"
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            style={[
              {
                width: 36,
                height: 36,
                backgroundColor: '#FFEBEA',
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="logout" size={18} color={BrutalColors.red} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Identity Brutal Card */}
        <BrutalCard style={{ padding: 20, alignItems: 'center', marginBottom: 20 }}>
          <View
            style={[
              {
                width: 72,
                height: 72,
                backgroundColor: BrutalColors.yellow,
                borderWidth: 2.5,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              },
              BrutalShadow.sm,
            ]}
          >
            <Text style={{ fontSize: 32, fontWeight: '900', color: BrutalColors.black }}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              letterSpacing: -0.3,
            }}
          >
            {displayName}
          </Text>

          <Text style={{ fontSize: 12, fontWeight: '700', color: '#666', marginTop: 2 }}>
            {displayEmail}
          </Text>

          <View style={{ marginTop: 10 }}>
            <BrutalBadge label={`ROLE: ${roleLabel}`} variant="yellow" />
          </View>
        </BrutalCard>

        {/* Navigation Menu */}
        <View style={{ gap: 10, marginBottom: 24 }}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(customer)/orders')}>
            <BrutalCard
              style={{
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: BrutalColors.subtle,
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons name="receipt-long" size={20} color={BrutalColors.black} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    Orders & Missions
                  </Text>
                  <Text style={{ fontSize: 11, color: '#666' }}>
                    View complete order history and real-time tracking
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={BrutalColors.black} />
            </BrutalCard>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(customer)/addresses')}
          >
            <BrutalCard
              style={{
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: BrutalColors.subtle,
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons name="location-on" size={20} color={BrutalColors.black} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    Delivery Coordinates
                  </Text>
                  <Text style={{ fontSize: 11, color: '#666' }}>
                    Saved home, office, and gate waypoints
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={BrutalColors.black} />
            </BrutalCard>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(customer)/wallet')}>
            <BrutalCard
              style={{
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: BrutalColors.yellow,
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={20}
                    color={BrutalColors.black}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    Omni Digital Wallet
                  </Text>
                  <Text style={{ fontSize: 11, color: '#666' }}>
                    Instant 1-click checkout & automated refunds
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={BrutalColors.black} />
            </BrutalCard>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(customer)/home')}>
            <BrutalCard
              style={{
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: BrutalColors.subtle,
                    borderWidth: 1.5,
                    borderColor: BrutalColors.black,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons name="store" size={20} color={BrutalColors.black} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    Micro-Hubs Nearby
                  </Text>
                  <Text style={{ fontSize: 11, color: '#666' }}>
                    Discover neighborhood stores in your delivery corridor
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={BrutalColors.black} />
            </BrutalCard>
          </TouchableOpacity>
        </View>

        {/* Terminate Session Button */}
        <BrutalButton
          title="Terminate Session"
          onPress={handleLogout}
          variant="red"
          size="md"
          fullWidth
        />
      </ScrollView>

      {/* Unified Bottom Nav */}
      <BrutalBottomNav currentTab="profile" />
    </SafeAreaView>
  );
}
