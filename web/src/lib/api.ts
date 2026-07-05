import { auth } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders as Record<string, string>,
  };

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data !== undefined ? data.data : data;
}

// Typed API client
export const api = {
  // Auth
  auth: {
    register: (data: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data), skipAuth: true }),
    login: (firebaseToken: string) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ firebaseToken }), skipAuth: true }),
    me: () => apiRequest('/auth/me'),
    updateProfile: (data: any) => apiRequest('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Stores
  stores: {
    nearby: (lat: number, lng: number, radius?: number) => apiRequest(`/stores/nearby?lat=${lat}&lng=${lng}${radius ? `&radius=${radius}` : ''}`),
    getById: (id: string) => apiRequest(`/stores/${id}`),
    create: (data: any) => apiRequest('/stores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/stores/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    myStores: () => apiRequest('/stores/my/stores'),
    getAll: (page?: number) => apiRequest(`/stores?page=${page || 1}`),
    verify: (id: string) => apiRequest(`/stores/${id}/verify`, { method: 'PATCH' }),
  },

  // Products
  products: {
    list: (params?: { page?: number; categoryId?: string; search?: string; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.categoryId) query.set('categoryId', params.categoryId);
      if (params?.search) query.set('search', params.search);
      if (params?.sort) query.set('sort', params.sort);
      return apiRequest(`/products?${query.toString()}`);
    },
    getById: (id: string) => apiRequest(`/products/${id}`),
    search: (q: string) => apiRequest(`/products/search?q=${q}`),
    categories: () => apiRequest('/products/categories'),
  },

  // Inventory
  inventory: {
    byStore: (storeId: string, categoryId?: string) =>
      apiRequest(`/stores/${storeId}/inventory${categoryId ? `?categoryId=${categoryId}` : ''}`),
    manage: (storeId: string) => apiRequest(`/stores/${storeId}/inventory/manage`),
    upsert: (storeId: string, data: any) =>
      apiRequest(`/stores/${storeId}/inventory`, { method: 'POST', body: JSON.stringify(data) }),
    updateStock: (storeId: string, productId: string, stock: number) =>
      apiRequest(`/stores/${storeId}/inventory/${productId}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
  },

  // Cart
  cart: {
    get: () => apiRequest('/cart'),
    addItem: (storeId: string, productId: string, quantity: number) =>
      apiRequest('/cart/items', { method: 'POST', body: JSON.stringify({ storeId, productId, quantity }) }),
    updateQuantity: (itemId: string, quantity: number) =>
      apiRequest(`/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    removeItem: (itemId: string) =>
      apiRequest(`/cart/items/${itemId}`, { method: 'DELETE' }),
    clear: () => apiRequest('/cart', { method: 'DELETE' }),
  },

  // Orders
  orders: {
    checkout: (data: any) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
    myOrders: (page?: number) => apiRequest(`/orders/my?page=${page || 1}`),
    getById: (id: string) => apiRequest(`/orders/${id}`),
    cancel: (id: string) => apiRequest(`/orders/${id}/cancel`, { method: 'POST' }),
    updateStatus: (id: string, status: string) =>
      apiRequest(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    byStore: (storeId: string, status?: string) =>
      apiRequest(`/orders/store/${storeId}${status ? `?status=${status}` : ''}`),
    stats: () => apiRequest('/orders/stats'),
    all: (page?: number, status?: string) =>
      apiRequest(`/orders?page=${page || 1}${status ? `&status=${status}` : ''}`),
  },

  // Delivery
  delivery: {
    available: (lat?: number, lng?: number) =>
      apiRequest(`/delivery/available${lat ? `?lat=${lat}&lng=${lng}` : ''}`),
    myTasks: (status?: string) =>
      apiRequest(`/delivery/my-tasks${status ? `?status=${status}` : ''}`),
    activeTask: () => apiRequest('/delivery/active'),
    acceptTask: (id: string) => apiRequest(`/delivery/tasks/${id}/accept`, { method: 'POST' }),
    updateLocation: (id: string, lat: number, lng: number) =>
      apiRequest(`/delivery/tasks/${id}/location`, { method: 'PATCH', body: JSON.stringify({ lat, lng }) }),
    updateStatus: (id: string, status: string) =>
      apiRequest(`/delivery/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    toggleAvailability: () => apiRequest('/delivery/toggle-availability', { method: 'POST' }),
    earnings: () => apiRequest('/delivery/earnings'),
  },

  // Reviews
  reviews: {
    create: (data: any) => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    byStore: (storeId: string) => apiRequest(`/reviews/store/${storeId}`),
  },

  // Promotions
  promotions: {
    active: () => apiRequest('/promotions/active'),
    validate: (code: string, orderTotal: number) =>
      apiRequest('/promotions/validate', { method: 'POST', body: JSON.stringify({ code, orderTotal }) }),
  },

  // Users
  users: {
    addresses: () => apiRequest('/users/addresses'),
    createAddress: (data: any) => apiRequest('/users/addresses', { method: 'POST', body: JSON.stringify(data) }),
    updateAddress: (id: string, data: any) =>
      apiRequest(`/users/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteAddress: (id: string) => apiRequest(`/users/addresses/${id}`, { method: 'DELETE' }),
    // Admin
    all: (page?: number, role?: string) =>
      apiRequest(`/users?page=${page || 1}${role ? `&role=${role}` : ''}`),
    getById: (id: string) => apiRequest(`/users/${id}`),
    stats: () => apiRequest('/users/stats'),
    toggleActive: (id: string) => apiRequest(`/users/${id}/toggle-active`, { method: 'PATCH' }),
  },

  // Admin
  admin: {
    dashboardStats: () => apiRequest('/admin/dashboard-stats'),
  },

  // Payments
  payments: {
    createIntent: (orderId: string) => apiRequest('/payments/intent', { method: 'POST', body: JSON.stringify({ orderId }) }),
  }
};
