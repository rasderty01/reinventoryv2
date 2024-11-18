import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getMe, hasAccessToOrg } from "./users";

export const createNotification = mutation({
  args: {
    orgId: v.string(),
    userId: v.id("users"),
    message: v.string(),
    type: v.union(
      v.literal("low_stock"),
      v.literal("new_sale"),
      v.literal("report_ready")
    ),
    isRead: v.boolean(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    // Check user settings before creating the notification
    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .first();

    if (settings) {
      if (args.type === "low_stock" && !settings.enableLowStockAlerts) {
        return null; // Don't create notification if low stock alerts are disabled
      }
      if (args.type === "new_sale" && !settings.enableSalesNotifications) {
        return null; // Don't create notification if sales notifications are disabled
      }
    }

    const notificationId = await ctx.db.insert("notifications", args);
    return notificationId;
  },
});

export const getNotification = query({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification) return null;
    const access = await hasAccessToOrg(ctx, notification.orgId);
    if (!access) return null;
    return notification;
  },
});

export const listNotifications = query({
  args: {},
  handler: async (ctx) => {
    const me = await getMe(ctx, {});
    if (!me) return [];

    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), me._id))
      .collect();

    return Promise.all(
      notifications.map(async (notification) => {
        const access = await hasAccessToOrg(ctx, notification.orgId);
        if (!access) return null;

        // Check user settings for each notification
        const settings = await ctx.db
          .query("settings")
          .filter((q) => q.eq(q.field("orgId"), notification.orgId))
          .first();

        if (settings) {
          if (
            notification.type === "low_stock" &&
            !settings.enableLowStockAlerts
          ) {
            return null;
          }
          if (
            notification.type === "new_sale" &&
            !settings.enableSalesNotifications
          ) {
            return null;
          }
        }

        return notification;
      })
    ).then((notifications) => notifications.filter((n) => n !== null));
  },
});

export const markNotificationAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification) throw new Error("Notification not found");
    const access = await hasAccessToOrg(ctx, notification.orgId);
    if (!access) throw new Error("Unauthorized");
    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification) throw new Error("Notification not found");
    const access = await hasAccessToOrg(ctx, notification.orgId);
    if (!access) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});

export const getUnreadNotificationsCount = query({
  args: {},
  handler: async (ctx) => {
    const me = await getMe(ctx, {});
    if (!me) return 0;

    const notifications = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), me._id), q.eq(q.field("isRead"), false))
      )
      .collect();

    return (
      await Promise.all(
        notifications.map(async (notification) => {
          const access = await hasAccessToOrg(ctx, notification.orgId);
          if (!access) return false;

          const settings = await ctx.db
            .query("settings")
            .filter((q) => q.eq(q.field("orgId"), notification.orgId))
            .first();

          if (settings) {
            if (
              notification.type === "low_stock" &&
              !settings.enableLowStockAlerts
            ) {
              return false;
            }
            if (
              notification.type === "new_sale" &&
              !settings.enableSalesNotifications
            ) {
              return false;
            }
          }

          return true;
        })
      )
    ).filter(Boolean).length;
  },
});

export const clearNotifications = mutation({
  args: {
    tab: v.union(
      v.literal("important"),
      v.literal("other"),
      v.literal("snoozed"),
      v.literal("cleared")
    ),
    filter: v.optional(v.union(v.literal("unread"))),
  },
  handler: async (ctx, args) => {
    const me = await getMe(ctx, {});
    if (!me) throw new Error("Unauthorized");

    let notificationsQuery = ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), me._id));

    // Apply tab filter
    switch (args.tab) {
      case "important":
        notificationsQuery = notificationsQuery.filter((q) =>
          q.eq(q.field("type"), "low_stock")
        );
        break;
      case "other":
        notificationsQuery = notificationsQuery.filter((q) =>
          q.eq(q.field("type"), "new_sale")
        );
        break;
      case "cleared":
        notificationsQuery = notificationsQuery.filter((q) =>
          q.eq(q.field("isRead"), true)
        );
        break;
      case "snoozed":
      default:
        notificationsQuery = notificationsQuery.filter((q) =>
          q.eq(q.field("isRead"), false)
        );
        break;
    }

    // Apply additional filter if present
    if (args.filter === "unread") {
      notificationsQuery = notificationsQuery.filter((q) =>
        q.eq(q.field("isRead"), false)
      );
    }

    const notifications = await notificationsQuery.collect();

    // Delete or mark as read based on the tab
    if (args.tab === "cleared") {
      await Promise.all(
        notifications.map((notification) => ctx.db.delete(notification._id))
      );
    } else {
      await Promise.all(
        notifications.map((notification) =>
          ctx.db.patch(notification._id, { isRead: true })
        )
      );
    }

    return notifications.length;
  },
});
