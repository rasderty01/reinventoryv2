"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { isLoaded, setActive, userMemberships, createOrganization } =
    useOrganizationList({
      userMemberships: {
        infinite: true,
      },
    });
  const { organization } = useOrganization();

  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [organizationName, setOrganizationName] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!isLoaded) {
        return null;
      }

      const newOrg = await createOrganization({ name: organizationName });
      setActive({ organization: newOrg.id });
      setOrganizationName("");
      router.refresh();
      setDialogOpen(false);
      toast.success("Organization created successfully.");
    } catch (error) {
      console.error("Failed to create organization:", error);
      toast.error("Failed to create organization.");
    }
  };

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
                {organization?.imageUrl ? (
                  <Image
                    src={organization.imageUrl}
                    alt={organization.name}
                    className="size-4 rounded"
                    width={32}
                    height={32}
                  />
                ) : (
                  organization?.name?.charAt(0) || "O"
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {organization?.name || "Select Organization"}
                </span>
                <span className="truncate text-xs">
                  {organization?.membersCount || 0}{" "}
                  {organization?.membersCount === 1 ? "member" : "members"}
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
            {userMemberships.data?.map((membership) => (
              <DropdownMenuItem
                key={membership.organization.id}
                onSelect={() => {
                  setActive({ organization: membership.organization.id });
                  setOpen(false);
                  router.refresh();
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {membership.organization.imageUrl ? (
                    <Image
                      src={membership.organization.imageUrl}
                      alt={membership.organization.name}
                      className="size-4 rounded"
                      width={32}
                      height={32}
                    />
                  ) : (
                    membership.organization.name.charAt(0)
                  )}
                </div>
                {membership.organization.name}
                {membership.organization.id === organization?.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={(event) => {
                event.preventDefault();
                setDialogOpen(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Create Organization
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create an organization to start using Reinventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
                placeholder="Enter organization name"
              />
            </div>
            <Button type="submit">Create Organization</Button>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
