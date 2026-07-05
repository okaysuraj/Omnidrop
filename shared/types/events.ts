// WebSocket event definitions shared between backend and frontends

// ============= Event Names =============

export const WS_EVENTS = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',

  // Order events
  ORDER_STATUS_UPDATED: 'order:status_updated',
  ORDER_NEW: 'order:new',
  ORDER_CANCELLED: 'order:cancelled',

  // Delivery events
  DELIVERY_LOCATION_UPDATED: 'delivery:location_updated',
  DELIVERY_ASSIGNED: 'delivery:assigned',
  DELIVERY_ACCEPTED: 'delivery:accepted',
  DELIVERY_PICKED_UP: 'delivery:picked_up',
  DELIVERY_COMPLETED: 'delivery:completed',
  DELIVERY_REQUEST: 'delivery:request',

  // Inventory events
  INVENTORY_UPDATED: 'inventory:updated',
  INVENTORY_LOW_STOCK: 'inventory:low_stock',

  // Rooms
  JOIN_ORDER_ROOM: 'room:join_order',
  LEAVE_ORDER_ROOM: 'room:leave_order',
  JOIN_STORE_ROOM: 'room:join_store',
  LEAVE_STORE_ROOM: 'room:leave_store',
  JOIN_RIDER_ROOM: 'room:join_rider',
  LEAVE_RIDER_ROOM: 'room:leave_rider',
} as const;

// ============= Event Payloads =============

export interface OrderStatusPayload {
  orderId: string;
  status: string;
  updatedAt: string;
  message?: string;
}

export interface DeliveryLocationPayload {
  taskId: string;
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  etaMinutes?: number;
  updatedAt: string;
}

export interface DeliveryAssignedPayload {
  taskId: string;
  orderId: string;
  riderId: string;
  riderName: string;
  riderPhone?: string;
  etaMinutes?: number;
}

export interface InventoryUpdatePayload {
  storeId: string;
  productId: string;
  stock: number;
  isVisible: boolean;
}

export interface DeliveryRequestPayload {
  taskId: string;
  orderId: string;
  storeId: string;
  storeName: string;
  pickupAddress: string;
  dropAddress: string;
  estimatedDistance: number;
  estimatedEarnings: number;
}

export interface NewOrderPayload {
  orderId: string;
  storeId: string;
  customerName: string;
  itemCount: number;
  total: number;
  paymentMethod: string;
}
