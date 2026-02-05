"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { financesService, FinancialOverview, RevenueByDay, TopProduct, OrdersByStatus, RevenueComparison } from "@/lib/services/finances-service";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, XCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Status colors for pie chart
const STATUS_COLORS: { [key: string]: string } = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PREPARING: "#8b5cf6",
  READY_FOR_PICKUP: "#10b981",
  PICKED_UP: "#06b6d4",
  IN_TRANSIT: "#6366f1",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

// Status translations
const STATUS_TRANSLATIONS: { [key: string]: string } = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  READY_FOR_PICKUP: "Pronto",
  PICKED_UP: "Retirado",
  IN_TRANSIT: "Em Trânsito",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export default function FinancesPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [revenueByDay, setRevenueByDay] = useState<RevenueByDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus[]>([]);
  const [comparison, setComparison] = useState<RevenueComparison | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const [overviewData, revenueData, productsData, statusData, comparisonData] = await Promise.all([
        financesService.getFinancialOverview(),
        financesService.getRevenueByDay(selectedPeriod),
        financesService.getTopProducts(selectedPeriod, 10),
        financesService.getOrdersByStatus(selectedPeriod),
        financesService.getRevenueComparison(selectedPeriod),
      ]);

      setOverview(overviewData);
      setRevenueByDay(revenueData);
      setTopProducts(productsData);
      setOrdersByStatus(statusData);
      setComparison(comparisonData);
    } catch (error) {
      console.error("Error loading financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Finanças e Relatórios</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu negócio</p>
        </div>

        {/* Period Selector */}
        <Tabs value={selectedPeriod.toString()} onValueChange={(v) => setSelectedPeriod(parseInt(v))}>
          <TabsList>
            <TabsTrigger value="7">7 dias</TabsTrigger>
            <TabsTrigger value="30">30 dias</TabsTrigger>
            <TabsTrigger value="90">90 dias</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalRevenue.toFixed(2)} MT</div>
            {comparison && (
              <p className={`text-xs flex items-center gap-1 ${comparison.changes.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {comparison.changes.revenueChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(comparison.changes.revenueChange).toFixed(1)}% vs período anterior
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalOrders}</div>
            {comparison && (
              <p className={`text-xs flex items-center gap-1 ${comparison.changes.ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {comparison.changes.ordersChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(comparison.changes.ordersChange).toFixed(1)}% vs período anterior
              </p>
            )}
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.averageOrderValue.toFixed(2)} MT</div>
            <p className="text-xs text-muted-foreground">Por pedido</p>
          </CardContent>
        </Card>

        {/* Cancelled Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.cancelledOrders}</div>
            <p className="text-xs text-muted-foreground">
              {overview && overview.totalOrders > 0
                ? `${((overview.cancelledOrders / overview.totalOrders) * 100).toFixed(1)}% do total`
                : "0% do total"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue by Day Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Receita por Dia</CardTitle>
            <CardDescription>Evolução da receita nos últimos {selectedPeriod} dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDay as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)} MT`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString("pt-BR")}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} name="Receita" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status Pie Chart */}
        <Card className='col-span-2 md:col-span-1'>
          <CardHeader>
            <CardTitle>Pedidos por Status</CardTitle>
            <CardDescription>Distribuição dos pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }: any) => `${STATUS_TRANSLATIONS[status] || status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [value, STATUS_TRANSLATIONS[props.payload.status] || props.payload.status]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card className='col-span-2 md:col-span-1'>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 10 produtos por quantidade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value} unidades`} />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#f97316" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Produtos Mais Vendidos</CardTitle>
          <CardDescription>Produtos com melhor desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Produto</th>
                  <th className="text-right p-2">Quantidade</th>
                  <th className="text-right p-2">Receita</th>
                  <th className="text-right p-2">Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.productId} className="border-b hover:bg-muted/50">
                    <td className="p-2 flex items-center gap-2">
                      {product.productImage && (
                        <img src={product.productImage} alt={product.productName} className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="font-medium">{product.productName}</span>
                    </td>
                    <td className="text-right p-2">{product.totalQuantity}</td>
                    <td className="text-right p-2">{product.totalRevenue.toFixed(2)} MT</td>
                    <td className="text-right p-2">{product.ordersCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
