import { beforeEach, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";
import { taskService } from "../src/services/task.service";

describe("Task Tracker API", () => {
  beforeEach(() => {
    taskService.clearTasks();
  });

  describe("GET /health", () => {
    it("should return API health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Task Tracker API is running");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Finish programming assignment",
          description: "Build Task Tracker REST API",
          status: "todo",
          priority: "high",
          dueDate: "2026-05-10T23:59:00.000Z"
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe("Finish programming assignment");
      expect(response.body.data.priority).toBe("high");
    });

    it("should reject invalid task data", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "",
          priority: "urgent"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Title is required");
    });
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      await request(app)
        .post("/api/tasks")
        .send({
          title: "Task one",
          priority: "medium"
        });

      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].title).toBe("Task one");
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return one task by ID", async () => {
      const createdTask = await request(app)
        .post("/api/tasks")
        .send({
          title: "Find this task",
          priority: "low"
        });

      const taskId = createdTask.body.data.id;

      const response = await request(app).get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });

    it("should return 404 for missing task", async () => {
      const response = await request(app).get(
        "/api/tasks/42f91ac9-a1c3-42a2-9ab7-84537ce84f11"
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Task not found");
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update a task", async () => {
      const createdTask = await request(app)
        .post("/api/tasks")
        .send({
          title: "Update this task",
          priority: "high"
        });

      const taskId = createdTask.body.data.id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({
          status: "in-progress",
          priority: "medium"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("in-progress");
      expect(response.body.data.priority).toBe("medium");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const createdTask = await request(app)
        .post("/api/tasks")
        .send({
          title: "Delete this task",
          priority: "low"
        });

      const taskId = createdTask.body.data.id;

      const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe("Task deleted successfully");

      const getResponse = await request(app).get(`/api/tasks/${taskId}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe("Unknown route", () => {
    it("should return 404 for unknown route", async () => {
      const response = await request(app).get("/unknown-route");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
