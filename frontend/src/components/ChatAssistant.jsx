import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Bot, User, Send, X, Loader2 } from "lucide-react";

// A small component for the "is typing" animation
const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="p-2 bg-slate-200 rounded-full">
      <Bot className="w-5 h-5 text-slate-600" />
    </div>
    <div className="flex items-center space-x-1.5 bg-slate-200 px-4 py-3 rounded-2xl rounded-bl-none">
      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-0"></span>
      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-300"></span>
    </div>
  </div>
);

export default function ChatAssistant({ user }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);
  const location = useLocation();

  const isFullPage = location.pathname === "/mentor";

  // Add an initial greeting from the AI mentor
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text: "Hello! I'm your AI Mentor. How can I help you with your learning goals today?",
        },
      ]);
    }
  }, []);

  const send = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setPrompt(""); // Clear prompt immediately

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`,
        {
          prompt: `User profile: ${JSON.stringify(
            user
          )}\nUser message: ${prompt}`,
        }
      );

      const assistantMessage = {
        role: "assistant",
        text: (res.data.text || "⚠️ No response from assistant.")
          .replace(/^\* /gm, "• ")
          .replace(/\*/g, ""),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Error: I couldn't get a response. Please check the connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ChatUI = (
    <div
      className={`${
        isFullPage
          ? "w-full h-[70vh]" // Adjusted height for better balance
          : "w-[22rem] sm:w-[26rem] h-[36rem]"
      } flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-slate-100 to-white/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-inner">
            <Bot size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">AI Mentor</h2>
        </div>
        {!isFullPage && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="p-2 bg-slate-200 rounded-full self-start">
                <Bot className="w-5 h-5 text-slate-600" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-2.5 text-sm whitespace-pre-wrap rounded-2xl shadow-sm transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-lg"
                  : "bg-white text-slate-800 rounded-bl-lg"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="p-2 bg-blue-100 rounded-full self-start">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && send()}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-slate-400"
            placeholder="Ask your AI mentor..."
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !prompt.trim()}
            className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return isFullPage ? (
    <div className="min-h-[90vh] w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="absolute left-[3vw] top-[13vh]">
        <Link
          to="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
        </div>
        {/* <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Chat with your AI Mentor
          </h1>
        </div> */}
        {ChatUI}
      </div>
    </div>
  ) : (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        ChatUI
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-110 hover:rotate-6 duration-300"
          title="Open AI Mentor"
        >
          <Bot size={32} />
        </button>
      )}
    </div>
  );
}
