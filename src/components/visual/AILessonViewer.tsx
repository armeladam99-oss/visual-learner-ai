"use client";

import type { ReactNode } from "react";
import { Trophy, GraduationCap, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { latexToUnicode } from "@/lib/math-pretty";

// ═══════════════════════════════════════════════════════════════
// 🎓 AILESSON VIEWER — rend un cours généré par l’IA
// (équivalent Vite/React du LessonViewer Next.js fourni)
// Rendu allégé sans dépendances lourdes : le Markdown simple
// (titres, listes, gras) est parsé à la main et les formules
// LaTeX ($...$) sont converties en notation Unicode, comme dans
// le reste de Studio ADAM (AICourseCard, leçons intégrées…).
// ═══════════════════════════════════════════════════════════════

export interface AILessonExercise {
  id?: string;
  title?: string;
  problem_statement?: string;
  solution?: string;
  common_pitfalls?: string;
}

export interface AILessonData {
  title: string;
  subject: string;
  level: string;
  summary: string;
  key_concepts: string[];
  hard_exercises: AILessonExercise[];
}

// ────────────────────────────────────────────────────────────────
// Texte enrichi : gras **…**, code `…` et formules $…$ → Unicode.
// ────────────────────────────────────────────────────────────────
function InlineText({ text }: { text: string }) {
  const pretty = latexToUnicode(text);
  const parts = pretty.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="rounded-md bg-slate-700/60 border border-slate-600/40 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-300"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function paraClass() {
  return "my-2 leading-relaxed text-slate-300 first:mt-0 last:mb-0";
}

/** Parse Markdown minimal : titres, listes, paragraphes, séparateur. */
function MarkdownBlock({ text }: { text?: string }) {
  if (!text) return null;
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const out: ReactNode[] = [];
  let key = 0;
  let i = 0;

  const pushList = (ordered: boolean, startIdx: number): number => {
    const items: string[] = [];
    let j = startIdx;
    const re = ordered ? /^\d+[.)]\s+(.*)$/ : /^[-*]\s+(.*)$/;
    while (j < lines.length) {
      const m = lines[j].match(re);
      if (!m) break;
      items.push(m[1]);
      j += 1;
    }
    const cls = ordered
      ? "my-2.5 list-decimal pl-6 space-y-1.5 text-slate-300 marker:text-slate-500"
      : "my-2.5 list-disc pl-6 space-y-1.5 text-slate-300 marker:text-slate-500";
    out.push(
      <ul key={key++} className={cls}>
        {items.map((it, idx) => (
          <li key={idx} className="leading-relaxed">
            <InlineText text={it} />
          </li>
        ))}
      </ul>,
    );
    return j;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i += 1;
      continue;
    }
    // Titres (# et ## sont ramenés à un niveau h3 pour ne pas écraser le titre du cours)
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const cls =
        level >= 3
          ? "mt-5 mb-2 text-lg font-semibold text-indigo-300 first:mt-0"
          : "mt-4 mb-1.5 text-base font-bold text-slate-100 first:mt-0";
      out.push(
        <h3 key={key++} className={cls}>
          <InlineText text={h[2]} />
        </h3>,
      );
      i += 1;
      continue;
    }
    // Séparateur
    if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) {
      out.push(<hr key={key++} className="my-4 border-slate-700" />);
      i += 1;
      continue;
    }
    // Listes
    if (/^[-*]\s+/.test(line)) {
      i = pushList(false, i);
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      i = pushList(true, i);
      continue;
    }
    // Paragraphe : accumule les lignes simples suivantes
    const buf: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i] &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+[.)]\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i += 1;
    }
    out.push(
      <p key={key++} className={paraClass()}>
        <InlineText text={buf.join(" ")} />
      </p>,
    );
  }

  return <div className="space-y-0.5">{out}</div>;
}

function subjectChip(subject?: string) {
  const s = (subject || "").toLowerCase();
  if (s.includes("math"))
    return { icon: "📐", cls: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200" };
  if (s.includes("phys"))
    return { icon: "⚛️", cls: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" };
  if (s.includes("chim"))
    return { icon: "🧪", cls: "border-amber-400/30 bg-amber-400/10 text-amber-200" };
  return { icon: "🎓", cls: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200" };
}

function ExerciseCard({ exercise, index }: { exercise: AILessonExercise; index: number }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/70 overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          {exercise.title && (
            <h3 className="font-semibold text-slate-100 leading-snug flex-1">
              <InlineText text={exercise.title} />
            </h3>
          )}
        </div>

        <div className="ml-9">
          <MarkdownBlock text={exercise.problem_statement} />
        </div>

        <details className="group ml-9">
          <summary className="cursor-pointer select-none flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 w-fit rounded-lg border border-slate-600/60 bg-slate-700/30 px-3 py-1.5 transition-colors">
            <CheckCircle2 className="size-4 text-emerald-400" />
            Voir la solution détaillée et pièges à éviter
            <span className="text-slate-500 group-open:hidden">▾</span>
            <span className="text-slate-500 hidden group-open:inline">▴</span>
          </summary>
          <div className="mt-3 space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                <Sparkles className="size-3.5" /> Solution :
              </p>
              <MarkdownBlock text={exercise.solution} />
            </div>
            {exercise.common_pitfalls && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/25 bg-rose-500/[0.07] p-3">
                <AlertTriangle className="size-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-rose-300 mb-1">⚠️ Pièges fréquents :</p>
                  <p className="text-sm text-slate-300">
                    <InlineText text={exercise.common_pitfalls} />
                  </p>
                </div>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}

export function AILessonViewer({ lesson }: { lesson: AILessonData }) {
  const meta = subjectChip(lesson.subject);
  const concepts: string[] = Array.isArray(lesson.key_concepts) ? lesson.key_concepts : [];
  const exercises: AILessonExercise[] = Array.isArray(lesson.hard_exercises) ? lesson.hard_exercises : [];

  return (
    <div className="space-y-6 text-slate-100">
      {/* En-tête */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <GraduationCap className="size-3.5" />
          Cours généré par Studio ADAM IA
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-white leading-tight">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {lesson.subject && (
            <span className={`text-xs px-3 py-1 rounded-full border ${meta.cls}`}>
              {meta.icon} {lesson.subject}
            </span>
          )}
          <span className="text-xs px-3 py-1 rounded-full border border-slate-600/60 bg-slate-700/40 text-slate-300">
            📚 {lesson.level}
          </span>
          {exercises.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
              ⚡ Espace Défi : {exercises.length} exercice{exercises.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Résumé du cours + formules */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          📖 Résumé du cours
        </h2>
        <MarkdownBlock text={lesson.summary} />
      </div>

      {/* Concepts clés */}
      {concepts.length > 0 && (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            🧩 Concepts clés
          </h2>
          <div className="flex flex-wrap gap-2">
            {concepts.map((c, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-600/50 bg-slate-800/70 text-slate-200"
              >
                {latexToUnicode(c)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ⚡ Espace Défi — Exercices Difficiles */}
      {exercises.length > 0 && (
        <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="size-5 text-amber-400" />
            <h2 className="text-lg font-bold text-amber-300">
              ⚡ Espace Défi / Exercices Difficiles
            </h2>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Niveau Examen National SM / Concours d’écoles d’ingénieurs — combine plusieurs notions du chapitre. Essaie seul avant d’ouvrir le corrigé.
          </p>
          <div className="space-y-4">
            {exercises.map((ex, i) => (
              <ExerciseCard key={ex.id || i} exercise={ex} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
