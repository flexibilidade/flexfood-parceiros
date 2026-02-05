"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import { NewOrderDialog } from "@/components/NewOrderDialog";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { currentOrder, clearCurrentOrder } = useSocket();

  return (
    <>
      <SidebarProvider defaultOpen={true} className="flex">
        <Sidebar />

        <main className="flex-1 flex flex-col p-0 bg-[#f7f9faeb] mt-0 w-full overflow-x-hidden">
          <div className="px-4 lg:px-10 max-w-full overflow-x-hidden">
            <div className="relative pt-16 md:pt-0 w-full overflow-x-auto overscroll-x-none pb-20 md:pb-0">
              <Header />
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
