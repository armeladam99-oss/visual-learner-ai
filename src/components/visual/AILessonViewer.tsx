"use client";

import { Component, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Trophy, GraduationCap, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import "katex/dist/katex.min.css";

// ═══════════════════════════════════════════════════════════════
// 🎓 AILESSON VIEWER — rend un cours généré par l’IA
// (équivalent Vite/React du LessonViewer Next.js fourni)
// Markdown complet + vraies formules LaTeX via KaTeX.
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

const mdComponents = {
  h1: (props: { children?: React.ReactNode }) => (
    <h1 className="mt-6 mb-3 text-2xl font-bold text-white first:mt-0">{props.children}</h1>
  ),
  h2: (props: { children?: React.ReactNode }) => (
    <h2 className="mt-6 mb-2.5 text-xl font-bold text-slate-100 first:mt-0">{props.children}</h2>
  ),
  h3: (props: { children?: React.ReactNode }) => (
    <h3 className="mt-5 mb-2 text-lg font-semibold text-indigo-300 first:mt-0">{props.children}</h3>
  ),
  h4: (props: { children?: React.ReactNode }) => (
    <h4 className="mt-4 mb-1.5 text-base font-semibold text-slate-100 first:mt-0">{props.children}</h4>
  ),
  p: (props: { children?: React.ReactNode }) => (
    <p className="my-2 leading-relaxed text-slate-300 first:mt-0 last:mb-0">{props.children}</p>
  ),
  ul: (props: { children?: React.ReactNode }) => (
    <ul className="my-2.5 list-disc pl-6 space-y-1.5 text-slate-300 marker:text-slate-500">{props.children}</ul>
  ),
  ol: (props: { children?: React.ReactNode }) => (
    <ol className="my-2.5 list-decimal pl-6 space-y-1.5 text-slate-300 marker:text-slate-500">{props.children}</ol>
  ),
  li: (props: { children?: React.ReactNode }) => <li className="leading-relaxed">{props.children}</li>,
  strong: (props: { children?: React.ReactNode }) => <strong className="font-semibold text-white">{props.children}</strong>,
  em: (props: { children?: React.ReactNode }) => <em className="text-slate-100 italic">{props.children}</em>,
  code: (props: { children?: React.ReactNode }) => (
    <code className="rounded-md bg-slate-700/60 border border-slate-600/40 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-300">
      {props.children}
    </code>
  ),
  a: (props: { href?: string; children?: React.ReactNode }) => (
    <a href={props.href} target="_blank" rel="noreferrer" className="text-indigo-400 underline decoration-indigo-500/40 hover:text-indigo-300">
      {props.children}
    </a>
  ),
  hr: () => <hr className="my-4 border-slate-700" />,
};

/** Si une formule LaTeX est mal formée, rehype-katex lève une erreur :
 *  on affiche alors le texte brut plutôt que de faire planter la page. */
class KatexBoundary extends Component<{ children: ReactNode; fallbackText?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 bg-slate-900/40 rounded-lg p-3 overflow-x-auto">
          {this.props.fallbackText || "(formule non rendue)"}
        </pre>
      );
    }
    return this.props.children;
  }
}

function MarkdownBlock({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="ai-katex">
      <KatexBoundary fallbackText={text}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={mdComponents}
        >
          {text}
        </ReactMarkdown>
      </KatexBoundary>
    </div>
  );
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
            <h3 className="font-semibold text-slate-100 leading-snug flex-1">{exercise.title}</h3>
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
                  <p className="text-sm text-slate-300">{exercise.common_pitfalls}</p>
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
                {c}
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
