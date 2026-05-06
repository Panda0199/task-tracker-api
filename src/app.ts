import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { taskRoutes } from "./routes/task.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Tracker API is running"
  });
});

app.use("/api/tasks", taskRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
