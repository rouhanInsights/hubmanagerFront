"use client";

import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { Toaster } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Function to get page title based on pathname
function getPageTitle(pathname: string) {
  const map: { [key: string]: string } = {
    "/": "Dashboard",
    "/products": "Products",
    "/category": "Categories",
    "/orders": "All Orders",
    "/feedback": "Customer Feedback",
    "/users": "Customers",
    "/deliveryagent": "Delivery Agents",
    "/assign": "Assigned Orders",
    "/payments": "Payment Records",
    "/analytics": "Analytical Report",
    "/analytics/print": "Printable MIS Report",
    "/stock": "Stock Management",
    "/hubmanager": "Hub Manager Panel",
    "/admin": "Admin Dashboard",
  };

  return map[pathname] || "Dashboard";
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user?.role) setRole(user.role);
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {shouldHideSidebar ? (
            children
          ) : (
            <SidebarProvider>
              {role === "admin" ? <AdminSidebar /> : <AppSidebar />}
              <SidebarInset>
                {/* Top header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-5" />
                    <span className="font-semibold text-lg text-gray-700 mr-2">
                      {getPageTitle(pathname)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <NotificationBell />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>

                <main>{children}</main>
              </SidebarInset>
            </SidebarProvider>
          )}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
