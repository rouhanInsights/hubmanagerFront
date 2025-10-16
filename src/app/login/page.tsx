"use client";
import React from "react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
      
      {/* Left image panel - 7/12 width */}
      <div className="relative hidden lg:col-span-7 bg-muted lg:block">
        <Image
          src="/login.png"
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

      {/* Right form panel - 5/12 width */}
      <div className="lg:col-span-5 flex flex-col justify-center p-8 md:p-16">
        <div className="mb-8 text-center md:text-center">
          <Image
            src="/favicon.jpeg"
            alt="Logo"
            height={50}
            width={50}
            className="mx-auto mb-2 rounded-full"
          />
          <h2 className="text-3xl font-bold text-[#006b3d]">CALCUTTA FRESH FOODS</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Login with your credentials to access Hub Manager and Admin Panels
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}