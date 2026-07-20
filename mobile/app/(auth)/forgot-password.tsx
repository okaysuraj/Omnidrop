import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/(auth)/reset-password');
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
            <Text className="font-bold text-xl text-on-background ml-2">Reset Password</Text>
          </View>

          {/* Main Content */}
          <View className="flex-1 px-5 pt-8 pb-10">
            <View className="mb-10">
              <View className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Ionicons name="key-outline" size={32} color="#006e24" />
              </View>
              <Text className="font-bold text-2xl text-on-surface mb-2">Forgot Password?</Text>
              <Text className="text-base text-on-surface-variant">Don't worry! It happens. Please enter the email address associated with your account.</Text>
            </View>

            <View className="gap-6 flex-1">
              {/* Email Input */}
              <View className="gap-2">
                <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Email Address</Text>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 h-14">
                  <TextInput 
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your registered email"
                    placeholderTextColor="#6b7c68"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 text-base text-on-surface h-full"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={loading || email.length === 0}
                className={\`h-14 rounded-full flex-row items-center justify-center mt-4 active:opacity-80 \${email.length > 0 ? 'bg-primary' : 'bg-surface-container-high'}\`}
              >
                <Text className={\`font-bold text-base mr-2 \${email.length > 0 ? 'text-on-primary' : 'text-on-surface-variant'}\`}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
                {!loading && <Ionicons name="arrow-forward" size={20} color={email.length > 0 ? "#ffffff" : "#3b4b39"} />}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
