import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
            name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
            image: result.data.image_url,
            email: result.data.email_addresses[0]?.email_address ?? "",
          });
          break;

        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
            name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
            image: result.data.image_url,
            email: result.data.email_addresses[0]?.email_address ?? "",
          });
          break;

        case "organizationMembership.created":
          await ctx.runMutation(internal.users.addOrgIdToUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: mapClerkRoleToConvexRole(result.data.role),
          });
          break;

        case "organizationMembership.updated":
          await ctx.runMutation(internal.users.updateRoleInOrgForUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: mapClerkRoleToConvexRole(result.data.role),
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;

function mapClerkRoleToConvexRole(
  clerkRole: string
): "admin" | "manager" | "staff" {
  switch (clerkRole) {
    case "admin":
      return "admin";
    case "manager":
      return "manager";
    default:
      return "staff";
  }
}
