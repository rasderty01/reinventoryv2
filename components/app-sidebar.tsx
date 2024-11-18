"use client";

import {
  BarChart2,
  BoxIcon,
  FileText,
  Settings,
  ShoppingCart,
} from "lucide-react";
import * as React from "react";

import { NavInbox } from "@/components/nav-inbox";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart2,
  },
  {
    title: "Inventory",
    url: "#",
    icon: BoxIcon,
    isActive: true,
    items: [
      {
        title: "All items",
        url: "/dashboard/inventory",
      },
      {
        title: "Add an item",
        url: "/dashboard/inventory/add",
      },
      {
        title: "Categories",
        url: "/dashboard/inventory/categories",
      },
    ],
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavInbox />
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
