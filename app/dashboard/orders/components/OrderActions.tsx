// Order action buttons
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChefHat, Package, Bike } from "lucide-react";
import { Order } from "../types";

interface OrderActionsProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void;
}

export function OrderActions({ order, onUpdateStatus }: OrderActionsProps) {
  const getActionButtons = () => {
    switch (order.status) {
      case "PENDING":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "CONFIRMED")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onUpdateStatus(order.id, "CANCELLED")}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Recusar
            </Button>
          </div>
        );
      case "CONFIRMED":
        return (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, "PREPARING")}
            className="bg-orange-600 hover:bg-orange-700 w-full"
          >
            <ChefHat className="w-4 h-4 mr-2" />
            Iniciar Preparo
          </Button>
        );
      case "PREPARING":
        return (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, "READY_FOR_PICKUP")}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            <Package className="w-4 h-4 mr-2" />
            Marcar como Pronto
          </Button>
        );
      case "READY_FOR_PICKUP":
        return (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Package className="w-5 h-5" />
              <span className="font-medium">Pedido Pronto</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aguardando entregador retirar o pedido
            </p>
          </div>
        );
      case "PICKED_UP":
      case "IN_TRANSIT":
        return (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Bike className="w-5 h-5" />
              <span className="font-medium">
                {order.status === "PICKED_UP" ? "Pedido Retirado" : "Em Trânsito"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Entregador está a caminho do cliente
            </p>
          </div>
        );
      case "DELIVERED":
        return (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Pedido Entregue</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pedido concluído com sucesso
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="pt-2">{getActionButtons()}</div>;
}
