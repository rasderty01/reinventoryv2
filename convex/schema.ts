import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define custom types
export const itemStatus = v.union(
  v.literal("in_stock"),
  v.literal("low_stock"),
  v.literal("out_of_stock")
);

export const roles = v.union(
  v.literal("admin"),
  v.literal("manager"),
  v.literal("staff")
);

export const reportTypes = v.union(
  v.literal("sales"),
  v.literal("inventory"),
  v.literal("forecast")
);

// Define the schema
export default defineSchema({
  items: defineTable({
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
    createdBy: v.id("users"),
    updatedBy: v.id("users"),
    imageUrl: v.optional(v.string()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_status", ["status"])
    .index("by_categoryId", ["categoryId"]),

  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.string(),
    parentCategoryId: v.optional(v.id("categories")),
  }).index("by_orgId", ["orgId"]),

  sales: defineTable({
    orgId: v.string(),
    userId: v.id("users"),
    date: v.string(),
    total: v.number(),
    tax: v.number(),
    discount: v.optional(v.number()),
    paymentMethod: v.string(),
    status: v.union(v.literal("completed"), v.literal("refunded")),
  })
    .index("by_orgId", ["orgId"])
    .index("by_userId", ["userId"])
    .index("by_date", ["date"]),

  saleItems: defineTable({
    saleId: v.id("sales"),
    itemId: v.id("items"),
    quantity: v.number(),
    price: v.number(),
    discount: v.optional(v.number()),
  }).index("by_saleId", ["saleId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  organizations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  }),

  reports: defineTable({
    orgId: v.string(),
    type: reportTypes,
    name: v.string(),
    description: v.optional(v.string()),
    dateRange: v.object({
      start: v.string(),
      end: v.string(),
    }),
    createdBy: v.id("users"),
    createdAt: v.string(),
    data: v.any(), // Store report data as JSON
  })
    .index("by_orgId", ["orgId"])
    .index("by_type", ["type"]),

  notifications: defineTable({
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
  })
    .index("by_orgId", ["orgId"])
    .index("by_userId", ["userId"])
    .index("by_isRead", ["isRead"]),

  settings: defineTable({
    userId: v.string(),
    projectName: v.optional(v.string()),
    rootDirectory: v.optional(v.string()),
    includeOutsideFiles: v.optional(v.boolean()),
    enableNotifications: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),
});
