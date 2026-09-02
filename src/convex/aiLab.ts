"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateVisualization = action({
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
      throw new Error("GOOGLE_API_KEY not configured.");
    }

    const requestBody = {
      system_instruction: {
        parts: [{ text: args.systemPrompt }],
      },
      contents: args.messages,
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No response from Gemini API");
    }

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(text);
      return { response: text, parsed };
    } catch {
      return { response: text, parsed: null };
    }
  },
});
