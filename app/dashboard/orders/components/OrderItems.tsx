// Order items list
import { OrderItem } from "../types";
import { formatCurrency } from "../utils";
import Image from "next/image";

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            {/* Product Photo */}
            {item.productPhoto ? (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                <Image
                  src={item.productPhoto}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Sem foto</span>
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {item.productName}
              </p>
              <p className="text-xs text-muted-foreground">
                Quantidade: {item.quantity}
              </p>
              {item.notes && (
                <p className="text-xs text-muted-foreground italic mt-1">
                  Obs: {item.notes}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-sm">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(item.price)} cada
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
