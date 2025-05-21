"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    role: "Hub Manager", // ✅ Must be one of the allowed enum values
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful 🎉");
        router.push("/login");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 p-6 bg-white rounded-md shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Hub Manager">Hub Manager</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Register
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login now
        </Link>
      </p>
    </form>
  );
}
