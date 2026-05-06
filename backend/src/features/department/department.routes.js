import express from "express";
import * as departmentController from "./department.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requirePermission("companySettings"));

router.post("/", validateRequest(createDepartmentSchema), departmentController.createDepartment);
router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);
router.put("/:id", validateRequest(updateDepartmentSchema), departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);
router.patch("/:id/status", departmentController.toggleActiveStatus);

export default router;
