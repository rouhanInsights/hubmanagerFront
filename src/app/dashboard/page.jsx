"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "../../../utils/api"; // updated path
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {LogOut} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";



export default function Page() {
  const router = useRouter();
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true); // control render

  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const data = await getUserInfo();
  //       if (!data || data.detail) {
  //         localStorage.removeItem("access_token");
  //         router.push("/login");
  //       } else {
  //         setUser(data);
  //       }
  //     } catch (err) {
  //       localStorage.removeItem("access_token");
  //       router.push("/login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  
  //   fetchUser();
  // }, [router]);
  

  // if (loading) {
  //   return <div className="text-center p-10">Loading...</div>; // Prevent flicker
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Hello User</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Welcome to the dashboard </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button
            onClick={() => {
              localStorage.removeItem("access_token");
              router.push("/login");
            }}
            variant="outline"
            className="text-sm"
          ><LogOut />
            Logout
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
           
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div> */}
          {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
