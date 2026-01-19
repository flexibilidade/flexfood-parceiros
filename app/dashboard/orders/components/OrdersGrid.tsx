// Grid layout for orders
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface OrdersGridProps {
  children: ReactNode;
}

export function OrdersGrid({ children }: OrdersGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}
