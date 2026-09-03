// ═══════════════════════════════════════════════════════════════
// 🎓 STRUCTURE « COURS IA » — contrat entre l’IA (Groq/Gemini)
// et le rendu de fiche de cours dans l’application Studio ADAM.
// ═══════════════════════════════════════════════════════════════

export interface AIHardExercise {
  id?: string;
  title?: string;
  problem_statement?: string;
  solution?: string;
  common_pitfalls?: string;
}

export interface AICourse {
  title?: string;
  subject?: string;
  level?: string;
  summary?: string;
  key_concepts?: string[];
  hard_exercises?: AIHardExercise[];
  /** Visualisation optionnelle (schéma LabVizSpec) associée au cours. */
  lab_spec?: unknown;
}

/** Garde souple : vérifie qu’un objet ressemble bien à un cours IA exploitable. */
export function isAICourse(value: unknown): value is AICourse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.title === "string" && v.title.trim().length > 0) return true;
  if (typeof v.summary === "string" && v.summary.trim().length > 0) return true;
  return Array.isArray(v.key_concepts) || Array.isArray(v.hard_exercises);
}
