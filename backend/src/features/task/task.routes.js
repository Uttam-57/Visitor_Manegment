import express from "express";
import * as taskController from "./task.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
  getTasksSchema,
  taskIdParamSchema,
} from "./task.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("manageTasks"),
  validateRequest(createTaskSchema),
  taskController.createTask
);

router.get(
  "/",
  requirePermission("viewTasks"),
  validateRequest(getTasksSchema),
  taskController.getAllTasks
);

router.get(
  "/:id",
  requirePermission("viewTasks"),
  validateRequest(taskIdParamSchema),
  taskController.getTaskById
);

router.put(
  "/:id",
  requirePermission("manageTasks"),
  validateRequest(updateTaskSchema),
  taskController.updateTask
);

router.delete(
  "/:id",
  requirePermission("manageTasks"),
  validateRequest(taskIdParamSchema),
  taskController.deleteTask
);

export default router;
