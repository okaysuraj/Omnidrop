import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../../../src/lib/api';

export default function MerchantOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('New');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const stores = await api.stores.myStores();
      if (stores.length > 0) {
        const storeId = stores[0].id;
        const fetchedOrders = await api.orders.storeOrders(storeId);
        setOrders(fetchedOrders);
      }
    } catch (e) {
      console.error('Failed to load merchant orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.orders.updateStatus(orderId, status);
      fetchOrders();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'New') return order.status === 'PENDING';
    if (activeTab === 'Preparing') return order.status === 'PREPARING';
    if (activeTab === 'Ready') return order.status === 'READY';
    if (activeTab === 'History') return ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status);
    return false;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* TopAppBar (Mobile) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#006e24" />
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
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Orders</Text>
            <Text style={styles.pageSubtitle}>Manage your active and past deliveries.</Text>
          </View>

          {/* Order Status Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
            {['New', 'Preparing', 'Ready', 'History'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <View style={styles.ordersGrid}>
          {loading ? (
            <ActivityIndicator size="large" color="#006e24" style={{ marginTop: 40 }} />
          ) : filteredOrders.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#575d78' }}>No {activeTab.toLowerCase()} orders.</Text>
          ) : (
            filteredOrders.map(order => (
              <TouchableOpacity 
                key={order.id} 
                style={[styles.orderCard, order.status === 'PENDING' && styles.orderCardNew]}
                onPress={() => router.push(`/(merchant)/orders/${order.id}` as any)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.statusBadgeContainer}>
                    <View style={[styles.statusBadge, order.status === 'PENDING' ? styles.statusNewBadge : order.status === 'PREPARING' ? styles.statusPreparingBadge : styles.statusReadyBadge]}>
                      <Text style={order.status === 'PENDING' ? styles.statusNewText : order.status === 'PREPARING' ? styles.statusPreparingText : styles.statusReadyText}>{order.status}</Text>
                    </View>
                    <View style={styles.timeInfo}>
                      <MaterialIcons name="timer" size={16} color={order.status === 'PENDING' ? '#ba1a1a' : '#575d78'} />
                      <Text style={order.status === 'PENDING' ? styles.timeText : styles.timeTextNormal}>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <Text style={order.status === 'PENDING' ? styles.orderNumber : styles.orderNumberNormal}>#{order.id.slice(0,8).toUpperCase()}</Text>
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.customerName}>{order.user?.fullName || 'Customer'}</Text>
                  <Text style={styles.orderSummary}>{order.items?.length || 0} items • ${order.totalAmount?.toFixed(2) || '0.00'}</Text>
                </View>
                
                {order.status === 'PENDING' && (
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleUpdateStatus(order.id, 'PREPARING')}>
                    <Text style={styles.acceptButtonText}>Accept Order</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'PREPARING' && (
                  <TouchableOpacity style={styles.readyButton} onPress={() => handleUpdateStatus(order.id, 'READY')}>
                    <Text style={styles.readyButtonText}>Mark as Ready</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'READY' && (
                  <View style={styles.waitingBadge}>
                    <Text style={styles.waitingBadgeText}>Waiting for Courier</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* BottomNavBar (Mobile) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="dashboard" size={24} color="#5b617d" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="inventory" size={24} color="#5b617d" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <MaterialIcons name="shopping-bag" size={24} color="#007125" />
          <Text style={styles.activeNavText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="settings" size={24} color="#5b617d" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#191c1d',
    marginBottom: 4,
    fontFamily: 'Montserrat_800ExtraBold',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#575d78',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#f3f4f5',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 4,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b4b39',
  },
  activeTabText: {
    color: '#191c1d',
  },
  ordersGrid: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    shadowColor: '#141a32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 16,
  },
  orderCardNew: {
    borderColor: '#00ff5f',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusNewBadge: {
    backgroundColor: '#00e554',
  },
  statusPreparingBadge: {
    backgroundColor: '#dce1ff',
  },
  statusReadyBadge: {
    backgroundColor: '#ffdbce',
  },
  statusNewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002106',
  },
  statusPreparingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#141a32',
  },
  statusReadyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#370e00',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ba1a1a',
  },
  timeTextNormal: {
    fontSize: 12,
    fontWeight: '500',
    color: '#575d78',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191c1d',
  },
  orderNumberNormal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b4b39',
  },
  cardBody: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 4,
  },
  orderSummary: {
    fontSize: 14,
    color: '#575d78',
  },
  itemsList: {
    marginTop: 12,
    backgroundColor: '#f3f4f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e1e3e4',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#3b4b39',
  },
  itemPrice: {
    fontSize: 14,
    color: '#3b4b39',
  },
  acceptButton: {
    backgroundColor: '#006e24',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  readyButton: {
    backgroundColor: '#e1e3e4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  readyButtonText: {
    color: '#191c1d',
    fontSize: 16,
    fontWeight: '600',
  },
  waitingBadge: {
    backgroundColor: '#f3f4f5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9dadb',
    borderStyle: 'dashed',
  },
  waitingBadgeText: {
    color: '#3b4b39',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingBottom: 24,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
  },
  activeNavItem: {
    backgroundColor: '#00ff5f',
    borderRadius: 24,
    paddingVertical: 4,
    width: 80,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5b617d',
    marginTop: 4,
  },
  activeNavText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007125',
    marginTop: 4,
  },
});
