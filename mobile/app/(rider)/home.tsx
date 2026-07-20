import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';

export default function RiderHomeScreen() {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const active = await api.delivery.activeTask();
      if (active) {
        setActiveTask(active);
      } else {
        setActiveTask(null);
        if (isAvailable) {
          const available = await api.delivery.available();
          setAvailableTasks(available);
        }
      }
    } catch (e) {
      console.error('Error fetching tasks', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, [isAvailable]);

  const toggleAvailability = async () => {
    try {
      const res = await api.delivery.toggleAvailability();
      setIsAvailable(res.isAvailable);
      if (res.isAvailable) {
        fetchTasks();
      } else {
        setAvailableTasks([]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to toggle availability');
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      await api.delivery.acceptTask(taskId);
      fetchTasks();
      router.push('/(rider)/pickup-navigation');
    } catch (e) {
      Alert.alert('Error', 'Failed to accept task');
    }
  };

  const handleContinueTask = () => {
    if (activeTask?.status === 'ACCEPTED') {
      router.push('/(rider)/pickup-navigation');
    } else if (activeTask?.status === 'PICKED_UP') {
      router.push('/(rider)/live-tracking');
    } else {
      router.push('/(rider)/live-tracking');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color="#b9ccb5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>OmniDrop Rider</Text>
        </View>
        <TouchableOpacity style={styles.toggleBtn} onPress={toggleAvailability}>
          <View style={[styles.toggleIndicator, { backgroundColor: isAvailable ? '#00ff5f' : '#ffb4ab' }]} />
          <Text style={styles.toggleText}>{isAvailable ? 'Online' : 'Offline'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Dashboard</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00ff5f" style={{ marginTop: 40 }} />
        ) : activeTask ? (
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskLabel}>Active Delivery</Text>
              <Text style={styles.taskStatus}>{activeTask.status.replace('_', ' ')}</Text>
            </View>
            <View style={styles.taskBody}>
              <Text style={styles.storeName}>{activeTask.order?.store?.name}</Text>
              <Text style={styles.addressText}>To: {activeTask.dropLat.toFixed(4)}, {activeTask.dropLng.toFixed(4)}</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleContinueTask}>
              <Text style={styles.actionBtnText}>Continue Delivery</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#002106" />
            </TouchableOpacity>
          </View>
        ) : !isAvailable ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="power-settings-new" size={64} color="#353534" />
            <Text style={styles.emptyText}>You are offline.</Text>
            <Text style={styles.emptySubtext}>Go online to start receiving delivery requests.</Text>
          </View>
        ) : availableTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#00ff5f" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>Finding requests...</Text>
            <Text style={styles.emptySubtext}>Stay in high demand areas to get more orders.</Text>
          </View>
        ) : (
          <View style={styles.availableTasks}>
            <Text style={styles.sectionTitle}>Available Requests</Text>
            {availableTasks.map(task => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskLabel}>New Request</Text>
                  <Text style={styles.earningsText}>$12.50 Est.</Text>
                </View>
                <View style={styles.taskBody}>
                  <Text style={styles.storeName}>{task.order?.store?.name}</Text>
                  <Text style={styles.addressText}>Distance: ~2.4 mi</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAcceptTask(task.id)}>
                  <Text style={styles.actionBtnText}>Accept Request</Text>
                  <MaterialIcons name="check-circle" size={20} color="#002106" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="home" size={24} color="#007125" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(rider)/earnings')}>
          <MaterialIcons name="attach-money" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(rider)/wallet')}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Wallet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#b9ccb5" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#1c1b1b',
    borderBottomWidth: 1,
    borderBottomColor: '#3b4b39',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#00e554',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b4b39',
    gap: 8,
  },
  toggleIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toggleText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#1c1b1b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ff5f',
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  taskLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#00ff5f',
    textTransform: 'uppercase',
  },
  taskStatus: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#caf300',
  },
  earningsText: {
    fontSize: 14,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#00ff5f',
  },
  taskBody: {
    marginBottom: 20,
  },
  storeName: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    color: '#b9ccb5',
  },
  actionBtn: {
    backgroundColor: '#00ff5f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#002106',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#e5e2e1',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#b9ccb5',
    textAlign: 'center',
  },
  availableTasks: {
    marginTop: 8,
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
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3b4b39',
  },
  navItem: {
    alignItems: 'center',
    padding: 4,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: '#00ff5f',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#b9ccb5',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
    marginTop: 4,
  },
});
