import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { env } from "../../../shared/config/env";
import { useAuthStore } from "../../../shared/store/authStore";

export const useChatSocket = () => {
  const token = useAuthStore((state) => state.token);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(env.API_ORIGIN, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  return { socket: socketRef.current, isConnected };
};
