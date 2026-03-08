import { z } from "zod/v4";

export const achievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  unlockedAt: z.string().datetime().optional(),
});
export type Achievement = z.infer<typeof achievementSchema>;

export const statsSchema = z.object({
  tasksCompleted: z.number().int().default(0),
  currentStreak: z.number().int().default(0),
  longestStreak: z.number().int().default(0),
  completedByDay: z.record(z.string(), z.number().int()).default({}),
});
export type Stats = z.infer<typeof statsSchema>;

export const gamificationSchema = z.object({
  achievements: z.array(achievementSchema).default([]),
  stats: statsSchema.optional(),
});
export type Gamification = z.infer<typeof gamificationSchema>;
