//src/components/login-form.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      email === "admin@cff"
        ?` ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/admin/login`
        :` ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Immediate reload and redirect based on role
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setLoading(false);
      toast.error("Server error");
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-[#006b3d] hover:bg-[#18A558] text-white" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
       {/* <p className="text-sm text-center text-muted-foreground">
       Don &apos;t have an account? Register here{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p> */}
    </form>
  );
}