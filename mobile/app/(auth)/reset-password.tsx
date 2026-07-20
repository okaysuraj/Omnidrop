import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Strength calculation
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  let strengthColor = 'bg-error';
  let strengthText = 'Weak';
  let strengthTextColor = 'text-error';
  if (strength > 25 && strength <= 50) { strengthColor = 'bg-tertiary'; strengthText = 'Fair'; strengthTextColor = 'text-tertiary'; }
  else if (strength > 50 && strength <= 75) { strengthColor = 'bg-primary-fixed-dim'; strengthText = 'Good'; strengthTextColor = 'text-primary'; }
  else if (strength > 75) { strengthColor = 'bg-primary-container'; strengthText = 'Strong'; strengthTextColor = 'text-primary'; }
  if (password.length === 0) { strengthColor = 'bg-error'; strengthText = 'Weak'; strengthTextColor = 'text-outline'; strength = 0; }

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/login');
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
          <View className="flex-row items-center px-5 py-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 active:opacity-70">
              <Ionicons name="arrow-back" size={24} color="#006e24" />
            </TouchableOpacity>
            <Text className="font-bold text-xl text-on-background ml-2">Set New Password</Text>
          </View>

          {/* Main Content */}
          <View className="flex-1 px-5 pt-8 pb-10">
            <View className="mb-10">
              <View className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Ionicons name="lock-closed-outline" size={32} color="#006e24" />
              </View>
              <Text className="font-bold text-2xl text-on-surface mb-2">Secure Your Account</Text>
              <Text className="text-base text-on-surface-variant">Choose a strong password that you haven't used before to ensure your account stays protected.</Text>
            </View>

            <View className="gap-6 flex-1">
              {/* New Password Input */}
              <View className="gap-2">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">New Password</Text>
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
                <View className="pt-2">
                  <View className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <View className={\`h-full \${strengthColor}\`} style={{ width: \`\${strength}%\` }} />
                  </View>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className={\`text-xs font-medium \${strengthTextColor}\`}>Strength: {strengthText}</Text>
                    <View className="flex-row gap-1 items-center">
                      <Ionicons name="checkmark-circle" size={14} color={password.length >= 8 ? "#006e24" : "#b9ccb5"} />
                      <Text className="text-xs font-medium text-on-surface-variant">8+ chars</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="gap-2">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Confirm Password</Text>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 h-14">
                  <TextInput 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat password"
                    placeholderTextColor="#6b7c68"
                    secureTextEntry={!showConfirm}
                    className="flex-1 text-base text-on-surface h-full"
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="p-2 -mr-2">
                    <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#6b7c68" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Security Tip */}
              <View className="mt-6 p-4 bg-secondary-container rounded-2xl flex-row items-center gap-4">
                <View className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Ionicons name="shield-checkmark" size={24} color="#575d78" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-xs text-on-secondary-container mb-1">Security Tip</Text>
                  <Text className="text-xs text-on-secondary-container opacity-80">Avoid using common words or birthdays in your password.</Text>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading || password.length === 0}
                className="bg-primary h-14 rounded-full flex-row items-center justify-center mt-4 active:opacity-80"
              >
                <Text className="text-on-primary font-bold text-base mr-2">{loading ? 'Saving...' : 'Reset and Login'}</Text>
                {!loading && <Ionicons name="arrow-forward" size={20} color="#ffffff" />}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
