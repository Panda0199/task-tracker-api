import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { taskService } from "../services/task.service";

export class TaskController {
  private getIdFromParams(req: Request): string {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError("Invalid task ID", 400);
    }

    return id;
  }

  getAllTasks(_req: Request, res: Response, next: NextFunction): void {
    try {
      const tasks = taskService.getAllTasks();

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  getTaskById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = this.getIdFromParams(req);
      const task = taskService.getTaskById(id);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  createTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const task = taskService.createTask(req.body);

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  updateTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = this.getIdFromParams(req);
      const task = taskService.updateTask(id, req.body);

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  deleteTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = this.getIdFromParams(req);

      taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        message: "Task deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
