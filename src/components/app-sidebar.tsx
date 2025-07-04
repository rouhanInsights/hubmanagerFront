"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Boxes,
  Tags,
  Receipt,
  Users,
  UserRound,
  Truck,
  ClipboardCheck,
  CreditCard,
  Settings,
  PackageCheck,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "loading@example.com",
    avatar: "/images/img4.jpeg",
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser({
            name: parsed.name || "Hub Manager",
            email: parsed.email || "hub@example.com",
            avatar: "/images/img4.jpeg",
          });
        } catch {
          console.error("Failed to parse user data from localStorage");
        }
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
      ],
    },
    {
      title: "User Management",
      url: "/users",
      icon: Users,
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
      url: "/products",
      icon: Settings,
      isActive: true,
      items: [
        { title: "Stock Management", url: "/stock", icon: PackageCheck },
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
