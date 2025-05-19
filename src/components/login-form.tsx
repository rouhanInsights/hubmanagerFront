"use client";
import React, { useState } from "react";
import { login } from "../../utils/api"; 
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const response = await login(formData);

      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        setMessage("Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else if (response.detail) {
        setMessage(`❌ ${response.detail}`);
      } else {
        setMessage("❌ Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setMessage("❌ Network error. Please check your connection.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="/forgetPassword" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>

        {message && <p className="text-blue-300 mt-2 text-center">{message}</p>}

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262">
          <path
            fill="currentColor"
            d="M255.9 133.5c0-8.8-.7-17.2-2-25.4H130v48.1h70.7c-3 16-12 29.5-25.4 38.6v31.9h41.1c24.1-22.2 38.5-54.9 38.5-93.2zM130 261.6c35.1 0 64.5-11.6 86-31.5l-41.1-31.9c-11.4 7.6-26 12.1-44.9 12.1-34.5 0-63.7-23.3-74.1-54.7H13.8v34.2c21.4 42.3 65.4 71.8 116.2 71.8zM55.9 155.6c-5.2-15.6-5.2-32.5 0-48.1V73.3H13.8c-17.3 33.9-17.3 74.5 0 108.4l42.1-26.1zM130 51.6c19.2 0 36.5 6.6 50.1 19.7l37.6-37.6C196.1 11.4 165.7 0 130 0 79.2 0 35.2 29.5 13.8 71.8l42.1 34.2C66.3 74.9 95.5 51.6 130 51.6z"
          />
          </svg>
          Login with Google
        </Button>
        <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
      </div>
    </form>
  );
}


