import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./users";

export const createSaleItem = mutation({
  args: {
    saleId: v.id("sales"),
    itemId: v.id("items"),
    quantity: v.number(),
    price: v.number(),
    discount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get the sale to check authorization
    const sale = await ctx.db.get(args.saleId);
    if (!sale) throw new Error("Sale not found");

    const access = await hasAccessToOrg(ctx, sale.orgId);
    if (!access) throw new Error("Unauthorized");

    // Create the sale item
    const saleItemId = await ctx.db.insert("saleItems", args);
    return saleItemId;
  },
});

export const getSaleItem = query({
  args: { id: v.id("saleItems") },
  handler: async (ctx, args) => {
    const saleItem = await ctx.db.get(args.id);
    if (!saleItem) return null;

    // Get the sale to check authorization
    const sale = await ctx.db.get(saleItem.saleId);
    if (!sale) return null;

    const access = await hasAccessToOrg(ctx, sale.orgId);
    if (!access) return null;

    return saleItem;
  },
});

export const listSaleItems = query({
  args: { saleId: v.id("sales") },
  handler: async (ctx, args) => {
    const sale = await ctx.db.get(args.saleId);
    if (!sale) return [];

    const access = await hasAccessToOrg(ctx, sale.orgId);
    if (!access) return [];

    return await ctx.db
      .query("saleItems")
      .withIndex("by_saleId", (q) => q.eq("saleId", args.saleId))
      .collect();
  },
});

export const updateSaleItem = mutation({
  args: {
    id: v.id("saleItems"),
    quantity: v.optional(v.number()),
    price: v.optional(v.number()),
    discount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    const saleItem = await ctx.db.get(id);
    if (!saleItem) throw new Error("Sale item not found");

    // Get the sale to check authorization
    const sale = await ctx.db.get(saleItem.saleId);
    if (!sale) throw new Error("Associated sale not found");

    const access = await hasAccessToOrg(ctx, sale.orgId);
    if (!access) throw new Error("Unauthorized");

    await ctx.db.patch(id, updateFields);
  },
});

export const deleteSaleItem = mutation({
  args: { id: v.id("saleItems") },
  handler: async (ctx, args) => {
    const saleItem = await ctx.db.get(args.id);
    if (!saleItem) throw new Error("Sale item not found");

    // Get the sale to check authorization
    const sale = await ctx.db.get(saleItem.saleId);
    if (!sale) throw new Error("Associated sale not found");

    const access = await hasAccessToOrg(ctx, sale.orgId);
    if (!access) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

export const getSaleItemsWithDetails = query({
  args: { saleId: v.id("sales") },
  handler: async (ctx, args) => {
    const sale = await ctx.db.get(args.saleId);
    if (!sale) return [];

    const access = await hasAccessToOrg(ctx, sale.orgId);
    if (!access) return [];

    const saleItems = await ctx.db
      .query("saleItems")
      .withIndex("by_saleId", (q) => q.eq("saleId", args.saleId))
      .collect();

    return await Promise.all(
      saleItems.map(async (saleItem) => {
        const item = await ctx.db.get(saleItem.itemId);
        return {
          ...saleItem,
          item: item ? { name: item.name, sku: item.sku } : null,
        };
      })
    );
  },
});
