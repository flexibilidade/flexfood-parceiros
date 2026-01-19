"use client";

import { useSocket } from "@/contexts/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useEffect } from "react";

export function NewOrderNotification() {
  const { newOrders, clearNewOrders } = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio when clearing notifications
  const handleStopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    clearNewOrders();
  };

  // Get audio element reference
  useEffect(() => {
    const audio = document.querySelector('audio[src="/notification.mp3"]') as HTMLAudioElement;
    if (audio) {
      audioRef.current = audio;
    }
  }, []);

  if (newOrders.length === 0) return null;

  return (
    <AnimatePresence>
      {/* Stop Sound Button - Appears at top when there's a notification */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60]"
      >
        <Button
          onClick={handleStopSound}
          size="lg"
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm"
        >
          <VolumeX className="w-5 h-5 mr-2 animate-pulse" />
          Parar Som e Fechar
        </Button>
      </motion.div>

      {/* Notifications */}
      {newOrders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl p-4 mx-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Bell className="w-6 h-6" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">
                  🔔 Novo Pedido #{order.orderNumber.toString().padStart(4, '0')}
                </h3>
                <p className="text-sm opacity-90 mb-2">
                  {order.customerName} • {order.total.toFixed(2)} MT
                </p>
                <div className="text-xs opacity-75">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                </div>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-white hover:bg-white/20"
                onClick={() => clearNewOrders()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-1 bg-white/30 rounded-full mt-3 overflow-hidden"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
            >
              <div className="h-full bg-white rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
