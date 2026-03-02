"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import { NewOrderDialog } from "@/components/NewOrderDialog";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { currentOrder, clearCurrentOrder, isConnected } = useSocket();

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
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${
                    isConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
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
