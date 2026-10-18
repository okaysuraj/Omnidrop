import type {
  Address,
  AddressInput,
  Cart,
  Category,
  CheckoutInput,
  DashboardStats,
  DeliveryTask,
  Earnings,
  InventoryInput,
  InventoryItem,
  Order,
  OrderStats,
  PaginatedResponse,
  PaymentIntentResult,
  Product,
  ProductInput,
  ProfileInput,
  Promotion,
  PromotionValidation,
  RegisterInput,
  Review,
  ReviewInput,
  Store,
  StoreInput,
  StoreWithDistance,
  User,
  UserStats,
  WalletDetails,
  WalletIntentResult,
  WalletTransaction,
} from '../types';

import { auth } from './firebase';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(
  endpoint: string,
  method = 'GET',
  body?: unknown,
  skipAuth = false,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!skipAuth && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers.Authorization = 'Bearer ' + token;
  }
  const response = await fetch(API_BASE + endpoint, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message;
    throw new Error(
      Array.isArray(message) ? message.join(', ') : message || 'HTTP ' + response.status,
    );
  }
  const result = await response.json();
  // The backend wraps successful responses in { success, data }.
  return result.data !== undefined ? result.data : result;
}

export const api = {
  auth: {
    register: (data: RegisterInput) => request<User>('/auth/register', 'POST', data, true),
    login: (firebaseToken: string) => request<User>('/auth/login', 'POST', { firebaseToken }, true),
    me: () => request<User>('/auth/me'),
    updateProfile: (data: ProfileInput) => request<User>('/auth/profile', 'PATCH', data),
  },
  stores: {
    nearby: (lat: number, lng: number, radius?: number) =>
      request<StoreWithDistance[]>(
        `/stores/nearby?lat=${lat}&lng=${lng}${radius ? `&radius=${radius}` : ''}`,
      ),
    getById: (id: string) => request<Store>(`/stores/${id}`),
    create: (data: StoreInput) => request<Store>('/stores', 'POST', data),
    update: (id: string, data: StoreInput) => request<Store>(`/stores/${id}`, 'PATCH', data),
    myStores: () => request<Store[]>('/stores/my/stores'),
    getAll: (page?: number) => request<PaginatedResponse<Store>>(`/stores?page=${page || 1}`),
    verify: (id: string) => request<Store>(`/stores/${id}/verify`, 'PATCH'),
  },
  products: {
    list: (params?: { page?: number; categoryId?: string; search?: string; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.categoryId) query.set('categoryId', params.categoryId);
      if (params?.search) query.set('search', params.search);
      if (params?.sort) query.set('sort', params.sort);
      return request<PaginatedResponse<Product>>(`/products?${query.toString()}`);
    },
    getById: (id: string) => request<Product>(`/products/${id}`),
    search: (q: string) => request<Product[]>(`/products/search?q=${encodeURIComponent(q)}`),
    categories: () => request<Category[]>('/products/categories'),
    create: (data: ProductInput) => request<Product>('/products', 'POST', data),
    update: (id: string, data: ProductInput) => request<Product>(`/products/${id}`, 'PATCH', data),
  },
  inventory: {
    byStore: (storeId: string, categoryId?: string) =>
      request<InventoryItem[]>(
        `/stores/${storeId}/inventory${categoryId ? `?categoryId=${categoryId}` : ''}`,
      ),
    manage: (storeId: string) =>
      request<PaginatedResponse<InventoryItem>>(`/stores/${storeId}/inventory/manage`),
    upsert: (storeId: string, data: InventoryInput) =>
      request<InventoryItem>(`/stores/${storeId}/inventory`, 'POST', data),
    updateStock: (storeId: string, productId: string, stock: number) =>
      request<InventoryItem>(`/stores/${storeId}/inventory/${productId}/stock`, 'PATCH', { stock }),
  },
  cart: {
    get: () => request<Cart>('/cart'),
    addItem: (storeId: string, productId: string, quantity: number) =>
      request<Cart>('/cart/items', 'POST', { storeId, productId, quantity }),
    updateQuantity: (itemId: string, quantity: number) =>
      request<Cart>(`/cart/items/${itemId}`, 'PATCH', { quantity }),
    removeItem: (itemId: string) => request<Cart>(`/cart/items/${itemId}`, 'DELETE'),
    clear: () => request<Cart>('/cart', 'DELETE'),
  },
  orders: {
    checkout: (data: CheckoutInput) => request<Order>('/orders', 'POST', data),
    myOrders: (page?: number) => request<PaginatedResponse<Order>>(`/orders/my?page=${page || 1}`),
    getById: (id: string) => request<Order>(`/orders/${id}`),
    cancel: (id: string) => request<Order>(`/orders/${id}/cancel`, 'POST'),
    updateStatus: (id: string, status: string) =>
      request<Order>(`/orders/${id}/status`, 'PATCH', { status }),
    byStore: (storeId: string, status?: string) =>
      request<PaginatedResponse<Order>>(
        `/orders/store/${storeId}${status ? `?status=${status}` : ''}`,
      ),
    stats: () => request<OrderStats>('/orders/stats'),
    all: (page?: number, status?: string) =>
      request<PaginatedResponse<Order>>(
        `/orders?page=${page || 1}${status ? `&status=${status}` : ''}`,
      ),
  },
  delivery: {
    available: (lat?: number, lng?: number) =>
      request<DeliveryTask[]>(`/delivery/available${lat ? `?lat=${lat}&lng=${lng}` : ''}`),
    myTasks: (status?: string) =>
      request<DeliveryTask[]>(`/delivery/my-tasks${status ? `?status=${status}` : ''}`),
    activeTask: () => request<DeliveryTask | null>('/delivery/active'),
    acceptTask: (id: string) => request<DeliveryTask>(`/delivery/tasks/${id}/accept`, 'POST'),
    updateLocation: (id: string, lat: number, lng: number) =>
      request<{ lat: number; lng: number; etaMinutes: number }>(
        `/delivery/tasks/${id}/location`,
        'PATCH',
        { lat, lng },
      ),
    updateStatus: (id: string, status: string) =>
      request<DeliveryTask>(`/delivery/tasks/${id}/status`, 'PATCH', { status }),
    toggleAvailability: () =>
      request<{ isAvailable: boolean }>('/delivery/toggle-availability', 'POST'),
    earnings: () => request<Earnings>('/delivery/earnings'),
  },
  reviews: {
    create: (data: ReviewInput) => request<Review>('/reviews', 'POST', data),
    byStore: (storeId: string) => request<Review[]>(`/reviews/store/${storeId}`),
  },
  promotions: {
    active: () => request<Promotion[]>('/promotions/active'),
    validate: (code: string, orderTotal: number) =>
      request<PromotionValidation>('/promotions/validate', 'POST', { code, orderTotal }),
  },
  users: {
    addresses: () => request<Address[]>('/users/addresses'),
    createAddress: (data: AddressInput) => request<Address>('/users/addresses', 'POST', data),
    updateAddress: (id: string, data: Partial<AddressInput>) =>
      request<Address>(`/users/addresses/${id}`, 'PATCH', data),
    deleteAddress: (id: string) =>
      request<{ deleted: boolean }>(`/users/addresses/${id}`, 'DELETE'),
    all: (page?: number, role?: string) =>
      request<PaginatedResponse<User>>(`/users?page=${page || 1}${role ? `&role=${role}` : ''}`),
    getById: (id: string) => request<User>(`/users/${id}`),
    stats: () => request<UserStats>('/users/stats'),
    toggleActive: (id: string) => request<User>(`/users/${id}/toggle-active`, 'PATCH'),
  },
  admin: {
    dashboardStats: () => request<DashboardStats>('/admin/dashboard-stats'),
  },
  payments: {
    createIntent: (orderId: string) =>
      request<PaymentIntentResult>('/payments/intent', 'POST', { orderId }),
    createWalletIntent: (amount: number) =>
      request<WalletIntentResult>('/payments/wallet-intent', 'POST', { amount }),
  },
  wallet: {
    get: () => request<WalletDetails>('/wallet'),
    topup: (amount: number, description?: string) =>
      request<{ id: string; balance: number; currency: string; transaction: WalletTransaction }>(
        '/wallet/topup',
        'POST',
        { amount, description },
      ),
  },
};
