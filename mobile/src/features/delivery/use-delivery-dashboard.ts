import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { LOCATION_TASK_NAME } from '@/lib/location-task';
import { useAuth } from '@/providers/auth-provider';
import type { DeliveryTask } from '@/types';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useDeliveryDashboard() {
  const [activeTask, setActiveTask] = useState<DeliveryTask | null>(null);
  const [availableTasks, setAvailableTasks] = useState<DeliveryTask[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { logout, user } = useAuth();
  const loadData = async () => {
    try {
      const [active, available] = await Promise.all([
        api.delivery.activeTask().catch(() => null),
        api.delivery.available().catch(() => []),
      ]);
      setActiveTask(active);
      setAvailableTasks(available);
      setIsAvailable(user?.isAvailable || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
      }
    })();
  }, []);
  useEffect(() => {
    const handleLocationTracking = async () => {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (activeTask?.status === 'IN_TRANSIT') {
        if (!hasStarted) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
            showsBackgroundLocationIndicator: true,
          });
        }
      } else {
        if (hasStarted) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }
    };
    handleLocationTracking();
  }, [activeTask]);
  const toggleAvailability = async () => {
    try {
      const result = await api.delivery.toggleAvailability();
      setIsAvailable(result.isAvailable);
    } catch (err) {
      console.error(err);
    }
  };
  const acceptTask = async (taskId: string) => {
    setActionLoading(true);
    try {
      const task = await api.delivery.acceptTask(taskId);
      setActiveTask(task);
      setAvailableTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      Alert.alert('Task Error', getErrorMessage(err) || 'Failed to accept task.');
    } finally {
      setActionLoading(false);
    }
  };
  const updateStatus = async (taskId: string, status: string) => {
    setActionLoading(true);
    try {
      const task = await api.delivery.updateStatus(taskId, status);
      if (task.status === 'DELIVERED') {
        setActiveTask(null);
        loadData();
      } else {
        setActiveTask(task);
      }
    } catch (err) {
      Alert.alert('Update Failed', getErrorMessage(err) || 'Failed to update task.');
    } finally {
      setActionLoading(false);
    }
  };
  return {
    activeTask,
    availableTasks,
    isAvailable,
    loading,
    refreshing,
    actionLoading,
    logout,
    user,
    loadData,
    handleRefresh,
    toggleAvailability,
    acceptTask,
    updateStatus,
  };
}
