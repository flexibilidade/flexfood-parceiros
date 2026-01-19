// Order details panel
import { Order } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderItems } from "./OrderItems";
import { OrderTotal } from "./OrderTotal";
import { OrderActions } from "./OrderActions";
import { formatTime, formatDate } from "../utils";
import { MapPin, Clock, Phone } from "lucide-react";

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void;
}

export function OrderDetails({ order, onUpdateStatus }: OrderDetailsProps) {
  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Pedido #{order.orderNumber.toString().padStart(4, "0")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {formatDate(order.createdAt)} às {formatTime(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Customer Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">
                {order.customerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold">{order.customerName}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2 border-t">
            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Endereço de Entrega</p>
              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress}
                {order.deliveryCity && `, ${order.deliveryCity}`}
              </p>
            </div>
          </div>

          {order.estimatedTime && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Tempo Estimado</p>
                <p className="text-sm text-muted-foreground">
                  {order.estimatedTime} minutos
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderItems items={order.items} />
        </CardContent>
      </Card>

      {/* Total Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTotal
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            discount={order.discount}
            total={order.total}
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <OrderActions order={order} onUpdateStatus={onUpdateStatus} />
        </CardContent>
      </Card>
    </div>
  );
}
