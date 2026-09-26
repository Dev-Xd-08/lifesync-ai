import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, User, RefreshCw, AlertCircle } from "lucide-react";
import api from "../services/api";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I am your LifeSync Copilot. I have authenticated access to your financial ledger, document vault, tasks, and health logs. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const promptSuggestions = [
    "⚡ Give me a daily briefing",
    "💰 What are my total expenses?",
    "🔴 Any urgent tasks or deadlines?",
    "📂 What documents are in my vault?",
    "❤️ Summarize my health vitals"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : inputValue;
    if (!query.trim() || isLoading) return;

    const userMessage = { role: "user", text: query.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await api.post("/ai/chat", { message: query });
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.data.reply || "I analyzed your records but have no specific remarks.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Unable to reach LifeSync Copilot gateway. Please ensure the backend is connected.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "ai",
        text: "Chat refreshed. How can I assist you with your life records?",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              LifeSync Copilot
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700">
              ● Context-Aware RAG Active
            </span>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Reset conversation"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-b border-slate-100 bg-slate-50/40 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Suggestions:
        </span>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-xs ${
                  isUser
                    ? "bg-slate-200 text-slate-700"
                    : "bg-slate-900 text-white"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-emerald-400" />}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-2xs ${
                  isUser
                    ? "rounded-tr-none bg-slate-900 text-white"
                    : msg.isError
                    ? "rounded-tl-none bg-red-50 text-red-800 border border-red-200"
                    : "rounded-tl-none bg-slate-100/90 text-slate-800 border border-slate-200/50"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Bot className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-100 px-4 py-3 text-sm text-slate-500 border border-slate-200/50 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              LifeSync Copilot is analyzing your vault records...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t border-slate-200/80 p-3 bg-white"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Copilot about expenses, tasks, vault files, or vitals..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-slate-800 transition disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AIChat;