"use client";
import React from "react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left image panel */}
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/home/image (3).jpeg"
          alt="Login background"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold">Welcome to Calcutta Fresh Foods</h1>
          <p className="text-lg mt-2">Delivering Freshness to Your Doorstep</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center p-8 md:p-16">
        <div className="mb-8 text-center md:text-center">
          <h2 className="text-3xl font-semibold ">Login</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <LoginForm />
        </div>

        
      </div>
    </div>
  );
}
