"use client"

import * as React from "react"
import {
  Bot,
  Command,
   Send,
 
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Hub Manager",
    email: "m@example.com",
    avatar: "/images/img4.jpeg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/products",
        },
        {
          title: "Categories",
          url: "#",
        },
        {
          title: "Orders",
          url: "/orders",
        },
        
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
            title: "Users",
            url: "#",
          },
        {
          title: "Delivery Agents",
          url: "#",
        },
         {
          title: "Payments",
          url: "#",
        },
      ],
    },
    {
      title: "Product Management",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
            title: "Products Featured",
            url: "#",
          },
        {
          title: "Stock Management",
          url: "#",
        },
         {
          title: "Product Visibility",
          url: "#",
        },
      ],
    },
    
  ],
  navSecondary: [
   
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],

}

export  function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return  (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Hub Manager</span>
                 
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

