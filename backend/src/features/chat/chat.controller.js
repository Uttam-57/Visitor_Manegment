import * as chatService from "./chat.service.js";

export const listConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.listConversations(req.user.userId);
    res.status(200).json({ success: true, message: "Conversations retrieved", data: conversations });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const conversation = await chatService.createConversation(req.body, req.user);
    res.status(201).json({ success: true, message: "Conversation created", data: conversation });
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const messages = await chatService.listMessages(
      req.params.id,
      req.user,
      req.query.page,
      req.query.limit
    );
    res.status(200).json({ success: true, message: "Messages retrieved", data: messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const message = await chatService.sendMessage(req.params.id, req.body.content, req.user);
    res.status(201).json({ success: true, message: "Message sent", data: message });
  } catch (error) {
    next(error);
  }
};
