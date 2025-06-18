"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Users,
  Package,
  UserCog,
  Truck,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Super Admin");

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    payments: 0,
    agents: 0,
    managers: 0,
    products: 0,
  });

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const [usersRes, ordersRes, paymentsRes, agentsRes, managersRes, productsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/count`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/count`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/count`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da/approved/count`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubmanagers/count`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/count`),
      ]);

      const [users, orders, payments, agents, managers, products] = await Promise.all([
        usersRes.json(),
        ordersRes.json(),
        paymentsRes.json(),
        agentsRes.json(),
        managersRes.json(),
        productsRes.json(),
      ]);

      setStats({
        users: users.count || 0,
        orders: orders.count || 0,
        payments: payments.count || 0,
        agents: agents.count || 0,
        managers: managers.count || 0,
        products: products.count || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  fetchStats();
}, []);


  const cards = [
    {
      title: "Delivery Agents",
      description: "Registered delivery agents",
      icon: Truck,
      route: "/deliveryagent",
      value: stats.agents,
    },
    {
      title: "Hub Managers",
      description: "Active hub managers",
      icon: UserCog,
      route: "/hubmanager",
      value: stats.managers,
    },
    {
      title: "Orders",
      description: "Total orders placed",
      icon: ShoppingCart,
      route: "/orders",
      value: stats.orders,
    },
    {
      title: "Users",
      description: "Registered customers",
      icon: Users,
      route: "/users",
      value: stats.users,
    },
    {
      title: "Stock",
      description: "Available products",
      icon: Package,
      route: "/stock",
      value: stats.products,
    },
    {
      title: "Payments",
      description: "Completed transactions",
      icon: IndianRupee,
      route: "/payments",
      value: stats.payments,
    },
  ];

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between px-6 border-b bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-5" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            variant="ghost"
            className="text-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Welcome, {adminName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                This is your control panel. Use the sections below to manage the platform.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Dashboard Cards with Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(card.route)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
