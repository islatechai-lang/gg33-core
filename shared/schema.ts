import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  whopUserId: z.string(),
  name: z.string().optional(),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertUserSchema = z.object({
  name: z.string().optional(),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
