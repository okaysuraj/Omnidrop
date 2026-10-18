// API response types and model interfaces

import {
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PromotionType,
  SubstitutionStatus,
  TicketPriority,
  TicketStatus,
  UserRole,
  WalletTransactionType,
} from './enums';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  firebaseUid: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  isAvailable?: boolean;
}

export interface Address extends BaseEntity {
  userId: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface BusinessHours {
  [day: string]: { open: string; close: string; isClosed: boolean };
}

export interface Store extends BaseEntity {
  ownerId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  address: string;
  lat: number;
  lng: number;
  radiusKm: number;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  businessHours: BusinessHours;
  kycDocumentUrl?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  phone?: string;
}

export interface StoreWithDistance extends Store {
  distance: number;
  estimatedDeliveryMinutes: number;
  isOpen: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  images: string[];
  categoryId: string;
  unit: string;
  weight?: string;
  category?: Category;
  inventory?: (InventoryItem & { store?: Store })[];
}

export interface InventoryItem extends BaseEntity {
  storeId: string;
  productId: string;
  stock: number;
  priceOverride?: number;
  isVisible: boolean;
  product?: Product;
}

export interface CartItem extends BaseEntity {
  userId: string;
  storeId: string;
  productId: string;
  quantity: number;
  product?: Product;
  inventory?: InventoryItem;
  effectivePrice?: number;
}

export interface Cart {
  tax?: number;
  items: CartItem[];
  storeId?: string | null;
  store?: Store;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  substitutionStatus: SubstitutionStatus;
  product?: Product;
}

export interface Order extends BaseEntity {
  userId: string;
  storeId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  total: number;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod;
  scheduledAt?: string;
  items?: OrderItem[];
  store?: Store;
  user?: User;
  payment?: Payment;
  deliveryTask?: DeliveryTask;
}

export interface Payment extends BaseEntity {
  orderId: string;
  stripePaymentId?: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
}

export interface DeliveryTask extends BaseEntity {
  orderId: string;
  riderId?: string;
  status: DeliveryStatus;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  currentLat?: number;
  currentLng?: number;
  etaMinutes?: number;
  pickedUpAt?: string;
  deliveredAt?: string;
  rider?: User;
  order?: Order;
  codAmount?: number;
}

export interface Review extends BaseEntity {
  userId: string;
  orderId: string;
  storeId?: string;
  riderId?: string;
  storeRating?: number;
  riderRating?: number;
  comment?: string;
  user?: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
}

export interface Promotion extends BaseEntity {
  code: string;
  type: PromotionType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startsAt: string;
  expiresAt: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface Wallet extends BaseEntity {
  userId: string;
  balance: number;
  currency: string;
}

export interface WalletTransaction extends BaseEntity {
  walletId: string;
  amount: number;
  type: WalletTransactionType;
  referenceId?: string;
  description: string;
}

export interface SupportTicket extends BaseEntity {
  userId: string;
  orderId?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface WalletDetails {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
  updatedAt: string;
}

export type PaymentIntentResult =
  | { provider: 'stripe'; clientSecret: string }
  | { provider: 'wallet'; status: 'PAID'; message: string }
  | { provider: 'razorpay'; orderId: string; amount: number; currency: string };

export interface WalletIntentResult {
  provider: 'stripe';
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface Earnings {
  totalDeliveries: number;
  totalEarnings: number;
  todayEarnings: number;
  todayDeliveries: number;
}

export interface UserStats {
  total: number;
  customers: number;
  shopkeepers: number;
  riders: number;
}
export interface OrderStats {
  inTransit: number;
  total: number;
  pending: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}
export interface DashboardStats {
  revenue: number;
  orders: { total: number };
  users: { totalActive: number; customers: number; shopkeepers: number; riders: number };
  stores: { total: number; verified: number; unverified: number };
  recentOrders: Order[];
}
export interface PromotionValidation {
  valid: boolean;
  discount: number;
  promotion: Promotion;
}
