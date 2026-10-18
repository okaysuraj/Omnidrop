import type {
  Address,
  AddressInput,
  Cart,
  CartItemInput,
  Category,
  CheckoutInput,
  DeliveryTask,
  Earnings,
  InventoryInput,
  InventoryItem,
  Order,
  PaginatedResponse,
  PaymentIntentResult,
  Product,
  ProductInput,
  ProductQuery,
  ProfileInput,
  Promotion,
  RegisterInput,
  Review,
  ReviewInput,
  Store,
  StoreInput,
  StoreWithDistance,
  User,
  WalletDetails,
  WalletIntentResult,
  WalletTransaction,
} from '../types';

import axios, { type Method } from 'axios';
import { auth } from './firebase';
// Android emulators reach the host machine through 10.0.2.2.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api';
const client = axios.create({ baseURL: API_URL });
client.interceptors.request.use(async (config) => {
  if (auth.currentUser)
    config.headers.Authorization = 'Bearer ' + (await auth.currentUser.getIdToken());
  return config;
});

async function request<T>(
  method: Method,
  url: string,
  data?: unknown,
  params?: ProductQuery,
): Promise<T> {
  const response = await client.request<{ success: boolean; data: T }>({
    method,
    url,
    data,
    params,
  });
  // The backend wraps successful responses in { success, data }.
  return response.data.data;
}

export const api = {
  auth: {
    login: async (firebaseToken?: string) => {
      const token =
        firebaseToken || (auth.currentUser ? await auth.currentUser.getIdToken() : null);
      return request<User>('POST', '/auth/login', { firebaseToken: token });
    },
    register: (data: RegisterInput) => request<User>('POST', '/auth/register', data),
    me: () => request<User>('GET', '/auth/me'),
    updateProfile: (data: ProfileInput) => request<User>('PATCH', '/auth/profile', data),
  },
  users: {
    getAddresses: () => request<Address[]>('GET', '/users/addresses'),
    addAddress: (data: AddressInput) => request<Address>('POST', '/users/addresses', data),
    updateAddress: (id: string, data: Partial<AddressInput>) =>
      request<Address>('PATCH', `/users/addresses/${id}`, data),
    deleteAddress: (id: string) =>
      request<{ deleted: boolean }>('DELETE', `/users/addresses/${id}`),
    getStats: () => request<Record<string, number>>('GET', '/users/stats'),
  },
  products: {
    search: (query: string) =>
      request<Product[]>('GET', `/products/search?q=${encodeURIComponent(query)}`),
    categories: () => request<Category[]>('GET', '/products/categories'),
    byId: (id: string) => request<Product>('GET', `/products/${id}`),
    list: (params: ProductQuery = {}) =>
      request<PaginatedResponse<Product>>('GET', '/products', undefined, params),
    create: (data: ProductInput) => request<Product>('POST', '/products', data),
  },
  stores: {
    nearby: (lat: number, lng: number, radius?: number) =>
      request<StoreWithDistance[]>(
        'GET',
        `/stores/nearby?lat=${lat}&lng=${lng}${radius ? `&radius=${radius}` : ''}`,
      ),
    byId: (id: string) => request<Store>('GET', `/stores/${id}`),
    myStores: () => request<Store[]>('GET', '/stores/my/stores'),
    create: (data: StoreInput) => request<Store>('POST', '/stores', data),
    update: (id: string, data: StoreInput) => request<Store>('PATCH', `/stores/${id}`, data),
  },
  inventory: {
    byStore: (storeId: string) => request<InventoryItem[]>('GET', `/stores/${storeId}/inventory`),
    manage: (storeId: string) =>
      request<PaginatedResponse<InventoryItem>>('GET', `/stores/${storeId}/inventory/manage`),
    upsert: (storeId: string, data: InventoryInput) =>
      request<InventoryItem>('POST', `/stores/${storeId}/inventory`, data),
    updateStock: (storeId: string, productId: string, stock: number) =>
      request<InventoryItem>('PATCH', `/stores/${storeId}/inventory/${productId}/stock`, { stock }),
  },
  cart: {
    get: () => request<Cart>('GET', '/cart'),
    addItem: (data: CartItemInput) => request<Cart>('POST', '/cart/items', data),
    updateQuantity: (itemId: string, quantity: number) =>
      request<Cart>('PATCH', `/cart/items/${itemId}`, { quantity }),
    removeItem: (itemId: string) => request<Cart>('DELETE', `/cart/items/${itemId}`),
    clear: () => request<Cart>('DELETE', '/cart'),
  },
  orders: {
    create: (data: CheckoutInput) => request<Order>('POST', '/orders', data),
    myOrders: () => request<PaginatedResponse<Order>>('GET', '/orders/my'),
    byId: (id: string) => request<Order>('GET', `/orders/${id}`),
    storeOrders: (storeId: string) =>
      request<PaginatedResponse<Order>>('GET', `/orders/store/${storeId}`),
    updateStatus: (id: string, status: string) =>
      request<Order>('PATCH', `/orders/${id}/status`, { status }),
  },
  delivery: {
    available: () => request<DeliveryTask[]>('GET', '/delivery/available'),
    myTasks: () => request<DeliveryTask[]>('GET', '/delivery/my-tasks'),
    acceptTask: (taskId: string) =>
      request<DeliveryTask>('POST', `/delivery/tasks/${taskId}/accept`),
    activeTask: () => request<DeliveryTask | null>('GET', '/delivery/active'),
    updateStatus: (taskId: string, status: string) =>
      request<DeliveryTask>('PATCH', `/delivery/tasks/${taskId}/status`, { status }),
    toggleAvailability: () =>
      request<{ isAvailable: boolean }>('POST', '/delivery/toggle-availability'),
    getEarnings: () => request<Earnings>('GET', '/delivery/earnings'),
  },
  payments: {
    createIntent: (orderId: string) =>
      request<PaymentIntentResult>('POST', '/payments/intent', { orderId }),
    createWalletIntent: (amount: number) =>
      request<WalletIntentResult>('POST', '/payments/wallet-intent', { amount }),
  },
  wallet: {
    get: () => request<WalletDetails>('GET', '/wallet'),
    topup: (amount: number, description?: string) =>
      request<{ id: string; balance: number; currency: string; transaction: WalletTransaction }>(
        'POST',
        '/wallet/topup',
        { amount, description },
      ),
  },
  reviews: {
    create: (data: ReviewInput) => request<Review>('POST', '/reviews', data),
  },
  promotions: {
    active: () => request<Promotion[]>('GET', '/promotions/active'),
    validate: (code: string, orderTotal: number) =>
      request<{ valid: boolean; discount: number; promotion: Promotion }>(
        'POST',
        '/promotions/validate',
        { code, orderTotal },
      ),
  },
};
