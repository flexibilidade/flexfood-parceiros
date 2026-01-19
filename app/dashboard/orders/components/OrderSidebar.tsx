// Orders sidebar list
import { Order } from "../types";
import { OrderListItem } from "./OrderListItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderSidebarProps {
  orders: Order[];
  selectedOrder: Order | null;
  onSelectOrder: (order: Order) => void;
}

export function OrderSidebar({
  orders,
  selectedOrder,
  onSelectOrder,
}: OrderSidebarProps) {
  return (
    <div className="border-r bg-gray-50 h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h2 className="font-bold text-lg">Pedidos</h2>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y">
          {orders.map((order) => (
            <OrderListItem
              key={order.id}
              order={order}
              isSelected={selectedOrder?.id === order.id}
              onClick={() => onSelectOrder(order)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
