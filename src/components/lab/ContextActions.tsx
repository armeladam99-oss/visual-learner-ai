"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LabVizSpec } from "@/lib/lab/lab-schema";
import {
  TrendingUp, Minus, Plus, RotateCcw, Grid3x3,
  Eye, EyeOff, Download, Sparkles, BarChart3,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// ⚡ CONTEXT ACTIONS — Smart buttons based on workspace state
// ═══════════════════════════════════════════════════════════════

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  color: string;
}

export function ContextActions({
  spec,
  onSendCommand,
}: {
  spec: LabVizSpec | null;
  onSendCommand: (prompt: string) => void;
}) {
  if (!spec) return null;

  const actions = getActionsForSpec(spec);

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSendCommand(action.prompt)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${action.color}`}
        >
          {action.icon}
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}

function getActionsForSpec(spec: LabVizSpec): Action[] {
  const actions: Action[] = [];
  const type = spec.type;
  const domain = spec.domain;

  // === MATH ACTIONS ===
  if (domain === "math") {
    if (type === "function-plot" || type === "multi-function-plot" || type === "derivative-plot") {
      actions.push({
        id: "derivative", label: "Dérivée", icon: <TrendingUp className="size-3" />,
        prompt: "Ajoute la dérivée de la fonction",
        color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
      });
      actions.push({
        id: "add-func", label: "+ Fonction", icon: <Plus className="size-3" />,
        prompt: "Ajoute une nouvelle fonction sur le même graphique",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
      });
      actions.push({
        id: "zeros", label: "Zéros", icon: <Minus className="size-3" />,
        prompt: "Montre les zéros de la fonction",
        color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
      });
      actions.push({
        id: "variations", label: "Variations", icon: <BarChart3 className="size-3" />,
        prompt: "Montre le tableau de variations",
        color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
      });
      actions.push({
        id: "zoom-in", label: "Zoom +", icon: <RotateCcw className="size-3" />,
        prompt: "Zoome sur la partie intéressante du graphique",
        color: "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20",
      });
    }

    if (type === "surface-3d" || type === "curve-3d") {
      actions.push({
        id: "rotate", label: "Tourner", icon: <RotateCcw className="size-3" />,
        prompt: "Fais tourner la scène",
        color: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
      });
    }
  }

  // === PHYSICS ACTIONS ===
  if (domain === "physics") {
    actions.push({
      id: "graph", label: "Graphique", icon: <BarChart3 className="size-3" />,
      prompt: "Ajoute le graphique position en fonction du temps",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    });
    actions.push({
      id: "explain", label: "Expliquer", icon: <Sparkles className="size-3" />,
      prompt: "Explique cette expérience étape par étape",
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
    });
  }

  // === CHEMISTRY ACTIONS ===
  if (domain === "chemistry") {
    actions.push({
      id: "add-mol", label: "+ Molécule", icon: <Plus className="size-3" />,
      prompt: "Ajoute une autre molécule à comparer",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    });
    actions.push({
      id: "info", label: "Infos", icon: <Sparkles className="size-3" />,
      prompt: "Explique les propriétés de cette molécule",
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
    });
  }

  // === ELECTRICITY ACTIONS ===
  if (domain === "electricity") {
    actions.push({
      id: "calc", label: "Calculer", icon: <Sparkles className="size-3" />,
      prompt: "Calcule le courant, la tension et la puissance",
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
    });
    actions.push({
      id: "graph", label: "Graphique", icon: <BarChart3 className="size-3" />,
      prompt: "Montre le graphique tension en fonction du temps",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    });
  }

  // === UNIVERSAL ===
  actions.push({
    id: "explain", label: "Expliquer", icon: <Sparkles className="size-3" />,
    prompt: "Explique cette visualisation en détail",
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20",
  });

  return actions;
}
