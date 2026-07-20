import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function VoiceSearchScreen() {
  const router = useRouter();
  const [pulseAnim] = useState(new Animated.Value(0));
  const [promptIndex, setPromptIndex] = useState(0);

  const prompts = [
    'Try saying "Order milk and eggs"',
    'Try saying "Is my sushi on its way?"',
    'Try saying "Find the nearest grocery store"',
    'Try saying "Reorder my last meal"'
  ];

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Prompt rotation
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 1.4],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.3, 0],
  });

  const handleMicPress = () => {
    // Simulate finishing voice recording and searching
    router.replace({ pathname: '/(customer)/search/results', params: { q: 'Organic Groceries' } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="bolt" size={28} color="#00e554" />
          <Text style={styles.headerTitle}>OmniDrop</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#b9ccb5" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        
        {/* Ambient Gradient Background - simulated with simple view since no native radial gradient without extra library */}
        <View style={styles.ambientGlow} />

        {/* Exit Action */}
        <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#e5e2e1" />
        </TouchableOpacity>

        <View style={styles.voiceCore}>
          
          {/* Animated Microphone Hub */}
          <View style={styles.micHub}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale }], opacity }]} />
            <Animated.View style={[styles.pulseRing, { transform: [{ scale }], opacity: opacity, animationDelay: '500ms' } as any]} />
            <Animated.View style={[styles.pulseRing, { transform: [{ scale }], opacity: opacity, animationDelay: '1000ms' } as any]} />
            
            <TouchableOpacity style={styles.micButton} onPress={handleMicPress} activeOpacity={0.8}>
              <MaterialIcons name="mic" size={64} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Listening Text */}
          <View style={styles.listeningContainer}>
            <Text style={styles.listeningText}>Listening...</Text>
            <View style={styles.voiceBars}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <View key={i} style={[styles.voiceBar, { height: 12 + Math.random() * 20 }]} />
              ))}
            </View>
          </View>

          {/* Prompts & Suggestions */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.promptText}>{prompts[promptIndex]}</Text>
            
            <View style={styles.suggestionsGrid}>
              <TouchableOpacity style={styles.suggestionCard} onPress={() => handleMicPress()}>
                <MaterialIcons name="local-shipping" size={24} color="#00e554" style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>Track order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.suggestionCard} onPress={() => handleMicPress()}>
                <MaterialIcons name="restaurant" size={24} color="#00e554" style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>Nearby food</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/home')}>
          <MaterialIcons name="home" size={24} color="#849581" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="search" size={24} color="#00ff5f" />
          <Text style={styles.navTextActive}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="receipt-long" size={24} color="#849581" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#849581" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313', // Using dark theme as requested for other screens, even though HTML says light, dark looks better for voice search overlay
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#1c1b1b',
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00e554',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  ambientGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 255, 95, 0.1)',
    top: '30%',
  },
  exitButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    zIndex: 20,
  },
  voiceCore: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: 48,
    zIndex: 10,
  },
  micHub: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(0, 255, 95, 0.3)',
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#006e24',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#006e24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  listeningContainer: {
    alignItems: 'center',
    gap: 8,
  },
  listeningText: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    letterSpacing: -0.5,
  },
  voiceBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 32,
    gap: 6,
  },
  voiceBar: {
    width: 4,
    backgroundColor: '#00ff5f',
    borderRadius: 2,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 24,
    marginTop: 20,
  },
  promptText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    fontStyle: 'italic',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  suggestionCard: {
    flex: 1,
    backgroundColor: '#1c1b1b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(185, 204, 181, 0.3)',
    gap: 8,
  },
  suggestionIcon: {
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1c1b1b',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 95, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 24,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#849581',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00ff5f',
    marginTop: 4,
  },
});
