"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface NewOrderDialogProps {
  order: Order | null;
  onClose: () => void;
}

export function NewOrderDialog({ order, onClose }: NewOrderDialogProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (order && audioRef.current) {
      console.log("🔊 Dialog opened, playing sound...");
      
      // Play sound when dialog opens
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
      
      audioRef.current.play()
        .then(() => {
          console.log("✅ Sound playing");
          setIsPlaying(true);
          
          // Auto-stop after 30 seconds
          setTimeout(() => {
            stopSound();
          }, 30000);
        })
        .catch((err) => {
          console.error("❌ Error playing sound:", err);
        });
    }

    return () => {
      stopSound();
    };
  }, [order]);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
      setIsPlaying(false);
      console.log("🔇 Sound stopped");
    }
  };

  const handleViewOrder = () => {
    stopSound();
    router.push(`/dashboard/orders`);
    onClose();
  };

  const handleClose = () => {
    stopSound();
    onClose();
  };

  if (!order) return null;

  return (
    <>
      <Dialog open={!!order} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🔔 Novo Pedido!</DialogTitle>
            <DialogDescription>
              Você recebeu um novo pedido
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Pedido</div>
              <div className="text-2xl font-bold">#{order.orderNumber}</div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-sm text-muted-foreground">Cliente</div>
                <div className="font-medium">{order.customerName}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Telefone</div>
                <div className="font-medium">{order.customerPhone}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-xl font-bold text-primary">
                  {order.total.toFixed(2)} MT
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Itens</div>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.quantity}x {item.productName} - {item.price.toFixed(2)} MT
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleViewOrder} className="flex-1">
                Ver Pedido
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1">
                {isPlaying ? "🔇 Fechar" : "Fechar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/sounds/notification.mp3"
        preload="auto"
        style={{ display: "none" }}
      />
    </>
  );
}
