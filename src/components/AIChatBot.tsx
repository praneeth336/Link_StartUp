import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = { role: "user" | "assistant"; content: string };

const defaultResponses: Record<string, string> = {
  default:
    "I'm your AI Startup Expert! I can help you with:\n\n• **Validating startup ideas**\n• **Business model suggestions**\n• **Market analysis tips**\n• **Funding strategies**\n• **Team building advice**\n\nAsk me anything about your startup journey!",
  idea: "Great idea! Here's how to validate it:\n\n1. **Market Research** — Identify your target audience size\n2. **Competitive Analysis** — Study existing solutions\n3. **MVP Approach** — Build the smallest viable product first\n4. **User Interviews** — Talk to 20+ potential users\n5. **Revenue Model** — Define how you'll monetize\n\nWould you like me to dive deeper into any of these?",
  funding:
    "For early-stage funding, consider:\n\n• **Bootstrapping** — Self-fund initially\n• **Angel Investors** — For $25K-$500K\n• **Seed Round** — $500K-$2M from VCs\n• **Accelerators** — Y Combinator, Techstars\n• **Grants** — Government startup programs\n\nWhat stage are you at?",
  team: "Building the right team is crucial:\n\n• **CTO** — Technical co-founder for product development\n• **CMO** — Marketing expertise for growth\n• **Advisors** — Industry experts for guidance\n\nUse LINKSTART's marketplace to find skilled co-founders who complement your strengths!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("idea") || lower.includes("validate")) return defaultResponses.idea;
  if (lower.includes("fund") || lower.includes("invest") || lower.includes("money")) return defaultResponses.funding;
  if (lower.includes("team") || lower.includes("co-founder") || lower.includes("hire")) return defaultResponses.team;
  return "That's a great question! As an AI startup expert, I recommend breaking this down into actionable steps. Could you tell me more about your specific situation — your domain, stage, and goals? That way I can give you tailored advice.";
}

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: defaultResponses.default },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(userMsg.content) }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 rounded-full p-4 gradient-primary shadow-lg ${open ? "hidden" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ["0 0 20px hsl(217 91% 60% / 0.3)", "0 0 40px hsl(217 91% 60% / 0.5)", "0 0 20px hsl(217 91% 60% / 0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-6rem)] glass rounded-2xl border border-border/50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 gradient-primary">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="font-display font-semibold text-primary-foreground">Expert AI</span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-primary-foreground/80 hover:text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/60 text-foreground"
                    }`}
                  >
                    {msg.content.split("\n").map((line, j) => (
                      <span key={j}>
                        {line.replace(/\*\*(.*?)\*\*/g, "").length !== line.length
                          ? line.split(/\*\*(.*?)\*\*/).map((part, k) =>
                              k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                            )
                          : line}
                        {j < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-accent/60 rounded-xl px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about startups..."
                  className="flex-1 bg-accent/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" className="gradient-primary border-0 px-3" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
