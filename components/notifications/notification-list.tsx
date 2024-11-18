"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { NotificationItem } from "./notification-item";

export function NotificationList() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "inbox";

  const notifications = useQuery(api.notifications.listNotifications, {});

  if (!notifications) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }

  // Filter notifications based on current tab
  const filteredNotifications = notifications.filter((notification) => {
    switch (currentTab) {
      case "important":
        return notification.type === "low_stock";
      case "other":
        return notification.type === "new_sale";
      case "cleared":
        return notification.isRead;
      default:
        return !notification.isRead;
    }
  });

  return (
    <div className="divide-y">
      {filteredNotifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          id={notification._id}
          message={notification.message}
          type={notification.type}
          isRead={notification.isRead}
          createdAt={notification.createdAt}
        />
      ))}
    </div>
  );
}
