import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/lib/firebase';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'DELIVERY_PARTNER'>('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Get ID token
      const token = await userCredential.user.getIdToken();
      
      // 3. Create user in backend with the role
      await api.auth.register({
        fullName,
        role,
        idToken: token,
      });

      // The AuthProvider will handle the redirect automatically after login API succeeds
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{ justifyContent: 'center', flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}>
      <View className="items-center mb-8">
        <Text className="text-4xl mb-2">👋</Text>
        <Text className="text-3xl font-extrabold text-white">Join Omnidrop</Text>
        <Text className="text-slate-400 mt-2 text-center">
          Create an account to get started
        </Text>
      </View>

      <View className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
        {error ? (
          <Text className="text-red-400 mb-4 text-center">{error}</Text>
        ) : null}

        {/* Role Selector */}
        <View className="flex-row mb-6 bg-slate-900/50 rounded-xl p-1 border border-slate-700">
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${role === 'CUSTOMER' ? 'bg-indigo-500' : ''}`}
            onPress={() => setRole('CUSTOMER')}
          >
            <Text className={`font-bold ${role === 'CUSTOMER' ? 'text-white' : 'text-slate-400'}`}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${role === 'DELIVERY_PARTNER' ? 'bg-indigo-500' : ''}`}
            onPress={() => setRole('DELIVERY_PARTNER')}
          >
            <Text className={`font-bold ${role === 'DELIVERY_PARTNER' ? 'text-white' : 'text-slate-400'}`}>Rider</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-slate-300 font-semibold mb-2 ml-1">Full Name</Text>
          <TextInput
            className="bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white"
            placeholder="John Doe"
            placeholderTextColor="#64748b"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

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
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-indigo-400 font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
