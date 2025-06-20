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

const data = {
  user: {
    name: "Hub Manager",
    email: "m@example.com",
    avatar: "/images/img4.jpeg",
  },
  navMain: [
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  <span className="truncate font-semibold">Hub Manager</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}