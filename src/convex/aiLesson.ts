"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════════
// 🎓 GENERATE LESSON — équivalent serveur de /api/generate-lesson
// (Next.js → Convex action). Aucune clé API n’est exposée au
// frontend : GROQ_API_KEY (prioritaire, gratuit) puis GOOGLE_API_KEY.
// ═══════════════════════════════════════════════════════════════

const PERSONA = `Tu es « Visual Learner AI » (inspiré de Kresco.ma), un tuteur scientifique interactif, rigoureux et adaptatif de Studio ADAM. Tu guides les élèves de la filière 2BAC Sciences Mathématiques B et du cursus scientifique général.

Orientations académiques :
- Réponds avec précision, que le sujet relève du programme officiel de la classe ou qu’il le dépasse.
- Sujet HORS PROGRAMME : explique avec pédagogie puis ajoute : « 📌 Note Académique : Ce concept est hors programme pour votre année scolaire actuelle (2BAC SM B), mais sa compréhension enrichira grandement votre culture scientifique et vos capacités de raisonnement. »
- Ne devine JAMAIS une constante physique (g, c, e, NA, h...), une date ou une démonstration. Si tu n’es pas sûr, indique-le au lieu d’inventer.`;

const LESSON_RULES = `Génère un cours complet, rigoureux et conforme au programme officiel marocain. Langue : FRANÇAIS obligatoire.

Structure du contenu pédagogique :
1. summary : résumé complet en Markdown avec les définitions, théorèmes et propriétés ; formules scientifiques en notation LaTeX entre $...$ (et $$...$$ pour les formules importantes) ; chaque grande partie commence par « ### ». Ajoute des exemples concrets et des liens avec d’autres chapitres et la vie réelle.
2. key_concepts : 4 à 6 notions clés.
3. hard_exercises : 1 à 2 problèmes complexes MULTI-NOTIONS de niveau Examen National SM / Concours d’écoles d’ingénieurs, avec :
   - problem_statement : énoncé complet,
   - solution : correction détaillée étape par étape (démarche, calculs en LaTeX, résultat final),
   - common_pitfalls : pièges fréquents commis par les élèves.

RÈGLES JSON (impératif) :
- Réponds UNIQUEMENT par un objet JSON valide, sans texte autour ni balises de code.
- Dans les valeurs JSON, tout backslash LaTeX s’écrit DOUBLÉ (exemple : dans le JSON, écris \\\\star pour obtenir \\star, et \\\\frac{a}{b} pour obtenir \\frac{a}{b}). Les retours de ligne à l’intérieur d’une chaîne s’écrivent \\n.
- Le JSON doit respecter exactement ce schéma :
{
  "title": "Titre du chapitre",
  "subject": "Matière",
  "level": "Niveau",
  "summary": "Résumé complet en Markdown avec formules LaTeX $...$",
  "key_concepts": ["Notion 1", "Notion 2"],
  "hard_exercises": [
    {
      "id": "ex_01",
      "title": "Exercice de synthèse type Examen National / Concours",
      "problem_statement": "Énoncé complexe combinant plusieurs notions...",
      "solution": "Démonstration et résolution étape par étape...",
      "common_pitfalls": "Erreurs fréquentes commises par les élèves de Sciences Mathématiques."
    }
  ]
}`;

export const generateLesson = action({
  args: {
    title: v.string(),
    subject: v.string(),
    level: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const title = (args.title || "").trim();
    const subject = (args.subject || "").trim();
    const level = (args.level || "2BAC Sciences Mathématiques B").trim();

    const userPrompt = [
      `Chapitre à traiter : « ${title} »`,
      subject ? `Matière : ${subject}` : "",
      `Classe : ${level} (Maroc)`,
      "",
      LESSON_RULES,
    ]
      .filter((l) => l.length > 0)
      .join("\n");

    // ─── 1) GROQ (Llama, gratuit) — JSON mode ───
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: PERSONA },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.35,
            max_tokens: 6000,
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const status = response.status;
          if (status === 401 || status === 403) return { lesson: null, error: "INVALID_KEY", connected: false, provider: "groq" };
          if (status === 429) return { lesson: null, error: "RATE_LIMITED", connected: true, provider: "groq" };
        } else {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            const lesson = parseLesson(text, { title, subject, level });
            if (lesson) return { lesson, error: null, connected: true, provider: "groq" };
          }
        }
      } catch {
        // Basculer sur Gemini
      }
    }

    // ─── 2) GEMINI (fallback) — réponse en JSON garanti ───
    const geminiKey = process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: PERSONA }] },
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 6000,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (!response.ok) {
          const status = response.status;
          if (status === 400 || status === 403) return { lesson: null, error: "INVALID_KEY", connected: false, provider: "gemini" };
          if (status === 429) return { lesson: null, error: "RATE_LIMITED", connected: true, provider: "gemini" };
        } else {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const lesson = parseLesson(text, { title, subject, level });
            if (lesson) return { lesson, error: null, connected: true, provider: "gemini" };
          }
        }
      } catch {
        // Retour d’erreur générique ci-dessous
      }
    }

    return { lesson: null, error: "NO_API_KEY", connected: false, provider: null };
  },
});

interface LessonSeed {
  title: string;
  subject: string;
  level: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLesson(raw: string, seed: LessonSeed): Record<string, unknown> | null {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```\w*\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(text.substring(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object") return null;

  const summary = typeof obj.summary === "string" ? obj.summary : "";
  const keyConcepts = Array.isArray(obj.key_concepts)
    ? obj.key_concepts.filter((c): c is string => typeof c === "string")
    : [];
  const hardExercises = Array.isArray(obj.hard_exercises)
    ? obj.hard_exercises.filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    : [];

  // Le contenu doit être exploitable, sinon on préfère un échec propre.
  if (!summary && hardExercises.length === 0) return null;

  return {
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title : seed.title,
    subject: typeof obj.subject === "string" && obj.subject.trim() ? obj.subject : seed.subject,
    level: typeof obj.level === "string" && obj.level.trim() ? obj.level : seed.level,
    summary,
    key_concepts: keyConcepts,
    hard_exercises: hardExercises,
    lab_spec: obj.lab_spec ?? null,
  };
}

export const apiStatus = action({
  args: {},
  handler: async () => {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GOOGLE_API_KEY;
    return { groq: !!groqKey, gemini: !!geminiKey, connected: !!(groqKey || geminiKey) };
  },
});
