import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Animations
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.orders.byId(id as string);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();

    // Checkmark scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Fade and slide for content
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00e554" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Background Decorative Element */}
      <View style={styles.bgGlow} />

      <View style={styles.content}>
        
        {/* Animated Checkmark */}
        <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkCircle}>
            <MaterialIcons name="check-circle" size={80} color="#007125" />
          </View>
        </Animated.View>

        {/* Typography */}
        <Animated.View style={[styles.textSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>
            Order <Text style={styles.orderId}>#{order?.id?.substring(0, 8).toUpperCase()}</Text> is locked in.
          </Text>
        </Animated.View>

        {/* Info Card */}
        <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBoxPrimary}>
              <MaterialIcons name="timer" size={28} color="#006e24" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardLabel}>ESTIMATED DELIVERY</Text>
              <Text style={styles.cardValue}>12–18 <Text style={styles.cardValueUnit}>mins</Text></Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardBody}>
            <View style={styles.iconBoxSecondary}>
              <MaterialIcons name="storefront" size={20} color="#5b617d" />
            </View>
            <View style={styles.cardBodyText}>
              <Text style={styles.cardBodyTitle}>Preparing at <Text style={styles.boldText}>{order?.store?.name || 'Store'}</Text></Text>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={() => router.push('/(customer)/order/track')}>
            <Text style={styles.primaryBtnText}>Track Order</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(customer)/home')}>
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  bgGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 255, 95, 0.05)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  checkContainer: {
    marginBottom: 40,
  },
  checkCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#00ff5f', // primary-container
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#00ff5f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#006e24',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
    textAlign: 'center',
  },
  orderId: {
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    backgroundColor: '#e7e8e9', // surface-container-high
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#edeeef',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  iconBoxPrimary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#edeeef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#3b4b39',
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  cardValueUnit: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  divider: {
    height: 1,
    backgroundColor: '#edeeef',
    marginBottom: 20,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBoxSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d8defe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBodyText: {
    flex: 1,
  },
  cardBodyTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#191c1d',
    marginBottom: 8,
  },
  boldText: {
    fontFamily: 'Montserrat_700Bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#edeeef',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    width: '33%',
    backgroundColor: '#006e24',
    borderRadius: 3,
  },
  actionsSection: {
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006e24',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowColor: '#006e24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  primaryBtnText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  secondaryBtnText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#3b4b39',
  },
});
