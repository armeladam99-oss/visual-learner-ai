"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════════
// 🧪 GEMINI → LAB SPEC — Transforme une demande en LabSpec
// ═══════════════════════════════════════════════════════════════

const LAB_SPEC_SYSTEM_PROMPT = `Tu es un moteur de visualisation scientifique. Tu transformes une demande utilisateur en une LabSpec JSON valide.

RÈGLES ABSOLUES :
- Tu dois TOUJOURS retourner UNIQUEMENT un JSON valide (pas de texte avant/après)
- Le JSON doit respecter EXACTEMENT le schéma ci-dessous
- Ne JAMAIS inclure de eval(), new Function(), <script>, fetch, ou du code JavaScript
- Toutes les expressions mathématiques doivent être en notation simple : x^2, sin(x), cos(x), exp(x), sqrt(x)
- Utilise des noms de variables simples : a, b, c, x, t, etc.

SCHÉMA LabSpec :
{
  "response": "Description courte en français de ce qui est créé",
  "spec": {
    "domain": "math" | "physics" | "chemistry" | "biology" | "geometry" | "astronomy" | "electricity" | "data",
    "type": "string (voir types disponibles)",
    "title": "Titre court",
    "description": "Description",
    "params": { "clé": valeur },
    "equations": ["eq1", "eq2"],
    "scene": {
      "objects": [
        {
          "id": "string",
          "type": "sphere" | "cube" | "cylinder" | "cone" | "surface" | "curve-3d" | "vector-3d" | "molecule" | "orbit" | "projectile" | "pendulum" | "wave" | "spring" | "circuit" | "cell" | "function-plot" | "bar-chart",
          "position": [x, y, z],
          "color": "#hex",
          "label": "string",
          "props": { "clé": valeur }
        }
      ],
      "camera": { "position": [x,y,z], "target": [x,y,z], "fov": 50, "autoRotate": false },
      "grid": true,
      "axes": true
    }
  },
  "parameters": [
    { "id": "string", "name": "string", "symbol": "string", "value": number, "min": number, "max": number, "step": number, "unit": "string" }
  ]
}

TYPES DISPONIBLES PAR DOMAINE :
- math: function-plot, multi-function-plot, derivative-plot, surface-3d, curve-3d, vector-field-3d
- physics: projectile-sim, free-fall-sim, pendulum-sim, wave-sim, spring-sim
- chemistry: molecule-3d, dosage
- biology: cell-plant, cell-animal, dna-3d
- geometry: triangle-construction, circle-construction, transformation-2d
- astronomy: solar-system
- electricity: circuit-rc
- data: bar-chart

OBJETS SCÈNE 3D :
- sphere: { radius: number }
- cube: { size: number }
- cylinder: { radiusTop, radiusBottom, height }
- cone: { radius, height }
- molecule: { molecule: "H2O" | "CO2" | "CH4" | "NH3" | "C2H5OH" | etc. }
- orbit: { distance, speed, color }
- projectile: { v0, angle, g }
- pendulum: { length, angle0, g }
- wave: { amplitude, frequency, speed }
- function-plot: { expr, xMin, xMax }
- surface: { expr, xMin, xMax, yMin, yMax }

EXEMPLES :
"Trace f(x)=x²" → { "domain": "math", "type": "function-plot", "params": { "expr": "x^2", "xMin": -10, "xMax": 10 } }
"Montre H2O" → { "domain": "chemistry", "type": "molecule-3d", "params": { "molecule": "H2O" } }
"Crée une sphère" → { "domain": "math", "type": "surface-3d", "params": { "solid": "sphere", "size": 1 }, "scene": { "objects": [{ "type": "sphere", "props": { "radius": 1 } }] } }
"Chute libre 20m" → { "domain": "physics", "type": "free-fall-sim", "params": { "h0": 20, "g": 9.81 } }
"Compare sin(x) et cos(x)" → { "domain": "math", "type": "multi-function-plot", "params": { "functions": ["sin(x)", "cos(x)"], "labels": ["sin(x)", "cos(x)"] } }
"Crée une sphère rouge et un cube bleu" → scene avec 2 objets

Si la demande est une MODIFICATION (ajoute, supprime, change, modifie, déplace, fais tourner, etc.), retourne :
{
  "response": "Description de la modification",
  "command": {
    "type": "add" | "remove" | "update" | "animate" | "show" | "hide" | "reset",
    "target": "id de l'objet ou description",
    "data": { modifications }
  }
}

Si la demande est une CONVERSATION générale (pas scientifique), retourne UNIQUEMENT :
{
  "response": "Réponse conversationnelle naturelle",
  "spec": null
}`;

export const generateLabSpec = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("model")),
        parts: v.array(v.object({ text: v.string() })),
      })
    ),
    userMessage: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return {
        response: "⚠️ Google API Key non configurée. Ajoute GOOGLE_API_KEY dans les paramètres.",
        spec: null,
        command: null,
        parameters: null,
      };
    }

    // Build the conversation with system prompt
    const systemInstruction = {
      parts: [{ text: LAB_SPEC_SYSTEM_PROMPT }],
    };

    // Include recent conversation for context
    const contents = args.messages.slice(-10);

    const requestBody = {
      system_instruction: systemInstruction,
      contents,
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    };

    try {
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
        console.error("Gemini API error:", response.status, error);
        return {
          response: `Erreur Gemini: ${response.status}`,
          spec: null,
          command: null,
          parameters: null,
        };
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return {
          response: "Pas de réponse de Gemini",
          spec: null,
          command: null,
          parameters: null,
        };
      }

      // Parse the JSON response
      try {
        const parsed = JSON.parse(text);
        return {
          response: parsed.response || "",
          spec: parsed.spec || null,
          command: parsed.command || null,
          parameters: parsed.parameters || null,
        };
      } catch {
        // If not valid JSON, return as conversation
        return {
          response: text,
          spec: null,
          command: null,
          parameters: null,
        };
      }
    } catch (error) {
      console.error("Gemini fetch error:", error);
      return {
        response: "Erreur de connexion à Gemini.",
        spec: null,
        command: null,
        parameters: null,
      };
    }
  },
});
