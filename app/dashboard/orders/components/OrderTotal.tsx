// Order total and payment info
import { formatCurrency } from "../utils";

interface OrderTotalProps {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
}

export function OrderTotal({
  subtotal,
  deliveryFee,
  discount,
  total,
  paymentMethod,
  paymentStatus,
}: OrderTotalProps) {
  return (
    <div className="space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Subtotal:</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>

      {/* Delivery Fee */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Taxa de Entrega:</span>
        <span className="font-medium">{formatCurrency(deliveryFee)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Desconto:</span>
          <span className="font-medium text-green-600">
            -{formatCurrency(discount)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t">
        <span className="font-bold text-lg">Total:</span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Payment Info */}
      <div className="flex justify-between items-center pt-2 border-t text-sm">
        <span className="text-muted-foreground">Método de Pagamento:</span>
        <span className="font-medium">{paymentMethod}</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Status do Pagamento:</span>
        <span
          className={`font-medium ${
            paymentStatus === "PAID"
              ? "text-green-600"
              : paymentStatus === "PENDING"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {paymentStatus === "PAID"
            ? "Pago"
            : paymentStatus === "PENDING"
            ? "Pendente"
            : "Falhou"}
        </span>
      </div>
    </div>
  );
}
