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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const dbUser = await login(email.trim(), password);
      if (dbUser?.role === 'DELIVERY_PARTNER') {
        router.replace('/(delivery)/dashboard');
      } else if (dbUser?.role === 'SHOPKEEPER' || dbUser?.role === 'ADMIN') {
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

  const fillQuickAuth = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    if (error) clearError();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ HYPERLOCAL MESH · AUTHENTICATION TERMINAL" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 18, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Bar */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  {
                    width: 38,
                    height: 38,
                    backgroundColor: BrutalColors.yellow,
                    borderWidth: 2,
                    borderColor: BrutalColors.black,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  },
                  BrutalShadow.sm,
                ]}
              >
                <Text style={{ color: BrutalColors.black, fontWeight: '900', fontSize: 20 }}>
                  Ω
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 20,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    color: BrutalColors.black,
                  }}
                >
                  Omnidrop
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '800',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  12-Min Hyperlocal Mesh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(auth)/register')}
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
                Register →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Brutalist Card */}
          <BrutalCard style={{ padding: 20, marginBottom: 20 }}>
            <View style={{ marginBottom: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <BrutalBadge label="// SECURE GATEWAY" variant="yellow" />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    color: '#777',
                    textTransform: 'uppercase',
                  }}
                >
                  NODE V2.4
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '900',
                  color: BrutalColors.black,
                  textTransform: 'uppercase',
                  letterSpacing: -0.5,
                }}
              >
                Operator Sign In
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
                Authenticate your terminal to access live corridor dispatch, inventory, and order
                fulfillment.
              </Text>
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
              label="Operator Email"
              value={email}
              onChangeText={setEmail}
              placeholder="operator@omnidrop.network"
              keyboardType="email-address"
              leftIcon="email"
              autoCapitalize="none"
            />

            <View style={{ marginBottom: 6 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: BrutalColors.black,
                    letterSpacing: 0.6,
                  }}
                >
                  Passkey
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: BrutalColors.black,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Forgot Passkey?
                  </Text>
                </TouchableOpacity>
              </View>
              <BrutalInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter account passkey"
                secureTextEntry={!showPassword}
                leftIcon="lock"
                rightIcon={showPassword ? 'visibility-off' : 'visibility'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                autoCapitalize="none"
              />
            </View>

            <BrutalButton
              title="Authorize Session →"
              onPress={handleLogin}
              loading={loading}
              variant="yellow"
              size="lg"
              fullWidth
              style={{ marginTop: 6 }}
            />

            {/* Quick Test Node Fillers */}
            <View
              style={{
                marginTop: 22,
                paddingTop: 16,
                borderTopWidth: 2,
                borderTopColor: '#EEEEEE',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    color: '#666',
                    letterSpacing: 0.5,
                  }}
                >
                  Quick Fill Node Credentials:
                </Text>
                <BrutalBadge label="SANDBOX" variant="black" size="xs" />
              </View>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'Admin', email: 'suraj14879@gmail.com', variant: 'yellow' as const },
                  { label: 'Merchant', email: 'shopkeeper@test.com', variant: 'white' as const },
                  { label: 'Courier', email: 'rider@test.com', variant: 'green' as const },
                  { label: 'Customer', email: 'customer@test.com', variant: 'white' as const },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => fillQuickAuth(item.email)}
                    activeOpacity={0.8}
                    style={[
                      {
                        borderWidth: 1.5,
                        borderColor: BrutalColors.black,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor:
                          item.variant === 'yellow'
                            ? BrutalColors.yellow
                            : item.variant === 'green'
                              ? BrutalColors.green
                              : '#FFFFFF',
                      },
                      BrutalShadow.sm,
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                      }}
                    >
                      {item.label} Node
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BrutalCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
