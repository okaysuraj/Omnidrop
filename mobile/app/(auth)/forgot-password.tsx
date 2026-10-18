import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalInput,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors } from '@/constants/theme';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword, error, clearError } = useAuth();

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch {
      // Error handled by Auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ CREDENTIAL RECOVERY · OMNIDROP SECURITY" />
      <BrutalHeader title="Passkey Recovery" subtitle="Identity Verification" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 18 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BrutalCard style={{ padding: 20, marginTop: 8 }}>
            <View style={{ marginBottom: 18 }}>
              <BrutalBadge
                label="// SECURITY DISPATCH"
                variant="yellow"
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: BrutalColors.black,
                  textTransform: 'uppercase',
                  letterSpacing: -0.3,
                }}
              >
                Reset Account Passkey
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
                Enter your registered operator email to receive a cryptographically verified passkey
                reset token.
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

            {success ? (
              <View style={{ gap: 16 }}>
                <View
                  style={{
                    backgroundColor: '#E8FBF4',
                    borderWidth: 2,
                    borderColor: BrutalColors.green,
                    padding: 14,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#008855"
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 13,
                        textTransform: 'uppercase',
                        color: BrutalColors.black,
                      }}
                    >
                      Dispatch Successful
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#333', fontWeight: '600', lineHeight: 17 }}>
                    Reset link transmitted to {email}. Check your inbox or spam directory to
                    authorize password update.
                  </Text>
                </View>

                <BrutalButton
                  title="Return To Sign In"
                  onPress={() => router.replace('/(auth)/login')}
                  variant="yellow"
                  size="md"
                  fullWidth
                />
              </View>
            ) : (
              <View>
                <BrutalInput
                  label="Registered Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="operator@omnidrop.network"
                  keyboardType="email-address"
                  leftIcon="email"
                  autoCapitalize="none"
                />

                <BrutalButton
                  title="Transmit Reset Token →"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={!email}
                  variant="yellow"
                  size="lg"
                  fullWidth
                  style={{ marginTop: 6 }}
                />

                <TouchableOpacity
                  onPress={() => router.replace('/(auth)/login')}
                  style={{ marginTop: 18, alignItems: 'center' }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: BrutalColors.black,
                    }}
                  >
                    ← Cancel & Return to Login
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </BrutalCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
