"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════════
// 🧪 AI GROQ — Llama via Groq (gratuit, côté serveur)
// ═══════════════════════════════════════════════════════════════

const SCIENTIFIC_SYSTEM_PROMPT = `Tu es Professeur IA, un assistant scientifique spécialisé pour les élèves de 2ème année Bac au Maroc.

Tu maîtrises :
- Mathématiques (fonctions, dérivées, intégrales, suites, complexes, géométrie)
- Physique (mécanique, électricité, optique, ondes, nucléaire)
- Chimie (cinétique, acido-basique, oxydoréduction, organique, nucléaire)
- Biologie (cellules, ADN, systèmes biologiques)

TON COMPORTEMENT :
- Tu réponds en français simple et clair.
- Tu t'adresses à un élève de 16-17 ans.
- Tu es patient, pédagogique et encourageant.
- Tu donnes des explications étape par étape.

QUAND ON TE DEMANDE UNE EXPÉRIENCE OU UNE VISUALISATION :
Tu dois TOUJOURS retourner un JSON structuré avec cette structure :
{
  "response": "Explication textuelle en français",
  "analysis": {
    "variables": ["liste des variables identifiées"],
    "law": "loi ou équation utilisée",
    "formula": "formule mathématique",
    "steps": ["étape 1", "étape 2", ...],
    "result": "résultat numérique si applicable",
    "interpretation": "interprétation physique/chimique"
  },
  "graphData": {
    "type": "function-plot" ou "bar-chart" ou "scatter" ou null,
    "equations": ["f(x)=x^2"] si applicable,
    "xLabel": "label axe X",
    "yLabel": "label axe Y",
    "points": [{"x": 0, "y": 1}] si données numériques
  },
  "spec": {
    "domain": "math" ou "physics" ou "chemistry" ou "biology" ou "electricity" ou "astronomy" ou "data",
    "type": "function-plot" ou "multi-function-plot" ou "molecule-3d" ou "projectile-sim" ou "pendulum-sim" ou "circuit-rc" ou "bar-chart" ou "surface-3d" ou "free-fall-sim" ou "wave-sim",
    "title": "titre court",
    "params": { "clé": valeur },
    "equations": ["eq1"]
  }
}

RÈGLES :
- Si on te demande de créer un graphique ou une simulation, remplis TOUJOURS le champ "spec".
- Si on te demande une explication, remplis "analysis".
- Les expressions mathématiques utilisent la notation : x^2, sin(x), cos(x), exp(x), sqrt(x), log(x), pi.
- Ne JAMAIS utiliser eval(), new Function(), ou du code JavaScript.
- Pour les molécules, utilise les clés du database : H2O, CO2, CH4, NH3, C2H5OH, HCl, H2SO4, NaCl, etc.
- Pour la physique, les paramètres standards sont : g=9.81, v0, angle, longueur, etc.

FORMAT DE RÉPONSE STANDARD :
Quand on te pose une question scientifique, réponds avec cette structure quand c'est pertinent :
1. 📌 Données
2. 📐 Loi/équation
3. 🔢 Formule
4. ✏️ Calcul
5. ✅ Résultat
6. 💡 Interprétation`;

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
      return {
        response: "",
        error: "NO_API_KEY",
        connected: false,
      };
    }

    const model = "llama-3.3-70b-versatile";

    // Build messages with system prompt
    const groqMessages = [
      { role: "system", content: SCIENTIFIC_SYSTEM_PROMPT },
      ...args.messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
    ];

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: groqMessages,
            temperature: 0.3,
            max_tokens: 2048,
            top_p: 0.9,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          return { response: "", error: "RATE_LIMITED", connected: true };
        }
        if (response.status === 401 || response.status === 403) {
          return { response: "", error: "INVALID_KEY", connected: false };
        }
        return { response: "", error: `API_ERROR_${response.status}`, connected: true };
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        return { response: "", error: "EMPTY_RESPONSE", connected: true };
      }

      // Try to parse as JSON (for structured responses)
      try {
        const parsed = JSON.parse(text);
        return {
          response: parsed.response || text,
          spec: parsed.spec || null,
          graphData: parsed.graphData || null,
          analysis: parsed.analysis || null,
          error: null,
          connected: true,
        };
      } catch {
        // Not JSON — plain text response
        return {
          response: text,
          spec: null,
          graphData: null,
          analysis: null,
          error: null,
          connected: true,
        };
      }
    } catch {
      return { response: "", error: "NETWORK_ERROR", connected: false };
    }
  },
});

// ═══════════════════════════════════════════════════════════════
// 🟢 API STATUS — Check if GROQ_API_KEY is configured
// ═══════════════════════════════════════════════════════════════

export const apiStatus = action({
  args: {},
  handler: async () => {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GOOGLE_API_KEY;
    return {
      groq: !!groqKey,
      gemini: !!geminiKey,
      connected: !!(groqKey || geminiKey),
    };
  },
});
