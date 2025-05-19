"use client";
import React, { useState } from "react";
import { signUp } from "../../utils/api"; // Import API function
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function SignUp({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    dob: "",
    email: "",
    alternate_email: "",
    password: "",
    confirm_password: "",
    school_college: "",
    degree: "",
    gender: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirm_password || !formData.mobile_no || !formData.dob) {
      setMessage("⚠️ All fields are required.");
      return;
    }
  
    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setMessage("❌ Passwords do not match.");
      return;
    }
  
    try {
      const response = await signUp(formData);
  
      if (response.message === "User created successfully") {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else if (response.detail) {
        setMessage(`❌ ${response.detail}`);
      } else {
        setMessage("❌ Signup failed. Please check your input.");
      }
    } catch (error) {
      console.error("Signup request failed:", error);
      setMessage("❌ Network error. Please check your connection.");
    }
  };
  

  return (
    <div className={cn("flex flex-col gap-6 max-w-3xl mx-auto p-6 rounded-lg bg-white", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Speech Fix</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Speech Fix</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log In
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alternate_email">Alternative Email (Optional)</Label>
                <Input id="alternate_email" type="email" name="alternate_email" placeholder="alternative@example.com" value={formData.alternate_email} onChange={handleChange} />
              </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <select id="gender" name="gender" className="w-full border border-input bg-background px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mobile_no">Mobile No</Label>
                <Input id="mobile_no" type="tel" name="mobile_no" placeholder="+1 234 567 8901" value={formData.mobile_no} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="school_college">School/College</Label>
                <Input id="school_college" type="text" name="school_college" placeholder="XYZ University" value={formData.school_college} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="degree">Degree</Label>
                <Input id="degree" type="text" name="degree" placeholder="BSc in Computer Science" value={formData.degree} onChange={handleChange} required />
              </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input id="confirm_password" type="password" name="confirm_password" placeholder="Re-enter password" value={formData.confirm_password} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="w-full max-w-xs">
                Sign Up
              </Button>
            </div>

            {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}
