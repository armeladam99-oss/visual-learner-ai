import type { ChapterMeta } from "@/types/lessons";

export const chapters: ChapterMeta[] = [
  {
    id: "polynomes-2nd-degre",
    subject: "math",
    title: "Polynômes du 2nd degré",
    description:
      "Étude complète des fonctions du second degré : forme générale, racines, parabole, signe, et applications.",
    icon: "📐",
    color: "from-blue-500 to-indigo-600",
    estimatedTime: "45 min",
    difficulty: "intermédiaire",
  },
  {
    id: "cinematique",
    subject: "physics",
    title: "Cinématique",
    description:
      "Mouvement rectiligne, position, vitesse, accélération. Comprendre et interpréter les graphiques de mouvement.",
    icon: "🚀",
    color: "from-emerald-500 to-teal-600",
    estimatedTime: "40 min",
    difficulty: "intermédiaire",
  },
  {
    id: "solutions-molaires",
    subject: "chemistry",
    title: "Solutions et concentrations",
    description:
      "Concentration molaire, dilution, suivi temporel, dosage acido-basique et interprétation des courbes.",
    icon: "⚗️",
    color: "from-amber-500 to-orange-600",
    estimatedTime: "35 min",
    difficulty: "débutant",
  },
];

export const subjectLabels: Record<string, string> = {
  math: "Mathématiques",
  physics: "Physique-Chimie",
  chemistry: "Chimie",
};

export const subjectColors: Record<string, string> = {
  math: "bg-blue-50 text-blue-700 border-blue-200",
  physics: "bg-emerald-50 text-emerald-700 border-emerald-200",
  chemistry: "bg-amber-50 text-amber-700 border-amber-200",
};
