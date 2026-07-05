import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/lib/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // The AuthProvider will detect this state change and handle routing
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-900">
      <View className="items-center mb-10">
        <Text className="text-5xl mb-2">⚡</Text>
        <Text className="text-3xl font-extrabold text-white">Welcome Back</Text>
        <Text className="text-slate-400 mt-2 text-center">
          Login to continue with Omnidrop
        </Text>
      </View>

      <View className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
        {error ? (
          <Text className="text-red-400 mb-4 text-center">{error}</Text>
        ) : null}

        <View className="mb-4">
          <Text className="text-slate-300 font-semibold mb-2 ml-1">Email</Text>
          <TextInput
            className="bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white"
            placeholder="name@example.com"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-slate-300 font-semibold mb-2 ml-1">Password</Text>
          <TextInput
            className="bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white"
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-indigo-500 rounded-xl py-4 items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-indigo-400 font-bold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
