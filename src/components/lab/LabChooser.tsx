"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sigma, Cpu, Globe, Zap, FlaskConical, Dna, Orbit, BarChart3,
  Atom, Search, ArrowLeft, ChevronRight, Sparkles, Beaker, TestTubeDiagonal,
  Magnet, Waves, Lightbulb, Binary, PenTool, Rocket, Telescope, X, Wand2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 📊 DOMAIN DEFINITIONS
// ═══════════════════════════════════════════════════════════════

interface LabDomainItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
  experiments: LabExperiment[];
}

interface LabExperiment {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  description: string;
}

const LAB_DOMAINS: LabDomainItem[] = [
  {
    id: "math",
    label: "Mathématiques",
    icon: <Sigma className="size-6" />,
    color: "text-indigo-400",
    gradient: "from-indigo-500/20 to-violet-500/20",
    description: "Fonctions, courbes, dérivées, intégrales",
    experiments: [
      { id: "func", label: "Fonction", icon: "📈", prompt: "Trace f(x) = x²", description: "Graphique de fonction" },
      { id: "deriv", label: "Dérivée", icon: "📐", prompt: "Dérivée de f(x) = x³ - 3x", description: "Fonction et sa dérivée" },
      { id: "compare", label: "Comparer", icon: "⚖️", prompt: "Compare sin(x) et cos(x)", description: "Plusieurs courbes" },
      { id: "param", label: "Paramétrique", icon: "🌀", prompt: "Fonction paramétrique x=cos(t), y=sin(2t)", description: "Courbe paramétrique" },
      { id: "param-slider", label: "Avec sliders", icon: "🎚️", prompt: "Fais varier a dans f(x)=a*x²+b*x+c", description: "Paramètres modifiables" },
      { id: "analysis", label: "Analyse", icon: "🔍", prompt: "Trouve les zéros de x²-4x+3", description: "Zéros, minimum, maximum" },
    ],
  },
  {
    id: "geometry",
    label: "Géométrie",
    icon: <Cpu className="size-6" />,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/20",
    description: "Figures, constructions, transformations",
    experiments: [
      { id: "triangle", label: "Triangle", icon: "🔺", prompt: "Construis un triangle ABC", description: "Triangle avec points" },
      { id: "mediatrice", label: "Médiatrice", icon: "📏", prompt: "Ajoute la médiatrice de AB", description: "Construction" },
      { id: "circle", label: "Cercle", icon: "⭕", prompt: "Construis un cercle et affiche son rayon", description: "Cercle avec rayon" },
      { id: "rotation", label: "Rotation", icon: "🔄", prompt: "Fais une rotation de 90 degrés", description: "Transformation" },
    ],
  },
  {
    id: "3d",
    label: "Modèles 3D",
    icon: <Globe className="size-6" />,
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-purple-500/20",
    description: "Solides, surfaces, scènes 3D",
    experiments: [
      { id: "surface", label: "Surface 3D", icon: "🌊", prompt: "Surface 3D z=sin(x²+y²)", description: "Surface mathématique" },
      { id: "sphere", label: "Sphère", icon: "🔵", prompt: "Crée une sphère", description: "Solide 3D" },
      { id: "vector", label: "Vecteur 3D", icon: "➡️", prompt: "Plan XYZ avec un vecteur (3,2,4)", description: "Vecteur dans l'espace" },
      { id: "curve3d", label: "Courbe 3D", icon: "🌀", prompt: "Courbe 3D x=cos(t), y=sin(t), z=t/5", description: "Hélice ou courbe paramétrique" },
    ],
  },
  {
    id: "physics",
    label: "Physique",
    icon: <Zap className="size-6" />,
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-orange-500/20",
    description: "Mouvements, forces, énergie",
    experiments: [
      { id: "projectile", label: "Projectile", icon: "🚀", prompt: "Simule un projectile à 20 m/s avec un angle de 45°", description: "Mouvement projectile" },
      { id: "freefall", label: "Chute libre", icon: "⬇️", prompt: "Chute libre depuis 20 mètres", description: "Gravité" },
      { id: "pendulum", label: "Pendule", icon: "🔔", prompt: "Simule un pendule", description: "Oscillation" },
      { id: "wave", label: "Onde", icon: "🌊", prompt: "Onde sinusoïdale", description: "Propagation ondulatoire" },
      { id: "spring", label: "Ressort", icon: "🌀", prompt: "Simule un ressort avec une masse", description: "Oscillation ressort-masse" },
    ],
  },
  {
    id: "chemistry",
    label: "Chimie",
    icon: <FlaskConical className="size-6" />,
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-fuchsia-500/20",
    description: "Molécules, réactions, liaisons",
    experiments: [
      { id: "h2o", label: "H₂O", icon: "💧", prompt: "Montre H2O en 3D", description: "Molécule d'eau" },
      { id: "ch4", label: "CH₄", icon: "🔵", prompt: "Montre CH4 en 3D", description: "Méthane" },
      { id: "co2", label: "CO₂", icon: "💨", prompt: "Montre CO2 en 3D", description: "Dioxyde de carbone" },
      { id: "compare", label: "Comparer", icon: "⚖️", prompt: "Compare H2O et CO2", description: "Deux molécules" },
      { id: "search", label: "Rechercher", icon: "🔎", prompt: "_SEARCH_", description: "Chercher une molécule" },
    ],
  },
  {
    id: "biology",
    label: "Biologie",
    icon: <Dna className="size-6" />,
    color: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20",
    description: "Cellules, ADN, systèmes biologiques",
    experiments: [
      { id: "plant-cell", label: "Cellule végétale", icon: "🌱", prompt: "Montre une cellule végétale", description: "Organites et structure" },
      { id: "animal-cell", label: "Cellule animale", icon: "🔬", prompt: "Montre une cellule animale", description: "Organites et structure" },
      { id: "dna", label: "ADN", icon: "🧬", prompt: "Montre l'ADN en 3D", description: "Double hélice" },
    ],
  },
  {
    id: "electricity",
    label: "Électricité",
    icon: <Lightbulb className="size-6" />,
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-blue-500/20",
    description: "Circuits, tension, courant",
    experiments: [
      { id: "rc", label: "Circuit RC", icon: "⚡", prompt: "Simule un circuit RC", description: "Condensateur et résistance" },
      { id: "simple", label: "Circuit simple", icon: "🔋", prompt: "Construis un circuit avec une pile et une résistance", description: "Loi d'Ohm" },
    ],
  },
  {
    id: "astronomy",
    label: "Astronomie",
    icon: <Orbit className="size-6" />,
    color: "text-indigo-300",
    gradient: "from-indigo-500/20 to-blue-500/20",
    description: "Système solaire, orbites, planètes",
    experiments: [
      { id: "solar", label: "Système solaire", icon: "☀️", prompt: "Montre le système solaire", description: "Planètes et orbites" },
      { id: "planet", label: "Planète", icon: "🪐", prompt: "Montre une planète avec sa lune", description: "Système planète-lune" },
    ],
  },
  {
    id: "data",
    label: "Données",
    icon: <BarChart3 className="size-6" />,
    color: "text-teal-400",
    gradient: "from-teal-500/20 to-cyan-500/20",
    description: "Statistiques, histogrammes, nuages de points",
    experiments: [
      { id: "stats", label: "Statistiques", icon: "📊", prompt: "Statistiques : 12 25 18 32 40", description: "Moyenne, médiane, écart-type" },
      { id: "hist", label: "Histogramme", icon: "📉", prompt: "Fais un histogramme de 10 15 22 18 30 25 12 28 35 20", description: "Distribution de données" },
    ],
  },
];

