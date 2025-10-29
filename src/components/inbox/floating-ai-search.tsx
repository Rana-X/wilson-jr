"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Send, Bot, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { mockChatHistory } from "@/lib/mock-data";

export function FloatingAISearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isExpanded &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleSend = () => {
    if (inputValue.trim()) {
      // Handle send (would add to chat history in real implementation)
      console.log("Sending:", inputValue);
      setInputValue("");
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-4 right-6 z-50 bg-white border-2 border-blue-500 shadow-lg"
      animate={{
        width: isExpanded ? 400 : 320,
        height: isExpanded ? 500 : 48,
        borderRadius: isExpanded ? 16 : 24,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // COLLAPSED STATE
          <motion.button
            key="collapsed"
            onClick={() => setIsExpanded(true)}
            className="w-full h-full px-4 flex items-center gap-3 hover:shadow-xl hover:border-blue-600 transition-all duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Search className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="flex-1 text-left text-sm text-slate-500">
              Ask Wilson anything...
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
          </motion.button>
        ) : (
          // EXPANDED STATE
          <motion.div
            key="expanded"
            className="w-full h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, delay: 0.15 }}
          >
            {/* Header */}
            <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900">Chat with Wilson</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat History - Scrollable */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockChatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>

                    {msg.role === "user" && (
                      <Avatar className="h-8 w-8 bg-slate-200 flex-shrink-0 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-600" />
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="h-16 border-t border-slate-200 px-4 flex items-center gap-2 flex-shrink-0">
              <Input
                placeholder="Type your question..."
                className="flex-1 border-slate-200 focus:border-blue-500 focus-visible:ring-blue-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 h-10 w-10 flex-shrink-0"
                disabled={!inputValue.trim()}
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
