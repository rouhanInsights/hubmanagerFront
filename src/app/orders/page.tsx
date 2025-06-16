"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useState, Fragment } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Order {
  order_id: number;
  customer_name: string;
  phone: string;
  full_address: string;
  product_details: string[];
  total_price: number;
  status: string;
  payment_method: string;
  order_date: string;
  slot_date: string;
  slot_details: string;
}

const fetchOrders = async (): Promise<{ orders: Order[] }> => {
  const res = await fetch("http://localhost:5000/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export default function OrdersPage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 500,
  });

  const orders = data?.orders || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const ordersPerPage = 10;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (error) toast.error("Failed to load orders");

  return (
    <SidebarProvider>
      
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 border-b mb-4 sticky top-0 z-30 bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">All Orders</h1>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            variant="outline"
            className="text-sm"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </header>

        <main className="p-6 bg-white min-h-screen">
          <div className="overflow-auto rounded-md shadow bg-white">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2 w-64">Products</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Ordered Date</th>
                  <th className="px-4 py-2">Delivery Date</th>
                  <th className="px-4 py-2">Slot Time</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="text-center p-6 text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center p-6 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => {
                    const isExpanded = expandedRows.includes(order.order_id);

                    return (
                      <Fragment key={`${order.order_id}-${order.order_date}`}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-2 py-2">{order.order_id}</td>
                          <td className="px-2 py-2">{order.customer_name}</td>
                          <td className="px-2 py-2">{order.phone}</td>
                          <td className="px-2 py-2">{order.full_address}</td>
                          <td className="px-2 py-2">
                            <Collapsible
                              open={isExpanded}
                              onOpenChange={(open) => {
                                setExpandedRows((prev) =>
                                  open
                                    ? [...prev, order.order_id]
                                    : prev.filter((id) => id !== order.order_id)
                                );
                              }}
                            >
                              <CollapsibleTrigger className="text-blue-600 underline text-sm">
                                {isExpanded ? "Hide Products ▲" : "View Products ▼"}
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                                  {order.product_details.map((item, idx) => (
                                    <li key={`${order.order_id}-${idx}`}>{item}</li>
                                  ))}
                                </ul>
                              </CollapsibleContent>
                            </Collapsible>
                          </td>
                          <td className="px-2 py-2">₹{Number(order.total_price).toFixed(2)}</td>
                          <td className="px-2 py-2">{order.status}</td>
                          <td className="px-2 py-2">{order.payment_method}</td>
                          <td className="px-2 py-2">
                            {new Date(order.order_date).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2">
                            {new Date(order.slot_date).toLocaleDateString()}
                          </td>
                          <td className="px-1 py-2">{order.slot_details}</td>
                        </tr>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-4 mt-6 mb-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
