import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

export default function ChatAssistant({ user }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);
  const location = useLocation();

  const isFullPage = location.pathname === "/mentor";

  const send = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`, {
        prompt: `User profile: ${JSON.stringify(user)}\nUser message: ${prompt}`,
      });

      const assistantMessage = {
        role: "assistant",
        text: res.data.text || "⚠️ No response from assistant.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error: failed to get response." },
      ]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ChatUI = (
    <div
      className={`${
        isFullPage ? "w-full h-[60vh] max-w-3xl mx-auto" : "w-[22rem] sm:w-[26rem] h-[36rem]"
      } flex flex-col bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden`}
    >
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          🎓 <span>AI Mentor</span>
        </h2>
        {!isFullPage && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-red-500 transition text-xl"
            title="Close"
          >
            ✖
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 text-sm whitespace-pre-wrap rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none animate-fade-in"
                  : "bg-slate-100 text-slate-800 rounded-bl-none animate-fade-in"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-slate-500 animate-pulse">AI is typing...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-gradient-to-r from-slate-50 to-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-slate-400"
            placeholder="Ask your AI mentor..."
          />
          <button
            onClick={send}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Back link */}
     
    </div>
  );

  return isFullPage ? (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex items-center justify-center p-4">
      {ChatUI}
    </div>
  ) : (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition transform hover:scale-105"
          title="Open AI Mentor"
        >
          🎓
        </button>
      )}
      {isOpen && ChatUI}
    </div>
  );
}
