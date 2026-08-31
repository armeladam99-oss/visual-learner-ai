import type { ChapterMeta } from "@/types/lessons";

export const chapters: ChapterMeta[] = [
  // MATHÉMATIQUES
  {
    id: "limites-continuite",
    subject: "math",
    title: "Limites et continuité",
    description:
      "Limites finies et infinies, continuité, théorème des valeurs intermédiaires, fonctions composées.",
    icon: "∞",
    color: "from-blue-500 to-indigo-600",
    estimatedTime: "45 min",
    difficulty: "intermédiaire",
  },
  {
    id: "derivation-fonctions",
    subject: "math",
    title: "Dérivation et étude de fonctions",
    description:
      "Tangente, dérivée, variations, extremums, concavité, fonction dérivée et application graphique.",
    icon: "📈",
    color: "from-violet-500 to-purple-600",
    estimatedTime: "50 min",
    difficulty: "avancé",
  },
  {
    id: "suites-numeriques",
    subject: "math",
    title: "Suites numériques",
    description:
      "Récurrence, limites de suites, convergence, suites géométriques et arithmétiques.",
    icon: "🔢",
    color: "from-sky-500 to-blue-600",
    estimatedTime: "40 min",
    difficulty: "intermédiaire",
  },
  {
    id: "fonction-exponentielle",
    subject: "math",
    title: "Fonction exponentielle",
    description:
      "Définition, propriétés, équations différentielles, croissance, comparaison avec les puissances.",
    icon: "𝑒",
    color: "from-emerald-500 to-teal-600",
    estimatedTime: "35 min",
    difficulty: "intermédiaire",
  },

  // PHYSIQUE-CHIMIE
  {
    id: "ondes-mecaniques",
    subject: "physics",
    title: "Ondes mécaniques progressives",
    description:
      "Définition, propagation, énergie, réflexion, transmission, corde vibrant.",
    icon: "🌊",
    color: "from-cyan-500 to-blue-600",
    estimatedTime: "40 min",
    difficulty: "intermédiaire",
  },
  {
    id: "ondes-periodiques",
    subject: "physics",
    title: "Ondes mécaniques périodiques",
    description:
      "Onde sinusoïdale, longueur d'onde, période, fréquence, vitesse de phase, superposition.",
    icon: "〰️",
    color: "from-teal-500 to-cyan-600",
    estimatedTime: "45 min",
    difficulty: "intermédiaire",
  },
  {
    id: "ondes-lumineuses",
    subject: "physics",
    title: "Propagation des ondes lumineuses",
    description:
      "Nature corpusculaire et ondulatoire, vitesse de la lumière, réflexion, réfraction, interference.",
    icon: "💡",
    color: "from-amber-500 to-yellow-600",
    estimatedTime: "40 min",
    difficulty: "avancé",
  },

  // CHIMIE
  {
    id: "acido-basique",
    subject: "chemistry",
    title: "Réactions acido-basiques",
    description:
      "Acides, bases, pH, dosage, courbe de titrage, point d'équivalence, indicateurs.",
    icon: "⚗️",
    color: "from-rose-500 to-pink-600",
    estimatedTime: "40 min",
    difficulty: "intermédiaire",
  },
  {
    id: "suivi-temporel",
    subject: "chemistry",
    title: "Suivi temporel d'une réaction",
    description:
      "Cinétique chimique, vitesse de réaction, ordre, demi-vie, suivi par conductimétrie.",
    icon: "⏱️",
    color: "from-orange-500 to-red-600",
    estimatedTime: "35 min",
    difficulty: "intermédiaire",
  },
  {
    id: "transformations-nucleaires",
    subject: "chemistry",
    title: "Transformations nucléaires",
    description:
      "Radioactivité, décroissance, N/Z, énergie, masse, fission, fusion.",
    icon: "☢️",
    color: "from-yellow-500 to-amber-600",
    estimatedTime: "35 min",
    difficulty: "avancé",
  },
];

export const subjectLabels: Record<string, string> = {
  math: "Mathématiques",
  physics: "Physique-Chimie",
  chemistry: "Chimie",
};

export const subjectColors: Record<string, string> = {
  math: "bg-blue-50 text-blue-700 border-blue-200",
  physics: "bg-cyan-50 text-cyan-700 border-cyan-200",
  chemistry: "bg-rose-50 text-rose-700 border-rose-200",
};
