import { randomUUID } from "crypto";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../models/task.model";

export class TaskRepository {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();

    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now
    };

    this.tasks.push(task);

    return task;
  }

  update(id: string, input: UpdateTaskInput): Task | undefined {
    const task = this.findById(id);

    if (!task) {
      return undefined;
    }

    const updatedTask: Task = {
      ...task,
      ...input,
      updatedAt: new Date().toISOString()
    };

    this.tasks = this.tasks.map((existingTask) =>
      existingTask.id === id ? updatedTask : existingTask
    );

    return updatedTask;
  }

  delete(id: string): boolean {
    const initialLength = this.tasks.length;

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return this.tasks.length < initialLength;
  }

  clear(): void {
    this.tasks = [];
  }
}

export const taskRepository = new TaskRepository();
