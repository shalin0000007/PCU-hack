import { useState } from "react";
import { X, Send, Sparkles } from "lucide-react";

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
        { role: "assistant", content: "Sorry, I am having trouble connecting to the server." }
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-surface-container-lowest rounded-2xl shadow-[0_12px_32px_rgba(42,52,57,0.15)] z-50 flex flex-col max-h-[600px] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-primary">
            <div className="flex items-center gap-2 text-primary-foreground">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold font-['Manrope']">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-low">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    msg.role === "user"
                      ? "bg-tertiary text-tertiary-foreground"
                      : "bg-surface-container-lowest text-foreground shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-['Inter']">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-4 bg-surface-container-low space-y-2">
              <p className="text-xs text-muted-foreground font-['Inter']">Suggested questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuery(query)}
                    className="text-left px-3 py-2 bg-tertiary-container text-on-tertiary-container rounded-lg hover:bg-tertiary-container/80 transition-colors text-xs font-semibold font-['Inter']"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-foreground placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground rounded-xl transition-colors"
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
