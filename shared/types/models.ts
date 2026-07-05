// Shared API response types and model interfaces

import {
  UserRole,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryStatus,
  PromotionType,
  SubstitutionStatus,
  TicketStatus,
  TicketPriority,
  WalletTransactionType,
} from './enums';

// ============= Base =============

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ============= User =============

export interface User extends BaseEntity {
  firebaseUid: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
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

// ============= Store =============

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
  phone?: string;
}

export interface StoreWithDistance extends Store {
  distance: number;
  estimatedDeliveryMinutes: number;
  isOpen: boolean;
}

// ============= Product =============

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
}

export interface InventoryItem extends BaseEntity {
  storeId: string;
  productId: string;
  stock: number;
  priceOverride?: number;
  isVisible: boolean;
  product?: Product;
}

// ============= Cart =============

export interface CartItem extends BaseEntity {
  userId: string;
  storeId: string;
  productId: string;
  quantity: number;
  product?: Product;
  inventory?: InventoryItem;
}

export interface Cart {
  items: CartItem[];
  storeId?: string;
  store?: Store;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

// ============= Order =============

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
  payment?: Payment;
  deliveryTask?: DeliveryTask;
}

// ============= Payment =============

export interface Payment extends BaseEntity {
  orderId: string;
  stripePaymentId?: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
}

// ============= Delivery =============

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
}

// ============= Review =============

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

// ============= Promotion =============

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

// ============= Wallet =============

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

// ============= Support =============

export interface SupportTicket extends BaseEntity {
  userId: string;
  orderId?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

// ============= API Responses =============

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
