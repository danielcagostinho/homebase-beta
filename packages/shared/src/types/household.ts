import { z } from "zod/v4";

export const householdMemberSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "member"]).default("member"),
  joinedAt: z.string().datetime(),
});
export type HouseholdMember = z.infer<typeof householdMemberSchema>;

export const householdSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().min(1),
  createdBy: z.string(),
  members: z.array(householdMemberSchema).default([]),
  createdAt: z.string().datetime(),
});
export type Household = z.infer<typeof householdSchema>;
