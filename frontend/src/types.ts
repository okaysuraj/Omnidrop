export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  image_url: string | null;
  category: Category | null;
}

export interface ProductList {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_admin: boolean;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unit_price: string;
  product: Product;
}

export interface Order {
  id: number;
  status: string;
  total: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}
