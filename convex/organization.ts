import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

import { Id } from "./_generated/dataModel";
import { createSettings } from "./settings";
import { hasAccessToOrg } from "./users";

export const createOrganization = internalMutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    createdBy: v.string(),
    clerkOrgId: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // Create the organization
    const orgId = await ctx.db.insert("organizations", {
      ...args,
    });

    await createSettings(ctx, {
      orgId: args.clerkOrgId,
      lowStockThreshold: 10, // Default value
      defaultTaxRate: 0, // Default value
      currency: "PHP", // Default value
      timeZone: "UTC", // Default value
      enableLowStockAlerts: true, // Default value
      enableSalesNotifications: true, // Default value
      enableReportScheduling: false, // Default value
      reportScheduleFrequency: "weekly", // Default value
      tokenIdentifier: args.tokenIdentifier,
    });

    // Find the user by createdBy (which should be the Clerk user ID)
    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.eq(
          q.field("tokenIdentifier"),
          `https://${process.env.CLERK_HOSTNAME}|${args.createdBy}`
        )
      )
      .first();

    if (user) {
      // Update the user's orgIds
      await ctx.db.patch(user._id, {
        orgIds: [...(user.orgIds || []), { orgId: orgId, role: "admin" }],
      });
    } else {
      console.warn(`User not found for createdBy: ${args.createdBy}`);
    }

    return orgId;
  },
});

export const getOrganization = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.id);
    if (!org) return null;
    const access = await hasAccessToOrg(ctx, args.id.toString());
    if (!access) return null;
    return org;
  },
});

export const listOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();
    if (!user) return [];
    return await Promise.all(
      user.orgIds.map(
        async ({ orgId }) => await ctx.db.get(orgId as Id<"organizations">)
      )
    );
  },
});

export const updateOrganization = internalMutation({
  args: {
    id: v.id("organizations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    const access = await hasAccessToOrg(ctx, id.toString());
    if (!access || access.role !== "admin") throw new Error("Unauthorized");
    await ctx.db.patch(id, updateFields);
  },
});

export const deleteOrganization = internalMutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.id.toString());
    if (!access || access.role !== "admin") throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.patch(user._id, {
        orgIds: user.orgIds.filter((org) => org.orgId !== args.id.toString()),
      });
    }
  },
});
