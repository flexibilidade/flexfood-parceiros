// Empty state for orders
interface OrdersEmptyProps {
  message: string;
}

export function OrdersEmpty({ message }: OrdersEmptyProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      {message}
    </div>
  );
}
