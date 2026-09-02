"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send, Sparkles, Sigma, Zap, FlaskConical, Globe,
  Dna, Cpu, Orbit, BarChart3, Lightbulb, Beaker,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🧪 LAB WELCOME — Free text input as primary interface
// ═══════════════════════════════════════════════════════════════

const DOMAIN_CHIPS = [
  { id: "math", label: "Maths", icon: Sigma, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  { id: "physics", label: "Physique", icon: Zap, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { id: "chemistry", label: "Chimie", icon: FlaskConical, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: "3d", label: "Modèles 3D", icon: Globe, color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { id: "biology", label: "Biologie", icon: Dna, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { id: "electricity", label: "Électricité", icon: Lightbulb, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { id: "geometry", label: "Géométrie", icon: Cpu, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "astronomy", label: "Astronomie", icon: Orbit, color: "bg-indigo-300/10 text-indigo-300 border-indigo-300/20" },
  { id: "data", label: "Données", icon: BarChart3, color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
];

const PLACEHOLDER_EXAMPLES = [
  "Écris une équation, une expérience, une simulation, une construction 3D ou une question scientifique...",
  "Trace f(x)=x²-3x+2",
  "Crée un circuit avec une pile de 9V et une résistance de 100Ω",
  "Montre une molécule d'eau en 3D",
  "Simule un projectile à 20 m/s avec un angle de 45°",
  "Crée une scène 3D avec une sphère et un cube",
  "Étudie les racines de x²-5x+6",
  "Compare sin(x) et cos(x)",
];

interface LabWelcomeProps {
  onSubmit: (prompt: string) => void;
  onDomainClick?: (domain: string) => void;
}

export function LabWelcome({ onSubmit, onDomainClick }: LabWelcomeProps) {
  const [input, setInput] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8 px-4 min-h-[70vh]"
    >
      {/* Logo + Title */}
      <div className="text-center space-y-4 mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-indigo-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/10"
        >
          <Beaker className="size-12 text-cyan-400" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Laboratoire Scientifique
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Écris ce que tu veux créer ou expérimenter — l&apos;IA comprend et construit la visualisation.
          </p>
        </motion.div>
      </div>

      {/* PRIMARY: Free text input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-2xl space-y-3"
      >
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length)}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIdx]}
            className="min-h-[120px] text-base resize-none bg-slate-800/80 border-slate-700/60 text-white placeholder:text-slate-500 rounded-2xl px-5 py-4 pr-14 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            autoFocus
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="absolute bottom-3 right-3 size-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 p-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl text-sm"
        >
          <Sparkles className="size-4 mr-2" />
          Créer avec l&apos;IA
        </Button>
      </motion.div>

      {/* SECONDARY: Domain chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 space-y-3 text-center"
      >
        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
          ou explorer un domaine
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {DOMAIN_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => onDomainClick?.(chip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:scale-105 ${chip.color}`}
              >
                <Icon className="size-3" />
                {chip.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
