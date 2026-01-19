// Service for finances and reports API calls
import api from "../api";

export interface FinancialOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingAmount: number;
  pendingOrdersCount: number;
  cancelledOrders: number;
  deliveredOrders: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productImage?: string;
  totalQuantity: number;
  totalRevenue: number;
  ordersCount: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface RevenueComparison {
  current: {
    revenue: number;
    orders: number;
    period: {
      startDate: Date;
      endDate: Date;
    };
  };
  previous: {
    revenue: number;
    orders: number;
    period: {
      startDate: Date;
      endDate: Date;
    };
  };
  changes: {
    revenueChange: number;
    ordersChange: number;
  };
}

export const financesService = {
  // Get financial overview
  async getFinancialOverview(): Promise<FinancialOverview> {
    const response = await api.get("/api/partners/finances/overview");
    return response.data.data.overview;
  },

  // Get revenue by day
  async getRevenueByDay(days: number = 30): Promise<RevenueByDay[]> {
    const response = await api.get("/api/partners/finances/revenue-by-day", {
      params: { days },
    });
    return response.data.data.chartData;
  },

  // Get top products
  async getTopProducts(days: number = 30, limit: number = 10): Promise<TopProduct[]> {
    const response = await api.get("/api/partners/finances/top-products", {
      params: { days, limit },
    });
    return response.data.data.topProducts;
  },

  // Get orders by status
  async getOrdersByStatus(days: number = 30): Promise<OrdersByStatus[]> {
    const response = await api.get("/api/partners/finances/orders-by-status", {
      params: { days },
    });
    return response.data.data.chartData;
  },

  // Get revenue comparison
  async getRevenueComparison(days: number = 30): Promise<RevenueComparison> {
    const response = await api.get("/api/partners/finances/revenue-comparison", {
      params: { days },
    });
    return response.data.data;
  },
};
