import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createTaskSchema,
  taskParamsSchema,
  updateTaskSchema
} from "../schemas/task.schema";

export const taskRoutes = Router();

taskRoutes.get(
  "/",
  taskController.getAllTasks.bind(taskController)
);

taskRoutes.get(
  "/:id",
  validate(taskParamsSchema),
  taskController.getTaskById.bind(taskController)
);

taskRoutes.post(
  "/",
  validate(createTaskSchema),
  taskController.createTask.bind(taskController)
);

taskRoutes.patch(
  "/:id",
  validate(updateTaskSchema),
  taskController.updateTask.bind(taskController)
);

taskRoutes.delete(
  "/:id",
  validate(taskParamsSchema),
  taskController.deleteTask.bind(taskController)
);
