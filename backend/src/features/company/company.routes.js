import express from "express";
import * as companyController from "./company.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requirePermission("companySettings"));

router.post("/", validateRequest(createCompanySchema), companyController.createCompany);
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.put("/:id", validateRequest(updateCompanySchema), companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

export default router;
