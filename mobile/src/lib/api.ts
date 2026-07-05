import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api'; // 10.0.2.2 is localhost for Android Emulator

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  auth: {
    login: () => apiClient.post('/auth/login').then(res => res.data),
    register: (data: any) => apiClient.post('/auth/register', data).then(res => res.data),
    me: () => apiClient.get('/auth/me').then(res => res.data),
  },
  stores: {
    nearby: (lat: number, lng: number) => apiClient.get(`/stores/nearby?lat=${lat}&lng=${lng}`).then(res => res.data),
    byId: (id: string) => apiClient.get(`/stores/${id}`).then(res => res.data),
  },
  orders: {
    myOrders: () => apiClient.get('/orders').then(res => res.data),
    byId: (id: string) => apiClient.get(`/orders/${id}`).then(res => res.data),
  },
  delivery: {
    available: () => apiClient.get('/delivery/available').then(res => res.data),
    acceptTask: (taskId: string) => apiClient.post(`/delivery/tasks/${taskId}/accept`).then(res => res.data),
    activeTask: () => apiClient.get('/delivery/active').then(res => res.data),
    updateStatus: (taskId: string, status: string) => apiClient.patch(`/delivery/tasks/${taskId}/status`, { status }).then(res => res.data),
    toggleAvailability: () => apiClient.patch('/delivery/availability').then(res => res.data),
  }
};
