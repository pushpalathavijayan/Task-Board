import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import api from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ChatSection() {
  const { user } = useContext(AuthContext);
  const boxRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Load messages safely
  const load = useCallback(async () => {
    try {
      const res = await api.get("/messages");

      const data = Array.isArray(res.data) ? res.data : [];

      // Oldest → newest
      setMessages([...data].reverse());

      // Scroll to bottom after DOM updates
      setTimeout(() => {
        if (boxRef.current) {
          boxRef.current.scrollTo({
            top: boxRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  }, []);

  // Initial load + auto-refresh
  useEffect(() => {
    load();
    const interval = setInterval(load, 2500);
    return () => clearInterval(interval);
  }, [load]);

  // Send message
  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post("/messages", {
        message: text,
        userName: user?.username || "Unknown",
      });

      setText("");
      load(); // Refresh after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-3">Global Chat</h3>

      {/* CHAT BOX */}
      <div
        ref={boxRef}
        className="h-64 overflow-auto mb-3 border p-2 rounded"
      >
        {messages.map((m) => {
          const username = m.userName || m.username || "Anon";
          const msg = m.message || m.text || "";
          const time = m.timestamp || m.createdAt;

          return (
            <div key={m._id} className="mb-3">
              <div className="text-sm font-medium text-blue-700">
                {username}
              </div>

              <div className="text-black">{msg}</div>

              <div className="text-xs text-gray-400">
                {time ? new Date(time).toLocaleString() : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT + SEND */}
      <form onSubmit={send} className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Say something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
