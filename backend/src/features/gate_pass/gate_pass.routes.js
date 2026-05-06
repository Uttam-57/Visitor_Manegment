import express from "express";
import * as gatePassController from "./gate_pass.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { createGatePassSchema, updateStatusSchema } from "./gate_pass.validation.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validateRequest(createGatePassSchema), gatePassController.createGatePass);
router.get("/", gatePassController.getAllGatePasses);
router.get("/:id", gatePassController.getGatePassById);
router.patch("/:id/status", validateRequest(updateStatusSchema), gatePassController.updateStatus);

export default router;
