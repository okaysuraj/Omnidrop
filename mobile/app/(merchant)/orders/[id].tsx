import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { api } from '../../../../src/lib/api';

export default function PackingStatusScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const orderId = id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (orderId) {
      api.orders.byId(orderId).then(data => {
        setOrder(data);
        if (data.items) {
          setItems(data.items.map((item: any) => ({
            id: item.id,
            name: item.product?.name || 'Item',
            quantity: item.quantity,
            location: 'Store Location',
            image: item.product?.imageUrl,
            packed: false,
          })));
        }
      }).catch(e => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [orderId]);
  
  const [items, setItems] = useState<any[]>([]);

  const toggleItemPacked = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, packed: !item.packed } : item
    ));
  };

  const packedCount = items.filter(i => i.packed).length;
  const totalCount = items.length;
  const allPacked = totalCount > 0 && packedCount === totalCount;

  const handleMarkReady = async () => {
    try {
      await api.orders.updateStatus(orderId, 'READY');
      setIsReady(true);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#006e24" style={{ marginTop: 100 }} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar (Mobile) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#006e24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OmniDrop Merchant</Text>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' }} 
            style={styles.profileImage}
          />
        </View>
      </View>

      <ScrollView style={styles.mainContent} contentContainerStyle={styles.mainContentContainer}>
        
        {/* Header Section */}
        <View style={styles.pageHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Pack Order #{orderId?.slice(0,8).toUpperCase()}</Text>
            <View style={styles.timeContainer}>
              <MaterialIcons name="schedule" size={20} color="#575d78" />
              <Text style={styles.pageSubtitle}>Due in 15 minutes</Text>
            </View>
          </View>
          
          {/* Ready for Pickup Toggle */}
          <View style={styles.toggleContainer}>
            <View>
              <Text style={styles.toggleTitle}>Ready for Pickup</Text>
              <Text style={styles.toggleSubtitle}>Notify driver order is packed</Text>
            </View>
            <Switch
              trackColor={{ false: '#d9dadb', true: '#006e24' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#d9dadb"
              onValueChange={(val) => {
                if (val) handleMarkReady();
              }}
              value={isReady || order?.status === 'READY'}
              disabled={!allPacked || order?.status === 'READY'}
            />
          </View>
        </View>

        {/* Packing Checklist */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Items to Pack ({totalCount})</Text>
            <View style={styles.packedBadge}>
              <Text style={styles.packedBadgeText}>{packedCount}/{totalCount} Packed</Text>
            </View>
          </View>
          
          <View style={styles.itemsList}>
            {items.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.itemRow, item.packed && styles.itemRowPacked]}
                onPress={() => toggleItemPacked(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={item.packed}
                    onValueChange={() => toggleItemPacked(item.id)}
                    color={item.packed ? '#006e24' : undefined}
                    style={styles.checkbox}
                  />
                </View>
                
                <View style={styles.itemImageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                  ) : (
                    <MaterialIcons name="egg" size={32} color="#6b7c68" />
                  )}
                </View>
                
                <View style={styles.itemDetails}>
                  <View style={styles.itemNameContainer}>
                    <Text style={[styles.itemName, item.packed && styles.itemNamePacked]}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemLocation}>{item.location}</Text>
                  
                  {item.warning && (
                    <View style={styles.warningContainer}>
                      <MaterialIcons name="info" size={16} color="#ba1a1a" />
                      <Text style={styles.warningText}>{item.warning}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.packButton, allPacked ? styles.packButtonActive : styles.packButtonDisabled]}
          disabled={!allPacked || order?.status === 'READY'}
          onPress={handleMarkReady}
        >
          <MaterialIcons name="inventory" size={24} color={allPacked ? '#ffffff' : '#5b617d'} />
          <Text style={[styles.packButtonText, allPacked ? styles.packButtonTextActive : styles.packButtonTextDisabled]}>
            Pack Order
          </Text>
        </TouchableOpacity>
        
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#006e24',
    fontFamily: 'Montserrat_800ExtraBold',
  },
  profileContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e1e3e4',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  pageHeader: {
    marginBottom: 24,
  },
  titleSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#191c1d',
    marginBottom: 8,
    fontFamily: 'Montserrat_800ExtraBold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#575d78',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f5',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1d',
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#5b617d',
    marginTop: 2,
  },
  checklistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#0e1736',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edeeef',
    paddingBottom: 16,
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191c1d',
    fontFamily: 'Montserrat_700Bold',
  },
  packedBadge: {
    backgroundColor: '#d8defe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  packedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5b617d',
  },
  itemsList: {
    gap: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#edeeef',
    backgroundColor: '#f8f9fa',
  },
  itemRowPacked: {
    borderColor: 'rgba(0,110,36,0.3)',
    backgroundColor: '#ffffff',
  },
  checkboxContainer: {
    paddingTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f3f4f5',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1d',
    flex: 1,
    marginRight: 8,
  },
  itemNamePacked: {
    color: '#006e24',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1d',
  },
  itemLocation: {
    fontSize: 14,
    color: '#3b4b39',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#ba1a1a',
  },
  packButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  packButtonDisabled: {
    backgroundColor: '#d9dadb',
    opacity: 0.7,
  },
  packButtonActive: {
    backgroundColor: '#006e24',
    shadowColor: '#006e24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.39,
    shadowRadius: 14,
    elevation: 8,
  },
  packButtonText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  packButtonTextDisabled: {
    color: '#3b4b39',
  },
  packButtonTextActive: {
    color: '#ffffff',
  },
});
