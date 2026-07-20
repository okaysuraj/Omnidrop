import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Strength calculation
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  let strengthColor = 'bg-error';
  if (strength > 25 && strength <= 50) strengthColor = 'bg-tertiary';
  else if (strength > 50 && strength <= 75) strengthColor = 'bg-primary-fixed-dim';
  else if (strength > 75) strengthColor = 'bg-primary-container';

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="flex-row justify-between items-center px-5 py-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 active:opacity-70">
              <Ionicons name="arrow-back" size={24} color="#006e24" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="active:opacity-70">
              <Text className="text-primary font-bold text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View className="flex-1 px-5 pt-8 pb-10">
            <View className="mb-8">
              <Text className="text-2xl font-bold text-on-surface mb-2">Create Account</Text>
              <Text className="text-base text-on-surface-variant">Join OmniDrop today and experience delivery reimagined.</Text>
            </View>

            <View className="gap-6 flex-1">
              {/* Full Name Input */}
              <View className="gap-2">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Full Name</Text>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 h-14 focus:border-primary">
                  <TextInput 
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Alex Rivers"
                    placeholderTextColor="#6b7c68"
                    autoCapitalize="words"
                    className="flex-1 text-base text-on-surface h-full"
                  />
                  {fullName.length > 2 && (
                    <Ionicons name="checkmark-circle" size={20} color="#006e24" />
                  )}
                </View>
              </View>

              {/* Email Input */}
              <View className="gap-2">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Email Address</Text>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 h-14">
                  <TextInput 
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#6b7c68"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 text-base text-on-surface h-full"
                  />
                  {email.length > 0 && (
                    <Ionicons name="checkmark-circle" size={20} color="#006e24" />
                  )}
                </View>
              </View>

              {/* Password Input */}
              <View className="gap-2">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Password</Text>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 h-14">
                  <TextInput 
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#6b7c68"
                    secureTextEntry={!showPassword}
                    className="flex-1 text-base text-on-surface h-full"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6b7c68" />
                  </TouchableOpacity>
                </View>
                
                {/* Strength Indicator */}
                {password.length > 0 && (
                  <View className="pt-1">
                    <View className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <View className={\`h-full \${strengthColor}\`} style={{ width: \`\${strength}%\` }} />
                    </View>
                  </View>
                )}
              </View>

              {/* Terms Checkbox placeholder - keeping it simple for now */}
              <View className="flex-row items-center mt-2 pr-4">
                <Text className="text-xs text-on-surface-variant flex-1 flex-wrap">
                  By creating an account, you agree to our <Text className="font-bold text-primary">Terms of Service</Text> and <Text className="font-bold text-primary">Privacy Policy</Text>.
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity 
                onPress={handleRegister}
                disabled={loading}
                className="bg-primary h-14 rounded-full flex-row items-center justify-center mt-2 active:opacity-80"
              >
                <Text className="text-on-primary font-bold text-base mr-2">{loading ? 'Creating Account...' : 'Create Account'}</Text>
                {!loading && <Ionicons name="arrow-forward" size={20} color="#ffffff" />}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
