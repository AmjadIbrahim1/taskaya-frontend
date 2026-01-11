// frontend/src/lib/validations.ts
import { z } from "zod";


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title is too long")
    .trim(),
  description: z
    .string()
    .max(2000, "Description is too long")
    .optional()
    .nullable(),
  deadline: z
    .string()
    .datetime("Invalid date format")
    .optional()
    .nullable()
    .or(z.literal("")),
  isUrgent: z.boolean().default(false),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500)
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000)
    .optional()
    .nullable(),
  deadline: z
    .string()
    .datetime("Invalid date format")
    .optional()
    .nullable()
    .or(z.literal("")),
  isUrgent: z.boolean().optional(),
  completed: z.boolean().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
});

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(200)
    .trim(),
});


export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type SearchInput = z.infer<typeof searchSchema>;