import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import logger from "./utils/logger.utils.js";
import app from "./app.js";
import { registerChatHandlers } from "./features/chat/chat.socket.js";

const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  },
});

connectDB()
  .then(() => {
    registerChatHandlers(io);
    server.listen(PORT, () => {
      console.log("─────────────────────────────────────");
      console.log("🚀 Server started");
      console.log(`   Port : http://localhost:${PORT}`);
      console.log(`   Env  : ${process.env.NODE_ENV}`);
      console.log("─────────────────────────────────────");
    });
  })
  .catch((err) => {
    logger.error("─────────────────────────────────────");
    logger.error("❌ Server failed to start");
    logger.error(`   Reason : ${err.message}`);
    logger.error(`   Env    : ${process.env.NODE_ENV}`);
    logger.error("─────────────────────────────────────");
    process.exit(1);
  });