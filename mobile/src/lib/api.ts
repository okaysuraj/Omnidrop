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
    updateProfile: (data: any) => apiClient.patch('/auth/profile', data).then(res => res.data),
  },
  users: {
    getAddresses: () => apiClient.get('/users/addresses').then(res => res.data),
    addAddress: (data: any) => apiClient.post('/users/addresses', data).then(res => res.data),
    getStats: () => apiClient.get('/users/stats').then(res => res.data),
  },
  products: {
    search: (query: string) => apiClient.get(`/products/search?q=${query}`).then(res => res.data),
    categories: () => apiClient.get('/products/categories').then(res => res.data),
    byId: (id: string) => apiClient.get(`/products/${id}`).then(res => res.data),
  },
  stores: {
    nearby: (lat: number, lng: number) => apiClient.get(`/stores/nearby?lat=${lat}&lng=${lng}`).then(res => res.data),
    byId: (id: string) => apiClient.get(`/stores/${id}`).then(res => res.data),
    myStores: () => apiClient.get('/stores/my/stores').then(res => res.data),
  },
  cart: {
    get: () => apiClient.get('/cart').then(res => res.data),
    addItem: (data: { storeId: string; productId: string; quantity: number }) => apiClient.post('/cart/items', data).then(res => res.data),
    updateQuantity: (itemId: string, quantity: number) => apiClient.patch(`/cart/items/${itemId}`, { quantity }).then(res => res.data),
    removeItem: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`).then(res => res.data),
    clear: () => apiClient.delete('/cart').then(res => res.data),
  },
  orders: {
    create: (data: any) => apiClient.post('/orders', data).then(res => res.data),
    myOrders: () => apiClient.get('/orders/my').then(res => res.data),
    byId: (id: string) => apiClient.get(`/orders/${id}`).then(res => res.data),
    storeOrders: (storeId: string) => apiClient.get(`/orders/store/${storeId}`).then(res => res.data),
    updateStatus: (id: string, status: string) => apiClient.patch(`/orders/${id}/status`, { status }).then(res => res.data),
  },
  delivery: {
    available: () => apiClient.get('/delivery/available').then(res => res.data),
    acceptTask: (taskId: string) => apiClient.post(`/delivery/tasks/${taskId}/accept`).then(res => res.data),
    activeTask: () => apiClient.get('/delivery/active').then(res => res.data),
    updateStatus: (taskId: string, status: string) => apiClient.patch(`/delivery/tasks/${taskId}/status`, { status }).then(res => res.data),
    toggleAvailability: () => apiClient.patch('/delivery/availability').then(res => res.data),
    getEarnings: () => apiClient.get('/delivery/earnings').then(res => res.data),
  },
  reviews: {
    create: (data: any) => apiClient.post('/reviews', data).then(res => res.data),
  }
};
