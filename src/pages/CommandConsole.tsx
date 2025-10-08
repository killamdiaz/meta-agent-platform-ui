import { useState } from "react";
import { Plus, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CommandConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Agent created successfully. Marketing Agent is now active and ready to handle outreach tasks.",
        "Task assigned to Sales Agent. Expected completion in 2 hours.",
        "Finance Agent has updated the revenue dashboard with the latest figures.",
        "Support Agent is now monitoring customer inquiries in real-time.",
      ];
      const assistantMessage: Message = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-atlas-glow" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-4xl font-normal">
                <span className="text-atlas-glow">Hello, Founder</span>
              </h1>
              <p className="text-3xl font-normal text-muted-foreground/80">What should we build today?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl">
              {[
                "Create a Marketing Agent to handle outreach",
                "Show me all active agents and their tasks",
                "Generate a sales report for this week",
                "Set up automated customer support",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="p-4 text-left text-sm border border-border rounded-xl hover:border-atlas-glow/50 hover:bg-muted/30 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-atlas-glow/20 text-foreground ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-atlas-glow animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-atlas-glow animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-atlas-glow animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-[28px] hover:border-border transition-colors">
            <div className="flex items-center gap-3 px-5 py-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-transparent h-9 w-9"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Atlas Core..."
                className="flex-1 bg-transparent border-0 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Tools</span>
              </button>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-transparent h-9 w-9"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
