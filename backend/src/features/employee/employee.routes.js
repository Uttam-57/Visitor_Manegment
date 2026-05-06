import express from "express";
import * as employeeController from "./employee.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requirePermission("companySettings"));

router.post("/", validateRequest(createEmployeeSchema), employeeController.createEmployee);
router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.put("/:id", validateRequest(updateEmployeeSchema), employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
