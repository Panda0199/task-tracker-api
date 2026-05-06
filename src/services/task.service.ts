import { AppError } from "../errors/app-error";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../models/task.model";
import { taskRepository } from "../repositories/task.repository";

export class TaskService {
  getAllTasks(): Task[] {
    return taskRepository.findAll();
  }

  getTaskById(id: string): Task {
    const task = taskRepository.findById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return task;
  }

  createTask(input: CreateTaskInput): Task {
    return taskRepository.create(input);
  }

  updateTask(id: string, input: UpdateTaskInput): Task {
    const updatedTask = taskRepository.update(id, input);

    if (!updatedTask) {
      throw new AppError("Task not found", 404);
    }

    return updatedTask;
  }

  deleteTask(id: string): void {
    const deleted = taskRepository.delete(id);

    if (!deleted) {
      throw new AppError("Task not found", 404);
    }
  }

  clearTasks(): void {
    taskRepository.clear();
  }
}

export const taskService = new TaskService();
