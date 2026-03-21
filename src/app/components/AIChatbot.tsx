import { useState } from "react";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = input;
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, context: null }),
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
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the server. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-surface-container-lowest rounded-2xl shadow-2xl z-50 flex flex-col max-h-[600px] overflow-hidden border border-outline-variant/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold font-headline">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-low">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-container-lowest text-on-surface shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-4 bg-surface-container-low space-y-2">
              <p className="text-xs text-muted-foreground">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuery(query)}
                    className="text-xs px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
