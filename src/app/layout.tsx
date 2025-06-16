//src/app/layout.tsx

"use client";

import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user?.role) setRole(user.role);
      } catch {
  // optional: log a fallback
  console.error("Invalid user data in localStorage");
}
    }
  }, []);

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
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          )}
        </ReactQueryProvider>
      </body>
    </html>
  );
}