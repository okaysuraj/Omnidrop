import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalInput,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'SHOPKEEPER' | 'DELIVERY_PARTNER'>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !fullName) return;
    setLoading(true);
    try {
      await register(email.trim(), password, fullName.trim(), role);
      if (role === 'DELIVERY_PARTNER') {
        router.replace('/(delivery)/dashboard');
      } else if (role === 'SHOPKEEPER') {
        router.replace('/(merchant)/orders');
      } else {
        router.replace('/(customer)/home');
      }
    } catch {
      // Error handled by Auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ NODE ONBOARDING · OMNIDROP MESH REGISTRY" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 18 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                {
                  width: 36,
                  height: 36,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  backgroundColor: BrutalColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                BrutalShadow.sm,
              ]}
            >
              <MaterialIcons name="arrow-back" size={20} color={BrutalColors.black} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={[
                {
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  backgroundColor: BrutalColors.white,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                },
                BrutalShadow.sm,
              ]}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Sign In Instead →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Card */}
          <BrutalCard style={{ padding: 20, marginBottom: 20 }}>
            <View style={{ marginBottom: 18 }}>
              <BrutalBadge
                label="// SYSTEM PROVISIONING"
                variant="yellow"
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '900',
                  color: BrutalColors.black,
                  textTransform: 'uppercase',
                  letterSpacing: -0.5,
                }}
              >
                Register New Node
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#555',
                  marginTop: 4,
                  lineHeight: 17,
                }}
              >
                Select your participant role in the Omnidrop mesh and configure access credentials.
              </Text>
            </View>

            {/* Role Selector Cards */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              Select Operating Role:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
              {[
                { id: 'CUSTOMER', label: 'Customer', desc: 'Doorstep Drops', icon: 'shopping-bag' },
                { id: 'SHOPKEEPER', label: 'Merchant', desc: 'Store Hub', icon: 'store' },
                {
                  id: 'DELIVERY_PARTNER',
                  label: 'Courier',
                  desc: 'Flight Pilot',
                  icon: 'two-wheeler',
                },
              ].map((r) => {
                const isSelected = role === r.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => setRole(r.id as typeof role)}
                    activeOpacity={0.8}
                    style={[
                      {
                        flex: 1,
                        borderWidth: 2,
                        borderColor: BrutalColors.black,
                        backgroundColor: isSelected ? BrutalColors.yellow : BrutalColors.white,
                        paddingVertical: 10,
                        paddingHorizontal: 6,
                        alignItems: 'center',
                      },
                      isSelected ? BrutalShadow.sm : {},
                    ]}
                  >
                    <MaterialIcons
                      name={r.icon as React.ComponentProps<typeof MaterialIcons>['name']}
                      size={20}
                      color={BrutalColors.black}
                      style={{ marginBottom: 4 }}
                    />
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                      }}
                    >
                      {r.label}
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#555', marginTop: 1 }}>
                      {r.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {error && (
              <View
                style={{
                  backgroundColor: '#FFEBEA',
                  borderWidth: 2,
                  borderColor: BrutalColors.red,
                  padding: 10,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}
                >
                  <MaterialIcons
                    name="error-outline"
                    size={16}
                    color={BrutalColors.red}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{ color: BrutalColors.red, fontWeight: '800', fontSize: 11, flex: 1 }}
                  >
                    {error}
                  </Text>
                </View>
                <TouchableOpacity onPress={clearError} style={{ padding: 2 }}>
                  <MaterialIcons name="close" size={16} color={BrutalColors.red} />
                </TouchableOpacity>
              </View>
            )}

            <BrutalInput
              label="Operator Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Alex Rivers"
              autoCapitalize="words"
              leftIcon="person"
            />

            <BrutalInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="operator@omnidrop.network"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
            />

            <BrutalInput
              label="Create Passkey"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              autoCapitalize="none"
            />

            <BrutalButton
              title="Initialize Node →"
              onPress={handleRegister}
              loading={loading}
              variant="yellow"
              size="lg"
              fullWidth
              style={{ marginTop: 8 }}
            />
          </BrutalCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
