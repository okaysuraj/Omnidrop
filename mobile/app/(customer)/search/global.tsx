import {
  BrutalBadge,
  BrutalBottomNav,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GlobalSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState([
    'ORGANIC AVOCADOS',
    'COLD BREW CONCENTRATE',
    'ARTISAN SOURDOUGH',
  ]);

  const trendingSearches = [
    'COLD PRESSED JUICE',
    'ALMOND BUTTER',
    'SOURDOUGH LOAF',
    'ENERGY DRINKS',
    'ORGANIC EGGS',
  ];

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push({ pathname: '/(customer)/search/results', params: { q: query } });
  };

  const clearRecent = (queryToClear?: string) => {
    if (queryToClear) {
      setRecentQueries(recentQueries.filter((q) => q !== queryToClear));
    } else {
      setRecentQueries([]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip left="GLOBAL RADAR // EXPLORE CATALOG" right="STATUS: SCANNING" />

      <BrutalHeader
        title="EXPLORE RADAR"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.push('/(customer)/cart')}
          >
            <Ionicons name="bag-handle" size={18} color={BrutalColors.black} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Console Input */}
        <View style={styles.searchConsoleWrapper}>
          <View style={styles.searchConsole}>
            <Ionicons name="search" size={20} color={BrutalColors.black} />
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH CATALOG, SKUS, HUBS..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              autoFocus={true}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.push('/(customer)/search/voice')}
              style={styles.voiceMicBtn}
            >
              <Ionicons name="mic" size={18} color={BrutalColors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TRENDING SEARCHES</Text>
            <BrutalBadge label="REAL-TIME" variant="yellow" />
          </View>
          <View style={styles.chipsContainer}>
            {trendingSearches.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.trendingChip}
                onPress={() => handleSearch(tag)}
                activeOpacity={0.8}
              >
                <Ionicons name="trending-up" size={14} color={BrutalColors.black} />
                <Text style={styles.trendingChipText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Search Logs */}
        {recentQueries.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT SEARCH LOGS</Text>
              <TouchableOpacity onPress={() => clearRecent()}>
                <Text style={styles.clearAllText}>CLEAR LOGS</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recentList}>
              {recentQueries.map((query, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.recentCard}
                  onPress={() => handleSearch(query)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.recentQueryText}>{query}</Text>
                  </View>
                  <TouchableOpacity onPress={() => clearRecent(query)} style={{ padding: 4 }}>
                    <Ionicons name="close" size={16} color={BrutalColors.black} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Asymmetric Bento Taxonomy Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HYPERLOCAL CORRIDORS</Text>
          <Text style={styles.sectionSubtitle}>SELECT STORE HUB OR CATEGORY DEPOT</Text>

          <View style={styles.bentoContainer}>
            {/* Groceries - Large Column */}
            <TouchableOpacity
              style={styles.bentoLarge}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: '/(customer)/products',
                  params: { categoryId: 'groceries' },
                })
              }
            >
              <ImageBackground
                source={{
                  uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
                }}
                style={styles.bentoBg}
              >
                <View style={styles.bentoBadge}>
                  <Text style={styles.bentoBadgeText}>&lt; 10 MIN</Text>
                </View>
                <View style={styles.bentoInfoBanner}>
                  <Text style={styles.bentoTitleLarge}>FRESH GROCERIES</Text>
                  <Text style={styles.bentoSubLarge}>LOCAL HARVEST & PANTRY</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* Right Column Bento Stack */}
            <View style={styles.bentoRightCol}>
              {/* Bakery Depot */}
              <TouchableOpacity
                style={styles.bentoMedium}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/(customer)/products',
                    params: { categoryId: 'bakery' },
                  })
                }
              >
                <ImageBackground
                  source={{
                    uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500',
                  }}
                  style={styles.bentoBg}
                >
                  <View style={[styles.bentoBadge, { backgroundColor: BrutalColors.yellow }]}>
                    <Text style={styles.bentoBadgeText}>ARTISAN</Text>
                  </View>
                  <View style={styles.bentoInfoBanner}>
                    <Text style={styles.bentoTitleMedium}>BAKERY & CAFE</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              {/* Essentials Dual Row */}
              <View style={styles.bentoDualRow}>
                <TouchableOpacity
                  style={styles.bentoSmall}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: '/(customer)/products',
                      params: { categoryId: 'daily' },
                    })
                  }
                >
                  <View style={[styles.bentoColorCard, { backgroundColor: BrutalColors.yellow }]}>
                    <Ionicons name="flash-outline" size={24} color={BrutalColors.black} />
                    <Text style={styles.bentoTitleSmall}>DAILY FAST</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bentoSmall}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: '/(customer)/products',
                      params: { categoryId: 'pharmacy' },
                    })
                  }
                >
                  <View style={[styles.bentoColorCard, { backgroundColor: BrutalColors.green }]}>
                    <Ionicons name="medkit-outline" size={24} color={BrutalColors.black} />
                    <Text style={styles.bentoTitleSmall}>CARE HUB</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic Offer Card */}
        <BrutalCard bg={BrutalColors.yellow} style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text style={styles.offerBadge}>DISPATCH PROMO // ACTIVE</Text>
            <BrutalBadge label="PROMO: HYPERFAST" variant="black" />
          </View>
          <Text style={styles.offerTitle}>ZERO RUNNER FEE ON ORDERS &gt; ₹199</Text>
          <Text style={styles.offerDesc}>
            Autonomous routing applies instant discount during checkout authorization.
          </Text>
        </BrutalCard>
      </ScrollView>

      {/* Unified Brutal Bottom Navigation */}
      <BrutalBottomNav currentTab="catalog" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  headerBtn: {
    width: 36,
    height: 36,
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...BrutalShadow.sm,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  searchConsoleWrapper: {
    marginBottom: 20,
  },
  searchConsole: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    ...BrutalShadow.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  voiceMicBtn: {
    backgroundColor: BrutalColors.yellow,
    width: 32,
    height: 32,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    fontFamily: 'monospace',
    marginTop: -6,
    marginBottom: 12,
  },
  clearAllText: {
    fontSize: 10,
    fontWeight: '900',
    color: BrutalColors.urgentRed,
    fontFamily: 'monospace',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    ...BrutalShadow.sm,
  },
  trendingChipText: {
    fontSize: 10,
    fontWeight: '900',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...BrutalShadow.sm,
  },
  recentQueryText: {
    fontSize: 11,
    fontWeight: '800',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  bentoContainer: {
    flexDirection: 'row',
    gap: 12,
    height: 240,
  },
  bentoLarge: {
    flex: 1,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.sm,
    overflow: 'hidden',
  },
  bentoRightCol: {
    flex: 1,
    gap: 12,
  },
  bentoMedium: {
    flex: 1,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.sm,
    overflow: 'hidden',
  },
  bentoDualRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  bentoSmall: {
    flex: 1,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    ...BrutalShadow.sm,
    overflow: 'hidden',
  },
  bentoBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 10,
  },
  bentoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: BrutalColors.terminalGreen,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bentoBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: BrutalColors.black,
  },
  bentoInfoBanner: {
    backgroundColor: BrutalColors.white,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    padding: 6,
  },
  bentoTitleLarge: {
    fontSize: 12,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  bentoSubLarge: {
    fontSize: 8,
    fontWeight: '700',
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  bentoTitleMedium: {
    fontSize: 11,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  bentoColorCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  bentoTitleSmall: {
    fontSize: 10,
    fontWeight: '900',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  offerBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: BrutalColors.black,
    fontFamily: 'monospace',
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  offerDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: BrutalColors.black,
    marginTop: 2,
  },
});
