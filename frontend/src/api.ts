const API_BASE = "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? (typeof body === "string" ? body : detail);
      if (Array.isArray(detail)) {
        detail = detail.map((d: { msg?: string }) => d.msg ?? "").join(", ");
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(String(detail), res.status);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export const api = {
  register: (data: { email: string; password: string; full_name: string; role: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string) => request<import("./types").User>("/auth/me", {}, token),

  products: (
    page: number = 1,
    limit: number = 12,
    search?: string,
    categorySlug?: string,
    sortBy?: string,
    storeId?: number
  ) => {
    let url = `/products?page=${page}&page_size=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categorySlug) url += `&category_slug=${encodeURIComponent(categorySlug)}`;
    if (sortBy) url += `&sort_by=${encodeURIComponent(sortBy)}`;
    if (storeId) url += `&store_id=${storeId}`;
    return request<import("./types").ProductList>(url);
  },

  productBySlug: (slug: string, storeId?: number) => {
    let url = `/products/${slug}`;
    if (storeId) url += `?store_id=${storeId}`;
    return request<import("./types").Product>(url);
  },

  categories: () =>
    request<import("./types").Category[]>("/categories"),

  cart: (token: string) =>
    request<import("./types").Cart>("/cart", {}, token),

  addToCart: (
    token: string,
    data: { product_id: number; quantity: number }
  ) =>
    request("/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  updateCartItem: (token: string, itemId: number, quantity: number) =>
    request(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }, token),

  removeCartItem: (token: string, itemId: number) =>
    request(`/cart/items/${itemId}`, { method: "DELETE" }, token),

  checkout: (token: string, shipping_address: string) =>
    request<import("./types").Order>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify({ shipping_address }),
    }, token),

  orders: (token: string) =>
    request<import("./types").Order[]>("/orders", {}, token),

  order: (token: string, id: number) =>
    request<import("./types").Order>(`/orders/${id}`, {}, token),

  getSellerDashboard: (token: string) =>
    request<any>("/seller/dashboard", {}, token),

  getSellerProducts: (token: string) =>
    request<import("./types").Product[]>("/seller/products", {}, token),

  createSellerProduct: (token: string, data: any) =>
    request<import("./types").Product>("/seller/products", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  updateSellerProduct: (token: string, id: number, data: any) =>
    request<import("./types").Product>(`/seller/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }, token),

  deleteSellerProduct: (token: string, id: number) =>
    request(`/seller/products/${id}`, { method: "DELETE" }, token),

  getSellerOrders: (token: string) =>
    request<any[]>("/seller/orders", {}, token),

  updateSellerOrderStatus: (token: string, id: number, status: string) =>
    request<any>(`/seller/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }, token),

  getStores: () =>
    request<any[]>("/stores"),

  getSellerStoreInventory: (token: string, storeId: number) =>
    request<any[]>(`/seller/inventory/${storeId}`, {}, token),

  updateSellerStoreInventory: (token: string, storeId: number, productId: number, stock: number) =>
    request<any>(`/seller/inventory/${storeId}`, {
      method: "POST",
      body: JSON.stringify({ product_id: productId, stock }),
    }, token),

  getAiDeliveryEstimate: (storeId: number, lat: number, lng: number) =>
    request<{ estimate_text: string }>(`/ai/delivery-estimate?store_id=${storeId}&user_lat=${lat}&user_lng=${lng}`),

  getRiderOrders: (token: string) =>
    request<any[]>("/rider/orders", {}, token),

  acceptRiderOrder: (token: string, orderId: number) =>
    request<any>(`/rider/orders/${orderId}/accept`, { method: "PATCH" }, token),

  deliverRiderOrder: (token: string, orderId: number) =>
    request<any>(`/rider/orders/${orderId}/deliver`, { method: "PATCH" }, token),

  chatWithAI: (token: string, message: string, storeId?: number) =>
    request<{ response: string; items_added: any[] }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, store_id: storeId })
    }, token),
};
