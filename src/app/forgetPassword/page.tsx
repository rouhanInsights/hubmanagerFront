"use client";
import React, { useState } from "react";
import { requestPasswordReset } from "../../../utils//api"; // API function
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("⚠️ Please enter your email.");
      return;
    }

    try {
      const response = await requestPasswordReset(email);
      if (response.message) {
        setMessage(`✅ ${response.message}`);
      } else {
        setMessage("❌ Error: " + response.detail);
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);
      setMessage("❌ Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto p-6 rounded-lg shadow-md bg-white">
      <h1 className="text-xl font-bold text-center">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">Request Reset Link</Button>
        </div>
        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
}
