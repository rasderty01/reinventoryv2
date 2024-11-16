"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const [open, setOpen] = React.useState(false);

  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            Loading...
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const activeOrganization: (typeof userMemberships.data)[0] | undefined =
    userMemberships.data?.find(
      (mem) =>
        mem.organization.id ===
        userMemberships.data?.find(
          (mem) => mem.organization.id === mem.organization.id
        )?.organization.id
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeOrganization?.organization.imageUrl ? (
                  <Image
                    src={activeOrganization.organization.imageUrl}
                    alt={activeOrganization.organization.name}
                    className="size-4 rounded"
                  />
                ) : (
                  activeOrganization?.organization.name?.charAt(0) || "O"
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrganization?.organization.name ||
                    "Select Organization"}
                </span>
                <span className="truncate text-xs">
                  {activeOrganization?.organization.membersCount || 0} members
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {userMemberships.data?.map((membership, index) => (
              <DropdownMenuItem
                key={membership.organization.id}
                onSelect={() => {
                  setActive({ organization: membership.organization.id });
                  setOpen(false);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {membership.organization.imageUrl ? (
                    <Image
                      src={membership.organization.imageUrl}
                      alt={membership.organization.name}
                      className="size-4 rounded"
                    />
                  ) : (
                    membership.organization.name.charAt(0)
                  )}
                </div>
                {membership.organization.name}
                {membership.organization.id ===
                  userMemberships.data[index].id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={() => {
                // Here you would typically open a modal or navigate to a page to create a new organization
                console.log("Create new organization");
                setOpen(false);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Create new store
              </div>
            </DropdownMenuItem>
            {userMemberships.hasNextPage && (
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={() => {
                  userMemberships.fetchNext();
                }}
              >
                <div className="font-medium text-muted-foreground">
                  Load more organizations
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
