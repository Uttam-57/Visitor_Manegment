import express from "express";
import * as projectController from "./project.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectsSchema,
  projectIdParamSchema,
} from "./project.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("manageProjects"),
  validateRequest(createProjectSchema),
  projectController.createProject
);

router.get(
  "/",
  requirePermission("viewProjects"),
  validateRequest(getProjectsSchema),
  projectController.getAllProjects
);

router.get(
  "/:id",
  requirePermission("viewProjects"),
  validateRequest(projectIdParamSchema),
  projectController.getProjectById
);

router.put(
  "/:id",
  requirePermission("manageProjects"),
  validateRequest(updateProjectSchema),
  projectController.updateProject
);

router.delete(
  "/:id",
  requirePermission("manageProjects"),
  validateRequest(projectIdParamSchema),
  projectController.deleteProject
);

export default router;
