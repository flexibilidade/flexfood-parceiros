"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import { NewOrderDialog } from "@/components/NewOrderDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";
import React, { useState } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { currentOrder, clearCurrentOrder, isConnected, reconnect } = useSocket();
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Para o estado de reconectando quando a conexão é restabelecida
  React.useEffect(() => {
    if (isConnected && isReconnecting) {
      setIsReconnecting(false);
    }
  }, [isConnected, isReconnecting]);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      reconnect();
      // Timeout de segurança caso a conexão não seja restabelecida
      setTimeout(() => {
        setIsReconnecting(false);
      }, 10000); // 10 segundos
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      setIsReconnecting(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <SidebarProvider defaultOpen={true} className="flex">
        <Sidebar />

        <main className="flex-1 flex flex-col p-0 bg-[#f7f9faeb] mt-0 w-full overflow-x-hidden">
          <div className="px-4 lg:px-10 max-w-full overflow-x-hidden">
            <div className="relative pt-16 md:pt-0 w-full overflow-x-auto overscroll-x-none pb-20 md:pb-0">
              <Header />

              {/* Socket Connection Indicator */}
              <div className="fixed bottom-4 right-4 z-50">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                  />
                  {isConnected ? "Conectado" : "Desconectado"}
                </div>
              </div>

              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>

      {/* New Order Dialog */}
      <NewOrderDialog order={currentOrder} onClose={clearCurrentOrder} />

      {/* Connection Lost Dialog */}
      <Dialog open={!isConnected}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <WifiOff className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Conexão Perdida
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              A conexão com o servidor foi perdida. Verifique sua conexão com a internet e tente novamente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="w-full"
            >
              {isReconnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reconectando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Reconectar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleReload}
              className="w-full"
            >
              Recarregar Página
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Dashboard Layout
 * Provides dashboard layout with sidebar for all dashboard pages
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <DashboardContent>{children}</DashboardContent>
    </SocketProvider>
  );
}
