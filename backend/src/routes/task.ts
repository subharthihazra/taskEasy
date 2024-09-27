import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task";
import { verifyUserMiddleware } from "../controllers/auth";
const router = Router();

router.post("/tasks", verifyUserMiddleware, createTask); // Create a task
router.get("/tasks", verifyUserMiddleware, getTasks); // Get all tasks for a user
router.put("/tasks/:id", verifyUserMiddleware, updateTask); // Update a specific task by ID
router.delete("/tasks/:id", verifyUserMiddleware, deleteTask); // Delete a specific task by ID

export default router;
