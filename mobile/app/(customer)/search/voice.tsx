import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VoiceSearchScreen() {
  const router = useRouter();
  const [pulseAnim] = useState(new Animated.Value(0));
  const [promptIndex, setPromptIndex] = useState(0);

  const prompts = [
    'TRY SAYING: "ORDER MILK, BREAD AND EGGS"',
    'TRY SAYING: "TRACK ACTIVE DRONE SHIPMENT"',
    'TRY SAYING: "NEAREST 10-MIN GROCERY HUB"',
    'TRY SAYING: "REORDER LAST BASKET MANIFEST"',
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const handleMicPress = () => {
    router.replace({
      pathname: '/(customer)/search/results',
      params: { q: 'Organic Produce' },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip
        left="VOICE RADAR // SPEECH-TO-TELEMETRY"
        right="AUDIO-STREAM: ACTIVE"
      />

      <BrutalHeader
        title="Voice Radar"
        subtitle="Speech Search Engine"
        onBack={() => router.back()}
        rightAction={<BrutalBadge label="LISTEN" variant="green" />}
      />

      <View style={styles.mainContent}>
        {/* Radar Wave Station */}
        <View style={styles.micStation}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale }] }]} />

          <TouchableOpacity style={styles.micButton} onPress={handleMicPress} activeOpacity={0.8}>
            <MaterialIcons name="mic" size={48} color={BrutalColors.black} />
          </TouchableOpacity>
        </View>

        {/* Listening Status & Frequency Meters */}
        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>LISTENING FOR INSTRUCTION...</Text>
          <View style={styles.frequencyMeters}>
            {[24, 40, 16, 32, 48, 20, 36, 12].map((height, idx) => (
              <View key={idx} style={[styles.freqBar, { height }]} />
            ))}
          </View>
        </View>

        {/* Dynamic Prompts Box */}
        <BrutalCard
          bg={BrutalColors.yellow}
          style={{ width: '100%', marginBottom: 16, padding: 14 }}
        >
          <Text style={styles.promptHeader}>VOICE SYNTAX PROMPT</Text>
          <Text style={styles.promptText}>{prompts[promptIndex]}</Text>
        </BrutalCard>

        {/* Quick Voice Shortcuts */}
        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            style={styles.shortcutBtn}
            onPress={() =>
              router.push({
                pathname: '/(customer)/search/results',
                params: { q: 'Track Order' },
              })
            }
            activeOpacity={0.8}
          >
            <MaterialIcons name="navigation" size={20} color={BrutalColors.black} />
            <Text style={styles.shortcutText}>TRACK ACTIVE SHIPMENT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutBtn}
            onPress={() =>
              router.push({
                pathname: '/(customer)/search/results',
                params: { q: 'Fresh Bakery' },
              })
            }
            activeOpacity={0.8}
          >
            <MaterialIcons name="restaurant" size={20} color={BrutalColors.black} />
            <Text style={styles.shortcutText}>SCAN LOCAL HUBS</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel / Return */}
        <View style={{ width: '100%', marginTop: 20 }}>
          <BrutalButton
            title="CANCEL VOICE SCAN"
            variant="white"
            onPress={() => router.back()}
            size="md"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  micStation: {
    position: 'relative',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    backgroundColor: BrutalColors.yellow,
    borderWidth: 2,
    borderColor: BrutalColors.black,
  },
  micButton: {
    width: 96,
    height: 96,
    backgroundColor: BrutalColors.green,
    borderWidth: 3,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...BrutalShadow.lg,
  },
  statusBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  frequencyMeters: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 48,
    gap: 6,
  },
  freqBar: {
    width: 8,
    backgroundColor: BrutalColors.black,
    borderWidth: 1,
    borderColor: BrutalColors.black,
  },
  promptHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  promptText: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shortcutBtn: {
    flex: 1,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    padding: 12,
    ...BrutalShadow.sm,
    gap: 6,
  },
  shortcutText: {
    fontSize: 10,
    fontWeight: '900',
    color: BrutalColors.black,
  },
});
