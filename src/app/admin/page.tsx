//src/app/admin/page.tsx

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

  return (
    <SidebarProvider>
      

      <SidebarInset>
        {/* Top Bar with Breadcrumb and Logout */}
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
          
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {adminName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have full access to manage the platform.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">View and manage all registered delivery agents.</p>
                <Button onClick={() => router.push("/deliveryagent")}>
                  Manage DAs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Track and monitor all customer orders.</p>
                <Button onClick={() => router.push("/orders")}>
                  View Orders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Securely log out of admin panel.</p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                  }}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}