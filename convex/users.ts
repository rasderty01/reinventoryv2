import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from "./_generated/server";
import { roles } from "./schema";

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError("Expected user to be defined");
  }

  return user;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      image: args.image,
      email: args.email,
      status: "active",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError("No user with this token!");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
      email: args.email,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    const org = user.orgIds.find((org) => org.orgId === args.orgId);

    if (!org) {
      throw new ConvexError(
        "Expected an org on the user but was not found when updating"
      );
    }

    org.role = args.role;

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
      email: user?.email,
    };
  },
});

export const getMe = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    console.log("identity", identity);
    if (!identity) {
      throw new ConvexError("You must be logged in to get user information");
    }
    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  },
});

export const handleDeleteUser = internalMutation({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), args.tokenIdentifier))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Soft delete user
    await ctx.db.patch(user._id, {
      status: "deleted",
      deletedAt: new Date().toISOString(),
    });

    // Handle related data

    console.log(`User ${user._id} has been marked as deleted`);
  },
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
): Promise<{ user: Doc<"users">; role: string } | null> {
  const identity = await ctx.auth.getUserIdentity();
  console.log(identity, "heyyo");
  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const orgMembership = user.orgIds.find((item) => item.orgId === orgId);

  if (orgMembership) {
    return { user, role: orgMembership.role };
  }

  if (user.tokenIdentifier.includes(orgId)) {
    // Assuming a default role for users identified by tokenIdentifier
    return { user, role: "member" };
  }

  return null;
}
