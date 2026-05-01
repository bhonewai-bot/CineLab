import OpenAI from "openai";
import { tools } from "./tools";
import { handleToolCall } from "./handlers";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const MODEL = "qwen/qwen-plus";
const MAX_TOOL_ROUNDS = 5;

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
- Tone: friendly and natural

Language:
- Detect the language the user is writing in and always reply in that same language
- If the user writes in Burmese (မြန်မာဘာသာ), respond fully in Burmese
- Movie titles can be kept in their original English title followed by a Burmese transliteration if helpful`;

type Message = OpenAI.Chat.ChatCompletionMessageParam;

// Type guard — only process standard function tool calls
function isFunctionToolCall(
  toolCall: OpenAI.Chat.ChatCompletionMessageToolCall,
): toolCall is OpenAI.Chat.ChatCompletionMessageToolCall & {
  type: "function";
  function: { name: string; arguments: string };
} {
  return toolCall.type === "function";
}

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

    // Execute all tool calls in parallel — skip non-function types
    const toolResults = await Promise.all(
      message.tool_calls
        .filter(isFunctionToolCall)
        .map(async (toolCall) => {
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

    fullMessages.push(...toolResults);
  }

  return "Sorry, I couldn't complete the request. Please try again.";
}
