import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createNotification } from "./notifications";
import { hasAccessToOrg } from "./users";

export const createSale = mutation({
  args: {
    orgId: v.string(),
    userId: v.id("users"),
    date: v.string(),
    total: v.number(),
    tax: v.number(),
    discount: v.optional(v.number()),
    paymentMethod: v.string(),
    status: v.union(v.literal("completed"), v.literal("refunded")),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .first();

    if (settings && args.tax === 0 && settings.defaultTaxRate) {
      args.tax = (args.total * settings.defaultTaxRate) / 100;
    }

    const saleId = await ctx.db.insert("sales", args);

    if (settings?.enableSalesNotifications) {
      await createNotification(ctx, {
        orgId: args.orgId,
        userId: args.userId,
        message: `New sale created for ${args.total} ${settings.currency}`,
        type: "new_sale",
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return saleId;
  },
});

export const listSales = query({
  args: {
    orgId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) return [];

    let query = ctx.db
      .query("sales")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId));

    if (args.startDate !== "") {
      query = query.filter((q) => q.gte(q.field("date"), args.startDate));
    }
    if (args.endDate !== "") {
      query = query.filter((q) => q.lte(q.field("date"), args.endDate));
    }

    return await query.collect();
  },
});

export const getSalesSummary = query({
  args: {
    orgId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    let query = ctx.db
      .query("sales")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId));

    if (args.startDate !== "") {
      query = query.filter((q) => q.gte(q.field("date"), args.startDate));
    }
    if (args.endDate !== "") {
      query = query.filter((q) => q.lte(q.field("date"), args.endDate));
    }

    const sales = await query.collect();

    return sales.reduce(
      (summary, sale) => ({
        totalSales: summary.totalSales + sale.total,
        totalTax: summary.totalTax + sale.tax,
        totalDiscount: summary.totalDiscount + (sale.discount || 0),
        numberOfSales: summary.numberOfSales + 1,
      }),
      { totalSales: 0, totalTax: 0, totalDiscount: 0, numberOfSales: 0 }
    );
  },
});
