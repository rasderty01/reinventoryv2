import * as z from "zod";

export const organizationSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
