"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes ping-slow {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes ping-slower {
          0%   { transform: scale(1);   opacity: 0.35; }
          70%  { transform: scale(1.85); opacity: 0; }
          100% { transform: scale(1.85); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin-in  { from { transform: rotate(-90deg) scale(0.5); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
        @keyframes spin-out { from { transform: rotate(0deg)   scale(1);   opacity: 1; } to { transform: rotate(90deg) scale(0.5); opacity: 0; } }

        .ai-btn-ring-1 { animation: ping-slow   2s cubic-bezier(0,0,0.2,1) infinite; }
        .ai-btn-ring-2 { animation: ping-slower 2s cubic-bezier(0,0,0.2,1) infinite 0.4s; }

        .ai-btn-shimmer {
          background: linear-gradient(
            105deg,
            #e50914 0%, #ff2d1a 30%, #ff6b35 50%, #ff2d1a 70%, #e50914 100%
          );
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .icon-spin-in  { animation: spin-in  0.25s ease forwards; }
        .icon-spin-out { animation: spin-out 0.25s ease forwards; }
      `}</style>

      {/* Floating button — bottom-right on mobile (above nav) and desktop */}
      <div className="fixed z-[60] bottom-20 right-6 md:bottom-6">
        {!open && (
          <>
            <span className="ai-btn-ring-1 absolute inset-0 rounded-full bg-[#e50914] block pointer-events-none" />
            <span className="ai-btn-ring-2 absolute inset-0 rounded-full bg-[#e50914] block pointer-events-none" />
          </>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="relative w-14 h-14 rounded-full text-white flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_32px_rgba(229,9,20,0.75)] active:scale-90 transition-all duration-200 overflow-hidden ai-btn-shimmer"
          style={{ transform: open ? "scale(1.05)" : "scale(1)" }}
          aria-label="Open AI movie assistant"
        >
          <span key={open ? "close" : "bot"} className="material-symbols-outlined text-2xl icon-spin-in">
            {open ? "close" : "smart_toy"}
          </span>
        </button>
      </div>

      {/* Chat panel
          Mobile:  centered horizontally, w-[calc(100%-32px)], bottom sits 16px above the button top
          Desktop: anchored bottom-right, fixed 380px width
          Button is bottom-20 (80px) + h-14 (56px) = top at 136px from bottom → panel bottom = 136 + 16 = 152px
      */}
      {open && (
        <div className="
          fixed z-[60] flex flex-col overflow-hidden
          bg-[#1c1b1b] border border-zinc-800 shadow-2xl rounded-2xl

          bottom-[152px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-h-[60vh]

          md:bottom-24 md:left-auto md:right-6 md:translate-x-0 md:w-[380px] md:max-h-[600px]
        ">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#201f1f] border-b border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-[#e50914] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-base">
                smart_toy
              </span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Cinelab AI</p>
              <p className="text-zinc-500 text-xs">Powered by Qwen</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-zinc-600 text-5xl block mb-3">
                  movie_filter
                </span>
                <p className="text-zinc-500 text-sm">
                  Ask me anything about movies!
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {[
                    "What's trending this week?",
                    "Movies like Inception",
                    "Tell me about Interstellar",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-xs text-zinc-400 bg-[#2a2a2a] hover:bg-[#353534] px-3 py-2 rounded-lg transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#e50914] text-white rounded-tr-sm"
                      : "bg-[#2a2a2a] text-[#e5e2e1] rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-800 bg-[#201f1f]">
            <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-xl px-4 py-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any movie..."
                className="flex-1 bg-transparent text-sm text-[#e5e2e1] placeholder:text-zinc-600 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="text-[#e50914] disabled:text-zinc-600 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
