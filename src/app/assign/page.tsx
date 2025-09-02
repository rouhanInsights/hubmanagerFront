"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
  order_status: string; // 'assigned' | 'delivered' | 'rejected'
  remarks?: string;
  delivered_at?: string | null;
}

function AssignOrderInner() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasMounted, setHasMounted] = useState(false);

  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      const payload = await res.json();
      return payload.orders as AssignableOrder[];
    },
    refetchInterval: 1000,
  });

  const { data: assignedOrders = [] } = useQuery<AssignedOrder[]>({
    queryKey: ["assignedOrders"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da-orders/assigned`);
      if (!res.ok) throw new Error("Failed to fetch assigned orders");
      const payload = await res.json();
      return payload.orders as AssignedOrder[];
    },
    refetchInterval: 2000,
  });

  // Safety: if a highlight id comes from URL, pre-select it
  useEffect(() => {
    if (highlightId) {
      const id = Number(highlightId);
      if (!selectedOrders.includes(id)) {
        setSelectedOrders((prev) => [...prev, id]);
      }
    }
  }, [highlightId, selectedOrders]);

  // Highlight scroll/flash
  useEffect(() => {
    if (highlightRef.current) {
      const el = highlightRef.current;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-blue-200", "bg-blue-100", "animate-pulse");
      const t = setTimeout(() => {
        el.classList.remove("animate-pulse", "ring-2", "ring-blue-200", "bg-blue-100");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [highlightId]);

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

      if (!res.ok) throw new Error("Failed");

      toast.success("Orders assigned successfully");
      refetchAssignable();
      setSelectedOrders([]);
    } catch {
      toast.error("Error assigning orders");
    }
  };

  // --- FIX: never show delivered/assigned/rejected or already-present-in-assigned in the selectable list ---
  const assignedIds = new Set(assignedOrders.map((a) => a.order_id));
  const hiddenStatuses = new Set(["delivered", "assigned", "rejected"]);

  const selectableOrders = assignableOrders.filter((o) => {
    const status = (o.order_status || "").toLowerCase();
    return !hiddenStatuses.has(status) && !assignedIds.has(o.order_id);
  });

  const filteredAssigned = assignedOrders.filter((entry) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      entry.agent_name.toLowerCase().includes(s) ||
      entry.full_address.toLowerCase().includes(s) ||
      entry.slot_details.toLowerCase().includes(s);

    const matchStatus = statusFilter === "all" || entry.order_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="px-4 pb-10">
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Delivery Agent</label>
        <select
          className="w-full border rounded p-2"
          value={selectedAgent ?? ""}
          onChange={(e) => setSelectedAgent(Number(e.target.value))}
        >
          <option value="" disabled>
            Select agent
          </option>
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
          {selectableOrders.length === 0 && (
            <div className="text-sm text-muted-foreground px-1 py-1">No orders available to assign.</div>
          )}
          {selectableOrders.map((order) => {
            const isHighlighted = highlightId && String(order.order_id) === highlightId;
            return (
              <div
                key={order.order_id}
                ref={isHighlighted ? highlightRef : null}
                className={`flex items-center space-x-2 p-1 rounded ${
                  isHighlighted ? "bg-blue-100 ring-2 ring-blue-200" : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={order.order_id}
                  checked={selectedOrders.includes(order.order_id)}
                  onChange={(e) => {
                    const orderId = Number(e.target.value);
                    setSelectedOrders((prev) =>
                      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
                    );
                  }}
                />
                <label>
                  #{order.order_id} — {order.full_address} ({order.slot_details})
                </label>
              </div>
            );
          })}
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
            <option value="delivered">Delivered</option>
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
                    {hasMounted && entry.delivered_at ? new Date(entry.delivered_at).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ✅ Wrap the page in Suspense to satisfy `useSearchParams` requirement
export default function AssignOrderPage() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <Suspense fallback={<div className="p-4">Loading orders...</div>}>
          <AssignOrderInner />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
