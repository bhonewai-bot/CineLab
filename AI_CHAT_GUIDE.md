# 🎬 AI Movie Chat — Step-by-Step Implementation Guide

## Overview

We're adding an AI chat assistant that uses Qwen 3 with tool calling to answer
movie questions using real TMDB data.

**Stack:**

- Qwen API (OpenAI-compatible)
- `openai` npm package (already installed)
- Anthropic tool-calling pattern
- Next.js Route Handler as the backend entry point

---

## Final File Structure

```
lib/
└── ai/
    ├── tools.ts          ← Step 1: Tool schema definitions
    ├── handlers.ts       ← Step 2: Tool execution (calls lib/tmdb.ts)
    └── chat.ts           ← Step 3: AI orchestration loop

app/
└── api/
    └── ai/
        └── chat/
            └── route.ts  ← Step 4: POST /api/ai/chat

components/
└── AiChat.tsx            ← Step 5: Chat UI (client component)

app/
└── layout.tsx            ← Step 6: Mount AiChat in layout
```

---

## Step 1 — Tool Definitions (`lib/ai/tools.ts`)

Create the file `lib/ai/tools.ts`:

```ts
export const tools = [
  {
    type: "function",
    function: {
      name: "search_movies",
      description: "Search movies by title, keyword, actor, or director name",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query e.g. 'Inception', 'Christopher Nolan', 'romantic comedy 2024'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_movie_details",
      description:
        "Get full details about a specific movie including cast, runtime, budget, and trailer",
      parameters: {
        type: "object",
        properties: {
          movie_id: {
            type: "string",
            description: "The TMDB movie ID (from search results)",
          },
        },
        required: ["movie_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_similar_movies",
      description: "Get movies similar to a specific movie",
      parameters: {
        type: "object",
        properties: {
          movie_id: {
            type: "string",
            description: "The TMDB movie ID to find similar movies for",
          },
        },
        required: ["movie_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_trending_movies",
      description: "Get the current trending movies this week",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];
```

---

## Step 2 — Tool Handlers (`lib/ai/handlers.ts`)

Create the file `lib/ai/handlers.ts`:

