import type { Address, Product, Review, Store, User } from './models';

export interface RegisterInput {
  firebaseToken: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
}

export type ProfileInput = Partial<Pick<User, 'fullName' | 'phone' | 'avatarUrl'>> & {
  fcmToken?: string;
  vehicleType?: string;
  vehicleNumber?: string;
};

export type AddressInput = Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type ProductInput = Partial<Product>;
export type StoreInput = Partial<Store> & {
  kycDocumentUrl?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
};

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  sort?: string;
}

export interface CartItemInput {
  productId: string;
  storeId?: string;
  quantity: number;
}

// Prices and totals are calculated by the backend from the current cart.
export interface CheckoutInput {
  deliveryAddress?: string;
  deliveryAddressId?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryInstructions?: string;
  paymentMethod: string;
  tip?: number;
  promotionCode?: string;
}

export interface InventoryInput {
  productId: string;
  stock: number;
  priceOverride?: number;
  isVisible?: boolean;
}

export type ReviewInput = Pick<
  Review,
  'orderId' | 'storeId' | 'riderId' | 'storeRating' | 'riderRating' | 'comment'
>;
