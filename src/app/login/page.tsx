"use client";
import React from "react";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {LoginForm}from '@/components/login-form';
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
  
      const response = await fetch("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
  
      if (response.ok && !data.detail) {
        router.push("/dashboard");
      } else {
        localStorage.removeItem("access_token");
      }
    };
    checkLogin();
  }, [router]); 

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/home/image (3).jpeg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ArrowLeftFromLine className="size-4" />
            </div>
             HOME
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
