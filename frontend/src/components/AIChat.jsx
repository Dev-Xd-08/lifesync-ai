import { useState } from "react";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your LifeSync AI. Ask me about your expenses, documents, tasks, or health records!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const updatedMessages = [...messages, { role: "user", text: userText }];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "No reply from assistant." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error connecting to server. Is backend running?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 flex h-[420px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-xl border-b border-slate-200 bg-slate-50 p-4">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold text-slate-900">LifeSync Copilot</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                msg.role === "user"
                  ? "bg-slate-300 text-slate-700"
                  : "bg-slate-900 text-white"
              }`}
            >
              {msg.role === "user" ? "ME" : "AI"}
            </div>
            <div
              className={`rounded-2xl p-3 text-sm ${
                msg.role === "user"
                  ? "rounded-tr-none bg-slate-900 text-white"
                  : "rounded-tl-none bg-slate-100 text-slate-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-slate-400"></span>
            LifeSync AI is thinking...
          </div>
        )}
      </div>

      {/* Form Input */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about expenses, documents, or tasks..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AIChat;