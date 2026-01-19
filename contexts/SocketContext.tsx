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
  clearNewOrders: () => void;
  testSound: () => void;
  audioEnabled: boolean;
  enableAudio: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { user, isLoading } = useAuth();

  // Initialize audio listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      audio.volume = 0.7;
      
      const handleCanPlay = () => {
        console.log("✅ Audio loaded and ready to play");
        setAudioLoaded(true);
      };
      
      const handleError = (e: Event) => {
        console.error("❌ Audio load error:", e);
      };
      
      audio.addEventListener("canplaythrough", handleCanPlay);
      audio.addEventListener("error", handleError);
      
      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlay);
        audio.removeEventListener("error", handleError);
      };
    }
  }, []);

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

    // Check if user has partnerId
    if (!user.partnerId) {
      console.log("❌ User has no partnerId");
      return;
    }

    console.log("✅ User authenticated:", user.id, "Partner:", user.partnerId);

    // Connect to Socket.IO server
    const socketInstance = io("http://localhost:8000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);

      // Register as partner
      socketInstance.emit("register", {
        userId: user.id,
        userType: "partner",
        partnerId: user.partnerId,
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Listen for new orders
    socketInstance.on("new-order", (data: { order: Order; message: string }) => {
      console.log("🔔 New order received:", data);

      // Play notification sound
      console.log("🔊 Attempting to play notification sound...");
      console.log("🔊 Audio loaded:", audioLoaded);
      console.log("🔊 Audio enabled:", audioEnabled);
      console.log("🔊 Audio ref exists:", !!audioRef.current);
      
      if (audioRef.current && audioEnabled) {
        // Reset audio to start
        audioRef.current.currentTime = 0;
        audioRef.current.loop = true; // Loop until user stops
        
        // Try to play
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("✅ Sound playing in loop");
            })
            .catch((err) => {
              console.error("❌ Audio play error:", err);
              console.error("Error name:", err.name);
              console.error("Error message:", err.message);
              
              if (err.name === "NotAllowedError") {
                console.log("⚠️ Autoplay blocked. Click 'Habilitar Som' button first.");
                toast.error("Som bloqueado", {
                  description: "Clique em 'Habilitar Som' para receber notificações sonoras",
                  duration: 5000,
                });
              }
            });
        }
      } else if (!audioEnabled) {
        console.log("⚠️ Audio not enabled. User needs to enable sound first.");
        toast.warning("Som desabilitado", {
          description: "Clique em 'Habilitar Som' para ouvir notificações",
          duration: 5000,
        });
      } else {
        console.error("❌ Audio ref is null");
      }

      // Add to new orders list
      setNewOrders((prev) => [...prev, data.order]);

      // Show toast notification with Sonner
      toast.success(`🔔 Novo Pedido #${data.order.orderNumber}!`, {
        description: `${data.order.customerName} - ${data.order.total.toFixed(2)} MT`,
        duration: 10000,
      });

      // Auto-remove from new orders after 10 seconds
      setTimeout(() => {
        setNewOrders((prev) => prev.filter((o) => o.id !== data.order.id));
      }, 10000);
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

  const enableAudio = () => {
    console.log("🔊 Enabling audio...");
    
    if (audioRef.current) {
      // Play a silent sound to unlock audio
      audioRef.current.volume = 0;
      audioRef.current.play()
        .then(() => {
          console.log("✅ Audio unlocked!");
          audioRef.current!.volume = 0.7;
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
          setAudioEnabled(true);
          toast.success("Som habilitado!", {
            description: "Você receberá notificações sonoras de novos pedidos",
          });
        })
        .catch((err) => {
          console.error("❌ Failed to enable audio:", err);
          toast.error("Erro ao habilitar som", {
            description: "Tente novamente",
          });
        });
    }
  };

  const testSound = () => {
    console.log("🧪 Testing sound...");
    
    if (!audioEnabled) {
      toast.warning("Som desabilitado", {
        description: "Habilite o som primeiro",
      });
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("✅ Test sound played successfully!");
            toast.success("Som funcionando!");
          })
          .catch((err) => {
            console.error("❌ Test sound error:", err);
            toast.error("Erro ao tocar som");
          });
      }
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, newOrders, clearNewOrders, testSound, audioEnabled, enableAudio }}>
      {/* Hidden audio element for notification sound */}
      <audio 
        ref={audioRef as any}
        src="/notification.mp3" 
        preload="auto"
        style={{ display: 'none' }}
      />
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
