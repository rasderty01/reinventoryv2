import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./users";

export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.string(),
    parentCategoryId: v.optional(v.id("categories")),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) throw new Error("Unauthorized");

    const categoryId = await ctx.db.insert("categories", args);
    return categoryId;
  },
});

export const getCategory = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) return null;
    const access = await hasAccessToOrg(ctx, category.orgId);
    if (!access) return null;
    return category;
  },
});

export const listCategories = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) return [];
    return await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .collect();
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    parentCategoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    const category = await ctx.db.get(id);
    if (!category) throw new Error("Category not found");
    const access = await hasAccessToOrg(ctx, category.orgId);
    if (!access) throw new Error("Unauthorized");
    await ctx.db.patch(id, updateFields);
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) throw new Error("Category not found");
    const access = await hasAccessToOrg(ctx, category.orgId);
    if (!access) throw new Error("Unauthorized");

    // Check if there are any items or child categories using this category
    const items = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("categoryId"), args.id))
      .first();
    if (items) throw new Error("Cannot delete category with associated items");

    const childCategories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("parentCategoryId"), args.id))
      .first();
    if (childCategories)
      throw new Error("Cannot delete category with child categories");

    await ctx.db.delete(args.id);
  },
});

type CategoryWithChildren = Doc<"categories"> & {
  children: CategoryWithChildren[];
};

export const getCategoryHierarchy = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.orgId);
    if (!access) return [];

    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .collect();

    const buildHierarchy = (
      parentId: string | null = null
    ): CategoryWithChildren[] => {
      return categories
        .filter((category) => category.parentCategoryId === parentId)
        .map((category) => ({
          ...category,
          children: buildHierarchy(category._id),
        }));
    };

    return buildHierarchy();
  },
});
