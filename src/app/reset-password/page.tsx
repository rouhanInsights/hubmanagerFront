"use client";
import React, { useState } from "react";
import { resetPassword } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    reset_token: "",
    new_password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.reset_token || !formData.new_password) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const response = await resetPassword(formData);
      if (response.message) {
        setMessage(`✅ ${response.message}`);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage("❌ Error: " + response.detail);
      }
    } catch (error) {
      console.error("Reset password request failed:", error);
      setMessage("❌ Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto p-6 rounded-lg shadow-md bg-white">
      <h1 className="text-xl font-bold text-center">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          
          <Label htmlFor="reset_token">Reset Token</Label>
          <Input id="reset_token" type="text" name="reset_token" value={formData.reset_token} onChange={handleChange} required />

          <Label htmlFor="new_password">New Password</Label>
          <Input id="new_password" type="password" name="new_password" value={formData.new_password} onChange={handleChange} required />

          <Button type="submit" className="w-full">Reset Password</Button>
        </div>
        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
}
