"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
  LogOut,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  Shield,
  Star,
  ShoppingBag,
  Package,
  UtensilsCrossed,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  creatorOnly?: boolean;
  studentOnly?: boolean;
}

interface NavGroup {
  group: string;
  links: NavLink[];
  forAdminOnly?: boolean;
}

/**
 * Sidebar component
 */
const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { setSidebarWidth, closeMobileSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigationGroups: NavGroup[] = [
    {
      group: "Menu",
      links: [
        {
          name: "Visão Geral",
          href: "/dashboard",
          icon: <LayoutDashboard size={20} />,
        },
      ],
    },
    {
      group: "Gestão",
      links: [
        {
          name: "Cardápio",
          href: "/dashboard/menu",
          icon: <UtensilsCrossed size={20} />,
        },
        {
          name: "Pedidos",
          href: "/dashboard/orders",
          icon: <ShoppingBag size={20} />,
        },
      ],
    },
    {
      group: "Financeiro",
      links: [
        {
          name: "Finanças",
          href: "/dashboard/finances",
          icon: <DollarSign size={20} />,
        },
      ],
    },
    {
      group: "Administração",
      links: [
        {
          name: "Painel Admin",
          href: "/dashboard/admin",
          icon: <Shield size={20} />,
          adminOnly: true,
        },
        {
          name: "Restaurantes",
          href: "/dashboard/admin/restaurants",
          icon: <UtensilsCrossed size={20} />,
          adminOnly: true,
        },
        {
          name: "Usuários",
          href: "/dashboard/admin/users",
          icon: <Users size={20} />,
          adminOnly: true,
        },
        {
          name: "Pedidos",
          href: "/dashboard/admin/orders",
          icon: <ShoppingBag size={20} />,
          adminOnly: true,
        },
        {
          name: "Categorias",
          href: "/dashboard/admin/categories",
          icon: <FileText size={20} />,
          adminOnly: true,
        },
      ],
      forAdminOnly: true,
    },
    {
      group: "Configurações",
      links: [
        {
          name: "Restaurante",
          href: "/dashboard/settings",
          icon: <Settings size={20} />,
        },
        {
          name: "Terminar sessão",
          href: "/auth/logout",
          icon: <LogOut size={20} />,
        },
      ],
    },
  ];

  // Set initial sidebar width
  useEffect(() => {
    setSidebarWidth(isExpanded ? "16rem" : "70px");
  }, [isExpanded, setSidebarWidth]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setSidebarWidth(!isExpanded ? "16rem" : "70px");
  };

  return (
    <ShadcnSidebar className="flex flex-col">
      {/* Sidebar Header */}
      <SidebarHeader className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-sidebar-foreground font-bold text-lg">
              flexfood
            </span>
          </motion.div>
        )}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent p-1.5 rounded-md transition-colors"
          >
            {isExpanded ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        )}
      </SidebarHeader>

      {/* Navigation links */}
      {user?.id && (
        <SidebarContent className="flex-1 py-4 overscroll-none">
          {navigationGroups.map((group) => {
            const visibleLinks = group.links.filter((link) => {
              // Admin only links
              if (link.adminOnly && user?.role !== "ADMIN") {
                return false;
              }
              return true;
            });

            if (visibleLinks.length === 0) {
              return null; // Don't render group if no links are visible
            }

            if (group.forAdminOnly && user?.role !== "ADMIN") {
              return null; // Don't render group if user is not admin
            }

            return (
              <SidebarGroup key={group.group} className="w-full mb-2">
                {isExpanded && (
                  <SidebarGroupLabel className="px-4 mb-1 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                    {group.group}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-0.5">
                    {visibleLinks.map((link) => {
                      const isActive = pathname === link.href;

                      return (
                        <SidebarMenuItem key={link.name}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={`w-full justify-start hover:bg-transparent ${
                              isExpanded ? "px-3" : "justify-center px-2"
                            }`}
                          >
                            <Link
                              href={link.href}
                              onClick={(e) => {
                                if (isMobile) {
                                  e.preventDefault();
                                  closeMobileSidebar();
                                  setTimeout(() => {
                                    router.push(link.href);
                                  }, 150);
                                }
                              }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-primary"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                              }`}
                            >
                              <div
                                className={`flex-shrink-0 ${
                                  isActive
                                    ? "text-sidebar-primary"
                                    : "text-sidebar-foreground/60"
                                }`}
                              >
                                {link.icon}
                              </div>
                              {isExpanded && (
                                <span className={`text-sm font-medium`}>
                                  {link.name}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      )}

      {/* User Info Footer */}
      {user && isExpanded && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            {!user?.image ? (
              <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-sidebar-primary" />
              </div>
            ) : (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <div className="mt-2 px-2 py-1 bg-sidebar-primary/10 rounded-md">
            <p className="text-xs font-medium text-sidebar-primary text-center">
              Parceiro
            </p>
          </div>
        </div>
      )}
    </ShadcnSidebar>
  );
};

export default Sidebar;
