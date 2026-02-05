"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import api from "@/lib/api";
import { OrderSidebar } from "./components/OrderSidebar";
import { OrderDetails } from "./components/OrderDetails";
import { OrdersLoading } from "./components/OrdersLoading";
import { OrdersEmpty } from "./components/OrdersEmpty";
import { Order } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-select first order when orders change (only on desktop)
    if (orders.length > 0 && !selectedOrder && !isMobile) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, isMobile]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/partners/orders");

      if (response.data.success) {
        // Filter out PENDING orders (not paid yet)
        const paidOrders = response.data.orders.filter(
          (order: Order) => order.status !== "PENDING"
        );
        setOrders(paidOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await api.patch(`/api/partners/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        const updatedOrder = response.data.order;

        // Update orders list
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Update selected order if it's the one being updated
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus } : prev
          );
        }

        toast.success(`Pedido #${updatedOrder.orderNumber} atualizado para ${getStatusLabel(newStatus)}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Não foi possível atualizar o pedido");
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    if (isMobile) {
      setIsDetailsOpen(true);
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    const labels: Record<Order["status"], string> = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmado",
      PREPARING: "Preparando",
      READY_FOR_PICKUP: "Pronto",
      ON_THE_WAY: "Entregador a Caminho",
      PICKED_UP: "Retirado",
      IN_TRANSIT: "Em Trânsito",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado",
      FAILED_DELIVERY: "Entrega Falhada",
    };
    return labels[status] || status;
  };

  const filterOrders = (status: string) => {
    if (status === "new") {
      return orders.filter((o) => o.status === "CONFIRMED");
    }
    if (status === "preparing") {
      return orders.filter((o) => o.status === "PREPARING");
    }
    if (status === "ready") {
      return orders.filter((o) => o.status === "READY_FOR_PICKUP");
    }
    if (status === "completed") {
      return orders.filter((o) =>
        ["ON_THE_WAY", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED_DELIVERY"].includes(o.status)
      );
    }
    return orders;
  };

  if (loading) {
    return <OrdersLoading />;
  }

  const filteredOrders = filterOrders(activeTab);

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="new" className="text-xs md:text-sm">
              <span className="hidden md:inline">Novos</span>
              <span className="md:hidden">Novo</span>
              <span className="ml-1">({filterOrders("new").length})</span>
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-xs md:text-sm">
              <span className="hidden md:inline">Preparando</span>
              <span className="md:hidden">Prep</span>
              <span className="ml-1">({filterOrders("preparing").length})</span>
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs md:text-sm">
              <span className="hidden md:inline">Prontos</span>
              <span className="md:hidden">Pronto</span>
              <span className="ml-1">({filterOrders("ready").length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs md:text-sm">
              <span className="hidden md:inline">Concluídos</span>
              <span className="md:hidden">Concl</span>
              <span className="ml-1">({filterOrders("completed").length})</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs md:text-sm">
              Todos ({orders.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content: Sidebar + Details */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Full width on mobile, fixed width on desktop */}
        <div className="w-full md:w-96">
          {filteredOrders.length === 0 ? (
            <OrdersEmpty message="Nenhum pedido encontrado" />
          ) : (
            <OrderSidebar
              orders={filteredOrders}
              selectedOrder={selectedOrder}
              onSelectOrder={handleSelectOrder}
            />
          )}
        </div>

        {/* Details Panel - Hidden on mobile, shown in Sheet instead */}
        <div className="hidden md:block flex-1 bg-gray-50">
          {selectedOrder ? (
            <OrderDetails
              order={selectedOrder}
              onUpdateStatus={updateOrderStatus}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Selecione um pedido para ver os detalhes
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sheet for Order Details */}
      {isMobile && (
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent side="bottom" className="h-[90vh] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>
                Pedido #{selectedOrder?.orderNumber}
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(90vh-60px)]">
              {selectedOrder && (
                <OrderDetails
                  order={selectedOrder}
                  onUpdateStatus={updateOrderStatus}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
