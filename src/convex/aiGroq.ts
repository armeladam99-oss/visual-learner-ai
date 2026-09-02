"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

const SYSTEM_PROMPT = [
  "Tu es Professeur IA, un assistant scientifique pour les eleves de 2eme annee Bac au Maroc.",
  "Tu maitrises : Mathematiques, Physique, Chimie, Biologie.",
  "",
  "REGLE ABSOLUE - FORMAT DE REPONSE :",
  "Pour TOUTE demande scientifique, Tu DOIS retourner UNIQUEMENT un JSON valide (pas de texte avant/apres, pas de markdown, pas de code blocks).",
  "",
  "Le JSON a cette forme :",
  '{"response": "Explication en francais avec les etapes", "spec": {"domain": "math", "type": "function-plot", "title": "Titre", "description": "Desc", "params": {"expr": "x^2", "xMin": -10, "xMax": 10}, "equations": ["f(x) = x2"]}}',
  "",
  "DOMAINES ET TYPES DISPONIBLES :",
  "MATHS :",
  '- function-plot : params { "expr": "x^2", "xMin": -10, "xMax": 10 }',
  '- multi-function-plot : params { "functions": ["x^2", "2*x+1"], "labels": ["f(x)", "g(x)"], "xMin": -10, "xMax": 10 }',
  '- derivative-plot : params { "expr": "x^3", "xMin": -5, "xMax": 5 }',
  '- surface-3d : params { "expr": "sin(sqrt(x^2+y^2))", "xMin": -5, "xMax": 5, "yMin": -5, "yMax": 5 }',
  "",
  "PHYSIQUE :",
  '- projectile-sim : params { "v0": 20, "angle": 45, "g": 9.81 }',
  '- free-fall-sim : params { "h0": 20, "g": 9.81 }',
  '- pendulum-sim : params { "length": 1, "angle0": 30, "g": 9.81 }',
  '- wave-sim : params { "amplitude": 1, "frequency": 2, "speed": 5 }',
  "",
  "CHIMIE :",
  '- molecule-3d : params { "molecule": "H2O" }',
  "",
  "ELECTRICITE :",
  '- circuit-rc : params { "R": 100, "C": 100, "U0": 5 }',
  "",
  "DONNEES :",
  '- bar-chart : params { "data": [12, 25, 18], "labels": ["A", "B", "C"] }',
  "",
  "EXEMPLES :",
  'Utilisateur: "Trace f(x)=x2-3x+2"',
  '-> JSON: {"response": "...", "spec": {"domain":"math","type":"function-plot","title":"f(x)=x2-3x+2","params":{"expr":"x^2-3*x+2","xMin":-10,"xMax":10}}}',
  "",
  'Utilisateur: "Compare sin(x) et cos(x)"',
  '-> JSON: {"response": "...", "spec": {"domain":"math","type":"multi-function-plot","title":"sin(x) vs cos(x)","params":{"functions":["sin(x)","cos(x)"],"labels":["sin(x)","cos(x)"],"xMin":-10,"xMax":10}}}',
  "",
  'Utilisateur: "Cree un projectile a 20 m/s angle 45"',
  '-> JSON: {"response": "...", "spec": {"domain":"physics","type":"projectile-sim","title":"Projectile","params":{"v0":20,"angle":45,"g":9.81}}}',
  "",
  'Utilisateur: "Montre H2O en 3D"',
  '-> JSON: {"response": "...", "spec": {"domain":"chemistry","type":"molecule-3d","title":"H2O","params":{"molecule":"H2O"}}}',
  "",
  'Utilisateur: "Explique les derivees"',
  '-> JSON: {"response": "explication texte", "spec": null}',
  "",
  'Utilisateur: "Salut"',
  '-> JSON: {"response": "reponse naturelle", "spec": null}',
  "",
  "NOTATION MATHEMATIQUE : x^2, sin(x), cos(x), exp(x), sqrt(x), log(x), abs(x), pi",
  "",
  "REGLES :",
  "- NE JAMAIS inclure de backticks dans ta reponse",
  "- Retourner UNIQUEMENT le JSON brut",
  "- Si pas de visualisation, mets spec: null",
  "- Pour les sujets non-scientifiques, reponds naturellement mais TOUJOURS en JSON",
].join("\n");

function stripCodeBlocks(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\w*\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  }
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  return cleaned.trim();
}

export const groqChat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { response: "", error: "NO_API_KEY", connected: false };
    }

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...args.messages.map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ];

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          temperature: 0.2,
          max_tokens: 2048,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return { response: "", error: "RATE_LIMITED", connected: true };
        if (response.status === 401 || response.status === 403) return { response: "", error: "INVALID_KEY", connected: false };
        return { response: "", error: `API_ERROR_${response.status}`, connected: true };
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) return { response: "", error: "EMPTY_RESPONSE", connected: true };

      try {
        const cleaned = stripCodeBlocks(text);
        const parsed = JSON.parse(cleaned);
        return {
          response: parsed.response || "",
          spec: parsed.spec || null,
          graphData: parsed.graphData || null,
          analysis: parsed.analysis || null,
          error: null,
          connected: true,
        };
      } catch {
        return { response: text, spec: null, graphData: null, analysis: null, error: null, connected: true };
      }
    } catch {
      return { response: "", error: "NETWORK_ERROR", connected: false };
    }
  },
});

export const apiStatus = action({
  args: {},
  handler: async () => {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GOOGLE_API_KEY;
    return { groq: !!groqKey, gemini: !!geminiKey, connected: !!(groqKey || geminiKey) };
  },
});