// Exemples de prompt libre par domaine (aides, jamais des limites)
const CUSTOM_SUGGESTIONS: Record<string, string> = {
  math: "Trace f(x)=x³-2x+1 avec sa dérivée et ses racines",
  geometry: "Construis un triangle rectangle ABC et affiche ses angles",
  "3d": "Crée une scène avec une sphère rouge et un cube bleu qui tourne",
  physics: "Étudie la chute d'une bille de 500 g depuis 10 m",
  chemistry: "Montre HCl en 3D et explique sa liaison",
  biology: "Montre une cellule animale avec ses organites",
  electricity: "Construis un circuit en parallèle avec deux résistances",
  astronomy: "Crée une planète avec deux lunes",
  data: "Calcule la moyenne et trace le graphique de 12 25 18 32 40",
};

// ═══════════════════════════════════════════════════════════════
// 🧪 LAB CHOOSER COMPONENT
// ═══════════════════════════════════════════════════════════════

export function LabChooser({
  onSelect,
  onAIOpen,
  initialDomain,
  onBackToHome,
}: {
  onSelect: (prompt: string) => void;
  onAIOpen: () => void;
  initialDomain?: string | null;
  onBackToHome?: () => void;
}) {
  const [selectedDomain, setSelectedDomain] = useState<LabDomainItem | null>(() => {
    if (!initialDomain) return null;
    return LAB_DOMAINS.find((d) => d.id === initialDomain) ?? null;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const filteredDomains = LAB_DOMAINS.filter((d) =>
    !searchQuery || d.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-4"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center">
          <Atom className="size-10 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Laboratoire Scientifique IA</h2>
          <p className="text-sm text-slate-400 mt-1">
            Choisis un domaine ou décris directement ce que tu veux voir
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <Input
          placeholder="Rechercher un domaine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white text-sm placeholder:text-slate-500"
        />
      </div>

      {/* Domain grid */}
      <AnimatePresence mode="wait">
        {!selectedDomain ? (
          <motion.div key="domains"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto"
          >
            {filteredDomains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain)}
                className={`flex items-center gap-3 rounded-xl border border-slate-700/50 bg-gradient-to-br ${domain.gradient} p-4 text-left hover:border-slate-500 hover:scale-[1.02] transition-all`}
              >
                <div className={`${domain.color}`}>{domain.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{domain.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{domain.description}</p>
                </div>
                <ChevronRight className="size-4 text-slate-500 flex-shrink-0" />
              </button>
            ))}

            {/* AI button */}
            <button
              onClick={onAIOpen}
              className="flex items-center gap-3 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 p-4 text-left hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all sm:col-span-2 lg:col-span-3"
            >
              <Sparkles className="size-6 text-cyan-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cyan-400">Demander à l&apos;IA</p>
                <p className="text-[10px] text-slate-400">Décris librement ce que tu veux — l&apos;IA comprend et crée la visualisation</p>
              </div>
            </button>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/30 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="size-3.5" />
                Fermer et écrire librement
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="experiments"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="max-w-2xl mx-auto space-y-3"
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedDomain(null)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              Retour aux domaines
            </button>

            {/* Domain header */}
            <div className="flex items-center gap-3">
              <div className={`${selectedDomain.color}`}>{selectedDomain.icon}</div>
              <h3 className="text-lg font-bold text-white">{selectedDomain.label}</h3>
            </div>

            {/* Experiment cards */}
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedDomain.experiments.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => {
                    if (exp.id === "search") {
                      onAIOpen();
                    } else {
                      onSelect(exp.prompt);
                    }
                  }}
                  className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 text-left hover:bg-slate-800 hover:border-slate-600 transition-all"
                >
                  <span className="text-xl">{exp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{exp.label}</p>
                    <p className="text-[10px] text-slate-400">{exp.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom experiment for this domain — vrai champ libre */}
            <div className="rounded-xl border border-dashed border-cyan-500/25 bg-cyan-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Wand2 className="size-3.5 text-cyan-400" />
                <p className="text-xs font-medium text-cyan-300">
                  ✨ Créer mon expérience en {selectedDomain.label.toLowerCase()}
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (customPrompt.trim()) onSelect(customPrompt.trim());
                      setCustomPrompt("");
                    }
                  }}
                  placeholder={CUSTOM_SUGGESTIONS[selectedDomain.id] || "Décris ton expérience..."}
                  className="flex-1 bg-slate-800/90 border-slate-700 text-white text-sm placeholder:text-slate-500"
                />
                <Button
                  size="sm"
                  disabled={!customPrompt.trim()}
                  onClick={() => {
                    onSelect(customPrompt.trim());
                    setCustomPrompt("");
                  }}
                  className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-500"
                >
                  <Sparkles className="size-3.5 mr-1.5" />
                  Créer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
