import express from "express";
import * as chatController from "./chat.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  createConversationSchema,
  listMessagesSchema,
  sendMessageSchema,
} from "./chat.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requirePermission("viewChat"));

router.get("/conversations", chatController.listConversations);
router.post(
  "/conversations",
  validateRequest(createConversationSchema),
  chatController.createConversation
);
router.get(
  "/conversations/:id/messages",
  validateRequest(listMessagesSchema),
  chatController.listMessages
);
router.post(
  "/conversations/:id/messages",
  validateRequest(sendMessageSchema),
  chatController.sendMessage
);

export default router;
