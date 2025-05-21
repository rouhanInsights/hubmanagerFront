"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {AppSidebar} from "@/components/app-sidebar";
import { SidebarProvider,SidebarInset,SidebarTrigger} from "@/components/ui/sidebar";

interface Order {
  order_id: number;
  customer_name: string;
  phone: string;
  full_address: string;
  product_name: string;
  quantity: number;
  price: number;
  status: string;
  payment_method: string;
  order_date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Login required to view orders");
      router.push("/login");
      return;
    }

    const BASE_URL = "http://localhost:5000";
    fetch(`${BASE_URL}/api/orders`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setOrders(data.orders || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders");
      });
  }, [router]);

  return (
    <div className="flex min-h-screen">
     <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
             <SidebarTrigger className="-ml-1" />
            
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">All Orders</h1>

        <div className="overflow-auto rounded-md shadow bg-white">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{order.order_id}</td>
                    <td className="px-4 py-2">{order.customer_name}</td>
                    <td className="px-4 py-2">{order.phone}</td>
                    <td className="px-4 py-2">{order.full_address}</td>
                    <td className="px-4 py-2">{order.product_name}</td>
                    <td className="px-4 py-2">{order.quantity}</td>
                    <td className="px-4 py-2">
  ₹{(Number(order.price) || 0).toFixed(2)}  {/* Ensure price is a number */}
</td>
<td className="px-4 py-2">
  ₹{(Number(order.quantity) * Number(order.price) || 0).toFixed(2)}  {/* Ensure total is a valid number */}
</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">{order.payment_method}</td>
                    <td className="px-4 py-2">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
     </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
