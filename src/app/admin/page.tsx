"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role !== "admin") {
      router.push("/login");
    } else {
      setAdminName(user.name || "Super Admin");
    }
  }, [router]);

  const cards = [
    {
      title: "Delivery Agents",
      description: "View and manage all registered delivery agents.",
      route: "/admin/delivery-agents",
    },
    {
      title: "Hub Managers",
      description: "Manage hub managers, reset passwords, or block access.",
      route: "/admin/hub-managers",
    },
    {
      title: "Orders",
      description: "Track, assign, or cancel orders and view invoice details.",
      route: "/admin/orders",
    },
    {
      title: "Users",
      description: "Monitor and manage customers, order history, and bans.",
      route: "/admin/users",
    },
    {
      title: "Stock",
      description: "Add, edit or delete products and manage stock.",
      route: "/stock",
    },
    {
      title: "Payments",
      description: "Check transactions and process manually.",
      route: "/admin/payments",
    },
   
  ];

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
            variant="outline"
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
              <CardTitle className="text-2xl">Welcome, {adminName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is your control panel. Choose a section to manage the platform.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{card.description}</p>
                  <Button onClick={() => router.push(card.route)}>Go to {card.title}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}