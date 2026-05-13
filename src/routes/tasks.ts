import { randomUUID } from 'crypto';
import { Router, Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createTaskSchema,
  TaskStatus,
  updateTaskSchema,
} from '../schemas/task';

/**
 * Task representation returned by the API.
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Router for task CRUD endpoints.
 */
export const tasksRouter = Router();
const tasks = new Map<string, Task>();

function sendValidationError(res: Response, error: ZodError): void {
  res.status(400).json({
    error: 'Invalid task payload',
    details: error.errors,
  });
}

function sendNotFoundError(res: Response): void {
  res.status(404).json({ error: 'Task not found' });
}

tasksRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  res.json(Array.from(tasks.values()));
});

tasksRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsedTask = createTaskSchema.safeParse(req.body);

  if (!parsedTask.success) {
    sendValidationError(res, parsedTask.error);
    return;
  }

  const timestamp = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    ...parsedTask.data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  tasks.set(task.id, task);
  res.status(201).json(task);
});

tasksRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const task = tasks.get(req.params.id);

  if (!task) {
    sendNotFoundError(res);
    return;
  }

  res.json(task);
});

tasksRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const existingTask = tasks.get(req.params.id);

  if (!existingTask) {
    sendNotFoundError(res);
    return;
  }

  const parsedTask = updateTaskSchema.safeParse(req.body);

  if (!parsedTask.success) {
    sendValidationError(res, parsedTask.error);
    return;
  }

  const updatedTask: Task = {
    ...existingTask,
    ...parsedTask.data,
    updatedAt: new Date().toISOString(),
  };

  tasks.set(updatedTask.id, updatedTask);
  res.json(updatedTask);
});

tasksRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const deletedTask = tasks.delete(req.params.id);

  if (!deletedTask) {
    sendNotFoundError(res);
    return;
  }

  res.status(204).send();
});
