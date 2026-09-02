"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════════
// 🤖 AI CHAT — Gemini conversation (server-side)
// ═══════════════════════════════════════════════════════════════

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("model")),
        parts: v.array(v.object({ text: v.string() })),
      })
    ),
    systemPrompt: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return {
        response: "",
        error: "NO_API_KEY",
        connected: false,
      };
    }

    const model = "gemini-2.0-flash";

    const requestBody = {
      system_instruction: {
        parts: [{ text: args.systemPrompt }],
      },
      contents: args.messages,
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        // Rate limit
        if (response.status === 429) {
          return {
            response: "",
            error: "RATE_LIMITED",
            connected: true,
          };
        }
        // Invalid key
        if (response.status === 400 || response.status === 403) {
          return {
            response: "",
            error: "INVALID_KEY",
            connected: false,
          };
        }
        return {
          response: "",
          error: `API_ERROR_${response.status}`,
          connected: true,
        };
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return {
          response: "",
          error: "EMPTY_RESPONSE",
          connected: true,
        };
      }

      return {
        response: text,
        error: null,
        connected: true,
      };
    } catch (fetchError) {
      return {
        response: "",
        error: "NETWORK_ERROR",
        connected: false,
      };
    }
  },
});

// ═══════════════════════════════════════════════════════════════
// 🟢 API STATUS — Check if GOOGLE_API_KEY is configured
// ═══════════════════════════════════════════════════════════════

export const apiStatus = action({
  args: {},
  handler: async () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    return {
      configured: !!apiKey,
      keyPreview: apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : null,
    };
  },
});
