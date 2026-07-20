import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home'); // Navigate to home after login
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
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="active:opacity-70">
              <Text className="text-primary font-bold text-sm">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View className="flex-1 px-5 pt-10 pb-10">
            <View className="mb-10">
              <Text className="font-extrabold text-4xl text-primary mb-2 italic tracking-tighter">OmniDrop</Text>
              <Text className="text-2xl font-bold text-on-surface mb-2">Welcome Back</Text>
              <Text className="text-base text-on-surface-variant">Sign in to continue your seamless delivery experience.</Text>
            </View>

            <View className="gap-6 flex-1">
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
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Password</Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                    <Text className="font-bold text-xs text-primary">Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 h-14">
                  <TextInput 
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#6b7c68"
                    secureTextEntry={!showPassword}
                    className="flex-1 text-base text-on-surface h-full"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6b7c68" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity 
                onPress={handleLogin}
                disabled={loading}
                className="bg-primary h-14 rounded-full flex-row items-center justify-center mt-4 active:opacity-80"
              >
                <Text className="text-on-primary font-bold text-base mr-2">{loading ? 'Signing In...' : 'Sign In'}</Text>
                {!loading && <Ionicons name="arrow-forward" size={20} color="#ffffff" />}
              </TouchableOpacity>

              <View className="flex-row items-center gap-4 my-6">
                <View className="flex-1 h-[1px] bg-outline-variant/50" />
                <Text className="text-xs font-bold text-on-surface-variant uppercase">Or continue with</Text>
                <View className="flex-1 h-[1px] bg-outline-variant/50" />
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity className="flex-1 h-14 rounded-xl border border-outline-variant items-center justify-center bg-surface-container-lowest active:opacity-70">
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 h-14 rounded-xl border border-outline-variant items-center justify-center bg-surface-container-lowest active:opacity-70">
                  <Ionicons name="logo-apple" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
