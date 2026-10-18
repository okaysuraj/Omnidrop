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
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationSelectionScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<'HOME' | 'WORK' | 'CURRENT'>('CURRENT');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip left="GNSS // WAYPOINT SELECTOR" right="PRECISION: ±1.2M" />

      <BrutalHeader
        title="COORDINATES"
        subtitle="GPS Target Reticle"
        onBack={() => router.back()}
        rightAction={<BrutalBadge label="LIVE GPS" variant="green" />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Viewport Frame */}
        <View style={styles.mapFrame}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
            }}
            style={styles.mapImage}
          />

          {/* Target Reticle in Center */}
          <View style={styles.reticleOverlay} pointerEvents="none">
            <View style={styles.reticleCenter}>
              <MaterialIcons name="my-location" size={28} color={BrutalColors.urgentRed} />
            </View>
            <View style={styles.coordsStrip}>
              <Text style={styles.coordsText}>12.9716° N, 77.5946° E</Text>
            </View>
          </View>

          {/* Quick GPS Center Button */}
          <TouchableOpacity
            style={styles.locateBtn}
            onPress={() => setSelectedPreset('CURRENT')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="navigation" size={20} color={BrutalColors.black} />
          </TouchableOpacity>
        </View>

        {/* Search Input Card */}
        <BrutalCard style={{ marginTop: 16, marginBottom: 16, padding: 12 }}>
          <Text style={styles.sectionLabel}>GEO-LOCATION SEARCH</Text>
          <View style={styles.searchRow}>
            <MaterialIcons name="search" size={20} color={BrutalColors.black} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="ENTER STREET, LANDMARK, HUB..."
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <MaterialIcons name="close" size={18} color={BrutalColors.black} />
              </TouchableOpacity>
            )}
          </View>
        </BrutalCard>

        {/* Selected Coordinate Details */}
        <BrutalCard bg={BrutalColors.yellow} style={{ marginBottom: 16, padding: 14 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text style={styles.targetLabel}>PRIMARY DOORSTEP TARGET</Text>
            <BrutalBadge label="VERIFIED" variant="black" />
          </View>
          <Text style={styles.targetAddress}>100FT ROAD, INDIRANAGAR</Text>
          <Text style={styles.targetSub}>DEFENCE COLONY, BENGALURU, KARNATAKA 560038</Text>
          <Text style={styles.instructionsText}>
            DELIVERY NOTES: GATE INTERCOM #402 · CALL ON ARRIVAL
          </Text>
        </BrutalCard>

        {/* Saved Coordinate Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={[styles.presetCard, selectedPreset === 'HOME' && styles.presetCardActive]}
            onPress={() => setSelectedPreset('HOME')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="home" size={20} color={BrutalColors.black} />
            <Text style={styles.presetTitle}>HOME BASE</Text>
            <Text style={styles.presetSub} numberOfLines={1}>
              Indiranagar 100ft
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.presetCard, selectedPreset === 'WORK' && styles.presetCardActive]}
            onPress={() => setSelectedPreset('WORK')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="business" size={20} color={BrutalColors.black} />
            <Text style={styles.presetTitle}>WORK STATION</Text>
            <Text style={styles.presetSub} numberOfLines={1}>
              Embassy Golf Links
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lock Coordinates Action */}
        <BrutalButton
          title="LOCK COORDINATES & CONFIRM →"
          variant="green"
          onPress={() => router.back()}
          size="lg"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  mapFrame: {
    width: '100%',
    height: 220,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#333',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  reticleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...BrutalShadow.sm,
  },
  coordsStrip: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: BrutalColors.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: BrutalColors.white,
  },
  coordsText: {
    color: BrutalColors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  locateBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...BrutalShadow.sm,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrutalColors.canvas,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: BrutalColors.black,
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.8,
  },
  targetAddress: {
    fontSize: 15,
    fontWeight: '900',
    color: BrutalColors.black,
    marginTop: 2,
  },
  targetSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    marginTop: 2,
  },
  instructionsText: {
    fontSize: 10,
    fontWeight: '800',
    color: BrutalColors.black,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: BrutalColors.black,
    paddingTop: 6,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  presetCard: {
    flex: 1,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    padding: 12,
    ...BrutalShadow.sm,
  },
  presetCardActive: {
    backgroundColor: BrutalColors.yellow,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
    marginTop: 6,
  },
  presetSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#555',
    marginTop: 2,
  },
});
