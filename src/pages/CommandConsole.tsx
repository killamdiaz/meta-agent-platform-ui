import { useState } from "react";
import { Plus, Mic, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTickets, Ticket as TicketType } from "@/data/mockTickets";
import TicketDrawer from "@/components/Console/TicketDrawer";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CommandConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTicketView, setShowTicketView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  const pendingCount = mockTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
  const closedCount = mockTickets.filter(t => t.status === 'closed').length;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

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

  const handleViewTickets = () => {
    setShowTicketView(true);
    setMessages([{
      role: "assistant",
      content: "I've loaded your tickets. Select a ticket from the panel on the right to get started. I'll help you resolve it step by step."
    }]);
  };

  const handleSelectTicket = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `**${ticket.key}: ${ticket.title}**\n\n**Priority:** ${ticket.priority}\n**Reporter:** ${ticket.reporter}\n**Status:** ${ticket.status}\n\n**Description:**\n${ticket.description}\n\nWould you like me to proceed with analyzing and fixing this issue?`
    }]);
  };

  const renderWelcome = () => (
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

      {/* Ticket Stats */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-red-400">{pendingCount}</span>
          <span className="text-sm text-muted-foreground">Pending tickets</span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-blue-400">{closedCount}</span>
          <span className="text-sm text-muted-foreground">Closed tickets</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleViewTickets}
          className="flex items-center gap-2 px-5 py-3 text-sm border border-border rounded-xl hover:border-atlas-glow/50 hover:bg-muted/30 transition-all"
        >
          <Ticket className="w-4 h-4" />
          View my tickets
        </button>
        <button
          className="flex items-center gap-2 px-5 py-3 text-sm border border-border rounded-xl hover:border-atlas-glow/50 hover:bg-muted/30 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Create new agent
        </button>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      {messages.map((message, i) => (
        <div
          key={i}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap",
              message.role === "user"
                ? "bg-atlas-glow/20 text-foreground ml-auto"
                : "bg-muted text-foreground"
            )}
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
  );

  const renderInput = () => (
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
  );

  // Split view with ticket drawer
  if (showTicketView) {
    return (
      <div className="flex h-screen gap-4 p-4">
        {/* Left: Chat Pane (3/4) */}
        <div className="flex-[3] flex flex-col bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            {renderMessages()}
          </div>
          {renderInput()}
        </div>

        {/* Right: Ticket Drawer (1/4) */}
        <div className="flex-1 min-w-[320px] max-w-[400px]">
          <TicketDrawer
            tickets={mockTickets}
            selectedTicket={selectedTicket}
            onSelectTicket={handleSelectTicket}
            onClearSelection={() => setSelectedTicket(null)}
          />
        </div>
      </div>
    );
  }

  // Default welcome view
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-8">
        {messages.length === 0 ? renderWelcome() : renderMessages()}
      </div>
      {renderInput()}
    </div>
  );
}
