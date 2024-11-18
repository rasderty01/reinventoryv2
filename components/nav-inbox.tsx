"use client";

import { Inbox } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavInbox() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Inbox</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/dashboard/inbox")}
            tooltip="Inbox"
          >
            <Link href="/dashboard/inbox?tab=important">
              <Inbox className="mr-2 h-4 w-4" />
              <span>Inbox</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
