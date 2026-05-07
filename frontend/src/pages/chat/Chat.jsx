import { useEffect, useMemo, useState } from "react";
import api from "../../shared/services/api";
import { apiEndpoints } from "../../shared/constants/api";
import { Button } from "../../shared/ui/atoms/Button";
import { Input } from "../../shared/ui/atoms/Input";
import { useAuthStore } from "../../shared/store/authStore";
import { useChatSocket } from "../../features/chat/hooks/useChatSocket";

const Chat = () => {
  const user = useAuthStore((state) => state.user);
  const { socket, isConnected } = useChatSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [form, setForm] = useState({
    type: "direct",
    name: "",
    memberId: "",
    memberIds: "",
    departmentId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(apiEndpoints.CHAT.CONVERSATIONS);
      setConversations(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(apiEndpoints.CHAT.MESSAGES(conversationId), { params: { page: 1, limit: 50 } });
      const items = res.data?.data?.items || [];
      setMessages(items.reverse());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket || !activeConversation?._id) return undefined;
    socket.emit("chat:join", activeConversation._id);
    return () => socket.emit("chat:leave", activeConversation._id);
  }, [socket, activeConversation]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleIncoming = (message) => {
      if (!message) return;

      setConversations((prev) =>
        prev.map((conv) =>
          String(conv._id) === String(message.conversation)
            ? { ...conv, lastMessage: message, lastMessageAt: message.createdAt }
            : conv
        )
      );

      if (String(message.conversation) === String(activeConversation?._id)) {
        setMessages((prev) => {
          const exists = prev.some((item) => String(item._id) === String(message._id));
          return exists ? prev : [...prev, message];
        });
      }
    };

    socket.on("chat:message", handleIncoming);
    return () => socket.off("chat:message", handleIncoming);
  }, [socket, activeConversation]);

  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    await fetchMessages(conversation._id);
  };

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { type: form.type };

    if (form.type === "direct") {
      payload.memberId = form.memberId.trim();
    }

    if (form.type === "group") {
      payload.name = form.name.trim();
      payload.memberIds = form.memberIds
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }

    if (form.type === "department") {
      payload.departmentId = form.departmentId.trim();
      payload.name = form.name.trim() || undefined;
    }

    try {
      await api.post(apiEndpoints.CHAT.CONVERSATIONS, payload);
      setForm({ type: "direct", name: "", memberId: "", memberIds: "", departmentId: "" });
      await fetchConversations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create conversation.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeConversation?._id || !messageInput.trim()) return;

    const content = messageInput.trim();
    setMessageInput("");

    if (socket && isConnected) {
      socket.emit("chat:message", { conversationId: activeConversation._id, content }, (ack) => {
        if (!ack?.ok) {
          setError(ack?.error || "Failed to send message.");
        }
      });
      return;
    }

    try {
      const res = await api.post(apiEndpoints.CHAT.MESSAGES(activeConversation._id), { content });
      const message = res.data?.data;
      if (message) setMessages((prev) => [...prev, message]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    }
  };

  const conversationLabel = (conversation) => {
    if (!conversation) return "";
    if (conversation.type === "group") return conversation.name || "Group";
    if (conversation.type === "department") return conversation.name || "Department";
    if (conversation.type === "direct") {
      const other = conversation.members?.find((member) => String(member._id) !== String(user?._id));
      return other?.fullName || other?.userEmail || "Direct";
    }
    return conversation.name || "Conversation";
  };

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => new Date(b.lastMessageAt || b.updatedAt) - new Date(a.lastMessageAt || a.updatedAt));
  }, [conversations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Conversations</h2>
          <p className="text-xs text-slate-500">{isConnected ? "Connected" : "Offline"}</p>
          {loading && <p className="text-xs text-slate-500 mt-2">Loading...</p>}
          <div className="mt-3 space-y-2">
            {sortedConversations.length === 0 && (
              <p className="text-sm text-slate-500">No conversations yet.</p>
            )}
            {sortedConversations.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition ${
                  String(activeConversation?._id) === String(conversation._id)
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <p className="font-medium text-slate-900">{conversationLabel(conversation)}</p>
                <p className="text-xs text-slate-500 truncate">{conversation.lastMessage?.content || "No messages yet"}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreateConversation} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Conversation</h3>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="type">Type</label>
            <select
              id="type"
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="direct">Direct</option>
              <option value="group">Group</option>
              <option value="department">Department</option>
            </select>
          </div>
          {form.type === "direct" && (
            <Input id="memberId" label="Member User ID" value={form.memberId} onChange={(e) => setForm((prev) => ({ ...prev, memberId: e.target.value }))} />
          )}
          {form.type === "group" && (
            <>
              <Input id="name" label="Group Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <Input id="memberIds" label="Member IDs (comma separated)" value={form.memberIds} onChange={(e) => setForm((prev) => ({ ...prev, memberIds: e.target.value }))} />
            </>
          )}
          {form.type === "department" && (
            <>
              <Input id="departmentId" label="Department ID" value={form.departmentId} onChange={(e) => setForm((prev) => ({ ...prev, departmentId: e.target.value }))} />
              <Input id="name" label="Display Name (optional)" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </>
          )}
          <Button type="submit" isLoading={loading}>Create</Button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 flex flex-col">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {activeConversation ? conversationLabel(activeConversation) : "Select a conversation"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {activeConversation && messages.length === 0 && (
            <p className="text-sm text-slate-500">No messages yet.</p>
          )}
          {messages.map((message) => {
            const senderId = message.sender?._id || message.sender;
            const isMine = String(senderId) === String(user?._id);
            return (
            <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[70%] rounded-lg px-3 py-2 text-sm bg-slate-100">
                <p className="text-slate-900">{message.content}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )})}
        </div>

        {activeConversation && (
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 flex gap-2">
            <Input
              id="messageInput"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button type="submit" isLoading={loading}>Send</Button>
          </form>
        )}

        {!activeConversation && (
          <div className="text-sm text-slate-500 pt-6">Choose a conversation to start chatting.</div>
        )}

        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default Chat;
