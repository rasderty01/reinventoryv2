/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as categories from "../categories.js";
import type * as clerk_clerk from "../clerk/clerk.js";
import type * as http from "../http.js";
import type * as items from "../items.js";
import type * as notifications from "../notifications.js";
import type * as organization from "../organization.js";
import type * as reports from "../reports.js";
import type * as sales from "../sales.js";
import type * as salesitem from "../salesitem.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  "clerk/clerk": typeof clerk_clerk;
  http: typeof http;
  items: typeof items;
  notifications: typeof notifications;
  organization: typeof organization;
  reports: typeof reports;
  sales: typeof sales;
  salesitem: typeof salesitem;
  settings: typeof settings;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
