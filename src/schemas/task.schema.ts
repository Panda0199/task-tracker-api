import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "../models/task.model";

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Task ID must be a valid UUID")
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(120, "Title must be 120 characters or less"),

    description: z
      .string()
      .trim()
      .max(500, "Description must be 500 characters or less")
      .optional(),

    status: z.enum(TASK_STATUSES).optional(),

    priority: z.enum(TASK_PRIORITIES).optional(),

    dueDate: z
      .string()
      .datetime("Due date must be a valid ISO datetime")
      .optional()
  })
});

export const updateTaskSchema = z.object({
  params: taskIdParamSchema,
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(120, "Title must be 120 characters or less")
        .optional(),

      description: z
        .string()
        .trim()
        .max(500, "Description must be 500 characters or less")
        .optional(),

      status: z.enum(TASK_STATUSES).optional(),

      priority: z.enum(TASK_PRIORITIES).optional(),

      dueDate: z
        .string()
        .datetime("Due date must be a valid ISO datetime")
        .optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided"
    })
});

export const taskParamsSchema = z.object({
  params: taskIdParamSchema
});

export type CreateTaskRequest = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>["body"];
