import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RiderHeatmapScreen() {
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState(100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#00e554" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=150' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.headerTitle}>Rider Heatmap</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#b9ccb5" />
        </TouchableOpacity>
      </View>

      {/* Main Content (Map Area) */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
          style={styles.mapImage}
        />
        <View style={styles.mapOverlay} />

        {/* Heatmap Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ffb4ab' }]} />
            <Text style={styles.legendText}>High Demand</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#00ff5f' }]} />
            <Text style={styles.legendText}>High Supply</Text>
          </View>
        </View>

        {/* Bottom Sheet Overlay (Metrics & Time) */}
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Area Status</Text>
              <Text style={styles.sheetLiveText}>LIVE</Text>
            </View>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, styles.metricCardCritical]}>
                <View style={styles.metricCardCriticalBg} />
                <Text style={styles.metricLabel}>Supply Gap</Text>
                <View style={styles.metricValueRow}>
                  <Text style={[styles.metricValue, { color: '#ffb4ab' }]}>14%</Text>
                  <Text style={styles.metricSubValue}>CRITICAL</Text>
                </View>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Avg Dispatch Time</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>2.4</Text>
                  <Text style={[styles.metricSubValue, { color: '#b9ccb5' }]}>MIN</Text>
                </View>
              </View>
            </View>

            {/* Time Slider (Visual representation) */}
            <View style={styles.sliderContainer}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Historical Playback</Text>
                <Text style={styles.sliderTime}>14:00 - Now</Text>
              </View>
              <View style={styles.sliderControls}>
                <TouchableOpacity style={styles.playButton}>
                  <MaterialIcons name="play-arrow" size={24} color="#b9ccb5" />
                </TouchableOpacity>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: '100%' }]} />
                  <View style={[styles.sliderThumb, { left: '100%' }]} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: '#131313',
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b4b39',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19,19,19,0.3)',
  },
  legendContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
    zIndex: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 31, 31, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3b4b39',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#201f1f',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    zIndex: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#849581',
    borderRadius: 2,
  },
  sheetContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#edffe7',
  },
  sheetLiveText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
    letterSpacing: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#131313',
    borderWidth: 1,
    borderColor: '#849581',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  metricCardCritical: {
    borderColor: 'rgba(255, 180, 171, 0.5)',
    overflow: 'hidden',
  },
  metricCardCriticalBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 180, 171, 0.05)',
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#e5e2e1',
  },
  metricSubValue: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: 'rgba(255, 180, 171, 0.8)',
    textTransform: 'uppercase',
  },
  sliderContainer: {
    paddingTop: 8,
    gap: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
    textTransform: 'uppercase',
  },
  sliderTime: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    padding: 4,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#353534',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: '#00e554',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00e554',
    marginLeft: -8, // Center over the end of the fill
    shadowColor: '#00e554',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
});
