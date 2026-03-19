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

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setInput("");
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const getAIResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();

    if (lowercaseQuery.includes("high") || lowercaseQuery.includes("risk score")) {
      return "The medium risk score of 56 is primarily due to: (1) A 15% revenue mismatch between GST returns and bank credits, (2) Debt ratio of 0.68 which is higher than the industry average of 0.52, and (3) Cash flow irregularities detected in Q3. However, the company shows consistent 18% YoY growth which is a positive indicator.";
    } else if (lowercaseQuery.includes("anomal")) {
      return "We detected several anomalies: (1) Revenue mismatch - GST shows ₹1.18 Cr but bank credits only show ₹1.05 Cr, a difference of ₹13 lakhs, (2) Unusual transaction patterns in Q3 with irregular cash flow timing, and (3) Higher debt accumulation compared to industry peers. These require further investigation.";
    } else if (lowercaseQuery.includes("loan") && lowercaseQuery.includes("reduc")) {
      return "The loan amount was reduced from ₹50 lakhs to ₹35 lakhs (70% of requested) due to the medium risk classification. The company's debt ratio of 0.68 indicates they already have significant leverage, so approving the full amount could strain their debt servicing capacity. This conservative approach protects both the lender and the borrower.";
    } else if (lowercaseQuery.includes("mismatch") || lowercaseQuery.includes("revenue")) {
      return "The revenue mismatch of 15% (₹13 lakhs difference) between GST and bank records could indicate: (1) Delayed payments from customers, (2) Non-cash transactions not reflected in bank statements, (3) Potential revenue recognition timing differences, or (4) Errors in data reporting. This requires clarification from the applicant.";
    } else {
      return "I can help you understand the credit risk analysis better. Try asking about specific aspects like the risk score, anomalies, financial ratios, or recommendations. You can also click on the suggested questions below.";
    }
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
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-[20px] shadow-2xl border border-[#e5e5e5] z-50 flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5] bg-gradient-to-r from-[#00b386] to-[#059669] rounded-t-[20px]">
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
                  className={`max-w-[80%] rounded-xl p-3 ${
                    msg.role === "user"
                      ? "bg-[#00b386] text-white"
                      : "bg-[#f5f5f5] text-[#1a1a1a]"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
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
                    className="text-left px-3 py-2 bg-[#e5f7f3] text-[#00b386] rounded-lg hover:bg-[#d1fae5] transition-colors text-xs"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-[#e5e5e5]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent"
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
