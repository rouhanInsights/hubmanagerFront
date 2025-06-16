"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface Payment {
  order_id: number;
  payment_method: string;
  total_price: number;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login required");
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/payments", {
      headers: { Authorization: 'Bearer ${token}' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPayments(data || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load payments");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <SidebarProvider>
      
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 border-b mb-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Payment Records</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        <main className="p-4">
          <div className="overflow-auto rounded-md shadow bg-white">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Payment Method</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-6 text-gray-500">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, idx) => (
                    <tr key={`${payment.order_id}-${idx}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{payment.order_id}</td>
                      <td className="px-4 py-2">{payment.payment_method}</td>
                      <td className="px-4 py-2">₹{Number(payment.total_price).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}