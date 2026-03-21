import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const suggestedQueries = [
  "Why is the risk score high?",
  "Explain the anomalies detected",
  "Why was the loan amount reduced?",
  "What caused the revenue mismatch?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help explain the credit risk analysis, anomalies, and recommendations. How can I assist you?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, context: null })
      });
      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "No response generated.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I am having trouble connecting to the Fastrouter server." }
      ]);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#00b386] to-[#059669] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[20px] shadow-2xl border border-white/50 dark:border-gray-700/50 z-50 flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between p-4 border-b border-white/50 dark:border-gray-700/50 bg-gradient-to-r from-[#00b386]/90 to-[#059669]/90 backdrop-blur-sm rounded-t-[20px]">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${msg.role === "user"
                      ? "bg-gradient-to-r from-[#00b386] to-[#059669] text-white"
                      : "bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-[#1a1a1a] dark:text-white border border-white/40 dark:border-gray-700/50"
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs text-[#737373]">Suggested questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuery(query)}
                    className="text-left px-3 py-2 bg-white/60 dark:bg-[#0f766e]/40 backdrop-blur-sm border border-white/40 dark:border-[#0f766e]/50 text-[#00b386] dark:text-[#00d9a0] rounded-lg hover:bg-[#d1fae5] dark:hover:bg-[#0f766e]/60 transition-colors text-xs"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-white/50 dark:border-gray-700/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/40 dark:border-gray-600/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
