"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface HubManager {
  user_id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function HubManagerPanel() {
  const [managers, setManagers] = useState<HubManager[]>([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState<HubManager | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubmanagers`)
      .then((res) => res.json())
      .then((data) => setManagers(data));
  }, []);

  const handleDialogOpen = () => {
    setEditing(null);
    setForm({ name: "", email: "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubmanagers/${editing.user_id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubmanagers`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(editing ? "Updated successfully" : "Created successfully");
      setDialogOpen(false);
      setForm({ name: "", email: "" });
      setEditing(null);
      const updated = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubmanagers`).then((r) => r.json());
      setManagers(updated);
    } else {
      const err = await res.json();
      toast.error(err.error || "Error occurred");
    }
  };

  const handleResetPassword = async (user_id: number) => {
  const newPassword = prompt("Enter new password:");
  if (!newPassword) return;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubmanagers/${user_id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });

  if (res.ok) {
    toast.success("Password updated");
  } else {
    toast.error("Failed to reset password");
  }
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Hub Manager Panel</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleDialogOpen}>
              + Add Hub Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogTitle>{editing ? "Edit Hub Manager" : "Add Hub Manager"}</DialogTitle>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleSave}>
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {managers.map((m) => (
          <div
            key={m.user_id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.email}</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(m.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(m);
                  setForm({ name: m.name, email: m.email });
                  setDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button variant="ghost" onClick={() => handleResetPassword(m.user_id)}>
                Reset Password
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
