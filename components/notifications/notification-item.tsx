"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Check, FileText, Package, ShoppingCart, Trash } from "lucide-react";

interface NotificationItemProps {
  id: Id<"notifications">;
  message: string;
  type: "low_stock" | "new_sale" | "report_ready";
  isRead: boolean;
  createdAt: string;
}

export function NotificationItem({
  id,
  message,
  type,
  isRead,
  createdAt,
}: NotificationItemProps) {
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const getIcon = () => {
    switch (type) {
      case "low_stock":
        return <Package className="h-4 w-4 text-yellow-500" />;
      case "new_sale":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "report_ready":
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b p-4 transition-colors hover:bg-muted/50",
        !isRead && "bg-muted/20"
      )}
    >
      <div className="flex size-8 items-center justify-center rounded-full bg-background shadow-sm">
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <p className={cn("text-sm", !isRead && "font-medium")}>{message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {!isRead && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => markAsRead({ id })}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteNotification({ id })}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete notification</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete notification</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
