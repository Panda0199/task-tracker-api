import { z } from 'zod';

/**
 * Allowed task workflow statuses.
 */
export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);

/**
 * Schema for creating a task.
 */
export const createTaskSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    status: taskStatusSchema.default('todo'),
  })
  .strict();

/**
 * Schema for updating a task.
 */
export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((task) => Object.keys(task).length > 0, {
    message: 'At least one field must be provided',
  });

/**
 * Task status values accepted by the API.
 */
export type TaskStatus = z.infer<typeof taskStatusSchema>;

/**
 * Request body accepted when creating a task.
 */
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * Request body accepted when updating a task.
 */
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
