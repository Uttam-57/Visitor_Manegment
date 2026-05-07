import express from "express";
import * as entryController from "./entry.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  createEntrySchema,
  updateEntrySchema,
  updateEntryStatusSchema,
  getEntriesSchema,
  entryIdParamSchema,
} from "./entry.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("createEntries"),
  validateRequest(createEntrySchema),
  entryController.createEntry
);

router.get(
  "/",
  requirePermission("viewEntries"),
  validateRequest(getEntriesSchema),
  entryController.getEntries
);

router.get(
  "/:id",
  requirePermission("viewEntries"),
  validateRequest(entryIdParamSchema),
  entryController.getEntryById
);

router.put(
  "/:id",
  requirePermission("createEntries"),
  validateRequest(updateEntrySchema),
  entryController.updateEntry
);

router.patch(
  "/:id/status",
  requirePermission("manageEntries"),
  validateRequest(updateEntryStatusSchema),
  entryController.updateEntryStatus
);

export default router;
