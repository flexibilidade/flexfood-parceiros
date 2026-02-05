// Order status badge
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Package, ChefHat, Bike, Car, AlertTriangle } from "lucide-react";
import { Order, statusConfig } from "../types";

interface OrderStatusBadgeProps {
  status: Order["status"];
}

const iconMap = {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ChefHat,
  Bike,
  Car,
  AlertTriangle,
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const IconComponent = iconMap[config.icon as keyof typeof iconMap];

  if (!IconComponent) {
    console.error(`Icon not found for status: ${status}, icon: ${config.icon}`);
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  }

  return (
    <Badge className={`${config.color} text-white`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
