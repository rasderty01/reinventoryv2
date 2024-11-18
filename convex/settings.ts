import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getMe, getUser } from "./users";

export const getSettings = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("You're not logged in");
    }

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .first();

    return settings;
  },
});

export const updateSettings = mutation({
  args: {
    settingsId: v.id("settings"),
    lowStockThreshold: v.number(),
    defaultTaxRate: v.number(),
    currency: v.string(),
    timeZone: v.string(),
    enableLowStockAlerts: v.boolean(),
    enableSalesNotifications: v.boolean(),
    enableReportScheduling: v.boolean(),
    reportScheduleFrequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly")
    ),
  },
  handler: async (ctx, args) => {
    const me = await getMe(ctx, args);

    if (!me) {
      throw new Error("You're not logged in");
    }

    const { settingsId, ...updateFields } = args;
    const existingSettings = await ctx.db.get(settingsId);

    if (!existingSettings) {
      throw new Error("Settings not found");
    }

    await ctx.db.patch(settingsId, {
      ...updateFields,
      updatedAt: new Date().toISOString(),
      updatedBy: me._id,
    });
    return settingsId;
  },
});

export const createSettings = mutation({
  args: {
    orgId: v.string(),
    lowStockThreshold: v.number(),
    defaultTaxRate: v.number(),
    currency: v.string(),
    timeZone: v.string(),
    enableLowStockAlerts: v.boolean(),
    enableSalesNotifications: v.boolean(),
    enableReportScheduling: v.boolean(),
    reportScheduleFrequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly")
    ),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await getUser(ctx, args.tokenIdentifier);

    const existingSettings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .first();

    if (existingSettings) {
      throw new Error("Settings already exist for this organization");
    }

    const settingsId = await ctx.db.insert("settings", {
      ...args,
      updatedAt: new Date().toISOString(),
      updatedBy: me?._id,
    });
    return settingsId;
  },
});
