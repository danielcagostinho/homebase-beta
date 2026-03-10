import { z } from "zod/v4";

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  color: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
});
export type Tag = z.infer<typeof tagSchema>;

export const createTagInputSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.string().optional(),
});
export type CreateTagInput = z.infer<typeof createTagInputSchema>;
