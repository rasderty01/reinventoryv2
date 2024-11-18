"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Bell, Filter, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { NotificationList } from "./notification-list";
import { NotificationTabs } from "./notification-tabs";

export function Notifications() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "inbox";
  const currentFilter = searchParams.get("filter");

  const clearNotifications = useMutation(api.notifications.clearNotifications);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (filter: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (filter === null) {
      newParams.delete("filter");
    } else {
      newParams.set("filter", filter);
    }
    router.push(`/dashboard/inbox?${newParams.toString()}`);
  };

  const clearFilter = () => {
    setFilter(null);
  };

  const handleClearAll = async () => {
    try {
      const clearedCount = await clearNotifications({
        tab: currentTab as "important" | "other" | "snoozed" | "cleared",
        filter: currentFilter as "unread" | undefined,
      });
      toast.success(`Cleared ${clearedCount} notifications`);
      router.refresh();
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const isClearAllEnabled = ["important", "other", "snoozed"].includes(
    currentTab
  );

  return (
    <div className="flex h-full flex-col rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-lg font-semibold">Notifications</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {currentFilter && (
                  <span className="ml-2 rounded-full bg-primary/20 px-1 py-0.5 text-xs">
                    1
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setFilter("unread")}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Unread only</span>
              </DropdownMenuItem>
              {currentFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilter}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            disabled={!isClearAllEnabled}
            onClick={handleClearAll}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>
      <NotificationTabs />
      <div className="flex-1 overflow-auto">
        <NotificationList />
      </div>
    </div>
  );
}
