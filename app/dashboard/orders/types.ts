// Order types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productPhoto?: string | null;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  userId: string;
  partnerId: string;
  deliverymanId?: string;
  addressId?: string;

  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Items
  items: OrderItem[];

  // Values
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;

  // Status
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "ON_THE_WAY"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "CANCELLED";

  // Payment
  paymentMethod: string;
  paymentStatus: string;
  paymentReference?: string;
  gatewayPaymentId?: string;
  paidAt?: string;

  // Delivery address
  deliveryAddress: string;
  deliveryCity?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;

  // Times
  estimatedPreparationTime?: number;
  estimatedDeliveryTime?: string;

  // Timestamps
  confirmedAt?: string;
  readyAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;

  // Notes
  notes?: string;
  cancellationReason?: string;

  // Legacy field for compatibility
  estimatedTime?: number;
}

export const statusConfig = {
  PENDING: {
    label: "Pendente",
    color: "bg-yellow-500",
    icon: "Clock",
  },
  CONFIRMED: {
    label: "Confirmado",
    color: "bg-blue-500",
    icon: "CheckCircle",
  },
  PREPARING: {
    label: "Preparando",
    color: "bg-orange-500",
    icon: "ChefHat",
  },
  READY_FOR_PICKUP: {
    label: "Pronto para Retirada",
    color: "bg-green-500",
    icon: "Package",
  },
  ON_THE_WAY: {
    label: "Entregador a Caminho",
    color: "bg-cyan-500",
    icon: "Car",
  },
  PICKED_UP: {
    label: "Retirado",
    color: "bg-purple-500",
    icon: "Bike",
  },
  IN_TRANSIT: {
    label: "Em Trânsito",
    color: "bg-indigo-500",
    icon: "Bike",
  },
  DELIVERED: {
    label: "Entregue",
    color: "bg-gray-500",
    icon: "CheckCircle",
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-red-500",
    icon: "XCircle",
  },
} as const;
