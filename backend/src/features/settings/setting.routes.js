import express from "express";
import * as settingController from "./setting.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { createSettingSchema, createSettingTemplateSchema } from "./setting.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requirePermission("allSettings"));

// Templates
router.post("/templates", validateRequest(createSettingTemplateSchema), settingController.createTemplate);
router.get("/templates", settingController.getTemplates);
router.put("/templates/:id", settingController.updateTemplate);

// Settings
router.post("/", validateRequest(createSettingSchema), settingController.createSetting);
router.get("/", settingController.getSettings);
router.get("/tree", settingController.getTree);
router.put("/:id", settingController.updateSetting);
router.delete("/:id", settingController.deleteSetting);

export default router;
