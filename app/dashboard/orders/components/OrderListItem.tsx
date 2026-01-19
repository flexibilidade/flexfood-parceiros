// Order list item for sidebar
import { Order, statusConfig } from "../types";
import { Clock } from "lucide-react";
import { formatTime } from "../utils";
import { cn } from "@/lib/utils";

interface OrderListItemProps {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
}

export function OrderListItem({ order, isSelected, onClick }: OrderListItemProps) {
  const config = statusConfig[order.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 text-left hover:bg-white transition-colors",
        isSelected && "bg-white border-l-4 border-l-primary"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-bold text-lg">#{order.orderNumber.toString().padStart(4, '0')}</p>
          <p className="text-sm text-muted-foreground">{order.customerName}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${config.color} text-white`}>
          {config.label}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{formatTime(order.createdAt)}</span>
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium">
          {order.items.length} {order.items.length === 1 ? "item" : "itens"}
        </p>
      </div>
    </button>
  );
}
