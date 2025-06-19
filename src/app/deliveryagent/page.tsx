"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, Download } from "lucide-react";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface Agent {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  availability: boolean;
  vehicle_details: string;
  upload_img: string | null;
}

export default function DeliveryAgentPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da`)
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch(() => toast.error("Failed to fetch agents"));
  }, []);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setAgents((prev) =>
        prev.map((a) => (a.user_id === id ? { ...a, status } : a))
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const toggleAvailability = async (id: number, availability: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/da/${id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: availability }),
      });
      if (!res.ok) throw new Error();
      setAgents((prev) =>
        prev.map((a) => (a.user_id === id ? { ...a, availability } : a))
      );
      toast.success("Availability updated");
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch  {
      toast.error("Failed to download image");
    }
  };

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
                  <BreadcrumbPage>Delivery Agents</BreadcrumbPage>
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

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full table-auto border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Vehicle</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Present Today</th>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.user_id} className="border-t">
                    <td className="p-2">{agent.name}</td>
                    <td className="p-2">{agent.email}</td>
                    <td className="p-2">{agent.phone}</td>
                    <td className="p-2">{agent.vehicle_details}</td>
                    <td className="p-2 capitalize">
                      <span
                        className={
                          agent.status === "approved"
                            ? "text-green-600"
                            : agent.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <Switch
                        checked={agent.availability}
                        onCheckedChange={(value) =>
                          toggleAvailability(agent.user_id, value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      {agent.upload_img ? (
                        <button
                          onClick={() =>
                            handleDownload(agent.upload_img!, `agent_${agent.user_id}.jpg`)
                          }
                          className="text-blue-600 underline flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-500">No image</span>
                      )}
                    </td>
                    <td className="p-2">
                      {agent.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(agent.user_id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(agent.user_id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
