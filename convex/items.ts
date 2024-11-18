import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { itemStatus } from "./schema";
import { hasAccessToOrg } from "./users";

// Query to list all items for an organization
export const list = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    console.log("args", args);
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    return await ctx.db
      .query("items")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .collect();
  },
});

// Query to get a single item by ID
export const get = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) return null;

    const access = await hasAccessToOrg(ctx, item.orgId);
    if (!access) return null;

    return item;
  },
});

// Mutation to create a new item
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    sku: v.string(),
    barcode: v.optional(v.string()),
    price: v.number(),
    cost: v.number(),
    quantity: v.number(),
    status: itemStatus,
    categoryId: v.id("categories"),
    orgId: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthenticated");

    const userId = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", user.tokenIdentifier)
      )
      .unique();

    if (!userId) throw new Error("User not found");

    const itemId = await ctx.db.insert("items", {
      ...args,
      createdBy: userId._id,
      updatedBy: userId._id,
    });

    await ctx.db.insert("itemHistory", {
      itemId,
      action: "create",
      changes: args,
      timestamp: new Date().toISOString(),
      userId: userId._id,
    });

    return itemId;
  },
});

// Mutation to update an existing item
export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    price: v.optional(v.number()),
    cost: v.optional(v.number()),
    quantity: v.optional(v.number()),
    status: v.optional(itemStatus),
    categoryId: v.optional(v.id("categories")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const item = await ctx.db.get(id);
    if (!item || item.deletedAt) throw new Error("Item not found");

    const access = await hasAccessToOrg(ctx, item.orgId);
    if (!access) throw new Error("Unauthorized");

    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthenticated");

    const userId = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", user.tokenIdentifier)
      )
      .unique();

    if (!userId) throw new Error("User not found");

    const updatedItem = { ...updates, updatedBy: userId._id };
    await ctx.db.patch(id, updatedItem);

    await ctx.db.insert("itemHistory", {
      itemId: id,
      action: "update",
      changes: updates,
      timestamp: new Date().toISOString(),
      userId: userId._id,
    });

    return id;
  },
});

// Mutation to soft delete an item
export const remove = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) throw new Error("Item not found");

    const access = await hasAccessToOrg(ctx, item.orgId);
    if (!access) throw new Error("Unauthorized");

    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthenticated");

    const userId = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", user.tokenIdentifier)
      )
      .unique();

    if (!userId) throw new Error("User not found");

    await ctx.db.patch(args.id, {
      deletedAt: new Date().toISOString(),
      updatedBy: userId._id,
    });

    await ctx.db.insert("itemHistory", {
      itemId: args.id,
      action: "delete",
      changes: { deletedAt: new Date().toISOString() },
      timestamp: new Date().toISOString(),
      userId: userId._id,
    });

    return args.id;
  },
});

// Query to get item history
export const getHistory = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    const access = await hasAccessToOrg(ctx, item.orgId);
    if (!access) throw new Error("Unauthorized");

    return await ctx.db
      .query("itemHistory")
      .withIndex("by_itemId", (q) => q.eq("itemId", args.itemId))
      .order("desc")
      .collect();
  },
});

// Mutation for batch update of items
export const batchUpdate = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("items"),
        updates: v.object({
          name: v.optional(v.string()),
          description: v.optional(v.string()),
          sku: v.optional(v.string()),
          barcode: v.optional(v.string()),
          price: v.optional(v.number()),
          cost: v.optional(v.number()),
          quantity: v.optional(v.number()),
          status: v.optional(itemStatus),
          categoryId: v.optional(v.id("categories")),
          imageUrl: v.optional(v.string()),
        }),
      })
    ),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthenticated");

    const userId = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", user.tokenIdentifier)
      )
      .unique();

    if (!userId) throw new Error("User not found");

    const updatedIds = [];

    for (const { id, updates } of args.items) {
      const item = await ctx.db.get(id);
      if (!item || item.deletedAt) continue;

      if (item.orgId !== args.orgId) throw new Error("Unauthorized");

      const updatedItem = { ...updates, updatedBy: userId._id };
      await ctx.db.patch(id, updatedItem);

      await ctx.db.insert("itemHistory", {
        itemId: id,
        action: "update",
        changes: updates,
        timestamp: new Date().toISOString(),
        userId: userId._id,
      });

      updatedIds.push(id);
    }

    return updatedIds;
  },
});
