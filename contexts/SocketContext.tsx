"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  newOrders: Order[];
  currentOrder: Order | null;
  clearNewOrders: () => void;
  clearCurrentOrder: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { user, isLoading } = useAuth();
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8060";

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) {
      console.log("⏳ Waiting for auth to load...");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log("❌ No user authenticated");
      return;
    }

    // Check if user has partner
    if (!user.partner) {
      console.log("❌ User has no partner associated");
      return;
    }

    console.log("✅ User authenticated:", user.id, "Partner:", user.partner.id);
    console.log("🔌 Attempting to connect to:", API_BASE_URL);

    // Connect to Socket.IO server
    const socketInstance = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 10000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);

      // Register as partner
      const registerData = {
        userId: user.id,
        userType: "partner" as const,
        partnerId: user?.partner?.id,
      };
      console.log("📤 Sending register event:", registerData);
      socketInstance.emit("register", registerData);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("Error details:", error);
      setIsConnected(false);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    });

    // Listen for new orders
    socketInstance.on("new-order", (data: { order: Order; message: string }) => {
      console.log("🔔 NEW ORDER RECEIVED (PARTNER):", data);
      console.log("📍 Current page:", window.location.pathname);

      // Set current order to show dialog
      setCurrentOrder(data.order);
      console.log("✅ Current order set, dialog should open");

      // Add to new orders list
      setNewOrders((prev) => [...prev, data.order]);

      // Show toast notification as backup
      toast.success(`Novo Pedido #${data.order.orderNumber}`, {
        description: `${data.order.customerName} - ${data.order.total.toFixed(2)} MT`,
        duration: 10000,
      });

      // Auto-remove from new orders after 30 seconds
      setTimeout(() => {
        setNewOrders((prev) => prev.filter((o) => o.id !== data.order.id));
      }, 30000);
    });

    // Listen for order status changes
    socketInstance.on("order-status-changed", (data: { order: Order; status: string; message: string }) => {
      console.log("📢 Order status changed:", data);

      toast.info(`Pedido #${data.order.orderNumber}`, {
        description: data.message,
        duration: 5000,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, isLoading]);

  const clearNewOrders = () => {
    setNewOrders([]);
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, newOrders, currentOrder, clearNewOrders, clearCurrentOrder }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
