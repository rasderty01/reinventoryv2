import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./users";

export const createReport = mutation({
  args: {
    orgId: v.string(),
    type: v.union(
      v.literal("sales"),
      v.literal("inventory"),
      v.literal("forecast")
    ),
    name: v.string(),
    description: v.optional(v.string()),
    dateRange: v.object({
      start: v.string(),
      end: v.string(),
    }),
    createdBy: v.id("users"),
    createdAt: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");
    const reportId = await ctx.db.insert("reports", args);
    return reportId;
  },
});

export const getReport = query({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) return null;
    const access = await hasAccessToOrg(ctx, report.orgId);
    if (!access) return null;
    return report;
  },
});

export const listReports = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) return [];
    return await ctx.db
      .query("reports")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .collect();
  },
});

export const updateReport = mutation({
  args: {
    id: v.id("reports"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    dateRange: v.optional(
      v.object({
        start: v.string(),
        end: v.string(),
      })
    ),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    const report = await ctx.db.get(id);
    if (!report) throw new Error("Report not found");
    const access = await hasAccessToOrg(ctx, report.orgId);
    if (!access) throw new Error("Unauthorized");
    await ctx.db.patch(id, updateFields);
  },
});

export const deleteReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error("Report not found");
    const access = await hasAccessToOrg(ctx, report.orgId);
    if (!access) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});
