"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ChevronDown, AlertTriangle, Trophy, CheckCircle2, Lightbulb } from "lucide-react";
import { latexToUnicode } from "@/lib/math-pretty";
import type { AICourse, AIHardExercise } from "@/lib/ai-course";

// ────────────────────────────────────────────────────────────────
// 🎓 CARTE « COURS IA » — rend la fiche structurée renvoyée par
// l’IA : résumé avec formules, concepts clés et Espace Défi.
// ────────────────────────────────────────────────────────────────

const SUBJECT_META: { key: string; icon: string; chip: string; gradient: string }[] = [
  {
    key: "math",
    icon: "📐",
    chip: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
    gradient: "from-indigo-500/15 to-transparent",
  },
  {
    key: "phys",
    icon: "⚛️",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    gradient: "from-emerald-500/15 to-transparent",
  },
  {
    key: "chim",
    icon: "🧪",
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    gradient: "from-amber-500/15 to-transparent",
  },
];

function subjectMeta(subject?: string) {
  const s = (subject || "").toLowerCase();
  if (s.includes("math")) return SUBJECT_META[0];
  if (s.includes("phys")) return SUBJECT_META[1];
  if (s.includes("chim")) return SUBJECT_META[2];
  return {
    key: "other",
    icon: "🎓",
    chip: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    gradient: "from-cyan-500/15 to-transparent",
  };
}

function Rich({
  text,
  className = "",
  strongClass = "text-white",
}: {
  text?: string;
  className?: string;
  strongClass?: string;
}) {
  if (!text) return null;
  const pretty = latexToUnicode(text);
  const parts = pretty.split("**");
  return (
    <div className={`whitespace-pre-line text-sm leading-relaxed text-slate-300 ${className}`}>
      {parts.map((p, j) =>
        j % 2 === 1 ? (
          <strong key={j} className={`font-semibold ${strongClass}`}>
            {p}
          </strong>
        ) : (
          <span key={j}>{p}</span>
        )
      )}
    </div>
  );
}

function ChallengeExercise({
  exercise,
  index,
}: {
  exercise: AIHardExercise;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const hasPitfalls = !!exercise.common_pitfalls;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            {exercise.title ? (
              <Rich
                text={exercise.title}
                className="text-slate-100 font-semibold !text-[13px] leading-snug"
                strongClass="text-white"
              />
            ) : null}
          </div>
        </div>

        {exercise.problem_statement && (
          <div className="ml-8">
            <Rich text={exercise.problem_statement} className="text-[13px]" />
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-8 flex items-center gap-1.5 rounded-lg border border-slate-600/60 bg-slate-700/40 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/70 hover:border-slate-500 transition-colors"
          aria-expanded={open}
        >
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          {open ? "Masquer le corrigé" : "Voir le corrigé étape par étape"}
          <ChevronDown className={`size-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="ml-8 mt-2 space-y-2">
                {exercise.solution && (
                  <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.07] p-3">
                    <Rich text={exercise.solution} className="text-[13px] !text-slate-200" strongClass="text-emerald-300" />
                  </div>
                )}
                {hasPitfalls && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] p-3">
                    <AlertTriangle className="size-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <Rich text={exercise.common_pitfalls} className="text-[12px] !text-amber-100/90" strongClass="text-amber-300" />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AICourseCard({ course }: { course: AICourse }) {
  const meta = subjectMeta(course.subject);
  const exercises: AIHardExercise[] = Array.isArray(course.hard_exercises) ? course.hard_exercises : [];
  const concepts: string[] = Array.isArray(course.key_concepts) ? course.key_concepts : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-700/60 bg-slate-900/80 overflow-hidden shadow-lg shadow-black/20"
    >
      {/* En-tête */}
      <div className={`bg-gradient-to-r ${meta.gradient} border-b border-slate-700/50 px-4 py-3`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{meta.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="size-3" />
              Cours généré par Studio ADAM IA
            </p>
            <Rich text={course.title} className="!text-[15px] !text-white font-bold leading-snug !mt-1" strongClass="text-white" />
          </div>
        </div>
        {(course.subject || course.level) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {course.subject && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.chip}`}>
                {course.subject}
              </span>
            )}
            {course.level && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-600/60 bg-slate-700/40 text-slate-300">
                📚 {course.level}
              </span>
            )}
            {exercises.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                🏆 {exercises.length} exercice{exercises.length > 1 ? "s" : ""} difficile{exercises.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Résumé */}
        {course.summary && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-slate-500">📖</span> Résumé du cours
            </p>
            <Rich text={course.summary} />
          </div>
        )}

        {/* Concepts clés */}
        {concepts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">🧩 Concepts clés</p>
            <div className="flex flex-wrap gap-1.5">
              {concepts.map((c, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-slate-600/50 bg-slate-800/60 text-slate-200"
                >
                  {latexToUnicode(c)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Espace Défi */}
        {exercises.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-amber-400" />
              <p className="text-sm font-bold text-amber-300">
                Espace Défi / Exercices Difficiles
              </p>
            </div>
            <div className="space-y-2.5">
              {exercises.map((ex, i) => (
                <ChallengeExercise key={ex.id || i} exercise={ex} index={i} />
              ))}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Lightbulb className="size-3" />
              Niveau Examens Nationaux / Concours — essaie seul avant d’ouvrir le corrigé.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
