// Customer information component
interface OrderCustomerInfoProps {
  name: string;
  phone: string;
  address: string;
}

export function OrderCustomerInfo({ name, phone, address }: OrderCustomerInfoProps) {
  return (
    <div className="border-b pb-3">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground">{phone}</p>
      <p className="text-sm text-muted-foreground mt-1">{address}</p>
    </div>
  );
}