```ts
import {
  searchMovies,
  getMovieDetail,
  getSimilarMovies,
  getTrendingMovies,
} from "@/lib/tmdb";

// Normalize movie data before returning to AI — keep it clean and small
function normalizeMovie(m: {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string;
}) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date?.slice(0, 4) ?? "Unknown",
    rating: Math.round((m.vote_average ?? 0) * 10) / 10,
    overview: m.overview ?? "",
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
      : null,
  };
}

export async function handleToolCall(
  name: string,
  args: Record<string, string>,
): Promise<unknown> {
  switch (name) {
    case "search_movies": {
      const data = await searchMovies(args.query);
      return data.results.slice(0, 7).map(normalizeMovie);
    }

    case "get_movie_details": {
      const movie = await getMovieDetail(args.movie_id);
      const director = movie.credits?.crew?.find((c) => c.job === "Director");
      const trailer = movie.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      return {
        id: movie.id,
        title: movie.title,
        tagline: movie.tagline,
        year: movie.release_date?.slice(0, 4),
        rating: Math.round(movie.vote_average * 10) / 10,
        runtime: movie.runtime
          ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
          : null,
        overview: movie.overview,
        genres: movie.genres?.map((g) => g.name) ?? [],
        director: director?.name ?? null,
        cast: movie.credits?.cast?.slice(0, 5).map((c) => c.name) ?? [],
        budget: movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : null,
        revenue:
          movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : null,
        trailer: trailer ? `https://youtube.com/watch?v=${trailer.key}` : null,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : null,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/movies/${movie.id}`,
      };
    }

    case "get_similar_movies": {
      const movies = await getSimilarMovies(args.movie_id);
      return movies.slice(0, 7).map(normalizeMovie);
    }

    case "get_trending_movies": {
      const movies = await getTrendingMovies();
      return movies.slice(0, 7).map(normalizeMovie);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
```

---

## Step 3 — AI Chat Orchestration (`lib/ai/chat.ts`)

Create the file `lib/ai/chat.ts`:

```ts
import OpenAI from "openai";
import { tools } from "./tools";
import { handleToolCall } from "./handlers";

const client = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const MODEL = "qwen-plus";
const MAX_TOOL_ROUNDS = 5; // prevent infinite loops

const SYSTEM_PROMPT = `You are a movie assistant integrated into Cinelab, a TMDb-powered movie platform.

Rules:
- NEVER hallucinate movie data — ALWAYS use tools when movie data is needed
- If a movie is mentioned by the user, search it first before answering
- Prefer real results from tools over generic answers

Capabilities:
- Search movies by title, actor, director, or keyword
- Get detailed movie info (cast, runtime, budget, trailer)
- Recommend similar movies
- Show what's trending

Behavior:
- If the user's intent is clear → call the right tool immediately
- If unclear → ask one short clarifying question
- Chain tools when needed (e.g. search first, then get details)

Response format:
- Use bullet points for lists
- Include title, year, and rating for each movie
- Keep responses concise — max 5–7 movies per list
- When linking to a movie, use its url field from tool results
- Tone: friendly and natural`;

type Message = OpenAI.Chat.ChatCompletionMessageParam;

export async function runChat(messages: Message[]): Promise<string> {
  const fullMessages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: fullMessages,
      tools: tools as OpenAI.Chat.ChatCompletionTool[],
      tool_choice: "auto",
    });

    const message = response.choices[0].message;

    // No tool calls — final answer ready
    if (!message.tool_calls || message.tool_calls.length === 0) {
      return message.content ?? "Sorry, I couldn't generate a response.";
    }

    // Push assistant message with tool calls
    fullMessages.push(message);

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      message.tool_calls.map(async (toolCall) => {
        const args = JSON.parse(toolCall.function.arguments) as Record<
          string,
          string
        >;
        const result = await handleToolCall(toolCall.function.name, args);
        return {
          role: "tool" as const,
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        };
      }),
    );

    // Push all tool results
    fullMessages.push(...toolResults);
  }

  return "Sorry, I couldn't complete the request. Please try again.";
}
```

---

## Step 4 — API Route (`app/api/ai/chat/route.ts`)

Create the directory `app/api/ai/chat/` and the file `route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { runChat } from "@/lib/ai/chat";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 },
      );
    }

    const reply = await runChat(messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
```

---

## Step 5 — Chat UI (`components/AiChat.tsx`)

Create `components/AiChat.tsx`:

```tsx
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
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-2xl hover:brightness-110 transition-all active:scale-95"
        aria-label="Open AI movie assistant"
      >
        <span className="material-symbols-outlined text-2xl">
          {open ? "close" : "smart_toy"}
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden bg-[#1c1b1b] border border-zinc-800 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#201f1f] border-b border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-[#e50914] flex items-center justify-center">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[440px]">
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
```

---

## Step 6 — Mount in Layout (`app/layout.tsx`)

Add `AiChat` to your root layout:

```tsx
import AiChat from "@/components/AiChat";

// inside the <body> tag, at the very end:
<body>
  {children}
  <AiChat />
</body>;
```

---

## Step 7 — Create the directories and files

Run these in your terminal:

```bash
# Create lib/ai directory
mkdir -p lib/ai

# Create app/api/ai/chat directory
mkdir -p app/api/ai/chat
```

Then create these files manually in your editor:

1. `lib/ai/tools.ts`
2. `lib/ai/handlers.ts`
3. `lib/ai/chat.ts`
4. `app/api/ai/chat/route.ts`
5. `components/AiChat.tsx`
6. Update `app/layout.tsx`

---

## Step 8 — Test

Test the API directly in the browser or Postman first:

```
POST http://localhost:3000/api/ai/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "What's trending this week?" }
  ]
}
```

Expected response:

```json
{
  "reply": "Here are the trending movies this week:\n\n• **Movie Title** (2024) — ⭐ 8.2\n..."
}
```

---

## Checklist

- [ ] Step 1: `lib/ai/tools.ts` created
- [ ] Step 2: `lib/ai/handlers.ts` created
- [ ] Step 3: `lib/ai/chat.ts` created
- [ ] Step 4: `app/api/ai/chat/route.ts` created
- [ ] Step 5: `components/AiChat.tsx` created
- [ ] Step 6: `app/layout.tsx` updated
- [ ] Step 7: Directories created via terminal
- [ ] Step 8: API tested in Postman
- [ ] Step 9: Chat UI tested in browser

---

## Common Issues

**"QWEN_API_KEY is undefined"**
→ Make sure it's in `.env.local` not `.env`, then restart dev server.

**Tool calls not working**
→ Check that `qwen-plus` supports tool calling in your region.
→ Try `qwen-turbo` as alternative.

**Empty reply from AI**
→ Check the `MAX_TOOL_ROUNDS` limit isn't being hit.
→ Add `console.log` in `chat.ts` to debug the tool loop.

**CORS errors**
→ The fetch is server-side so no CORS issues. If you see them, check the baseURL.
