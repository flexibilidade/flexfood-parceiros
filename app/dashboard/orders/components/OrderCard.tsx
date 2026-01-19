// Order card component
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, statusConfig } from "../types";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderItems } from "./OrderItems";
import { OrderTotal } from "./OrderTotal";
import { OrderActions } from "./OrderActions";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatTime } from "../utils";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void;
}

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold">
                Pedido #{order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatTime(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <OrderCustomerInfo
            name={order.customerName}
            phone={order.customerPhone}
            address={order.deliveryAddress}
          />

          <OrderItems items={order.items} />

          <OrderTotal
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            discount={order.discount}
            total={order.total}
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
          />

          <OrderActions order={order} onUpdateStatus={onUpdateStatus} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
