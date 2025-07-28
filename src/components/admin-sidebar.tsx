"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Boxes,
  Stars,
  Tags,
  Receipt,
  Users,
  UserRound,
  Truck,
  ClipboardCheck,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  UserCog,
  Warehouse,
  Command,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "/images/img4.jpeg",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.role === "admin") {
          setUser({
            name: parsed.name || "Admin",
            email: parsed.email || "admin@cff",
            avatar: "/images/img4.jpeg",
          });
        }
      } catch {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Categories", url: "/category", icon: Tags },
        { title: "Products", url: "/products", icon: Boxes },
        { title: "Orders", url: "/orders", icon: Receipt },
        { title: "Feedbacks", url: "/feedback", icon: Stars },
      ],
    },
    {
      title: "User Management",
      url: "/users",
      icon: UserCog,
      isActive: true,
      items: [
        { title: "Users", url: "/users", icon: UserRound },
        { title: "Delivery Agents", url: "/deliveryagent", icon: Truck },
        { title: "Assigned Orders", url: "/assign", icon: ClipboardCheck },
        { title: "Payments", url: "/payments", icon: CreditCard },
      ],
    },
    {
      title: "Product Management",
      url: "/stock",
      icon: Warehouse,
      isActive: true,
      items: [
        { title: "Stock Management", url: "/stock", icon: PackageCheck },
      ],
    },
    {
      title: "Admin",
      url: "/admin",
      icon: ShieldCheck,
      isActive: true,
      items: [
        { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "Hub Manager",
      url: "/hubmanager",
      icon: Users,
      isActive: true,
      items: [
        { title: "Hub Manager Panel", url: "/hubmanager", icon: Users },
      ],
    },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-muted-foreground">{user.email}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
