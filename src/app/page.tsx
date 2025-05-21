"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SalesChart } from "@/components/SalesChart";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      router.push("/login");
    } else {
      setIsLoggedIn(true);

      // ✅ Fetch total order count
      fetch("http://localhost:5000/api/orders/count")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch count");
          return res.json();
        })
        .then((data) => {
          setOrderCount(data.count || 0);
        })
        .catch((err) => {
          console.error("Error fetching order count:", err);
          toast.error("Could not load order stats");
        });

      // ✅ Fetch total product count
      fetch("http://localhost:5000/api/products/count")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch product count");
          return res.json();
        })
        .then((data) => {
          setProductCount(data.count || 0);
        })
        .catch((err) => {
          console.error("Error fetching product count:", err);
          toast.error("Could not load product stats");
        });
    }
  }, [router]);

  if (!isLoggedIn) return null;

  return (
    <>
     
    <div className="flex min-h-screen">
      
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
         <header className="flex h-16 shrink-0 items-center justify-between px-4">
                   <div className="flex items-center gap-2">
                     <SidebarTrigger className="-ml-1" />
                     <Separator orientation="vertical" className="mr-2 h-4" />
                     <Breadcrumb>
                       <BreadcrumbList>
                         <BreadcrumbItem className="hidden md:block">
                           <BreadcrumbLink href="#">Hello User</BreadcrumbLink>
                         </BreadcrumbItem>
                         <BreadcrumbSeparator className="hidden md:block" />
                         <BreadcrumbItem>
                           <BreadcrumbPage>Welcome to the dashboard </BreadcrumbPage>
                         </BreadcrumbItem>
                       </BreadcrumbList>
                     </Breadcrumb>
                   </div>
                   <Button
                     onClick={() => {
                       localStorage.removeItem("token");
                       router.push("/login");
                     }}
                     variant="outline"
                     className="text-sm"
                   ><LogOut />
                     Logout
                   </Button>
                 </header>

          <div className="flex-1 p-6 bg-gray-50">
            <header className="mb-6 border-b pb-2">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </header>

            {/* ✅ Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h2 className="text-2xl font-bold">{orderCount}</h2>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">Total Products</p>
                <h2 className="text-2xl font-bold">{productCount}</h2>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">Total Customers</p>
                <h2 className="text-2xl font-bold">1,256</h2>
              </div>
            </div>

            {/* Sales Overview & Recent Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Sales Overview</h3>
                <div className="h-64">
                  <SalesChart />
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span>Jane Smith</span>
                    <span>$250.00</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>John Doe</span>
                    <span>$189.00</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Alice Johnson</span>
                    <span>$329.00</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Michael Brown</span>
                    <span>$99.00</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Emily White</span>
                    <span>$49.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          </SidebarInset >
      </SidebarProvider>
    </div>
    </>
  );
}
