import { verifyAccessToken } from "../../utils/jwt.utils.js";
import { Conversation } from "./chat.model.js";
import { sendMessage } from "./chat.service.js";

const getTokenFromSocket = (socket) => {
  const authHeader = socket.handshake.headers?.authorization || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return socket.handshake.auth?.token || null;
};

export const registerChatHandlers = (io) => {
  io.use((socket, next) => {
    try {
      const token = getTokenFromSocket(socket);
      if (!token) return next(new Error("Unauthorized"));
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.userId;
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    const conversations = await Conversation.find({ members: userId }).select("_id");
    conversations.forEach((conversation) => {
      socket.join(`conv:${conversation._id}`);
    });

    socket.on("chat:join", async (conversationId) => {
      if (!conversationId) return;
      const conversation = await Conversation.findById(conversationId).select("members");
      if (!conversation) return;

      const isMember = conversation.members.some((member) => String(member) === String(userId));
      if (isMember) socket.join(`conv:${conversationId}`);
    });

    socket.on("chat:leave", (conversationId) => {
      if (!conversationId) return;
      socket.leave(`conv:${conversationId}`);
    });

    socket.on("chat:message", async (payload, ack) => {
      try {
        const { conversationId, content } = payload || {};
        if (!conversationId || !content) throw new Error("Invalid payload");

        const message = await sendMessage(conversationId, content, { userId });
        io.to(`conv:${conversationId}`).emit("chat:message", message);

        if (typeof ack === "function") ack({ ok: true, message });
      } catch (error) {
        if (typeof ack === "function") ack({ ok: false, error: error.message });
      }
    });
  });
};
