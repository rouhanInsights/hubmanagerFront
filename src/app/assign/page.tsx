"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  SidebarProvider,
  SidebarTrigger,
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

interface DAUser {
  user_id: number;
  name: string;
}

interface AssignableOrder {
  order_id: number;
  full_address: string;
  slot_details: string;
  order_status: string;
  remarks?: string;
  
}

interface AssignedOrder {
  assigned_id: number;
  order_id: number;
  agent_name: string;
  full_address: string;
  slot_details: string;
  order_status: string;
  remarks?: string;
   delivered_at?: string | null;
}

export default function AssignOrderPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: agents = [] } = useQuery<DAUser[]>({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da/approved`);
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json();
    },
  });

  const {
    data: assignableOrders = [],
    refetch: refetchAssignable,
  } = useQuery<AssignableOrder[]>({
    queryKey: ["assignableOrders"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da-orders/assignable`);
      if (!res.ok) throw new Error("Failed to fetch assignable orders");
      return res.json().then((data) => data.orders);
    },
    refetchInterval: 500,
  });

  const { data: assignedOrders = [] } = useQuery<AssignedOrder[]>({
    queryKey: ["assignedOrders"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da-orders/assigned`);
      if (!res.ok) throw new Error("Failed to fetch assigned orders");
      return res.json().then((data) => data.orders);
    },
    refetchInterval: 2000,
  });

  const handleAssign = async () => {
    if (!selectedAgent || selectedOrders.length === 0) {
      toast.warning("Please select an agent and at least one order");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da-orders/assign-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ da_id: selectedAgent, order_ids: selectedOrders }),
      });

      if (res.ok) {
        toast.success("Orders assigned successfully");
        refetchAssignable();
        setSelectedOrders([]);
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast.error("Error assigning orders");
    }
  };

  const filteredAssigned = assignedOrders.filter((entry) => {
    const matchSearch =
      entry.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.full_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.slot_details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || entry.order_status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <SidebarProvider>
    
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
                  <BreadcrumbPage>Assign Orders Here </BreadcrumbPage>
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
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </header>

        <div className="px-4 pb-10">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Delivery Agent</label>
            <select
              className="w-full border rounded p-2"
              value={selectedAgent ?? ""}
              onChange={(e) => setSelectedAgent(Number(e.target.value))}
            >
              <option value="" disabled>Select agent</option>
              {agents.map((agent) => (
                <option key={agent.user_id} value={agent.user_id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Orders</label>
            <div className="border rounded p-2 max-h-60 overflow-y-auto">
              {assignableOrders.map((order) => (
                <div key={order.order_id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={order.order_id}
                    checked={selectedOrders.includes(order.order_id)}
                    onChange={(e) => {
                      const orderId = Number(e.target.value);
                      setSelectedOrders((prev) =>
                        prev.includes(orderId)
                          ? prev.filter((id) => id !== orderId)
                          : [...prev, orderId]
                      );
                    }}
                  />
                  <label>
                    #{order.order_id} — {order.full_address} ({order.slot_details})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAssign}>Assign Selected Orders</Button>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3">Assigned Order History</h3>

            <div className="flex flex-wrap gap-4 mb-4">
              <Input
                placeholder="Search by agent, address or slot"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2"
              />
              <select
                className="border rounded p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="assigned">Assigned</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Order ID</th>
                    <th className="p-2 text-left">Agent</th>
                    <th className="p-2 text-left">Address</th>
                    <th className="p-2 text-left">Slot</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Remarks</th>
                    <th className="p-2 text-left">Delivered At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssigned.map((entry) => (
                    <tr key={entry.assigned_id} className="border-t">
                      <td className="p-2">#{entry.order_id}</td>
                      <td className="p-2">{entry.agent_name}</td>
                      <td className="p-2">{entry.full_address}</td>
                      <td className="p-2">{entry.slot_details}</td>
                      <td className="p-2 capitalize">{entry.order_status}</td>
                      <td className="p-2">{entry.remarks || "-"}</td>
                      <td className="p-2">
  {entry.delivered_at ? new Date(entry.delivered_at).toLocaleString() : "-"}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}