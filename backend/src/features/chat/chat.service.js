import { Conversation, ChatMessage } from "./chat.model.js";
import User from "../user/user.model.js";
import AppError from "../../utils/appError.js";

const ensureConversationAccess = (conversation, userId) => {
  const isMember = conversation.members.some((memberId) => String(memberId) === String(userId));
  if (!isMember) throw new AppError("Forbidden", 403);
};

export const listConversations = async (userId) => {
  return Conversation.find({ members: userId, isActive: true })
    .populate("members", "fullName userEmail employeeCode")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean();
};

export const createConversation = async (payload, currentUser) => {
  const { type, name, memberId, memberIds, departmentId } = payload;

  if (type === "direct") {
    if (!memberId) throw new AppError("Member is required for direct chat", 400);
    if (String(memberId) === String(currentUser.userId)) {
      throw new AppError("Cannot create direct chat with yourself", 400);
    }

    const existing = await Conversation.findOne({
      type: "direct",
      members: { $all: [currentUser.userId, memberId] },
      $expr: { $eq: [{ $size: "$members" }, 2] },
    });

    if (existing) return existing;

    const conversation = await Conversation.create({
      type: "direct",
      members: [currentUser.userId, memberId],
      createdBy: currentUser.userId,
    });

    return conversation;
  }

  if (type === "group") {
    if (!currentUser.permissions?.manageChat) {
      throw new AppError("You do not have permission to create group chats", 403);
    }
    if (!name) throw new AppError("Group name is required", 400);

    const uniqueMembers = new Set([currentUser.userId, ...(memberIds || [])]);
    if (uniqueMembers.size < 2) {
      throw new AppError("At least two members are required", 400);
    }

    const conversation = await Conversation.create({
      type: "group",
      name,
      members: Array.from(uniqueMembers),
      createdBy: currentUser.userId,
    });

    return conversation;
  }

  if (type === "department") {
    if (!currentUser.permissions?.manageChat) {
      throw new AppError("You do not have permission to create department chats", 403);
    }
    if (!departmentId) throw new AppError("Department is required", 400);

    const existing = await Conversation.findOne({ type: "department", department: departmentId });
    if (existing) return existing;

    const employees = await User.find({ department: departmentId, isActive: true }).select("_id");
    if (!employees.length) throw new AppError("No active members in department", 400);

    const conversation = await Conversation.create({
      type: "department",
      name: name || "Department Chat",
      department: departmentId,
      members: employees.map((employee) => employee._id),
      createdBy: currentUser.userId,
    });

    return conversation;
  }

  throw new AppError("Invalid chat type", 400);
};

export const listMessages = async (conversationId, currentUser, page = 1, limit = 30) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError("Conversation not found", 404);

  ensureConversationAccess(conversation, currentUser.userId);

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 30));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    ChatMessage.find({ conversation: conversationId })
      .populate("sender", "fullName userEmail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    ChatMessage.countDocuments({ conversation: conversationId }),
  ]);

  return {
    items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const sendMessage = async (conversationId, content, currentUser) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError("Conversation not found", 404);

  ensureConversationAccess(conversation, currentUser.userId);

  const message = await ChatMessage.create({
    conversation: conversationId,
    sender: currentUser.userId,
    content: content.trim(),
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  return message;
};
