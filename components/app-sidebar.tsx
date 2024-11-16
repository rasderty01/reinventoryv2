"use client";

import { useUser } from "@clerk/nextjs";
import {
  BarChart2,
  BoxIcon,
  FileText,
  Settings,
  ShoppingCart,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart2,
    isActive: true,
  },
  {
    title: "Inventory",
    url: "/dashboard/inventory",
    icon: BoxIcon,
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: ShoppingCart,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  if (!user) {
    return null; // Or a loading state
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
