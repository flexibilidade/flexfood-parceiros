"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { financesService, FinancialOverview, RevenueByDay } from "@/lib/services/finances-service";
import { DollarSign, ShoppingCart, TrendingUp, TrendingDown, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardClientPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [revenueByDay, setRevenueByDay] = useState<RevenueByDay[]>([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, isLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewData, revenueData] = await Promise.all([
        financesService.getFinancialOverview(),
        financesService.getRevenueByDay(7),
      ]);

      setOverview(overviewData);
      setRevenueByDay(revenueData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Aqui está um resumo do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (30 dias)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalRevenue.toFixed(2)} MT</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ticket médio: {overview?.averageOrderValue.toFixed(2)} MT
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalOrders}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              {overview?.deliveredOrders} entregues
            </p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.pendingOrdersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview?.pendingAmount.toFixed(2)} MT
            </p>
          </CardContent>
        </Card>

        {/* Cancelled Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.cancelledOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview && overview.totalOrders > 0 
                ? `${((overview.cancelledOrders / overview.totalOrders) * 100).toFixed(1)}% do total`
                : "0% do total"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Receita dos Últimos 7 Dias</CardTitle>
              <CardDescription>Evolução diária da receita</CardDescription>
            </div>
            <Link href="/dashboard/finances">
              <Button variant="outline" size="sm">
                Ver Relatório Completo
              </Button>
            </Link>
          </div>
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
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} name="Receita" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/orders")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Gerenciar Pedidos
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todos os pedidos
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/menu")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Editar Cardápio
            </CardTitle>
            <CardDescription>
              Adicione ou edite produtos do cardápio
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/finances")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              Ver Finanças
            </CardTitle>
            <CardDescription>
              Relatórios detalhados e análises
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
