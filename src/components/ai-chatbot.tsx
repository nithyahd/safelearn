"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  ShieldAlert, 
  ChevronRight,
  Flame,
  Waves,
  Zap,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  { text: "Earthquake safety", icon: Zap, color: "text-orange-500" },
  { text: "Fire evacuation steps", icon: Flame, color: "text-red-500" },
  { text: "Flood safety tips", icon: Waves, color: "text-blue-500" },
  { text: "Emergency kit checklist", icon: ClipboardList, color: "text-emerald-500" },
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I am SafeLearn AI. Ask me anything about disaster preparedness." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: "Sorry, I couldn't generate a response right now." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card className="mb-4 w-[350px] md:w-[400px] h-[550px] flex flex-col shadow-2xl rounded-[2rem] border-none overflow-hidden animate-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-zinc-900">
          <CardHeader className="bg-primary p-6 text-white flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-headline">SafeLearn Assistant</CardTitle>
                <p className="text-[10px] uppercase font-black tracking-widest text-white/80">AI Preparedness Expert</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-6">
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.role === "user" ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-muted/50 dark:bg-zinc-800/50 text-foreground rounded-tl-none border border-border/50"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex flex-col items-start max-w-[85%] animate-pulse">
                    <div className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-2xl rounded-tl-none border border-border/50 text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      SafeLearn Assistant is typing...
                    </div>
                  </div>
                )}

                {messages.length === 1 && !isLoading && (
                  <div className="pt-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Suggested Topics</p>
                    <div className="grid grid-cols-1 gap-2">
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(q.text)}
                          className="flex items-center gap-3 w-full p-3 rounded-xl bg-muted/30 dark:bg-zinc-800/30 hover:bg-primary/5 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-left group"
                        >
                          <div className={cn("p-1.5 rounded-lg bg-white dark:bg-zinc-900 shadow-sm", q.color)}>
                            <q.icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{q.text}</span>
                          <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative w-full"
            >
              <Input
                placeholder="Ask about safety..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="h-12 pr-12 rounded-xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 active:scale-90 flex items-center justify-center",
          isOpen ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rotate-90" : "bg-primary text-white hover:scale-110"
        )}
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
      </Button>
    </div>
  );
}
