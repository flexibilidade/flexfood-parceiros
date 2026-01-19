import api from "../api";

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "CANCELLED";

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    notes?: string;
    user: {
        id: string;
        name: string;
        phone?: string;
    };
    address: {
        street: string;
        city: string;
        province: string;
    };
    orderItems: {
        id: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        product: {
            id: string;
            name: string;
            price: number;
        };
    }[];
    deliveryman?: {
        id: string;
        user: {
            name: string;
        };
        phone: string;
    };
    createdAt: string;
    confirmedAt?: string;
    readyAt?: string;
    pickedUpAt?: string;
    deliveredAt?: string;
}

export const orderService = {
    getOrders: async (status?: OrderStatus): Promise<{ orders: Order[] }> => {
        const params = status ? { status } : {};
        const response = await api.get("/partners/orders", { params });
        return response.data;
    },

    getOrderById: async (id: string): Promise<{ order: Order }> => {
        const response = await api.get(`/partners/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (
        id: string,
        status: OrderStatus
    ): Promise<{ message: string; order: Order }> => {
        const response = await api.patch(`/partners/orders/${id}/status`, { status });
        return response.data;
    },
};
