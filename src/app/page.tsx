"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SalesChart } from "@/components/SalesChart";
import {
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<
    { customer_name: string; product_name: string; price: number }[]
  >([]);
  const [customerCount, setCustomerCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      router.push("/login");
    } else {
      setIsLoggedIn(true);

      // ✅ Fetch total order count
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/count`)
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
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/count`)
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

      // ✅ Fetch recent orders
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/recent`)
        .then((res) => res.json())
        .then((data) => {
          setRecentOrders(data);
        })
        .catch((err) => {
          console.error("Error fetching recent orders:", err);
          toast.error("Could not load recent orders");
        });
    }

    // ✅ Fetch total customer count
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/count`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customer count");
        return res.json();
      })
      .then((data) => {
        setCustomerCount(data.count || 0);
      })
      .catch((err) => {
        console.error("Error fetching customer count:", err);
        toast.error("Could not load customer stats");
      });
  }, [router]);

  if (!isLoggedIn) return null;

  return (
    <>
      <div className="flex min-h-screen">
        
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between px-4">
              <div className="flex items-center gap-2">
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
            </header>

            <div className="flex-1 p-6 bg-gray-50">
              

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
                  <h2 className="text-2xl font-bold">{customerCount}</h2>
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
                    <ul className="space-y-2">
                      {recentOrders.map((order, index) => (
                        <li
                          key={index}
                          className="flex flex-col text-sm border-b pb-1"
                        >
                          <span className="font-medium">
                            {order.customer_name}
                          </span>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {order.product_name}
                            </span>
                            <span className="text-green-600 font-semibold">
                              ₹{order.price}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          </SidebarInset>
      </div>
    </>
  );
}
